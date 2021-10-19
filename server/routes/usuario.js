const express = require("express");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarios");
const app = express();

app.get("/usuario",(req, res) => {
  Usuarios.find((err, usuarioDB) => {
    
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    } else {
      res.status(201).json({
        ok: true,
        usuario: usuarioDB,
      });
    }

  });
  
 

});

app.post("/usuario", (req, res) => {
  let { nombre, email, password, role, estado, google } = req.body;

  let usuario = new Usuarios({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    estado,
    google,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    } else {
      res.status(201).json({
        ok: true,
        usuario: usuarioDB,
      });
    }

    
  });

  
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  let body = req.body;
  
  Usuarios.findByIdAndUpdate(id, body, {new: true}, (err, usuarioDB) => {
     if (err) {
       res.status(400).json({
         ok: false,
         err,
       });
     } else {
       res.status(201).json({
         ok: true,
         usuario: usuarioDB,
       });
     }
  });

});

app.delete("/usuario/:id", (req, res) => {

  let id = req.params.id;
  

  Usuarios.findByIdAndUpdate(id, {estado: false}, { new: true }, (err, usuarioDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    } else {
      res.status(201).json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  });

});

module.exports = app;
