"use strict";
exports.__esModule = true;
var express = require("express");
var http = require('http');
var appSocket = express();
var server = http.createServer(appSocket);
// const socketio = require('socket.io')
var io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
require("reflect-metadata");
var cors = require("cors");
const { type } = require("os");
// import socketServer from "./socket";
// const io = socketServer(server);
appSocket.use(express.json());
appSocket.use(express.urlencoded({ extended: false }));
appSocket.use(cors());
server.listen(9000, function () {
    console.log('Server listening at port 9000.');
});

var activeRooms = []
let timeOut;

// objeto con todas las propiedasdes comunes de la partida, cosas como
const table = {
    //estas son las propiedades que son comunes a todos los juegos
    trucoValue: {truco: 2, retruco: 3, valeCuatro: 4}, //lista valor de trucos
    envidoValue: {envido: 2, realEnvido: 3},  //lista valor envido individual
    players: [],
    turn: 1,
    betsList: {firstTurn: ["truco", "envido1", "realEnvido", "faltaEnvido", "ir al mazo"],
                secondTurn: ["truco", "ir al mazo"],
                thirdTurn: ["truco", "ir al mazo"],
                firstTurnFlor: ["truco", "envido1", "realEnvido", "faltaEnvido", "ir al mazo", "flor"],
                flor: ["con flor me achico", "con flor quiero", "contraFlorAlResto", "contraFlor"],
                contraFlorAlResto: ["con flor me achico", "con flor quiero"],
                contraFlor: ["con flor me achico", "con flor quiero"],
                truco: ["no quiero truco", "quiero truco", "retruco", "valeCuatro"],
                retruco: ["no quiero retruco", "quiero retruco"],
                valeCuatro: ["no quiero valeCuatro", "quiero valeCuatro"],
                envido1: ["no quiero", "quiero", "envido2", "realEnvido", "faltaEnvido"],
                envido2: ["no quiero", "quiero", "realEnvido", "faltaEnvido"],
                realEnvido: ["noQuiero", "faltaEnvido"],
                faltaEnvido: ["noQuiero", "quiero"]
                }, //la lista de apuestas posibles la idea es que es un objeto con propiedades de apuestas posibles y un array con cada posible respuesta
    games: {}, //objeto que contiene todas las partidas jugandose, la propiedad es el id de cada Rooom
  };
  /*como se veria table.games {
        1234: {
            playerOne: {
                id: 2144124,
                name: "player",
                score: 0,
                hand: [],
                turnNumber: 1
                isTurn: false,
                betOptions: [],
                tableRival: [],
                tablePlayer: [],
                bet: false,
                roundResults: [],
            },
            playerTwo:{
                //igual que playerOne
            },
            common:{
                envidoList: [],
                trucoBet: "",
                scoreToWin: 15,
                matchesToWin: 1, 
                flor: true,
                cumulativeScore: 1,
                time: 15 * 1000 
            }
        }
  }
*/
  // devuelve el objeto deck para la partida
