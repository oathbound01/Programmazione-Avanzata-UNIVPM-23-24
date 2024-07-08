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


We implement a system to manage the game of Tic Tac Toe. In particular, the system should provide for the possibility of two users (authenticated through JWT) or one user interacting against the processor. There can be multiple active games at any given time. A user can at the same time participate in one and only one game. The possibility of playing against the processor (hereafter AI) is also requested to be developed. In the case of AI refer to the tic-tac-toe-ai-engine library. The system should provide for creating matches without AI (user versus user only) using the game of 3D Tic Tac Toe.

To ensure user security and authentication, the system uses JWT, allowing only authenticated users to log in and interact with the platform. Users can create matches by specifying the game mode, which can be between two users or against an artificial intelligence, and define a maximum time for each move, with the option of having no time limit. Credit management is a key aspect of the project: each user has a balance of 'credits that is charged for creating matches and for each move made. This credit can be managed and recharged by a system administrator.

The system offers comprehensive match management features, including checking moves and the ability to abandon a match. Users can check the current status of games, verifying whose turn it is, whether the game has ended, and who is the winner. In addition, the system maintains a detailed history of moves, which can be exported in various formats, such as PDF and JSON, and filtered by time period and match type.

Another goal is the creation of a public ranking that orders players by games won, including games won by abandonment, distinguishing between games against other users and against the AI. The ranking can be exported in JSON, PDF or CSV format, providing detailed analysis of player performance.

## 🕹️ Technologies Used

