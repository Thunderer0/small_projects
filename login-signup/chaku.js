const {
    reject
} = require("async");
const {
    UnverifiedAddUser,
    AddUser,
    FindUser,
    SendEmail,
} = require('./modules');
const {
    MongoClient
} = require('mongodb');
var url = 'mongodb://localhost:27017';
const dbName = "login-signup";
var sizeof = require('object-sizeof');
const { error } = require("console");

function CheckUser() {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(url);
        await client.connect()
        const db = client.db(dbName);

        const result = await db.collection('unverifieduserdatabase').find({}).toArray();


        var Username = result[0].Username;
        // console.log(Username);
        var EmailId = result[0].EmailId;
        var user = await FindUser(Username);
        // console.log(user);
        // console.log(user);
        try {
            var size =await sizeof(user);
            // console.log(size);
            if (size == 0) {
                resolve("true");
                console.log("true")
            } 
            // else {
            //     if (user[0].Username == Username) {
            //         resolve("user already exists!!")
            //     } else {
            //         if (user[0].EmailId == EmailId) {
            //             console.log("user exists")
            //             resolve("user with same email id already exists!!")
            //         } else {
            //             resolve("true");
            //         }
            //     }
            // }
        } catch (error) {
            reject(error)
        }
        client.close();
    })
}
var bholu = CheckUser()
bholu.then(
    function(value){
        console.log(value);
    },
    function(error){
        console.log(error);
    }
).catch(
    function(error){
        console.log(error);
    }
)
