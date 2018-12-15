const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });// if deployed add an ||www.name of my website.com
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


const cookieSessionMiddleware = cookieSession({
    secret:     process.env.SESSION_SECRET || require("./secrets").sessionSecret, // any string also in the encrypted cookie
    maxAge: 1000 * 60 * 60 * 24 * 90//two weeks
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
    console.log("inside accept friend from index.js");
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
        //console.log("from get /friendsAndWannabes", results);
        res.json({
            data: results,
        });
    }).catch(function(err) {
        console.log("Error in /friendsAndWannabes: ", err);

    });
});
app.post('/deleteProfile/:id', function(req,res){
    console.log("delete acount");
    //delete chat and friendships first, user last
    let promisesToDelete = [];

    promisesToDelete.push(
        db.deleteChat(req.session.userId).then(function(results) {
            console.log("from delete chat: ", results);
        })
    );

    promisesToDelete.push(db.deleteFriendship(req.session.userId));

    Promise.all(promisesToDelete)
        .then(db.deleteProfile(req.session.userId))
        .then(function() {
            console.log("delteted everything");
            req.session = null;
            res.json({
                userDeleted: true
            });
        })
        .catch(function(err) {
            console.log(err);

        });
});

app.post('/deleteImg', s3.deleteImg,  function(req,res){
    console.log("from delete img post");
    //send ok respons
    res.sendStatus(200);
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("from upload route in index", req.file);
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

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});
// put any other get route above this route:
app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


//changed from app. to server. as socket io was added:
server.listen(8080, function() {
    console.log("I'm listening.");
});

// all of the server side socket code goes here below server.listen
// onlineUsers object wil maintain a list of everyone cureently online:
let onlineUsers={};


io.on('connection', socket =>{
    console.log(`User with socket id ${socket.id} just connected`);
    let socketId= socket.id;
    //make req.session.userId available in socket:
    let userId =socket.request.session.userId;
    // set key to socketId and userId as value
    onlineUsers[socketId]=userId;
    // create an array of all users online:
    let arrOfIds=Object.values(onlineUsers);

    //load present users
    db.getOnlineUsers(arrOfIds).then( results =>{
        socket.emit('onlineUsers', results.rows);
    }).catch( err=> {
        console.log("error in get users by ids in index.js", err);
    });

    //add new user without reloading the page:
    //filter through array of users,  if id only in in there once, it is a new user. => emit broadcast
    console.log(arrOfIds);
    if(arrOfIds.filter(id => id == userId).length == 1){
        db.getUserById(userId).then(results=>{
            socket.broadcast.emit("userJoined", results);
        }).catch( err=> {
            console.log("error in get user by id in index.js", err);
        });
    }

    socket.on('disconnect', function(){
        delete onlineUsers[socketId];
        console.log(`user with ${userId} just disconnected`);
        // figure out if the user really left the site, not just closed one tab.
        // if user id is not in the object of online users, emit to socket
        if(!Object.values(onlineUsers).includes(userId)){
            io.sockets.emit('userLeft', userId);}
    });

    //render chat messages on page before adding a new message:
    db.getChatMessages().then(results =>{

        //console.log('results from old messages', results);
        socket.emit('oldMessages', results.reverse());
    }).catch( err=> {
        console.log("error in get old messages in index.js", err);
    });

    /*  funkar men lite fusk
  socket.on('newMsg', async msg=>{
        console.log("msg from chat in index", msg);
        // store in the database, get info about user: first last img.
        await db.insertMsg(userId, msg);
        //get the 10 most recent messages:
        let chatMsgs=  await db.getChatMessages();
        console.log("chatMsgs from index.js",chatMsgs);
        io.sockets.emit('chatMsgs', chatMsgs);
    });*/

    socket.on('newMsg', msg=>{
        console.log("msg from chat in index", msg);
        // store in the database, get info about user: first last img.
        db.insertMsg(userId, msg).then(results=>{
            console.log("resutls from insert img", results[0].id);
            db.getNewChatMessage(results[0].id).then(results=>{
                console.log("chatMsgs from index.js", results);
                io.sockets.emit('chatMsgs', results);
            });


        });
        //get the 10 most recent messages:

    });


});
