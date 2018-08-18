module.exports = async function get (req, res) {
    const StarBlockchain = require('../../../classes/star-blockchain');
    const height = req.param('height');
    const starBlockchain = new StarBlockchain(); 

    starBlockchain.getBlockByHeight(height)
        .then(block => res.json(block))
        .catch(() => res.status(400).json({
            reason: 'Bad request',
            details: 'Block was not found'
        }));
}