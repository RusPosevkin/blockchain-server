module.exports = async function get (req, res) {
    const StarRequestValidation = require('../../../classes/star-request-validation');
    const Block = require('../../../classes/block'); 
    const Blockchain = require('../../../classes/blockchain'); 
    const StarBlockchain = require('../../../classes/star-blockchain');
    const starBlockchain = new StarBlockchain(); 

    const {
        body,
        body: {
            address,
            star
        } = {}
    } = req;
    // only 500 bites of star story should be saved
    const STAR_STORY_BYTE_LENGTH = 500;

    if (address && star) {
        StarRequestValidation.getInstance()
            .isAuthorized(address)
            .then((isAuthorized) => {
                if (isAuthorized) {
                    debugger;
                    const newBlock = new Block(body);
                    const story = newBlock.body.star.story.substring(0, STAR_STORY_BYTE_LENGTH);
                    newBlock.body.star.story = new Buffer(story).toString('hex');

                    Blockchain.getInstance()
                        .then((instance) => instance.addBlock(newBlock))
                        .then((instance) => instance.getBlockHeight())
                        .then((height) => {
                            starBlockchain.getBlockByHeight(height-1, res)
                                .then((block) => res.json(block))
                                .catch(() => {
                                    return res.status(400).json({
                                        reason: 'Bad request',
                                        details: 'Block was not found'
                                    });
                                });
                        });
                } else {
                    res.status(400).json({
                        reason: 'Bad request',
                        details: 'There are no validation request or it was expired'
                    });
                }
            });
    } else {
        res.status(400).json({
            reason: 'Bad request',
            details: 'You should send JSON that contains "star" and "address" fields'
        });
    }
}