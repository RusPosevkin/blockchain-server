const level = require('level');
const bitcoinMessage = require('bitcoinjs-message');
const chainDB = './.data/star';
const db = level(chainDB);

// 5 minutes
const VALIDATION_WINDOW = 300;

/**
 * Blockchain of stars data request validation
 * @class
 */
class StarRequestValidation {
    /**
     * Instantiate StarRequestValidation if it wasn't done
     * @static
     */
    static getInstance() {
        if (!StarRequestValidation.instance) {
            StarRequestValidation.instance = new StarRequestValidation();
        }

        return StarRequestValidation.instance;
    }

    /**
     * Calculate timestamp for a five minutes in the past
     */
    getFiveMinutesInThePast() {
        return Date.now() - (5 * 60 * 1000);
    }

    /**
     * Check whether wallet address is authorized for register a new star 
     */
    isAuthorized(address) {
        return db.get(address)
            .then((dbValueString) => {
                const dbValue = JSON.parse(dbValueString);
                const isExpired = dbValue.requestTimeStamp < this.getFiveMinutesInThePast();

                return !isExpired && dbValue.messageSignature === 'valid';
            })
            .catch(() => false);
    }

    /**
     * Create validation request for concrete wallet address
     */
    requestValidation(address) {
        const timestamp = Date.now();
        const dbValue = {
            address: address,
            requestTimeStamp: timestamp,
            message: `${address}:${timestamp}:starRegistry`,
            validationWindow: VALIDATION_WINDOW
        };

        return db.put(address, JSON.stringify(dbValue)).then(() => dbValue);
    }

    /**
     * Create validation request for concrete wallet address
     */
    validateAddressBySignature(address, messageSignature) {
        return db.get(address)
            .then((dbValueString) => {
                const dbValue = JSON.parse(dbValueString);
                const fiveMinutesInThePast = this.getFiveMinutesInThePast();
                const isExpired = dbValue.requestTimeStamp < fiveMinutesInThePast;
                let isValid = false;
                if (isExpired) {
                    dbValue.validationWindow = 0;
                    dbValue.messageSignature = `Unfortunately, ${VALIDATION_WINDOW} seconds validation window was expired`;
                } else {
                    // convert value to the seconds
                    dbValue.validationWindow = Math.floor((dbValue.requestTimeStamp - fiveMinutesInThePast) / 1000); 
                    isValid = bitcoinMessage.verify(dbValue.message, address, messageSignature);

                    if (isValid) {
                        dbValue.messageSignature = 'valid';
                    } else {
                        dbValue.messageSignature = 'invalid';
                    }
                }

                db.put(address, JSON.stringify(dbValue));

                return {
                    registerStar: !isExpired && isValid,
                    status: dbValue
                };
            });
    }
}

module.exports = StarRequestValidation;