require("./config/config");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(require("./routes/usuario"));

// CONEXION MONGODB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error jejejej"));
db.once("open", () => console.log("Conectado con exito"));

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
