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
        const {
            dec,
            ra,
            story
        } = star;
        // checks existing of non-empty string properties ra, dec, story 
        if (typeof dec !== 'string' || typeof ra !== 'string' || typeof story !== 'string' || !dec.length || !ra.length || !story.length) {
            return res.status(400).json({
                reason: 'Bad request',
                details: "Your star information should include non-empty string properties 'dec', 'ra' and 'story'"
            }); 
        }
        // check that story length less than 500 bytes
        if (new Buffer(story).length > STAR_STORY_BYTE_LENGTH) {
            return res.status(400).json({
                reason: 'Bad request',
                details: 'Your star story too long. Maximum size is 500 bytes'
            });
        }
        // check that string contains only ASCII symbols (0-126 char codes)
        // https://stackoverflow.com/a/14313213
        // non-ASCII symbol example: '¡'
        const isASCII = ((str) =>  /^[\x00-\x7F]*$/.test(str));

        if (!isASCII(story)) {
            return res.status(400).json({
                reason: 'Bad request',
                details: 'Your star story contains non-ASCII symbols'
            }); 
        }
        StarRequestValidation.getInstance()
            .isAuthorized(address)
            .then((isAuthorized) => {
                if (isAuthorized) {
                    const newBlock = new Block(body);
                    const story = newBlock.body.star.story;
                    newBlock.body.star.story = new Buffer(story).toString('hex');

                    Blockchain.getInstance()
                        .then((instance) => instance.addBlock(newBlock))
                        .then((instance) => instance.getBlockHeight())
                        .then((height) => {
                            starBlockchain.getBlockByHeight(height-1, res)
                                .then((block) => {
                                    if (block && block.body && block.body.star && block.body.star.storyDecoded) {
                                        delete block.body.star.storyDecoded;
                                    }
                                    return res.json(block);
                                })
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
            details: "You should send JSON that contains 'star' and 'address' fields"
        });
    }
}