const Blockchain = require('../classes/blockchain');
const Block = require('../classes/block');

Blockchain.getInstance()
    .then((blockchain) => {
        const block = new Block("Test Block");
        blockchain.addBlock(block)
            .then((result) => {
                return blockchain.validateChain();
            });
    });