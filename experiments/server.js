const express = require('express')
var app = express();
var path = require('path')
var cookieParser = require('cookie-parser')
app.use(express.urlencoded({
    extended:false
}));
// google auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID ='277076601899-v30lbbjrouobm8m76adu0lkspid26ltt.apps.googleusercontent.com' 
const client = new OAuth2Client(CLIENT_ID);
// middleware
app.use(express.static(path.resolve(__dirname, 'views')));
app.set('view engine','ejs')
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req,res)=>{
    res.render('index.ejs');
})
app.get('/login', (req,res)=>{
    res.render('login')
})
app.post('/login',(req,res)=>{
    let token = req.body.token

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,    
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);     
      }
      verify().then(()=>{
          res.cookie('session-token', token)
          res.send('success')
      }).catch(console.error);
})
app.get('/dashboard',checkAunthenticated,(req,res)=>{
    let user =req.user;
    res.render('dashboard',{user});
})
app.get('/protectedroute',checkAunthenticated,(req,res)=>{
    res.render('protectedroute');
})
app.get('/logout',(req,res)=>{
    res.clearCookie('session-token');
    res.render('login');
})

function checkAunthenticated(req,res,next){
    let token = req.cookies['session-token'];

    let user= {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.username = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      }).catch(err=>{
          res.redirect('/login')
      });
}

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0');