const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("./bcrypt");

const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static('./public'));
app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET || require("./secrets").sessionSecret, // any string also in the encrypted cookie
        maxAge: 1000 * 60 * 60 * 24 * 14 //two weeks
    })
);
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

// put any other get route above this route:
app.get("*", function(req, res) {
    if (req.session.userId&& req.url == "/welcome"){
        res.redirect ('/');
    }
    else if(!req.session.userId&& req.url == "/"){
        res.redirect ('/welcome');
    }
    else {
        res.sendFile(__dirname + "/index.html");}
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
