const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");

const s3 = require("./s3");
const s3Url = require("./config");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//boilerplate code for upload : do not touch:
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
// end of boilerplate

app.use(compression());
app.use(express.static('./public'));
app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET || require("./secrets").sessionSecret, // any string also in the encrypted cookie
        maxAge: 1000 * 60 * 60 * 24 * 14 //two weeks
    })
);

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.post("/login", (req, res) => {
    db.byEmail(req.body.email)
        .then(function(results) {

            return bcrypt
                .compare(req.body.password, results[0].pass)

                // send a response
                .then(function(doesMatch) {
                    if (doesMatch) {
                        console.log("logged in");
                        req.session.userId = results[0].id;
                        res.json({
                            success: true
                        });

                    }
                    /*    if (!doesMatch) {
                        console.log("not loged in");
                        throw new Error();
                    }*/
                    else  {
                        console.log("not loged in");
                        throw new Error();
                    }
                });
        })

        //load an error message on the page if necessary:
        .catch(function(err) {
            console.log("Error in post /login: ", err);
            res.json({success: false});
        });
});
app.post('/registration', (req, res)=>{

    console.log("req.body from registration index.js: ", req.body);
    // hash the password
    bcrypt
        .hash(req.body.password)
        // insert data into db => create db with users
        .then(function(hash) {
            return db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hash
            );
        })
        // put userId in session
        .then(function(results) {
            console.log(results[0].id);
            req.session.userId = results[0].id;
            console.log("req.session",req.session);
        })

        // send a response
        .then(function() {
            console.log("send a response and redirect");
            //everything is ok
            res.json({
                success: true
            });
        })
        //load an error message on the page if necessary:
        .catch(function(err) {
            console.log("Error in post /registration: ", err);
            res.json({success:false});
        });

});

app.get('/user', async (req, res) => {
//    console.log(" get user sending request works");
    try {
        const data = await db.getUserById(req.session.userId);

        res.json({
            user: data[0],
            id: data[0].id,
            first: data[0].first,
            last: data[0].last,
            profilePicUrl:data[0].profilepic,
            bio: data[0].bio

        });
    } catch (e) {
        res.json({
            success: false
        });
    }
});

app.get('/user/:id/json',  async (req, res) => {
    if(req.params.id==req.session.userId){
        return (
            res.json({
                status: 'sameUser'
            })
        );
    }

    try {
        const data = await db.getOtherUser(req.params.id);

        res.json({

            first: data[0].first,
            last: data[0].last,
            profilePicUrl:data[0].profilepic,
            bio: data[0].bio

        });
    } catch (e) {
        res.json({
            success: false
        });
    }
});
app.post('/friendrequest/:id', async (req,res)=> {

    db.createFriendship(req.session.userId, req.params.id).then(function(results){
        //console.log("from friendrequest  route", results);
        res.json({
            data: results,
            success: true
        });
    }).catch(function(err) {
        console.log("Error in post /friendrequest: ", err);

    });
}
);
app.post('/acceptfriend/:id', function(req,res){
    db.acceptFriendship(req.session.userId, req.params.id).then(function(results){
        console.log("from accept friend  route", results);
        res.json({
            data: results,

        });
    }).catch(function(err) {
        console.log("Error in post /acceptfriend: ", err);

    });
});
app.post('/deletefriends/:id', function(req,res){
    db.deleteFriendship(req.session.userId, req.params.id).
        then(function(results){
            console.log("from delete friend  route", results);
            res.json({
                data: results,
            });
        }).catch(function(err) {
            console.log("Error in post /deleteFriendship: ", err);
        });
});
app.get('/friends/:id', function(req,res){
    console.log("from get freinds",req.session.userId, req.params.id);
    db.getFriendships(req.session.userId, req.params.id).then(function(results){
        console.log("from get friends", results);
        res.json({
            data:results,
            user: req.session.userId
        });
    }).catch(function(err) {
        console.log("Error in get /friends/:id: ", err);

    });
});
app.get('/friendsAndWannabes', function(req,res){
    console.log("in friends and wannabes");
    db.getFandWs(req.session.userId).then(function(results){
        console.log("from get /friendsAndWannabes", results);
        res.json({
            data: results,
        });
    }).catch(function(err) {
        console.log("Error in /friendsAndWannabes: ", err);

    });
});
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log(req.file);
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {

        var url = s3Url.s3Url + req.file.filename;
        console.log(req.session.userId,url);
        db.insertData(req.session.userId, url).then(function(results) {
            console.log("from index upload route" ,results);
            res.json({
                data: results,
                success: true
            });
        }).catch(function(err) {
            console.log("Error in post /upload: ", err);

        });
    } else {
        res.json({
            success: false
        });
    }
});


app.post('/add-bio', function(req, res){
    db.insertBio(req.session.userId, req.body.bio).then(function(results){
        console.log("from add bio route" ,results);
        res.json({
            data: results,
            success: true
        });
    }).catch(function(err) {
        console.log("Error in post /upload: ", err);

    });
});

app.get('/welcome', function(req, res) {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

// put any other get route above this route:
app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});



app.listen(8080, function() {
    console.log("I'm listening.");
});
