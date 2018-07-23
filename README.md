# blockchain-server

## Node.js framework
[Sails.js](https://sailsjs.com/)

## Endpoints

### Get block
```
GET response example for URL http://localhost:8000/block/0

        HTTP/1.1 200 OK
        content-type: application/json; charset=utf-8
        cache-control: no-cache
        content-length: 179
        accept-ranges: bytes
        Connection: close
        {"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3","height":0,"body":"First block in the chain - Genesis block","time":"1530311457","previousBlockHash":""}
```

### Post block

```
POST response example for URL http://localhost:8000/block

        HTTP/1.1 200 OK
        content-type: application/json; charset=utf-8
        cache-control: no-cache
        content-length: 238
        Connection: close
        {"hash":"ffaffeb2330a12397acc069791323783ef1a1c8aab17ccf2d6788cdab0360b90","height":1,"body":"Testing block with test string data","time":"1531764891","previousBlockHash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"}
```