function buildDeck(){
let deck = [{ id: 1, suit: 'copas', number: 1, truco: 7},
        { id: 2, suit: 'copas', number: 2, truco: 6 },
        { id: 3, suit: 'copas', number: 3, truco: 5},
        { id: 4, suit: 'copas', number: 4, truco: 14 },
        { id: 5, suit: 'copas', number: 5, truco: 13 },
        { id: 6, suit: 'copas', number: 6, truco: 12 },
        { id: 7, suit: 'copas', number: 7, truco: 11},
        { id: 10, suit: 'copas', number: 10, truco: 10 },
        { id: 11, suit: 'copas', number: 11, truco: 9 },
        { id: 12, suit: 'copas', number: 12, truco: 8},
        { id: 13, suit: 'bastos', number: 1, truco: 2},
        { id: 14, suit: 'bastos', number: 2, truco: 6 },
        { id: 15, suit: 'bastos', number: 3, truco: 5},
        { id: 16, suit: 'bastos', number: 4, truco: 14 },
        { id: 17, suit: 'bastos', number: 5, truco: 13 },
        { id: 18, suit: 'bastos', number: 6, truco: 12 },
        { id: 19, suit: 'bastos', number: 7, truco: 11},
        { id: 22, suit: 'bastos', number: 10, truco: 10 },
        { id: 23, suit: 'bastos', number: 11, truco: 9 },
        { id: 24, suit: 'bastos', number: 12, truco: 8 },
        { id: 25, suit: 'espadas', number: 1, truco: 1},
        { id: 26, suit: 'espadas', number: 2, truco: 6,  },
        { id: 27, suit: 'espadas', number: 3, truco: 5},
        { id: 28, suit: 'espadas', number: 4, truco: 14 },
        { id: 29, suit: 'espadas', number: 5, truco: 13 },
        { id: 30, suit: 'espadas', number: 6, truco: 12 },
        { id: 31, suit: 'espadas', number: 7, truco: 3},
        { id: 34, suit: 'espadas', number: 10, truco: 10 },
        { id: 35, suit: 'espadas', number: 11, truco: 9 },
        { id: 36, suit: 'espadas', number: 12, truco: 8 },
        { id: 37, suit: 'oros', number: 1, truco: 7},
        { id: 38, suit: 'oros', number: 2, truco: 6 },
        { id: 39, suit: 'oros', number: 3, truco: 5},
        { id: 40, suit: 'oros', number: 4, truco: 14 },
        { id: 41, suit: 'oros', number: 5, truco: 13 },
        { id: 42, suit: 'oros', number: 6, truco: 12 },
        { id: 43, suit: 'oros', number: 7 , truco: 4},
        { id: 46, suit: 'oros', number: 10, truco: 10 },
        { id: 47, suit: 'oros', number: 11, truco: 9 },
        { id: 48, suit: 'oros', number: 12, truco: 8 }
]
return deck
}
  
  // Fisher-Yates shuffle algorithm 
function shuffleDeck(deck){
let currentIndex = deck.length;
let randomIndex;
while(currentIndex != 0){

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
}

return deck;
}
  
  // le hace pop al deck y devuelve carta ()
function getCard(deck){
return deck.pop();
}

  // devuelve dos arrays de 3 cartas (manos) de cada jugador
function getHands(deck){
const playerAhand = [];
const playerBhand = [];
playerAhand.push(getCard(deck));
playerBhand.push(getCard(deck));
playerAhand.push(getCard(deck));
playerBhand.push(getCard(deck));
playerAhand.push(getCard(deck));
playerBhand.push(getCard(deck));
return [playerAhand, playerBhand]
}

// function nextTurn(){
//     table.turn = table.currentTurn++ % table.numberPlayers;

//     setTimeOut();
// }
// function setTimeOut(){
//     timeOut = setTimeout(()=>{
//         nextTurn();
//         console.log("cambio turno");
//     }, table.waitingTime);
// }

// function resetTimeOut(){
//     if(typeof timeOut === "object"){
//         console.log("timeout reset");
//         clearTimeout(timeOut);
//     }
// }

  
//Hacer passport
// io.use((socket, next) => {
//     console.log("socket.handshake.auth (middleware)", socket.handshake.auth)
//     if (true) {
//       next();

//     } else {
//       next(new Error("invalid"));
//     }
// });


