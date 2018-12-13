
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
        `SELECT first, last, profilepic, bio, id FROM users
        WHERE id =$1`, [id]
    ). then(function(results){

        return results.rows;
    });
};
exports.getOtherUser=id =>{
    return db.query(
        `SELECT first, last, profilepic, bio FROM users
        WHERE id =$1`, [id]
    ). then(function(results){
        //console.log("log: get other user by id from db.js", results.rows);
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

// part 6: friendships:

exports.createFriendship=(sender, receiver)=>{

    return db.query(
        `INSERT INTO  friendships (sender_id, receiver_id)
        VALUES ($1, $2)
        RETURNING *`,
        [sender, receiver]
    ).then(function(results) {

        return results.rows;
    });
};
exports.acceptFriendship=(receiver,sender)=>{

    return db.query(
        `UPDATE   friendships
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        RETURNING *`,
        [ receiver,sender]
    ).then(function(results) {

        return results.rows;
    });
};
exports.deleteFriendship=(receiver,sender)=>{

    return db.query(
        `DELETE  FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [ receiver,sender]
    ).then(function(results) {

        return results.rows;
    });
};
exports.getFriendships=(sender, receiver)=>{
    return db.query(`SELECT*FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)
        `, [sender, receiver]).then(function(results){

        return results.rows;
    });
};

//part 7: friends and wannabes:

exports.getFandWs =(id)=>{
    return db.query(`
    SELECT users.id, first, last, profilepic, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`, [id]).then(function(results){
        return results.rows;
    });
};

//part 8: online users: with different query syntax

exports.getOnlineUsers= (arrayOfIds) => {
    const query = `SELECT id, first, last, profilepic FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

//part 9: chat messages insert and extract:


exports.insertMsg = (id,msg) => {
    return db
        .query(
            `INSERT INTO  chat (sender_id, message)
            VALUES ($1, $2)
            RETURNING *`,
            [id, msg]
        )
        .then(function(results) {

            return results.rows;
        });
};

exports.getChatMessages= ()=>{
    return db.query(`SELECT users.id, first, last, profilepic, message, created_at
        FROM users
        JOIN chat ON sender_id = users.id
        ORDER BY created_at DESC
                LIMIT 10 `).then(results=>{
        return results.rows;
    });
};
exports.getNewChatMessage=(id)=>{
    return db.query(`SELECT users.id, first, last, profilepic, message, created_at
        FROM users
        JOIN chat ON sender_id = users.id
        WHERE chat.id= $1
        ORDER BY created_at DESC
                 `, [id]).then(results=>{
        console.log("results from new message db", results.rows);
        return results.rows;
    });
};
//delete account:



exports.deleteChat = id => {
    return db
        .query(`DELETE FROM chat WHERE sender_id =$1`, [id])
        .then(function(results) {
            return results.rows;
        });
};

exports.deleteFriendship = id => {
    return db
        .query(`DELETE FROM friendships WHERE (sender_id = $1 )
        OR (receiver_id = $1)`, [id])
        .then(function(results) {
            return results.rows;
        });
};

exports.deleteProfile = id => {
    return db
        .query(`DELETE FROM users WHERE id =$1`, [id])
        .then(function(results) {
            return results.rows;
        });
};
