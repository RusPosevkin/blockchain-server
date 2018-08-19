module.exports = async function get (req, res) {
    const StarRequestValidation = require('../../../../classes/star-request-validation');
    const {
        body: {
            address,
            signature
        }
    } = req;

    if (address && signature) {
        StarRequestValidation.getInstance()
            .validateAddressBySignature(address, signature)
            .then((response) => res.json(response))
            .catch((error) => {
                return res.status(400).json({
                    reason: 'Bad request',
                    details: 'Validation was not done or you have incorrect signature'
                });
            });
    } else {
        res.status(400).json({
            reason: 'Bad request',
            details: 'You should send JSON that contains "address" and "signature" fields'
        });
    }
}