
var spicedPg = require("spiced-pg");
var db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const secrets = require("./secrets");
    db = spicedPg(
        `postgres:${secrets.dbUser}:${secrets.password}@localhost:5432/socialnetwork`
    );
}

exports.registerUser = (first, last, email, hash) => {
    return db
        .query(
            `INSERT INTO  users (first, last, email, pass)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [first, last, email, hash]
        )
        .then(function(results) {
            console.log("register user from db.js: ", results.rows);
            return results.rows;
        });
};

exports.byEmail = email => {
    return db
        .query(
            `SELECT*
            FROM users
        WHERE email=$1`,
            [email]
        )
        .then(function(results) {
            console.log("log in user from db.js: ", results.rows);
            return results.rows;
        });
};

exports.getUserById =id =>{
    return db.query(
        `SELECT first, last, profilepic, bio FROM users
        WHERE id =$1`, [id]
    ). then(function(results){
        console.log("log: get users by id from db.js", results.rows);
        return results.rows;
    });
};

exports.insertData = (id, profilepic) => {
    //console.log("in query insertData");
    return db
        .query(`UPDATE users
            SET profilepic = $2
            WHERE id = $1
            RETURNING id, profilepic`,
        [id, profilepic]
        )
        .then(function(results) {
            console.log("image inserted", results.rows);
            return results.rows;
        });
};

exports.insertBio=(id, bio)=>{
    console.log("in query insertBio");
    return db.query(`UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
    [id, bio])
        .then(function(results) {
            console.log("bio inserted", results.rows);
            return results.rows;
        });
};
