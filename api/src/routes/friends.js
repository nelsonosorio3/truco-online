const { Router } = require("express");
const { json } = require("sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User, Friends } = require("../db.js");

const router = Router();

//todas las rutas /api/friends
router.get('/', (req, res) => {
  res.json({ msg: 'ruta /api/friends' });
})

router.post('/:id/:email', (req, res) => {

  const { id, email } = req.params
  if (!id || !email) return res.status(404).json({ message: "Missing parameters!" })

  User.findByPk(id)
    .then(sender => {
      if (!sender) throw new Error("No se encontro el id del usuario")
      User.findOne({ where: { email: email } })
      .then(requested => {
          if (!requested) throw new Error("No se encontro el Email")
          if(requested.toJSON().id === sender.toJSON().id) throw new Error("No se puede enviar una solicitud a uno mismo")
          return sender.hasUserRequested(requested)
        })
        .then((r) => {
          if (r) throw new Error("Ya se ha enviado una solicitud a este usuario")
          return User.findOne({ where: { email: email } })
        })
        .then(requested2 => {
          requested2.Friends = {
            status: "pending"
          }
          sender.addUserSender(requested2)
          res.status(201).json({ message: "Se envio una solicitud de amistad a " + requested2.email })
        })
        .catch(err => {
          return res.status(404).json({ message: err.message })
        })
    })
    .catch(err => {
      return res.status(404).json({ m: err.message })
    })
})

router.put('/:id/:email', (req, res) => {
  const { id, email } = req.params
  const { response } = req.query

  // console.log("La respuesta fue:");
  // console.log(response);

  if (!id || !email) return res.status(404).json({ Error: "Missing parameters!" })

  let userRequestedData = null
  let userSenderData = null

  User.findByPk(id)
  .then((requested => {
    if (!requested) throw new Error("No se encontro el usuario")
    userRequestedData = requested
    return User.findOne({ where: { email: email } })
  }))
  .then((sender) => {
    if (!sender) throw new Error("No se encontro el id del usuario")
    userSenderData = sender
    return Friends.findAll({
      where: {
        status: "pending",
        userSenderId:sender.toJSON().id,
        userRequestedId: id
      }
    })
  })
  .then((result) => {
    if(!result.length) throw new Error("El usuario requerido no tiene solicitud pendiente")
    userRequestedData.Friends = {
      status: response
    }
    return userSenderData.addUserSender(userRequestedData)
  })
  .then(response2 => {
    if (response == "accepted") {
      res.status(201).json({ message: "La solicitud fue aceptada "})
    } else {
      res.status(201).json({ message: "La solicitud fue rechaza por"})
    }
  })
  .catch(err => {
    return res.status(404).json({ message: err.message })
  })


  // User.findByPk(id)
  //   .then(requested => {
  //     if (!requested) throw new Error("No se encontro el usuario")

  //     User.findOne({ where: { email: email } })
  //       .then(sender => {
  //         if (!sender) throw new Error("No se encontro el id del usuario")
  //         //Revisar teoria
  //         requested.Friends = {
  //           status: response
  //         }
  //         sender.addUserSender(requested)
  //         if (response == "accepted") {
  //           res.status(201).json({ message: "La solicitud fue aceptada por " + requested.email })
  //         } else {
  //           res.status(201).json({ message: "La solicitud fue rechaza por " + requested.email })
  //         }
  //       })
  //       .catch(err => {
  //         return res.status(404).json({ message: err.message })
  //       })
  //   })
  //   .catch(err => {
  //     return res.status(404).json({ message: err.message })
  //   })
})

router.delete('/:id/:email' , (req , res) => {
  const {id, email} = req.params
  const {response} = req.query

  if(!id || !email) return res.status(404).json({Error: "Missing parameters!"})

  let userDeletedData = null

  User.findByPk(id)
  .then(userResult => {
    if(!userResult) throw new Error("No se encontro el usuario")
    return User.findOne({where: {email: email}})
  })
  .then(userResult => {
    if(!userResult) throw new Error("No se encontro el mail del email")
    userDeletedData = userResult.toJSON()
    return Friends.destroy({
      where: {
        status: "accepted",
        userSenderId: {[Op.or]: [id, Number(userDeletedData.id)]},
        userRequestedId: {[Op.or]: [id, Number(userDeletedData.id)]},
      }
    })
  })
  .then(result => {
    return result ? res.send("Se elimino amigo") : res.send("No se pudo eliminar el amigo.")
  })
  .catch(err => {
    return res.status(404).json({message: err.message})
  })
})

module.exports = router;
