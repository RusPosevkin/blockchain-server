module.exports = async function get (req, res) {
    const fs = require('fs');
    const bitcoin = require('bitcoinjs-lib');
    const bitcoinMessage = require('bitcoinjs-message');

    const address = req.param('address');
    const signature = req.param('signature');
    const VALIDATION_WINDOW = 193;

    const data = fs.readFileSync(`data/${address}`).toString();
    const messageSignature = data === signature ? 'valid' : 'incorrect';

    const body = {
        registerStar: true,
        status: {
            address,
            validationWindow: VALIDATION_WINDOW,
            messageSignature
        }
    };
    res.set({
        'Content-Type': 'application/json',
        'Charset': 'utf-8',
        'Cache-Control': 'no-cache',
        'Accept-Ranges': 'bytes',
        'Connection': 'close'
    });
    return res.json(200, body);
}