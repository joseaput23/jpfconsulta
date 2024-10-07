const express = require("express");
const app = express();

const { Op } = require("sequelize");

//*******

const sequelize = require("./src/conexion/connection");
const Categoria = require("./src/modelos/Categorias");
const Serie = require("./src/modelos/Series");
const Genero = require("./src/modelos/Generos");
const Reparto = require("./src/modelos/Reparto");
const SeriesReparto = require("./src/modelos/SeriesReparto");
const SeriesGeneros = require("./src/modelos/SeriesGeneros");

// Relaciones
Serie.belongsTo(Categoria, { foreignKey: "id_categoria", as: "categoria" });
Categoria.hasMany(Serie, { foreignKey: "id_categoria", as: "series" });

// ... Resto de las relaciones ...

module.exports = {
  Categoria,
  Serie,
  Genero,
  Reparto,
  SeriesGeneros,
  SeriesReparto,
};

//******/

const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
