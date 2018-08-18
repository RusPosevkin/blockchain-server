const Blockchain = require('./blockchain');

/**
 * Blockchain of stars data
 * @class
 */
class StarBlockchain{
    /**
     * Return all the blocks of the stars information by address 
     */
    getBlocksByAddress(address) {
        const blocks = [];
        var recursion = function (key, context) {
            return context.getBlockByHeight(key)
                .then((block) => {
                    if (block.body.address === address) {
                        blocks.push(block);
                    }

                    return recursion(key + 1, context);
                })
                .catch(() => blocks);
        };

        return recursion(0, this);
    }

    /**
     * Return block of the stars information by its height
     */
    getBlockByHeight(height) {
        return Blockchain.getInstance()
            .then((instance) => instance.getBlock(height))
            .then((block) => {
                if (block.body.star && block.body.star.story) {
                    block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString();
                }
        
                return block;
            });
    }

    /**
     * Return block of the stars information by its hash 
     */
    getBlockByHash(hash) {
        let recursion = function (key, context) {
            return context.getBlockByHeight(key)
                .then((block) => {
                    return block.hash === hash ? block : recursion(key + 1, context);
                })
                .catch(() => undefined);
        };

        return recursion(0, this);
    }
}

module.exports = StarBlockchain;