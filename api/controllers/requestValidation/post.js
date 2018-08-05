module.exports = async function get (req, res) {
    const fs = require('fs');
    const bitcoin = require('bitcoinjs-lib');
    const bitcoinMessage = require('bitcoinjs-message');
    const keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');
    const privateKey = keyPair.d.toBuffer(32);
    const address = req.param('address');
    const timestamp =  new Date().getTime();
    const message = `${address}:${timestamp}:starRegistry`;
    const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64');
    const VALIDATION_WINDOW = 300;

    fs.writeFileSync(`data/${address}`, signature);
    const body = {
        address,
        requestTimeStamp: timestamp,
        message,
        validationWindow: VALIDATION_WINDOW
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