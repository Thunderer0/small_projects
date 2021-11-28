const {
    reject
} = require('async');
const {
    MongoClient
} = require('mongodb');
var url = 'mongodb://localhost:27017';
const dbName = "login-signup";
var nodemailer = require('nodemailer');
var sizeof = require('object-sizeof')
// const { resolve } = require('path/posix');

function main() {
    // working function
    function UnverifiedAddUser(Name, Username, Password, EmailId) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            var user = {
                Name: Name,
                Username: Username,
                Password: Password,
                EmailId: EmailId
            }
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = db.collection('unverifieduserdatabase')
                resolve(await result.insertOne(user))
                console.log("unverified user created!!")
            } catch (error) {
                reject(error);
            }
        })
    }
    // working function
    function FindUser(Username) {
        return new Promise(async (resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect()
                const db = client.db(dbName);
                const result = db.collection('userdatabase').find({Username});
                console.log(Username);
                resolve(await result.toArray());
                console.log(await result.toArray());
                client.close();
            } catch (error) {
                reject(error)
            }
        })
    }
    // working function
    function CheckUser() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            await client.connect()
            const db = client.db(dbName);

            const result = await db.collection('unverifieduserdatabase').find({}).toArray();


            var Username = result[0].Username;
            var EmailId = result[0].EmailId;
            var user = await FindUser(Username);
            // console.log(user);
            try {
                var size = await sizeof(user);
                // console.log(size);
                if (size == 0) {
                    resolve("true");
                    // console.log("true")
                } else {
                    if (user[0].Username == Username) {
                        resolve("user already exists!!")
                    } else {
                        if (user[0].EmailId == EmailId) {
                            console.log("user exists")
                            resolve("user with same email id already exists!!")
                        } else {
                            resolve("true");
                        }
                    }
                }
            } catch (error) {
                reject(error)
            }
            client.close()
        })
    }

    // working function
    function SendEmail(Username, EmailId) {
        return new Promise(async (resolve, reject) => {
            var balo = Username;
            var calo = EmailId;
            // console.log(calo);
            try {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'parilsanghvi@gmail.com',
                        pass: 'Paril@0510'
                    }
                });

                var mailOptions = {
                    from: 'parilsanghvi@gmail.com',
                    to: calo,
                    subject: 'welcome to ecommerce website helpdesk',
                    text: 'your username is: ' + balo + '\nyour email id is: ' + calo + '\nclick o this link to confirm your account' + '\n http://localhost:8080/emailverification',
                };
                resolve(transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                }))
            } catch (error) {
                reject(error)
            }
        })
    }
    // working function
    function AddUser() {
        let promise = new Promise(async (resolve, reject) => {
            try {
                const client = new MongoClient(url);

                await client.connect()
                const db = client.db(dbName);

                const result = await db.collection('unverifieduserdatabase').find({}).toArray();
                // console.log("user found");
                var user = {
                    Name: result[0].Name,
                    Username: result[0].Username,
                    Password: result[0].Password,
                    EmailId: result[0].EmailId
                }
                const Result = db.collection('userdatabase').insertOne(user);
                console.log("verified user created!!")
                resolve("user created")

                const decoy = await db.collection('unverifieduserdatabase').deleteOne({});
                // console.log("user deleted");
                client.close();
            } catch (error) {
                reject(error);
            }
        })
        promise.then(
            function (value) {
                // console.log(value)
                return value;
            },
            function (error) {
                console.log(error);
                return error;
            }
        )
    }
    return {
        // function names
        UnverifiedAddUser,
        FindUser,
        SendEmail,
        CheckUser,
        AddUser
    }
}
module.exports = main()