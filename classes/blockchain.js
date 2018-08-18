const SHA256 = require('crypto-js/sha256');
const level = require('level');
const Block = require('./block');
const chainDB = '../.data';
const db = level(chainDB);

/**
 * Blockchain that saved data to the levelDB
 * @class
 */
class Blockchain {
    /**
     * Return existed class instance or instantiate class by first block 
     * if it was called for the first time
     */
    static getInstance() {
        if (!Blockchain.instance) {
            Blockchain.instance = new Blockchain();
            return Blockchain.instance.getBlockHeight()
                .then((height) => {
                    if (height === 0) {
                        const initialBlock = new Block('First block of the blockchain');
                        return Blockchain.instance.addBlock(initialBlock);
                    }
                })
                .then(() => Blockchain.instance);
        } 

        return Promise.resolve(Blockchain.instance);
    }

    /**
     * Get block (string) by its height
     */
    getBlock(height) {
        return db.get(height).then((value) => JSON.parse(value));
    }

    /**
     * Get block's height 
     */
    getBlockHeight() {
        let recursion = function (key) {
            return db.get(key)
                .then(() => recursion(key + 1))
                .catch(() => key);
        };

        return recursion(0);
    }

    /**
     * Add a new block to the blockchain 
     */
    addBlock(newBlock) {
        return this.getBlockHeight()
            .then((height) => {
                let promisePrevBlock;

                newBlock.height = height;
                newBlock.time = new Date().getTime().toString().slice(0, -3);

                if (height > 0) {
                    promisePrevBlock = this.getBlock(height - 1)
                        .then((previousBlock) => {
                            // linked blocks
                            newBlock.previousBlockHash = previousBlock.hash;
                        });
                }

                return Promise.all([promisePrevBlock])
                    .then(() => {
                        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                        return db.put(height, JSON.stringify(newBlock));
                    });
            })
            .then(() => Blockchain.instance);
    }

    /**
     * Checks whether block was changes by hash checking
     */
    validateBlock(height) {
        return this.getBlock(height)
            .then((block) => {
                // calculate actual hash and compare with saved value
                const blockHash = block.hash;
                block.hash = '';
                const validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    console.log(`Block #${height} is valid`);
                    return true;
                } else {
                    console.log(`Block #${height} is NOT valid!`);
                    return false;
                }
            });
    }

    /**
     * Checks whether block was changes by hash checking
     */
    validateChain() {
        let errorLog = [];
        return this.getBlockHeight()
            .then((height) => {
                let promiseList = [];
                for (let i = 0; i < height - 1; i++) {
                    promiseList.push(this.validateBlocksLink(i, errorLog));
                }

                // last item of the blockchain
                promiseList.push(this.validateBlock(height - 1, errorLog));

                return Promise.all(promiseList);
            })
            .then(() => {
                if (errorLog.length) {
                    console.log(`There are ${errorLog.length} errors occured`);
                    console.log('Errors in the blocks: ', errorLog);
                    return false;
                }

                console.log('There are no any errors');
                return true;
            })
            .then(() => Blockchain.instance);
    }

    /**
     * Validate the link between the current and next blocks 
     */
    validateBlocksLink(i, errorLog) {
        return this.validateBlock(i)
            .then((isValid) => {
                if (!isValid) {
                    errorLog.push(i);
                    return;
                } 
                return this.getBlock(i)
                    .then((block) => {
                        let blockHash = block.hash;
                        return this.getBlock(i + 1)
                            .then(nextBlock => {
                                let previousHash = nextBlock.previousBlockHash;
                                if (blockHash !== previousHash) {
                                    errorLog.push(i);
                                }
                            });
                    });
            });
    }
}

module.exports = Blockchain;