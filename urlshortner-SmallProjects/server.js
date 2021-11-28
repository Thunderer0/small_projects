const express = require('express')
const path = require('path')
const app = express();
const modules = require('./module')
// import all modules
app.use(express.urlencoded({
    extended: false
}));
// parsing string from browser
app.use(express.static(path.resolve(__dirname, 'views')));
// path defeination
app.set('view engine','ejs')
app.get('/' ,async (req,res) => {
    var result =await modules.findshortlink();
    var shorturls =await result;
    res.render('index',{shorturls : shorturls});
    // find all previous links embedd it in html by rendering {shorturls : shorturls} to ejs file
})
app.post('/shorturl',async (req,res)=>{
    var fullurl =await req.body.fullurl;
    await modules.addnewlink(fullurl);
    res.redirect('/');
    // add new link and redirect to homepage
});
app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0');