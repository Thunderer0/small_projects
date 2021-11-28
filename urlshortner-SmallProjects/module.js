const { MongoClient } = require('mongodb');
const shortid = require('shortid');

var url = 'mongodb://localhost:27017'
const dbName = "urlshortner";

function main(){
    function addnewlink(longurl) {
        return new Promise (async (resolve,reject)=>{
            const client = new MongoClient(url);
            let data = {
                long: longurl,
                short: shortid.generate()
            }
            // make an object to insert in database with random short number
            try {
                await client.connect()
                // connect to database
                const db = client.db(dbName);
                const result =db.collection('urlshortner')
                resolve(await result.insertOne(data))
                // insert data is promise is resolved
            } catch (error) {
                reject(error)
                // reject error
            }
        })
    }
    function findshortlink() {
        return new Promise (async (resolve,reject)=>{
            const client = new MongoClient(url);
            try {
                await client.connect()
                // connect to database
                const db = client.db(dbName);
                const result = db.collection('urlshortner').find({})
                // find data and save it in result
                resolve(await result.toArray());
                // convert data to array if promise is resolved
                client.close();
            } catch (error) {
                reject(error)
            }
        })
    }
    return{addnewlink,findshortlink}
    // return both functions
}

module.exports=main()
// export main()