const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarios");
const router = express.Router();

router.post('/login', (req, res) => {
    
  let {email, password} = req.body;
  
  Usuarios.findOne({email: email}, (err, userDB) => {

    if (err) {
     return res.status(500).json({
        ok: false,
        err,
      });
    } 
     
    if(!userDB) {
        return res.status(400).json({
          ok: false,
          err: {
            messeger: "(Usuario) o contraseña incorrecta",
          },
        });
    }

    if(!bcrypt.compareSync(password,userDB.password)){
        return res.status(400).json({
          ok: false,
          err: {
            messeger: "Usuario o (contraseña) incorrecta",
          },
        });
    }

    let token = jwt.sign({
      usuario: userDB,
    },"secret", {expiresIn: 60 * 60 * 24 * 30} );

    res.json({
      ok: true,
      usuario: userDB,
      token,
    });


  });

});

module.exports = router;