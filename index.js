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
    console.log(" get user sending request works");
    try {
        const data = await db.getUserById(req.session.userId);

        res.json({
            user: data[0],
            first: data[0].first,
            profilePicUrl:data[0].profilepic
            /*userId: req.session.userId,
            first: "Nath",
            last:"Scherf",
            profilePicUrl:'/bee.jpg'*/
        });
    } catch (e) {
        res.json({
            success: false
        });
    }
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
        //res.json({success: false});
        });
    } else {
        res.json({
            success: false
        });
    }
});
//upload image to uplaods directory
// uploas image to amazon
// insert image into db: updata query
// send response back to uploader component
// go to database and get user information :
// frist, last, profilePicUrl
// send back to axios as response
/*    res.json({
        userId: req.session.userId,
        first: "Nath",
        last:"Scherf",
        profilePicUrl:'/bee.jpg'});*/



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
