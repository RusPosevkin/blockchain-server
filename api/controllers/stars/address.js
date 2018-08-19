module.exports = async function get (req, res) {
    const StarBlockchain = require('../../../classes/star-blockchain');
    // remove ':' symbol
    const address = req.param('address').slice(1);
    const starBlockchain = new StarBlockchain(); 

    starBlockchain.getBlocksByAddress(address)
        .then((blocks) => res.json(blocks));
}