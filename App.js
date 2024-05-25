var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exam3'
});

conn.connect(function(err) {
    if (err) throw err;
    console.log('Database Connected');
});



// Admin Login Form
app.get('/', function(req, res) {

    res.render('index');
});

// Admin Dashboard Page
app.get('/dashboard',function(req,res){
    const Query = "SELECT * FROM task WHERE mode = 'enable'";
    conn.query(Query,function(err,result){
        if (err) throw err;

        if (result.length > 0) {
            console.log(result);
            res.render('Dashboard' ,{result});
        }
    })
    
})

// Admin Login Action Post Method
app.post('/', function(req, res) {
    var email = req.body.email;
    var pwd = req.body.password;
    var CheckData = "SELECT * FROM admin WHERE email ='" + email + "' AND pwd = '" + pwd + "'";
    conn.query(CheckData, function(err, result) {
        if (err) throw err;

        if (result.length > 0) {
                // Response Positive 
                res.redirect('/dashboard');
            
        } else {
            res.send('Invalid Credentials');
        }
    });
});

// UserSide Action
app.get('/users', function(req, res) {

    res.render('users');
});

app.get('/UserDash', function(req, res) {

    const Query = "SELECT * FROM task";
    conn.query(Query,function(err,result){
        if (err) throw err;

        if (result.length > 0) {
            res.render('UserSide' ,{result});
        }
    })
});

// User Login Check Email & Password
app.post('/users', function(req, res) {
    var email = req.body.email;
    var pwd = req.body.password;
    var CheckData = "SELECT * FROM tbluser WHERE email ='" + email + "' AND pwd = '" + pwd + "'";
    conn.query(CheckData, function(err, result) {
        if (err) throw err;

        if (result.length > 0) {
            
                res.redirect('/UserDash');
            
        } else {
            res.send('Invalid Credentials');
        }
    });
});

// User Can Add Task 
app.post('/UserDash', function(req, res) {
    var task = req.body.task;
    
    var CheckData = "INSERT INTO `task` (`taskname`) VALUES ('"+task+"')";
    conn.query(CheckData, function(err, result) {
        if (err) throw err;

        else{
            console.log(result);
            res.redirect('/UserDash');
        }
    });
});

app.get('/enablefun/:tid', function(req, res) {
    var id = req.params.tid;
    
    var CheckData = "UPDATE `task` SET `mode`='enable' WHERE `tid`='"+id+"'";
    conn.query(CheckData, function(err, result) {
        if (err) throw err;

        else{
            console.log(result);
            res.redirect('/UserDash');
        }
    });
});

app.get('/disablefun/:tid', function(req, res) {
    var tid = req.params.tid;
    var CheckData = "UPDATE `task` SET `mode`='disable' WHERE `tid`='"+tid+"'";
    conn.query(CheckData, function(err, result) {
        if (err) throw err;

        else{
            console.log(result);
            res.redirect('/UserDash');
        }
    });
});


app.listen(3000, function() {
    console.log('Server Running at 3000 PORT');
});
