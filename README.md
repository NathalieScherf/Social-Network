# Social-Network

A basic social network with interactive functions: 

* A profile page with an image and bio, including a upload function as well as a delete function for the whole account. 
* A page to view your friends and friend requests
* Functions to send and accept friend requests as well as functions to end friendships or remove  pending requests
* A chat for all users

## Technologies
* React/Redux
* Socket.io
* Node.js
* AWS  S3 and Knox
* PostgreSQL
* HTML5/CSS3

## Description: 

A new user is directed to a registration  page and can browse to a login page.  

![Start](/ImgsRM/Registration.PNG)

After successful registration or login the user lands on the profile page. 

Using the nav bar, the user can browse to a page with friends and friend requests, the chat or see other users who are online.
![Nav](/ImgsRM/Naybar.PNG)

On the profile page, the bio can be added/changed and a profile picture uploaded. In this exampe, a page is already uploaded and the bio is being edited. 

![ProfilePage](/ImgsRM/ImageandBio.PNG)

This is waht the page looks like if an other user  views your profile. They can send you a friend request, or delete an existing friendship. 

![Otheruser](/ImgsRM/ViewOtherUser.PNG) 

The logged in user can also browse to the "friends" page and get an overview of all the friends, 

![Friends](/ImgsRM/friends.PNG)

as well as pending friendships: 

![Wannabes](/ImgsRM/wannabes.PNG)

On this page friendships can also be acepted or ended. 

There is a chat where all users online can communicate. A list of the 10 most recent messages are loaded when the page loads and  new messages are added (with a time stamp). 


![Start](/ImgsRM/Chat1.PNG)
![Start](/ImgsRM/ChatResponse.PNG)
