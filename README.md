#### In order to run the source code:
    (Assuming python and 'pip' is installed)
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver

  There is uncompiled version of React code inside the *frontend* folder but you don't have to compiled it to use the app, as I already compiled it inside *frontend/build* folder and connected it to Django to serve it through *group_call/urls.py*. The *frontend* folder is just to review the React part of the code.


# Introduction

This is the source code to the group call app where you can create public or invite-only rooms to chat with other people. The app itself is simple and easy enough to use, nothing too fancy. Behind the scene though, it is a hell or so I define it. The idea for the app came to me when my friend asked me, *‘Can you build a clone of the zoom app?’*. *‘Can I?’*, I asked myself (spoiler, I couldn't). In the last final project for the CS50x course, I build a twitter-like Django app which was also simple. I thought to myself, I needed to make something better and different from that. I have to push myself harder if I want to test my skills and grow my knowledge. So for this reason I need to build something new, and also you guys mentioned not to copy previous projects. 

So yeah anyway, this app is not the best or perfect at all. I mean it might have many security issues that I didn't know due to my experience and there might be still lots of bugs lurking in the shadows or midst of giant code hell. But at least it works fine and I am proud of it!

# Overview of the project

The main technology I used here to pull off the group calling app are Django, React, and WebRTC. There are also respective dependencies I used along with these technologies. Like in Django I used DRF(Django Rest Framework) and Django Channels(a Web-socket framework for Django), with WebRTC I used a wrapper named *‘simple-peer’* package by Feross and in React I used many small libraries like *Formik*, *Yup*, *Axios* and more, so that my life get easier while I code. Well, kind of easier. I mean I will ignore the part I had to read through every documentation to understand these libraries and packages.

As you can guess my back-end was Django with DRF which was mainly for APIs. For this, session-based authentication wasn’t ideal, so I used the *'simple-jwt'* package for my JWT (Jason Web Token) Authentication. As I mentioned above I also used Django Channels, a web-socket framework for Django that helped me send signals between all users in an isolated room. These signals in combination with WebRTC (which I will briefly explain in a moment) enabled me to achieve a browser to browser connection where users can send media data to each other.

As for the front-end, I used React with libraries like *Formik* for forms, *Yup* for form validation schema, and Material UI for styling the app and giving that polish feel to it. *Axios* package was a great replacement for the 'fetch' method in JavaScript, that helped me to make those Ajax (Asynchronous JavaScript And XML) requests easily. 

Most of the front-end functionality was done in React which was divided into many React components. My React app is then compiled to normal HTML, CSS, and JavaScript inside *frontend/build* folder with the help of Webpack and Babel which is then served by Django through a URL route.

WebRTC was the most difficult technology of all, which was hard for me to understand and apply to my project. I still don't understand it quite. Without looking at google if I answer *'What is WebRTC?'*, well, it is a technology built into JavaScript that allows one user's browser to connect to another user's browser through a protocol, and the connection is persisted between the users without any server involved. I mean you do need a server initially, but after the connection is made server is not involved anymore. Well my brief explanation was close enough.

 The package *‘simple-peer’* was really handy when building this WebRTC group call app. It was a wrapper around WebRTC that simplified most of the complex API that was given by WebRTC to simple API.

# Django

In the root project directory, except the *'frontend'* and *'readme_screenshots'* folder, the rest of the folders and files are part of the back-end i.e. Django.

![Project folder file structure](./readme_screenshots/screenshot1.png)

## Folder: *group_call* (*settings.py, wsgi.py, urls.py…*)

![group_call folder file structure](./readme_screenshots/screenshot2.png)

We start from the *'group_call'* folder where the settings file, main urls file, and application reside.

Inside *'group_call/asgi.py'*, the file has been modified by creating a root routing configuration for Channels so that when HTTP requests are made, Channels server can receive it through this point.

The *'group_call/urls.py'* has three endpoints. 
- *‘admin/’* route takes to the admin section of the site, 
- *‘api/’* takes to api app,
-  and finally the last route with a regular expression is for the front-end where the compiled version of React is served.

In the *'group_call/settings.py file'*, I have added some custom configuration at the bottom of the file. Some of the configurations are like setting custom static file directory, some DRF related configurations, setting custom user model as default user model and some Channels specific settings. In the *'INSTALLED_APPS'* along with third-party apps, I have included two apps in this project which are 
- *‘api’* (API endpoint created with DRF),
-  and *‘video_signaling’* (Django Channel’s consumers)

## Folder: *api* (API App)

![api folder file structure](./readme_screenshots/screenshot3.png)

The *'api'* folder handles the task like creating room models, authentication for users, serializers, and so on.

In *'api/models.py'* I have created a custom *'User'* model that uses the *'email'* field as a way to authenticate user instead of *‘username’* and because of this, I needed to update *'UserManager'* class and *'UserAdmin'* class. Then below that, I also created the *'Room'* model which is used in group video call. The fields in the *'Room'* model are pretty self-explanatory. We have the *'titles'* and *‘description’* fields and also the **'type_of'* field so that room can be categorized as open or invite-only. We have a field for *‘user’* which connects the User model via a foreign key and finally a *‘created_on’* field for when the room was created.

The *'api/serializers.py'* is where all JSON serializing and deserializing of model happens. Since I am using JWT authentication to authenticate the user, I have made two serializer classes for that purpose. In *'TokenObtainPairSerializer'* class, I modified the *‘get_token’* class method to return *‘full_name’* field (concatenating *‘first_name’* and *‘last_name’* field from *User* model) along with other default JWT data in token. *'RegisterTokenSerializer'* class is used to deserialize user data coming from the front-end during registration and in return, they get serialized user data with JWT token pair (refresh and access tokens) which will be then used to authenticate the user from the front-end. And finally, we have *'RoomSerializer'* class that deals with the *'Room'* model. I also added an additional field *'room_id'* that generates room id depending upon the room type is open or invite so that can be used in the URL address bar.

In *'api/views.py'*, since I modified the *'TokenObtainPairSerializer'* class by adding the *'full_name’* field, I had to replace the old serializer class in *'TokenObtainPairView'* class with the modified token serializer class. Below that, I have defined *'RegisterAndObtainTokenView'* class that deals with user registration. Depending upon what the user sent, an appropriate response is then given back. Finally, we have *'RoomViewset'* class where all CRUD operation for the *'Room'* model happens. You can also see I override three methods inside the class, *‘get_queryset’*, *‘get_permissions’* and *‘destroy’* as follows. 

*‘get_queryset’* method is modified in such a way that by default its gonna return a list of all rooms with the recently created room at the top but if search query param is given, its gonna return list matching that param. I wanted to show the list of rooms even if the user is not logged-in but when they make a post request to create a room, the permission is restricted to the logged-in user only, so *‘get_permission’* is modified in such a way to deal with this. Since I don’t want one user to delete another user room, so in the *‘destroy’* method I made sure that didn’t happen as it compares the user id of the room with the user id that came from decoding the JWT token of that user in the request header before delete the room.

Finally, in *'api/urls.py'* file, I defined all the API endpoints. CRUD endpoints for the rooms are defined by *'DefaultRouter'* that is given by DRF which out of the box gives me endpoint to *‘rooms/’* and *‘rooms/int:room_id’*. Below that we have *‘user/create/’* endpoint for registration, followed by *‘token/’* endpoint that generates token pair (refresh and access token) that is used during login process, *‘token/refresh/’* endpoint refreshes *'access token'* if it gets expired and *‘token/verify/‘* endpoint is used to verify a token is valid or not.

## Folder: *video_signalling* (App to used for the signaling process of WebRTC)

![video_signalling folder file structure](./readme_screenshots/screenshot4.png)

This folder holds all the logic for the web-socket connection. It also keeps track of how many users joined in any specific room. This app does not hold many files. Only *'video_signalling/routing.py'* and *'video_signalling/consumers.py'* are important here.

Let's start with *video_signalling/routing.py*. Just like *'urls.py'* for HTTP protocol the *'routing.py'* is used to expose web-socket endpoint. You can see in the file there is only one path that is defined with a regular expression path and this path take a dynamic value as the room name.

*'video_signalling/consumers.py'* file has only one giant class *'VideoConsumer'* that inherits from *'AsyncWebsocketConsumer'* (which makes all the task asynchronous) that deals with web-socket connect, disconnect, send, and receiving message logic. You can see at the top I defined a class variable, *'USERS_CONNECTED'* which is a list to store users and this variable will be passed to all the users in the room whenever a user connects or disconnects so they store it in their React state and that way all users keep tab of how many users are there in a room. 

    Note that storing users in *'USERS_CONNECTED'* is not the same as adding users to the room which is done in a separate method given by Django Channels inside ‘connect’ method .

The first three methods *‘connect’*, *‘disconnect’*, and *‘receive’* are like events that happen when a user connects to, disconnect from, or sends messages to the web-socket. The rest of the methods are used to send a group message to all users in the rooms.

*‘connect’* method just creates a room and adds the user who joined into that room while *‘disconnect’* clears user from the room and from the class variable *'USERS_CONNECTED'* and sends a group message by calling *'group_send'* method to all the users who are connected to the room. In several place of this class I used *'group_send'* method which is Channels specific method responsible for sending messages to all users in the room.  Every time the *'group_send'* method is called a corresponding method, matching that call is defined below which is just a *‘send’* method that sends a message to a single user. For example this is how I send data to all user: 

![video_signalling folder file structure](./readme_screenshots/screenshot13.png)

and corresponding that value *'new_user_joined'* which is assigned to key *'type'* I have this method defined 

![video_signalling folder file structure](./readme_screenshots/screenshot14.png)

Hope that makes sense.

*‘receive’* method receives a message from a user and in response, a message is fired back to all users in the room depending upon what the message is. I am still scratching the surface about Django Channels and clearly, you can see my code is not that great and maybe not the right way to go about it. But at least it does the job. Back to the *'receive'* method, as you know data is received from the user through this method. It is then converted to python *'dict'*. This data is checked through an if-else statement to know what type of data arrived. If the type is *‘new_user_joined’* the user is first checked for validity (is the user authenticated), user id is stored in the class variable *'USERS_CONNECTED'* and then every other user is made aware of this user joining in and updated *'USERS_CONNECTED'* is passed to all so they can store it in their React state. If the type is an *'offer'* or an *'answer'* it just sends the signal back to the user to who the signal was intended for. The data also have sender’s and receiver’s *‘user_id’* value in it so that data from one user reaches another user properly. In Django Channels, I didn't know how to send a message to a specific user so I ended up using this method where Channel sends message data along with sender's and receiver's *'user_id'* to all users, and then in React the message is received and checked if the receiver’s *‘user_id’* matches with that currently logged-in user id. This is the basic structure of message data sent back and forth between users through Django Channels:

![Message Data structure](./readme_screenshots/screenshot5.png)

And finally, if the type is *'disconnect'* then everybody is notified about it so they clear data related to that user in their React state.

# React

For the front-end as I mentioned I used React with many small libraries. All of the libraries are listed inside the file package.json which is inside the folder *'frontend'*.

### The main packages used:

- *‘react-router-dom’* package is used to add route functionality to the app so that the app can be divided into different sections for users to visit.

- *Axios* package is used instead of fetch because it has several API that makes fetching data simpler, like defining a base URL in one place and using it everywhere with just adjusting the endpoint.

- *Formik* and *Yup* packages were used in conjunction to create forms and add validation respectively.

- *‘jwt-decode’* is a small package that I used to decode JWT tokens to extract user info

- *Material UI* for styling the app and also providing mobile responsiveness. Though here in there I used my custom styling to the app.

- Finally, *'simple-peer'*, which is a wrapper for WebRTC APIs. This wrapper was helpful, as it made dealing with WebRTC easier and I don't have to worry about a lot of things that I have to do in WebRTC manually.

In the root project directory, the folder *'frontend'* holds all of my React code. Inside this folder, it's a pretty generic React structure.

![frontend folder file structure](./readme_screenshots/screenshot6.png)

We have a *'frontend/public/'* folder that holds our *'index.html'*, *'frontend/src'* folder with all of React components, and *'frontend/build'* folder where all of the files from *'frontend/public/'*  and *'frontend/src'* directory is compiled to serve in Django. You can also see in *'group_call/settings.py'*, I configured *'STATICFILES_DIRS'* and *'TEMPLATES'* to point to this folder.

*'Index.jsx'* file is inside *'frontend/src'* folder is the usual entry point of the app which renders the *App* component. Inside the *App* component, there is the *Routes* component which then branches to different parts of the app with the help of *HashRouter* given by *'react-router-dom'*. *Routes* component has a lot of important methods for app. Like *loadRooms* (for loading list of rooms), *handleSearchChanges* (that calls *loadRooms* method but with query *param* which is just the search value from search bar), *authenticateUser* (the authentication method checks whether the user is logged in or not) and *printFeedback* (this method is used to send feedback messages to user). There is also methods like *closeRoomForm*, *openRoomForm* and *closeFeedback* which is used in conjunction with Material UI package to open and close different UI in the app.

In the *'frontend/src/components'* folder I divided my application into five parts which then comes together in the Routes component:

- Navigation (*frontend/src/components/navigation_bar*)
- Authentication(*frontend/src/components/authentication*)
- Lobby (*frontend/src/components/lobby*)
- Video Room (*frontend/src/components/video_room*)
- Utilities (*frontend/src/components/utilities*)

![components folder file structure](./readme_screenshots/screenshot7.png)

## Utilities

![Utilities folder file structure](./readme_screenshots/screenshot8.png)

This file holds all of my reusable functions, constants, and components that I used around the app. 

* *axios.jsx*
  - *getCookie* method is used to get csrf token from the cookie
  - *axiosInstance* instance is used make post, get and delete request with baseURL and several header value already defined.
  - *getRoomsList* is used to get room data from back-end
  - *validateToken* checks the validity of any token that is passed as argument
  - *refreshingAccessToken* is used to refresh *'access'* token

* *CONSTANTS.jsx*
  - *BASE_API_URL* is just url for the backend api
  - *webSocketUrl* function returns websocket URL depending upon the HTTP protocol
  - *AVAILABLE_PATHS* is just all the URL routes
  - *ALL_PATH_TITLES* is title corresponding to each URL routes defined in *AVAILABLE_PATHS*

* *authForms_validation_schema.jsx* and *roomForms_validation_schema.jsx* is validation schema made with *Yup* package to use in *Formik* forms.

* Inside *'frontend/src/components/utilities/components'* all my reusable components live that I use across the app


      There is one component in particular I needed to mention though, that is 'UserInfoProvider' which is a context provider for the whole app so that I can distribute user info (User id and user full name) across the app for easy access. This provider wraps the whole app inside 'Routes' component. The value for the provider is also filled inside 'Routes' with the help of 'authenticateUser' method.

![Navigation folder file structure](./readme_screenshots/screenshot15.png)

## Navigation

![Navigation folder file structure](./readme_screenshots/screenshot9.png)

**Note:** You will notice every section there is one file that ends with *'\*_styles.jsx'* which is just custom styling used to override Material UI styling for that specific component. So I will ignore those files.

Inside the *NavigationBar* component, the major functionality I provided was the search bar and links to the different endpoint of the app like the login, register, lobby and video room. It also provides a button that opens *'create room'* form. 

The navigation bar conditionally changes what it displays depending upon whether a user is logged in or not or what to hide in different routes. 
- *showComponents* is responsible for displaying search bar and *'create room form'* button when the route is *'/lobby'* only. 
- *changePageTitle* method is use to change the title on the navigation bar depending upon the current route.
-  *menuAction* is used to decide what action to perform whenever any item in the menu is clicked.

These methods is executed in different parts of the *NavigationBar* components, like in *constructor* method, life-cycle method like *componentDidMount* and *componentDidUpdate* and also in *render* method menu items are change depending upon user is logged-in or not.

## Authentication

![Authentication folder file structure](./readme_screenshots/screenshot10.png)

This folder has three components, *AuthenticationRoute*, *Login* and *Register* component. *AuthenticationRoute* component is a wrapper around *Route* component given by '*react-router-dom'* so I can redirect users to lobby if they are already authenticated. Both the *Login* component and Register component are pretty similar and uses *Formik* forms to handle user data submission along with *Yup* validation. All these two components does is, gets user data, validates it (shows error if data is invalid) and submits the data through onSubmit function. I used here Material UI styles to show visual feedback of error or success during submission.

Since I am using JWT authentication after a successful login or registration process user receives two tokens which are *'refresh'* and *'access'* tokens as follows that are then stored in the local storage of the browser. The access token is used in all of the request's header while making GET/POST/PUT/DELETE requests. That way back-end knows the person who is making a request is a valid user. And refresh token is used to refresh the access token when it expires. 

## Lobby

![Lobby folder file structure](./readme_screenshots/screenshot11.png)

This folder has two important functions. Displaying all rooms and a form to create a new room. 

### Display Room list

The list of rooms are displayed through the *RoomList* component. The data for the rooms list is loaded with the method *loadRooms* that was defined in *Routes* component and passed it down to *RoomList* as props.

Each of the rooms are just a single *Room* component. In the file *'Room.jsx'* is where the *Room* component is defined. Each *Room* component has details of the room like Title, description, date, and so on. There is also button like 'Enter' button to enter the room, 'Delete' button to delete it and Copy link button for copying room link for the invite-only room. These buttons are conditionally displayed depending on whether the room belongs to the current logged-in user or not or whether the room is invite-only or open to all. The enter and delete button's on-click actions are defined in *RoomList* component by *enterRoom* and *deleteRoom* (this methods just makes DELETE request with *roomId* as a *param* value) respectively. Inside Room component two methods were defined which are:

  - *copyRoomUrl* method is an on-click action for Copy link button that just lets you copy room link to your clipboard

  - *renderRoomType* method is just used to covert room type initials to readable text, for example 'OTA' to 'Open to all'

### Create Room Form

Inside *lobby* folder there is another folder called *'RoomForm'* which holds the *CreateRoomForm* component. This is a form which also uses *Formik* and *Yup* functionality to submit new room data, so that a new room can be created. This component is used inside *RoomList*, and it is at the top wrapped within *Modal* component provided by Material UI. This form is hidden by default but whenever the plus button is clicked, that is on navigation bar, this form is displayed as a overlay over the app. This overlay functionality was actually provided by Material UI

The *onSubmit* function unlike *Login* and *Register* is defined in *Roomlist* component where after creating a new room the *Roomlist* is refreshed so that the new room that was created just now is displayed at the top.



## Video Room (and WebRTC)

![Video Room folder file structure](./readme_screenshots/screenshot12.png)

First of all, inside the *'frontend/src/components/video_room'* folder there is a file called *'VideoRoomRoute.jsx'* which is just a wrapper around *Route* from *‘react-router-dom'* so that the user will be redirected to Login if the user is not logged in.

*'VideoRoom.jsx'* file holds all of my WebRTC logic and front-end web-socket logic. Understanding both of the concepts was a bit hard for me and I still don't understand them quite well. The code in this file still sometimes confuses me but I will try to explain what I tried to do here.

When the first user joins the room, the *VideoRoom* component is mounted and the user is immediately connected to Django Channels via web-socket and message is fired storing this user in the Channels (only if the connection was successful) and asked that user for access to their media devices, that is user's webcam and microphone. If the user fails to provide media access then this room shows an error page saying the user can't access this room without media devices. But on success, the user's data from user media is stored in a React state and it is played back to the user through the *Video* component. Nothing else happens until another user joins in, where the same process repeats to the second user except this time this user alerts all the other users (which is the first user) about this user. The new user then creates WebRTC offers for each users in the room and sends them via web-socket (that is, Django Channels). Every user then receives those signals and store them as their RTC remote description and creates a WebRTC answer in response. Which is then sent back to the user who sent the offer initially. The user who initiated the offer then receives the answer and sets that offer to their RTC remote description. Once this process is successfully passed a connection is made between every user in that room with each other and even if the server is turned off the connection will persist. Now since the connection is made each user will be able to see their fellow remote user video on the screen along with theirs in a *Video* component. Users get three buttons at the bottom of their screen to mute/unmute the video, mute/unmute audio and leave the room. Once any user leaves the room everybody is notified about it so that everyone can clear the WebRTC data that is related to the user who just disconnected.

Methods inside *VideoRoom* component:
  - *muteVideo*, *muteAudio* and *leaveRoom* methods are just as it says. 
  - *CreatePeer* creates a *Peer* object (with help of *'simple-peer'* package) as initiator and sends signal as an *offer* to single user with that *Peer* and returns that *Peer* for storing in the React state.
  - *addPeer* creates a a *Peer* object as non-initiator and sets the offer it just received as it's remote description. Then signals back that user with *answer* and finally returns the a *Peer* object.
  - *sendSignalsToAll* creates peer for each user in the room and send them offers with the help of *CreatePeer* method. Then for every *Peer* object created by method *CreatePeer*, is stored in the React state

*componentDidMount* life-cycle method is the place user receives messages from the web-socket(Django Channels) and deals with those messages. 
Here at first the object *navigator.mediaDevices* exist or not is being confirmed. Then web-socket connection is attempted to be made. After that *websocket.open* event is triggered in successful connection and message is fired back that a new user joined the room. Up next, is *websocket.onmessage* event, that receives messages sent by Channels. Just like Channels *receive* method the data received is converted to Javascript object and that object is ran against Javascript 'Switch/Case' command to determine what 'type' of data arrived. As I mentioned above the data sent back and forth has three 'keys' in common, that is 'type', 'from'(sender) and 'to'(receiver). Here in this switch command different type of messages are dealt with differently.

if *type* is equal to:
  - **new_user_joined**: User is asked for permission to media devices. And then when user gives the access, the stream object from that media devices is stored in React state and *sendSignalsToAll* method is called with current user id and that stream as an argument. And if the user joined is not the same as the current user then that user is made aware of the new user by firing *printFeedback*.
  - **sending_offer**: If receiver id is equal to current user id then the offer that came is set as that user remote description and *addPeer* method is fired. The *Peer* object return from *addPeer* is stored in state.
  - **sending_answer**: If receiver id is equal to current user id then the answer arrived is set as that user remote description and WebRTC connection is made.
  - **disconnected**: if the user who disconnected is not the current user then information regarding that user is cleared from that current user's React state.

*componentWillUnmount* life-cycle method is the place where stream is closed, web-socket connection is closed, all the WebRTC is connection is destroyed and all the states are cleared when a user is leave the room.

*Video* components is just a video element that plays the stream. This stream might be passed locally or remotely.


# Closing Thoughts

Phew, that was long. Learning Django and React and all the packages related to these two technologies was a journey for me. WebRTC was the most that gave me troubles. It gave me hard times and I almost gave up on this project just because of this. Many articles were explaining what WebRTC is in theory, and some tutorials on how to make a video call app but none were about Django and React. Sure there were tutorials on how to implement it in React but since I was a complete noob I wanted to know how to implement it with Django step by step. It was so frustrating to understand how to implement it. In the end, it worked. Not the best but worked.

Sorry if I missed out on explaining some of the stuff in projects. But I tried to give as much information as possible. Especially with WebRTC and Django Channels, the implementation is so confusing, it's still hard to explain what exactly happening with these two 'technology' within my code. I am really sorry if I couldn't explain it. But that doesn't mean I mindlessly coded it. I learned so much throughout the project and evolved from where I started. And I will just keep getting better at understanding these concepts in the future.

Thank you.
