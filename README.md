# Programmazione-Avanzata-UNIVPM-23-24
Project for the Programmazione Avanzata course - UnivPM 2023/2024

## Table of Contents

- [Project specification and goals](#-project-specification-and-goals)
- [Technologies Used](#️-technologies-used)
- [UML diagrams](#-uml-diagrams)
  - [UML Use-case diagrams](#uml-use-case-diagrams)
  - [Route: \newGame](#route-newgame)
  - [Route: \getGame](#route-getgame)
  - [Route: \makeMove](#route-makemove)
  - [Route: \getMoves](#route-getmoves)
  - [Route: \quitGame](#route-quitgame)
  - [Route: \leaderboard](#route-leaderboard)
  - [Route: \getCredits](#route-getcredits)
  - [Route: \recharge](#route-recharge)
- [Routes](#-routes)
- [Patterns used](#-patterns-used)
  - [Singleton](#singleton)
  - [DAO](#dao)
  - [Model-Controller](#model-controller)
  - [Chain of Responsibility](#chain-of-responsibility)
- [How to use the project](#-how-to-use-the-project)
- [Tests](#-tests)
- [Contributors](#-contributors)


## 📋 Project specification and goals


We implemented a system to manage the game of Tic Tac Toe. In particular, the system should accomodate two users (authenticated through JWT) or one user interacting against an AI opponent. There can be multiple active games at any given time. A user can only take part in one game at a time. 

This system uses JWT, allowing only authenticated users to log in and interact with the platform. Users can create games by specifying the game mode, which can be between two users (either 2D or 3D Tic Tac Toe) or against an AI, and define a maximum time for each move, with the option of having no time limit. Credit management is a key aspect of the project: each user has a balance of 'credits' that is charged for creating games and for each move. These credits can be managed and recharged by a system administrator.

The system offers comprehensive game management features, including checking moves and the ability to quit a game. Users can check the current status of games, verifying whose turn it is, whether the game has ended, and who is the winner. In addition, the system maintains a detailed history of moves.

The sostware has a leaderboard system that orders players by games won, including forfeited games. The ranking can be exported in JSON, PDF or CSV format, providing detailed analysis of player performance.

## 🕹️ Technologies Used

- [tic-tac-toe-ai-engine](https://www.npmjs.com/package/tic-tac-toe-ai-engine)
- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Express](https://expressjs.com/it/)
- [Node.js](https://nodejs.org/en)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Postman](https://www.postman.com/)

## 	📊 UML diagrams

### UML Use-case diagrams
![Diagramma dei casi d'uso - Diagramma dei casi d'uso](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/47cec9b6-edf2-4a0f-806d-ee84192a2c38)

### Route: /newGame 
The route **<mark>/newGame</mark>** is used to create a new gam. The user must provide some specific information about the game, such as the opponent or the game mode. The type of match can be chosen between user versus user, which can be in a simple version or a 3D version, or user versus AI. In the case of a user versus user match, it is necessary to specify the e-mail of the opponent.

In addition, a maximum time to make a move can be set; if the time expires, the match is declared over. There is also an option to impose no time limit for moves.

Each match incurs a cost in terms of tokens. For creating a user versus user match, a cost of 0.45 tokens is charged, while for a user versus AI match the cost is 0.75 tokens. In addition, each move made, whether by users or AI, has a cost of 0.05 tokens. You can create a match only if you have enough credits to cover the initial cost of creation. However, if the available credit drops below zero during the course of the match, you will still be able to play.

![Diagramma dei casi d'uso - NewGame](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/690451fa-ab84-4ab5-8023-42ebc9d312c2)

### Route: /game/:gameId
The oute **<mark>/game/:gameId</mark>** is used to obtain detailed information about a given game. When a user sends a request to this route, the current status of the game is returned, including whose turn it is currently, whether the game has ended, and, if so, who is the winner. The response also provides additional pertinent details, such as the current game state (the game board) and any relevant information that may affect the progress of the game.

![Diagramma dei casi d'uso - GameStatus](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/4f720390-cbf7-400f-a050-3ab03f8a7a2d)

### Route: /move/:gameId:
The route **<mark>/move/:gameId:</mark>** is used to make a move in a given game. When a player sends a request to make a move, the system first checks whether it is the turn of the player who sent the request. If it is not his turn, the move is rejected and the player is notified that he must wait for his turn.

Next, the system checks whether the proposed move is valid according to the rules of the game. For example, in a game of tic-tac-toe, this means checking that the chosen square is vacant and not occupied by another mark. If the move is eligible, it is recorded in the system and the turn passes to the other player. In addition, the system updates the status of the game and checks whether the move resulted in a victory for one of the players, or whether the game ended in a draw.

In case the move is not valid, the system rejects the request and provides an explanatory message describing why the move is not acceptable.

![Diagramma dei casi d'uso - MakeMove](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/ec02ce81-6f1c-4a09-add3-fdc7bb189744)

### Route: /history 
The route **<mark>/history</mark>** is used to obtain the move history and allows users to view all the moves made in past games, providing options to customize the output format and search criteria.

When a user invokes this route, they can specify the desired output format, which can be PDF or JSON.
In addition, the user can filter the moves according to the desired time period. A lower and upper date can be specified to define a time range.

![Diagramma dei casi d'uso - MoveHistory](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/28b5c69e-6a10-4d46-9e12-65b739b88622)

### Route: /quit/:gameId:
The **<mark>/quit/:gameId: </mark>** route is for quitting a game currently in progress. When a player decides to abandon a game, they send a request to this specific route.

The system first verifies the identity of the player to ensure that the request actually comes from one of the participants of the game. Once the identity is confirmed, the system acknoledges the action and updates the status of the game, indicating that it has been forfeited. The remaining player is then declared as the winner.

![Diagramma dei casi d'uso - QuitGame](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/2a0bf80f-93a6-4a32-917b-caed46017442)

### Route: /leaderboard
To implement the **<mark>/leaderboard</mark>** route, which returns player rankings without requiring authentication, the system needs to collect and aggregate several pieces of information related to games played. The ranking includes the total number of games won, both regularly and by opponent abandonment, and the number of games lost, also divided into regular and opponent abandonment losses. This data is categorized according to whether the games were played against other users or against artificial intelligence (AI).

Each player's score is calculated by considering all games won, including those by opponent abandonment. This score is the main metric for ranking players.

When a user accesses the ranking route, they can choose to sort the results in ascending or descending order with respect to the players' score. The output of the route is available in three formats-JSON, PDF, and CSV.

![Diagramma dei casi d'uso - Leaderboard (1)](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/44dbe94d-e84d-4d82-920e-83e8641a5ca2)

### Route: /credits 
The route **<mark>/credits </mark>** allows users to view their credit balance within the system. When a user sends a request to this route, the system verifies the authenticity of the JWT token provided with the request. Once authentication is confirmed, the system retrieves and returns the current credit balance associated with the user who made the request.

![Diagramma dei casi d'uso - CheckCredit](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/15f9817e-8038-4751-b0f3-7f136e880de3)

### Route: /recharge
The **<mark>/recharge</mark>** route is designed to allow administrators to recharge the credit of a specific user within the system. Access to this route is protected by authentication using JWT, ensuring that only authorized administrators can perform this critical operation.

An admin can send a request including the target user's e-mail address and the amount of credit to be added. The system checks the validity of the JWT token to confirm that the administrator has the necessary privileges to perform this action.

Once the authenticity of the request is confirmed, the system proceeds to update the specified user's credit with the amount provided. The amount cannot go over a set amount of max credits.

![Diagramma dei casi d'uso - AddCredit](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/81b62654-27e8-4b59-a589-5fa44f8cb2ec)


## 🧭 Routes:
| Route          | Method | Description                       | JWT Authentication |
|----------------|--------|-----------------------------------|--------------------|
| /newGame       | POST   | Initiate a new game               |        Yes         |
| /game/:gameId: | GET    | Retrieve the current game state   |        Yes         |
| /move/:gameId: | POST   | Make a move in the game           |        Yes         |
| /history       | GET    | Get all moves by the user         |        Yes         |
| /quit/:gameId: | POST   | Quit a game                       |        Yes         |
| /leaderboard   | GET    | Get the leaderboard               |        No          |
| /credits       | GET    | Get user credits                  |        Yes         | 
| /recharge      | POST   | Recharge a user's credits         |        Yes         | 


## 🧮 Patterns used

### Singleton
The Singleton is a creational design pattern that guarantees that there is only one instance of a class and provides a global access point to that instance.

In the design, the DBAccess class uses the Singleton pattern to guarantee that there is only one instance of Sequelize, the object that represents the database connection. 

### DAO
The DAO (Data Access Object) pattern is a design pattern that separates data access logic from business logic within an application. The main purpose of the DAO is to provide an abstract interface for data access while hiding database-specific implementation details. APIs shield the application from the complexity of CRUD (Create, Read, Update, Delete) operations that occur within the underlying storage mechanism.

In our project, the DAO pattern was used to manage data access and manipulation within the PostgreSQL database through the Sequelize ORM in the Node.js environment.

### Model-Controller
In our project, the Model-Controller (or Model-View-Controller, MVC) pattern is used to organize the application structure and clearly separate responsibilities between data management (Model) and business logic (Controller). This approach promotes a modular and scalable backend application structure. In the backend context, a view (view) is not used; requests are made using Postman.

### Chain of Responsibility
The Chain of Responsibility is a behavioral design pattern that allows you to pass requests along a chain of handlers. Each handler in the chain has the ability to process the request or pass it on to the next handler in the chain. This pattern decouples the sender of a request from its receiver, giving multiple objects a chance to handle the request.

In our project, the Chain of Responsibility pattern is implemented using middleware functions organized in pipelines to handle different aspects of request validation and processing. Each middleware function in the pipeline is responsible for a specific validation or processing task related to incoming requests.

## 🔧 How to use the project
To use the project, you need to have [Docker](https://www.docker.com/) installed and running on your device. 
Secondly, you need to clone this GitHub repository:
```
[git clone https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24
```

After coping the project, you need to place a **<mark>.env</mark>** file inside the project directory. Here are the required fields with example parameters:
```
DB_NAME=tictactoe
DB_USER=tttadmin
DB_PASSWORD=dbpass
DB_PORT=5432
DB_HOST=db
```
`DB_HOST=db` is the name of the Postgres container and should be left as is.
In this file, you also need to include the private key, which can be generated by tools such as OpenSSL, using the RS256 algorithm.
This same private key will need to be used to generate the JWT tokens that allow for actual usage of this program.
Once these steps are completed, you can proceed with running the project.

Now you'll need to generate the Docker image for the application using the following command:
```
docker-compose build
```
Start the Docker Compose consisting of the application container and the PostgreSQL container with this command:
```
docker-compose up
```

When both the containers are up and running, you must enter the `backend` container's shell with the following command:

```
docker exec -it backend bash
```

In the container you have to run Sequelize migrations and seeders, otherwise the program won't work correctly:

```
sequelize db:migrate

sequelize db:seed:all
```
This will give you acces to three default users:
- "user1@example.com": an admin user;
- "user2@example.com": a standard user;
- "zero@example.com": another standard user with 0 tokens left;

Once everything is set up, you can proceed to make requests using [Postman](https://www.postman.com/).

## 💻 Test
In all routes that require authorization, the JWT payload should include the following fields:
```
{
  "email": "user2@example.com",
  "role": "user",
}
```
After that we can go on to test all the routes.
Each request made to a route should include a JSON-formatted payload in its body.

### **<mark>/newGame</mark>**
This route creates a new game. 
- `gameOpponent`: the player opponent. Can be either a player's email or `AI`;
- `gameMode`: the game type. Can be `2D` or `3D`;
- `turnTime`: the turn timer in seconds. Maximum value is 300. Set to 0 for no timer;
```
{
    "gameOpponent": "AI",
    "gameMode": "2D",
    "turnTime": 0
}
```
A successful response returns the ID of the newly-created game.

### **<mark>/game/<gameId></mark>**
In this route, we pass the `gameId` parameter in the URL. The result is:
```
{
    "Message": "Game status successfully retrieved",
    "GameStatus": {
        "status": "IN PROGRESS",
        "player1": "user2@example.com",
        "player2": "AI",
        "currentTurn": "user2@example.com",
        "gameState": [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ],
        "winner": "TBD"
    }
}
```

### **<mark>/move/:gameId:</mark>**
This is the route used to make a move in the Tic-Tac-Toe game board of game with id `gameId`.
It will ad an 'X' if the user is player one or an 'O' if it's player two.
- `move`: the coordinates of the board space where to place the next move. 0-8 for 2D games, [0-3, 0,15] for 3D games;
```
{
    "move": "0",
}

```
The response contains the current game state.

```
{
    "Message": "Move successfully executed",
    "winner": "TBD",
    "status": "IN PROGRESS",
    "gameState": [
        "X",
        "",
        "",
        "",
        "O",
        "",
        "",
        "",
        ""
    ]
}
```

### **<mark>/history</mark>**
Return the move history for the current user. Can include optional filters in the request body.
- `lowerDate`: retrieves all moves after this date. Format is `YYYY-MM-DD`;
- `upperDate`: retrieves all moves after this date. Format is `YYYY-MM-DD`;
- `fileType`: desired output format. Can be `PDF`, `pdf`, `JSON`, `json`. Defaults to JSON.

```
{
    "lowerDate": "2023-3-3",
    "upperDate": "2024-10-10"
}
```
The result is something like this:
```
{
    "Message": "History of moves successfully retrieved",
    "MoveHistory": [
        {
            "moveId": 4,
            "gameId": 2,
            "player": "user2@example.com",
            "move": [
                4,
                2
            ],
            "gameType": "3D",
            "moveDate": "2024-07-09T15:42:55.428Z",
            "createdAt": "2024-07-09T15:42:55.428Z",
            "updatedAt": "2024-07-09T15:42:55.428Z"
        }
    ]
}
```

       
### **<mark>/quit/:gameId:</mark>**
Quits the game specified in `gameId`.
The user can't quit games that they aren't a part of or that are already over.
Awards a victory by forfeit to the other player.

```
{
    "Messages": "Game successfully quit"
}
```
 
 ### **<mark>/leaderboard</mark>**
Returns the current leaderboard with all users and their wins and losses.
Can include optional parameters in the body:
 
```
{
    "fileType": "csv"
}
```
`fileType`: desired output format. Can be `PDF`, `pdf`, `csv`, `json`, `JSON`, `json`. Defaults to JSON. 
And the result is:
```
User,Wins,Losses,Forfeit Wins,Forfeit Losses,Wins against AI,Losses against AI
user1@example.com,1,1,0,0,1,0
user2@example.com,0,2,0,0,0,1
```
 
 ### **<mark>/credits</mark>**
Returns the current user's credits.

 ```
{
    "credits": 4.3
}
```

 ### **<mark>/recharge</mark>**
This route allows an admin to recharge a specificied user's credit count. 
It will fail if trying to recharge a user over the maximum balance of 25 credits.
 - `amount`: the amount of credits to add;
 - `recipient`: the email of the user that that will receive the credits.

```
{
    "amount": 1,
    "recipient": "user1@example.com"
}
```
Returns a message if it succeeds.

```
{
    "Messages": "Credits successfully recharged"
}
```

### **<mark>/invalid</mark>**
When the user inputs an invalid route, they the following error message.
```
{
    "error": "Route not found"
}
```
  
## 	👥 Contributors
[Alessandro Rossini](https://github.com/oathbound01) (1119002)

Contributed to controllers (game logic), error messages, miscellanous and game validation middleware. 

[Tosca Pierro](https://github.com/toscap2002) (1120542)

Contributed to models, migrations, seeders, success messages and authentication validation middleware.