- [tic-tac-toe-ai-engine](https://www.npmjs.com/package/tic-tac-toe-ai-engine)
- Express (https://expressjs.com/it/)
- Sequelize (https://sequelize.org/)
- PostgreSQL (https://www.postgresql.org/)

## 	📊 UML diagrams

### UML Use-case diagrams
![Diagramma dei casi d'uso - Diagramma dei casi d'uso](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/47cec9b6-edf2-4a0f-806d-ee84192a2c38)

### Route: \newGame
The route **<mark>\createGame</mark>** is used to create a new game in the system, the user must provide some specific information. The type of match can be chosen between user versus user, which can be in a simple version or a 3D version of tic-tac-toe, or user versus AI. In the case of a user versus user match, it is necessary to specify the e-mail of the opponent, which will then be used to authenticate requests using JWT tokens.

In addition, a maximum time to make a move can be set; if the time expires, the match is declared over. There is also an option to impose no time limit for moves.

Each match incurs a cost in terms of tokens. For creating a user versus user match, a cost of 0.45 tokens is charged, while for a user versus AI match the cost is 0.75 tokens. In addition, each move made, whether by users or AI, has a cost of 0.05 tokens. You can create a match only if you have enough credit to cover the initial cost of creation. However, if the available credit drops below zero during the course of the match, you can still continue to play until the conclusion.

![Diagramma dei casi d'uso - NewGame](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/690451fa-ab84-4ab5-8023-42ebc9d312c2)

### Route: \getGame
Rout **<mark>\getGame</mark>** is used to obtain detailed information about the same. When a user sends a request to this route, the current status of the game is returned, including whose turn it is currently, whether the game has ended, and, if so, who is the winner. The response also provides additional pertinent details, such as the current game situation and any relevant information that may affect the progress of the game. This allows players to keep abreast of the development of the game and to plan their next moves strategically.

![Diagramma dei casi d'uso - GameStatus](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/4f720390-cbf7-400f-a050-3ab03f8a7a2d)

### Route: \makeMove
The route **<mark>\makeMove</mark>** is used to make a move in a given game is designed to ensure that each move is valid and in accordance with the rules of the game. When a player sends a request to make a move, the system first checks whether it is the turn of the player who sent the request. If it is not his turn, the move is rejected and the player is notified that he must wait his turn.

Next, the system checks whether the proposed move is valid according to the rules of the game. For example, in a game of tic-tac-toe, this means checking that the chosen square is vacant and not occupied by another mark. If the move is eligible, it is recorded in the system and the turn passes to the other player. In addition, the system updates the status of the game and checks whether the move resulted in a victory for one of the players, or whether the game ended in a draw.

In case the move is not valid, the system rejects the request and provides an explanatory message describing why the move is not acceptable. In this way, the player can correct the error and try again.

![Diagramma dei casi d'uso - MakeMove](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/ec02ce81-6f1c-4a09-add3-fdc7bb189744)

### Route: \getMoves
The route **<mark>\getMove</mark>** is used to obtain the move history and allows users to view all the moves made in past matches, providing options to customize the output format and search criteria.

When a user invokes this route, he or she can specify the desired output format, which can be PDF or JSON. The choice of encoding and the PDF library to be used are at the discretion of the student, allowing flexibility in technology implementation.

In addition, the user can filter the moves according to the desired time period. A lower and upper date can be specified to define a time range, or a specific period, such as "last month" or "last quarter," can be specified to obtain the moves made during that period.

For further details, it is also possible to filter the moves by match type. This includes distinguishing between user vs. user matches, both simple and 3D versions, and user vs. AI matches.

![Diagramma dei casi d'uso - MoveHistory](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/28b5c69e-6a10-4d46-9e12-65b739b88622)

### Route: \quitGame
The **<mark>\quitGame</mark>** route is for abandoning a game that is designed to allow players to end a game in progress in a formal and orderly manner. When a player decides to abandon a match, he or she sends a request to this specific route.

The system first verifies the identity of the player to ensure that the request actually comes from one of the participants in the match. Once the identity is confirmed, the system records the abandonment and updates the status of the match, indicating that it has been abandoned. The remaining player is then declared as the winner due to abandonment by the opponent.

![Diagramma dei casi d'uso - QuitGame](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/2a0bf80f-93a6-4a32-917b-caed46017442)

### Route: \leaderboard
To implement the **<mark>\leaderboard</mark>** route, which returns player rankings without requiring authentication, the system needs to collect and aggregate several pieces of information related to games played. The ranking includes the total number of games won, both regularly and by opponent abandonment, and the number of games lost, also divided into regular and opponent abandonment losses. This data is categorized according to whether the games were played against other users or against artificial intelligence (AI).

Each player's score is calculated by considering all games won, including those by opponent abandonment. This score is the main metric for ranking players.

When a user accesses the ranking route, he or she can choose to sort the results in ascending or descending order with respect to the players' score. The output of the route is available in three formats-JSON, PDF, and CSV-to allow flexible visualization and use of the data.

In summary, the route is designed to provide a clear and detailed overview of players' performance, highlighting their performance in matches against real and AI users, and offering a diverse output option to accommodate data visualization and analysis needs.

![Diagramma dei casi d'uso - Leaderboard (1)](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/44dbe94d-e84d-4d82-920e-83e8641a5ca2)

### Route: \getCredits
The route **<mark>\getCredits</mark>** allows users to view their credit balance within the system. When a user sends a request to this route, the system verifies the authenticity of the JWT token provided with the request. Once authentication is confirmed, the system retrieves and returns the current credit balance associated with the user who made the request.

![Diagramma dei casi d'uso - CheckCredit](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/15f9817e-8038-4751-b0f3-7f136e880de3)

### Route: \recharge
The **<mark>\recharge</mark>** route is designed to allow administrators to recharge the credit of a specific user within the system. Access to this route is protected by authentication using JWT, ensuring that only authorized administrators can perform this critical operation.

When an administrator wishes to top up a user's credit, he or she sends a request including the target user's e-mail address and the amount of credit to be added. The system checks the validity of the JWT token to confirm that the administrator has the necessary privileges to perform this action.

Once the authenticity of the request is confirmed, the system proceeds to update the specified user's credit with the amount provided. All recharge transactions are tracked and recorded in the system to ensure transparency, auditability, and security of transactions.

![Diagramma dei casi d'uso - AddCredit](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/81b62654-27e8-4b59-a589-5fa44f8cb2ec)


## 🧭 Routes:
| Route          | Method | Description                       | Authentication jwt |
|----------------|--------|-----------------------------------|--------------------|
| \newGame       | POST   | Initiate a new game               |        Yes         |
| \getGame       | GET    | Retrieve the current game state   |        Yes         |
| \makeMove      | POST   | Make a move in the game           |        Yes         |
| \getMoves      | GET    | Get all moves of a game           |        Yes         |
| \quitGame      | POST   | Quit the current game             |        Yes         |
| \leaderboard   | GET    | Get the leaderboard               |        No          |
| \getCredits    | Get    | Get user credits                  |        Yes         | 
| \recharge      | POST   | Recharge user credits             |        Yes         | 


## 🧮 Patterns used

### Singleton
The Singleton is a creational design pattern that guarantees that there is only one instance of a class and provides a global access point to that instance.

In the design, the DBAccess class uses the Singleton pattern to guarantee that there is only one instance of Sequelize, the object that represents the database connection. This is critical for several reasons:

- **Connection Management**: Having only one instance of Sequelize means that multiple connections to the database are not opened, avoiding wasted resources and ensuring efficient connection management.

- **Data Consistency**: Because the instance is shared across the application, all parts of the application access the database through the same connection. This helps maintain data consistency and avoid inconsistencies due to different connections.

- **Ease of Maintenance**: The Singleton simplifies database connection management. Because the instance is unique, any changes to the connection configuration or error handling can be applied centrally without having to replicate them throughout the code.

### DAO
The DAO (Data Access Object) pattern is a design pattern that separates data access logic from business logic within an application. The main purpose of the DAO is to provide an abstract interface for data access while hiding database-specific implementation details. APIs shield the application from the complexity of CRUD (Create, Read, Update, Delete) operations that occur within the underlying storage mechanism. This allows both layers to evolve independently without knowing anything about each other.

In our project, the DAO pattern was used to manage data access and manipulation within the PostgreSQL database through the Sequelize ORM in the Node.js environment.

### Model-Controller
In our project, the Model-Controller (or Model-View-Controller, MVC) pattern is used to organize the application structure and clearly separate responsibilities between data management (Model), business logic (Controller). This approach promotes a modular and scalable backend application structure. In the backend context, a view (view) is not used; requests are made using Postman.

### Chain of Responsibility
The Chain of Responsibility is a behavioral design pattern that allows you to pass requests along a chain of handlers. Each handler in the chain has the ability to process the request or pass it on to the next handler in the chain. This pattern decouples the sender of a request from its receiver, giving multiple objects a chance to handle the request.

In our project, the Chain of Responsibility pattern is implemented using middleware functions organized in pipelines to handle different aspects of request validation and processing. Each middleware function in the pipeline is responsible for a specific validation or processing task related to incoming requests.

## 🔧 How to use the project


## 💻 Tests


## 	👥 Contributors
[Alessandro Rossini](https://github.com/oathbound01) (1119002)

[Tosca Pierro](https://github.com/toscap2002) (1120542)














