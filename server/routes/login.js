const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarios");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

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


// Google autenticación
async function verify( token ) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
  
}


router.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token)
        .catch( err => {
          return res.status(403).json({
            ok: false,
            err,
          });
        });
  
  Usuarios.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(usuarioDB){
      
      if(usuarioDB.google === false){
        
        return res.status(400).json({
          ok: false,
          err : {
            messege: 'Debe usar la Autenticación normal',
          },
        });

      }else{

        let token = jwt.sign(
          { usuario: userDB },
          "secret",
          { expiresIn: 60 * 60 * 24 * 30 }
        );

        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token,
        });

      }



    }else{
      // Usuario no existe en nuestra db
      let usuario = new Usuarios();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = googleUser.google;
      usuario.password = ':)';

      usuario.save((err, usuariodb) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
      });

    }

  }); 
        
  // res.json({
  //   body: googleUser,
  // });

});

module.exports = router;