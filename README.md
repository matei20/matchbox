# Matchbox
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ***Online dating android application***
## Table of contents
* [About](#about)
* [Features](#features)
* [Technologies, development and implementation aspects](#technologies,-development-and-implementation-aspects)
* [Demo](#demo)
* [Contact](#contact)
## About
***Matchbox*** is an online dating app that enables users to anonymously like or dislike profiles of other users within a defined proximity, once two users have like each other they can exchange messages.

## Features
The android app lets you:
- authenticate/register with email and password
- add profile photo
- and some information about yourself (age, gender, school, job, a short bio)
- custom search filters based on age and location
- like/dislike other people profiles
- possibility to start a private real-time conversation with each one of your matches
- delete account and all associated information

***Matchbox*** requires the following permissions:
- location
- storage

## Technologies, development and implementation aspects

- ***Front end***
   - developed with [React Native](https://facebook.github.io/react-native/)
   - open-source library [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat) used for chat UI screen

- ***Back end***
  - web server developed with [ASP.NET Core 2.1](https://dotnet.microsoft.com/learn/aspnet/what-is-aspnet-core) framework which is responsible for providing a response to HTTP requests that come from users
  - WebSocket server implemented with [NodeJS](https://nodejs.org/en/about/) that allows real time chat features, handle clients and messages  
  - Token Authentication and Authorization using [JWT](https://jwt.io/introduction/)
  - Both servers are connected to [Oracle database19.c](https://www.oracle.com/database/)


## Demo

#### 1.Login/Swipe/Matches/Chat

![Demo](docs/gifs/login-matches.gif)

#### 2.Register

![Register Demo](docs/gifs/register.gif)

## Contact
- Created by [matei20](https://github.com/matei20) - feel free to contact me!