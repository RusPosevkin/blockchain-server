module.exports = async function get (req, res) {
    const body = {
        hash: "ffaffeb2330a12397acc069791323783ef1a1c8aab17ccf2d6788cdab0360b90",
        height: 1,
        body: "Testing block with test string data",
        time: "1531764891",
        previousBlockHash: "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
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