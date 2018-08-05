module.exports = async function get (req, res) {
    const VALIDATION_WINDOW = 300;
    const address = req.param('address');
    const timestamp =  new Date().getTime();
    const body = {
        address,
        requestTimeStamp: timestamp,
        messsage: `${address}:${timestamp}:starRegistry`,
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