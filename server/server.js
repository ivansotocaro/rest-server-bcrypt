require("./config/config");

const express = require("express");
const mongoose = require("mongoose");

//Inicializamos express
const app = express();

//Parsear los datos que se envian de tipo x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
//Parsear los datos que se envian de tipo Json
app.use(express.json());

app.use(require("./routes/usuario"));

// CONEXION MONGODB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error"));
db.once("open", () => console.log("Conectado con exito"));

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
