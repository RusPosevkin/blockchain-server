/**
 * Piece of the blockchain – block 
 * @class
 */
class Block {
    constructor(data) {
        this.hash = '';
        this.height = 0;
        this.time = 0;
        this.previousBlockHash = '';
        this.body = data;
    }
}

module.exports = Block;