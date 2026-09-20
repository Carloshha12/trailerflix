const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// fileSystem API + JSON.parse → Array de objetos
const trailerflix = JSON.parse(
  fs.readFileSync(path.join(__dirname, process.env.DATA_PATH), "utf-8"),
);

// Normaliza texto para comparar: minúsculas y sin acentos ("Irlandés" → "irlandes")
const normalizar = (texto) =>
  String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Sirve los archivos estáticos de /public (CSS, JS). El index se envía desde la ruta "/"
app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/catalogo", (req, res) => {
  res.json(trailerflix);
});

app.get("/titulo/:title", (req, res) => {
  const busqueda = normalizar(req.params.title);
  const resultado = trailerflix.filter((item) =>
    normalizar(item.titulo).includes(busqueda),
  );

  if (resultado.length === 0) {
    return res
      .status(404)
      .json({ mensaje: `No se encontraron títulos que coincidan con "${req.params.title}".` });
  }
  res.json(resultado);
});

app.get("/categoria/:cat", (req, res) => {
  const busqueda = normalizar(req.params.cat);
  const resultado = trailerflix.filter(
    (item) => normalizar(item.categoria) === busqueda,
  );

  if (resultado.length === 0) {
    return res
      .status(404)
      .json({ mensaje: `No se encontró la categoría "${req.params.cat}". Probá con "serie" o "película".` });
  }
  res.json(resultado);
});

app.get("/reparto/:act", (req, res) => {
  const busqueda = normalizar(req.params.act);
  const resultado = trailerflix.filter((item) =>
    normalizar(item.reparto).includes(busqueda),
  );

  if (resultado.length === 0) {
    return res
      .status(404)
      .json({ mensaje: `No se encontraron títulos con "${req.params.act}" en el reparto.` });
  }
  res.json(resultado);
});

app.get("/trailer/:id", (req, res) => {
  const item = trailerflix.find((t) => t.id === Number(req.params.id));

  if (!item) {
    return res
      .status(404)
      .json({ mensaje: `No existe ningún título con id "${req.params.id}".` });
  }

  const { id, titulo, trailer } = item;
  if (!trailer) {
    return res
      .status(404)
      .json({ id, titulo, mensaje: "El trailer de este título no está disponible." });
  }
  res.json({ id, titulo, trailer });
});

// Cualquier otra ruta
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
