const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: 'qrg258*001',
     connectionLimit: 3000,
     database:'board'
});

module.exports = {
    async run(query){
        return new Promise((resolve)=>{
            
        
    pool.getConnection()
        .then(conn => {
            
            conn.query(query)
                .then((rows) => {
                    resolve(rows);
                })
            
                .catch(err => {
                console.log(err); 
                conn.end();
                })
                
            }).catch(err => {
            //not connected
            });
        });
    }
}