io.on('connection', function (socket) {

    socket.on('passTurn',function(){
        if(table.players[table.turn] === socket.id){
           resetTimeOut();
           nextTurn();
        }
      })
    

    socket.on('connected', function (name) {
        // socket.broadcast.emit('messages', { name: name, msg: name + " has joined." });
        
    });
    socket.on('message', function (data) {
        io.to(data.roomId).emit('messages', { msg: data.msg });
    });
    socket.on('disconnect', function () {
        io.emit('messages', { server: 'Server', message: 'Has left the room.' });
    });
    socket.on('joinRoom', function (roomId) {
        const clients = io.sockets?.adapter.rooms.get(roomId) //set de clientes room
        if(clients?.size < 2 || clients === undefined){ //revisar si la sala esta llena
        socket.join(parseInt(roomId));
        console.log(table.players)
        if(activeRooms.indexOf(roomId) === -1) activeRooms = [...activeRooms, roomId]
        else console.log(roomId, 'ya existe');
        console.log("active rooms: ", activeRooms)
        }
        if(clients?.size === 2) {
            activeRooms =  activeRooms.filter(room=> room!== roomId)
            socket.emit("roomFull", false);
            let iterator = clients.values();
            const player1 = iterator.next().value;
            const player2 = iterator.next().value;
            console.log(clients.values())
            // let player2 = player1.next()
            io.to(player1).emit("playerOrder",true);
            io.to(player2).emit("playerOrder",false);
            table.games[roomId]={};
            table.games[roomId].playerOne = {
                id: player1,
                name: "player1",
                score: 0,
                hand: [],
                turnNumber: 1,
                isTurn: true,
                betOptions: [],
                tableRival: [],
                tablePlayer: [],
                bet: false,
                roundResults: [],
            };
            table.games[roomId].playerTwo = {
                id: player2,
                name: "player2",
                score: 0,
                hand: [],
                turnNumber: 1,
                isTurn: false,
                betOptions: [],
                tableRival: [],
                tablePlayer: [],
                bet: false,
                roundResults: [],
            };
            table.games[roomId].common ={
                envidoList: [],
                trucoBet: "",
                scoreToWin: 15,
                matchesToWin: 1, 
                flor: true,
                cumulativeScore: 1,
                time: 15 * 1000
            }
            console.log(table.games)

         } //remover la sala de la lista si esta llena
         io.emit("newRoomCreated"); // informar a todos los clientes lista neuvas creadas o cerradas
    });
    socket.on('roomTest', function (_a) {
        var room = _a.room;
        socket.to(room.emit('roomAction', {}));
    });
    socket.on('bringActiveRooms', function () {
        io.emit('showActiveRooms', { activeRooms });
    });
    // esucha el evento para iniciar una nueva ronda
    socket.on("newRoundStarts", (roomId)=>{
        let deck = buildDeck(); //contruye deck
        deck = shuffleDeck(deck); //baraja deck
        const [playerAhand, playerBhand] = getHands(deck); //obtiene manos de 3 cartas de dos jugadores
        socket.emit("newRoundStarts", playerAhand); // emite al cliente que emitio el nuevo turno la mano A
        socket.to(roomId).emit("newRoundStarts", playerBhand); // emite al otro cliente de la partida la mano B
        io.in(roomId).emit("bet", table.betsList.firstTurn); // emite a todos el evento apuesta con la lista de posibles apuesta iniciales
    });
    // escucha el evento bet para devolver la lista adecuado de opciones de apuesta
    socket.on("bet", (betPick, roomId) => {
        socket.to(roomId).emit("bet", table.betsList[betPick]); //emite al otro cliente la lista de respuesta a la apuesta enviada
        console.log(table.betsList[betPick]); 
    });
    socket.on("playCard", (card, roomId) => {
        socket.to(roomId).emit("playCard", card) //emite al otro cliente la carta que jugo el cliente emisor
    });
    socket.on("changeTurn", (roomId)=>{
        socket.to(roomId).emit("playerOrder", false);
        socket.emit("playerOrder", true);
    });
    socket.on("roundWin", (roomId, socketId)=>{
        socket.to()
    })


    // if(io.sockets?.adapter.rooms.get(roomId).size === 2 && !table.gameStarted) {
    //     console.log("hola")
    //     io.to(table.players[0]).emit("playerOrder",true);
    //     io.to(table.players[1]).emit("playerOrder",false);
    //     table.gameStarted= true;
    // };

   




    /*
    function getActiveRooms(io) {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name: 
    // ==> ['room1', 'room2']
    const res = filtered.map(i => i[0]);
    return res;
}
    */
});
// io.on('roomAccess', socket => {
//    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
//    const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id)
//    socket.on('connected', (name) => {
//       socket.broadcast.emit('messages', {name, msg: `${name} has joined.`})
//    });
// })
