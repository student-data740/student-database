//LIBRABRIES//
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const md5 = require('md5');
const app = express();

//EJS_ENGINE//
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ 
    extended: true 
}));

// DATABASE_CONNECTION && SCHEMA//
mongoose.connect('mongodb+srv://studentDB:hashitupKid@datastore-ymdnd.mongodb.net/studentDB', {useNewUrlParser: true});
const studentSchema = new mongoose.Schema({
    regnumber: Number,
    pwd: {type: String,
    min: 8,
    required: true}
});
const sDB = mongoose.model('sDB', studentSchema);

//NODE_ROUTING//
app.get('/', function(req, res) {
    res.render('index')}
);
app.post("/", function(req, res) {
    const id = req.body.regno;
    const passwd = md5(String(req.body.password));
    const tempID = id.toString().length;
    if(tempID === 12 || typeof id === Number && passwd.length === 8){
        const StudentData = new sDB({
            regnumber: id,
            pwd: passwd
        });
        StudentData.save((err)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/profile');
            }
        })
    }
    else{
        res.redirect('/');
    }
});
app.get('/profile', function(req, res) {
    sDB.findOne({}, function(err, data){
        id = data.regnumber;
        if(err){
            console.log(err);
        }else{
            res.render('profile', {overwrite: id});
        }
       });
});

let port = process.env.PORT;
if(port == null || port == ""){
    port = 8000;
}
app.listen(port);