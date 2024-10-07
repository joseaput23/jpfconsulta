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

Serie.belongsToMany(Genero, {
  through: SeriesGeneros,
  foreignKey: "id_serie",
  as: "generos",
});
Genero.belongsToMany(Serie, {
  through: SeriesGeneros,
  foreignKey: "id_genero",
  as: "series",
});

Serie.belongsToMany(Reparto, {
  through: SeriesReparto,
  foreignKey: "id_serie",
  as: "reparto",
});
Reparto.belongsToMany(Serie, {
  through: SeriesReparto,
  foreignKey: "id_reparto",
  as: "series",
});

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

app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate();
    await Categoria.sync();
    await Genero.sync();
    await Reparto.sync();
    await Serie.sync();
    await SeriesGeneros.sync();
    await SeriesReparto.sync();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en el servidor", description: error.message });
  }
});

//07-10-2024
app.get("/reparto", async (req, res) => {
  const { nombre } = req.query; // Tomamos el parámetro 'nombre' de la query string

  try {
    // Realizamos la consulta
    const reparto = await Reparto.findAll({
      where: {
        nombre_reparto: {
          [Op.like]: `%${nombre}%`, // Busca coincidencias parciales
        },
      },
    });

    // Si no se encuentran resultados
    if (reparto.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró ningún reparto con ese nombre" });
    }

    // Retornamos los resultados en JSON
    res.json(reparto);
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      message: "Error en el servidor",
      description: error.message,
    });
  }
});

///--------------------------------------------servidor en escucha------
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
