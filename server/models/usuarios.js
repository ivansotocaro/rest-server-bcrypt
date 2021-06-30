const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol valido",
};

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "USER_ROLE",
      enum: rolesValidos,
    },
    estado: {
      type: Boolean,
      required: true,
      default: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamp: true,
  }
);

const Usuarios = mongoose.model("Usuarios", usuarioSchema);

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

module.exports = Usuarios;
