const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");

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
