const { builtinModules } = require('module');
const { MongoClient } = require('mongodb');
const dbName = 'Mudits_db';
const url = 'mongodb://localhost:27017';
function Main() {
    async function RegisterUser(username, pass) {
        let data = {
            name: username,
            password: pass
        }
        const client = new MongoClient(url);
        await client.connect();

        let added = await UserAddition(data);
        let admin = client.db(dbName).admin();
        // await client.db(dbName).dropDatabase();
        console.log(await admin.listDatabases());
        client.close();
    }

    function UserAddition(data) {
        return new Promise(async (res, rej) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = await db.collection('UsersWebsite').insertOne(data);
                res(result);
                client.close();
            }
            catch (err) {
                rej(err);
            }
        })
    }
    function CheckUser(username){
        return new Promise(async (res,rej) =>{
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = db.collection('UsersWebsite').find({ name: username });
                res(await result.toArray());
                client.close();
            }
            catch (err) {
                rej(err);
            }
        })
    }

    return {RegisterUser , UserAddition,CheckUser}
}
module.exports = Main();