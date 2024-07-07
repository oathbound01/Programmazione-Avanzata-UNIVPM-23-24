# Programmazione-Avanzata-UNIVPM-23-24
Project for the Programmazione Avanzata course - UnivPM 2023/2024

## 📋 Project specification and goals


We implement a system to manage the game of Tic Tac Toe. In particular, the system should provide for the possibility of two users (authenticated through JWT) or one user interacting against the processor. There can be multiple active games at any given time. A user can at the same time participate in one and only one game. The possibility of playing against the processor (hereafter AI) is also requested to be developed. In the case of AI refer to the tic-tac-toe-ai-engine library. The system should provide for creating matches without AI (user versus user only) using the game of 3D Tic Tac Toe.

## 🕹️  Technologies Used

- [tic-tac-toe-ai-engine](https://www.npmjs.com/package/tic-tac-toe-ai-engine)
- Express (https://expressjs.com/it/)
- Sequelize (https://sequelize.org/)
- PostgreSQL (https://www.postgresql.org/)

## 	📊 UML diagrams

### UML Use-case diagrams
![Diagramma dei casi d'uso - Diagramma dei casi d'uso](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/47cec9b6-edf2-4a0f-806d-ee84192a2c38)

### Route: \newGame
![Diagramma dei casi d'uso - NewGame](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/690451fa-ab84-4ab5-8023-42ebc9d312c2)

### Route: \getGame
![Diagramma dei casi d'uso - GameStatus](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/4f720390-cbf7-400f-a050-3ab03f8a7a2d)

### Route: \makeMove
![Diagramma dei casi d'uso - MakeMove](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/ec02ce81-6f1c-4a09-add3-fdc7bb189744)

### Route: \getMoves
![Diagramma dei casi d'uso - MoveHistory](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/28b5c69e-6a10-4d46-9e12-65b739b88622)

### Route: \quitGame
![Diagramma dei casi d'uso - QuitGame](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/2a0bf80f-93a6-4a32-917b-caed46017442)

### Route: \leaderboard
![Diagramma dei casi d'uso - Leaderboard (1)](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/44dbe94d-e84d-4d82-920e-83e8641a5ca2)

### Route: \recharge
![Diagramma dei casi d'uso - AddCredit](https://github.com/oathbound01/Programmazione-Avanzata-UNIVPM-23-24/assets/95303629/81b62654-27e8-4b59-a589-5fa44f8cb2ec)


## Routes:
| Route          | Method | Description                       | Authentication jwt |
|----------------|--------|-----------------------------------|--------------------|
| \newGame       | POST   | Initiate a new game               |        Yes         |
| \getGame       | GET    | Retrieve the current game state   |        Yes         |
| \makeMove      | POST   | Make a move in the game           |        Yes         |
| \getMoves      | GET    | Get all moves of a game           |        Yes         |
| \quitGame      | POST   | Quit the current game             |        Yes         |
| \leaderboard   | GET    | Get the leaderboard               |        No          |
| \recharge      | POST   | Recharge user credits             |        Yes         | 


## Patterns used














