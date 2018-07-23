module.exports = async function get (req, res) {
    var counter = req.param('counter');
    const body = {
        hash: "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3",
        height: counter,
        body: "First block in the chain - Genesis block",
        time: "1530311457",
        previousBlockHash: ""
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