module.exports = async function get (req, res) {
    const StarRequestValidation = require('../../../classes/star-request-validation');
    const {
        body: {
            address
        } = {}
    } = req;

    if (address) {
        StarRequestValidation.getInstance()
            .requestValidation(address)
            .then((response) => res.json(response));
    } else {
        res.status(400).json({
            reason: 'Bad request',
            details: 'You should send JSON that contains "address" field'
        });
    }
}