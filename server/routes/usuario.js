const express = require("express");
const Usuarios = require("../models/usuarios");
const app = express();

app.get("/usuario", (req, res) => {
  res.json("get Usuario");
});

app.post("/usuario", (req, res) => {
  let body = req.body;

  let usuario = new Usuarios(body);

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

    //
  });

  //
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  res.json({ id });
});

app.delete("/usuario", (req, res) => {
  res.json("delete Usuario");
});

module.exports = app;
