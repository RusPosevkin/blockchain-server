module.exports = async function get (req, res) {
    const StarBlockchain = require('../../../classes/star-blockchain');
    // remove ':' symbol
    const hash = req.param('hash').slice(1);
    const starBlockchain = new StarBlockchain(); 

    starBlockchain.getBlockByHash(hash)
        .then((block) => {
            if (block) {
                return res.json(block);
            }
            starBlockchain.getBlockByHeight(-1, res)
                .then(block => res.json(block))
                .catch(() => res.status(400).json({
                    reason: 'Bad request',
                    details: 'Block was not found'
                }));
        });
}