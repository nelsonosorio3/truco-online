const { User, Friends, Games } = require("../db.js");
const { Router }  = require("express");
const Sequelize = require('sequelize');
// const Op = Sequelize.Op;

const router = Router();



router.get('/' , (req , res) => {
    Games.findAll()
    .then(r => {
        res.json(r);
    })
})

router.post('/:userid/:gameid' , (req , res) => {
    const {userid, gameid} = req.params

    Games.findOne({
        where: {id: gameid},
        raw: true

    })
    .then((gameFound) => {
        if(!gameFound) throw new Error("No existe la partida")
        if(gameFound.winner !== userid && gameFound.loser !== userid) throw new Error("El usuario no participo de la partida")

        return User.findOne({ 
            where: { id: userid},
        })
    })
    .then(user => {
        if(!user) throw new Error("No existe el usuario")
        return user.getGames({
            where: {id: gameid},
        })
    })
    .then(hasResult => {
        if(hasResult.length){
            throw new Error("El usuario ya tiene asignada esta partida")  
        } 
        return User.findOne({ 
            where: { id: userid},
        })
    })
    .then(user => {
        return user.addGames(gameid)
    })
    .then(response => {
        res.json(response)
    })
    .catch((err) => {
        return res.json({message: err.message})
    })
})

router.get('/:userid/' , (req , res) => {
    const {userid} = req.params
    
    User.findOne({ 
        where: { id: userid},
        attributes: ['id', 'username'],
    })
    .then(user => {
        return user.getGames({
            attributes: ['state', "winner", "loser"]
        })
    })
    .then(result => {
        res.json(result)
    })
    .catch((err) => {
        return res.json({message: err.message})
    })
    
})


module.exports = router;
