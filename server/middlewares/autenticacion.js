const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
 
  let token = req.get('token');

  jwt.verify(token, "secret", (err, decode) => {

    if (err) {
      return res.status(401).json({
         ok: false,
         err,
       });
    }

    req.usuario = decode.usuario;
    next();

  });
  
};


let verificaAdmin_Role = (req, res, next) => {
 
  let usuario = req.usuario;
  if(usuario.role === "ADMIN_ROLE"){
    next();
  }else{

     res.json({
      ok: false,
      err: {
        messeger: 'El usuario no es administrador'
      },
    });

  }
    
};
  

module.exports = {
  verificaToken,
  verificaAdmin_Role,
};