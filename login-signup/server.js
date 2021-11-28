var express = require('express');
var sizeof = require('object-sizeof')
var path = require('path');
const {
    UnverifiedAddUser,
    AddUser,
    FindUser,
    SendEmail,
    CheckUser
} = require('./modules');
var app = express();
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.resolve(__dirname, 'views')));
app.get('/', (req, res) => {
    res.render(__dirname + "/views/login.ejs");
})
app.get('/login', async (req, res) => {
    res.render(__dirname + "/views/login.ejs")
})
app.get('/signup', async (req, res) => {
    res.render(__dirname + "/views/signup.ejs")
})
app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.pwd;
    let bholu =await FindUser(username);
    console.log(bholu);
    if (sizeof(bholu)==0) {
        res.send("user doesnot exist")
    }
    else{
        if (bholu[0].Username==username&&bholu[0].Password==password) {
            res.render(__dirname+ "/views/successfull.ejs")
        }else{
            res.send("incorrect userid or password")
        }
    }
})
app.post('/signup', async (req, res) => {
    let Name = req.body.name;
    let Username = req.body.username;
    let Password = req.body.pwd;
    let EmailId = req.body.email;
    var sendemail = await SendEmail(Username, EmailId);
    var addunverifieduser = await UnverifiedAddUser(Name, Username, Password, EmailId);
    res.render(__dirname + "/views/waiting.ejs")
})
app.get('/emailverification', async (req, res) => {
    res.render(__dirname + "/views/emailverification.ejs")
})
app.post('/emailverification', async (req, res) => {
    var response = await req.body.response;
    // take data from unverified
    if (response == "yes") {
        var checkuser = CheckUser();
        var answer = 0;
        await checkuser.then(
            function(value){
                answer = value;
                console.log(answer);
            },
            function(error){
                answer = error;
            }
        )
        if (answer == "true") {
            // console.log("inside if");
            var halo = AddUser();

        }
        res.render(__dirname + "/views/login.ejs")
    }
})
app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0');