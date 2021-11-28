const express = require('express');
const app = express();
const port = 3000;
const path = 'signup.html';
const repo = require('./database/repo');
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
// // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// // Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.get('/signup', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/signup', (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        const result = repo.RegisterUser(username, password);
        res.send(`User registered with : \n Name : ${username} \n Password : ${password}`);
    } catch (error) {
        res.send("Error in registration : \n" + error);
    }
})
app.post('/login', async (req,res) =>{
    try {
        let username = req.body.username;
        let password = req.body.password;
        let ans = await repo.CheckUser(username);
        if(ans.length===0){
            res.send(`No user with username ${username} !! Register first`);
        }
        else{
            if(ans[0].name === username && ans[0].password === password){
                res.send('WELCOME ' + username);
            }
            else{
                res.send('Wrong username or password');
            }
        }
    } catch (error) {
        res.send("Error in Login : \n" + error);
    }
})
app.listen(port);