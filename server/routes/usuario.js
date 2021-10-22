const express = require("express");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarios");
const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");
const router = express.Router();


router.get("/usuario", verificaToken,(req, res) => {
  
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

router.post("/usuario",[verificaToken,verificaAdmin_Role], (req, res) => {
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

router.put("/usuario/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Usuarios.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
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

router.delete("/usuario/:id", [verificaToken,verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Usuarios.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true },
      (err, usuarioDB) => {
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
      }
    );
});

module.exports = router;
