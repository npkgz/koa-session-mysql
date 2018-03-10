const _crypto = require('crypto');

// async session id generator - 64 byte (base64)
module.exports = function genid(){
    return new Promise(function(resolve, reject){
        // random part size
        const size = 32;

        // output hashing
        const hash = _crypto.createHash('sha384');

        // new output buffer
        const buffer = Buffer.alloc(size+8);

        // get n random bytes
        _crypto.randomFill(buffer, 8, size, err => {
            // error occurend ?
            if (err){
                return reject(err);
            }

            // add current date
            buffer.writeUIntBE(Date.now(), 0, 8);
        
            // hash
            hash.on('readable', () => {
                const data = hash.read();
                if (data){
                    resolve(data.toString('base64'));
                }else{
                    reject(new Error);
                }
            });

            hash.write(buffer);
            hash.end();
        });
    });
}