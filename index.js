const express = require("express");
const fs = require("node:fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// fileSystem API + JSON.parse → Array de objetos
const TRAILERFLIX = JSON.parse(fs.readFileSync(process.env.DATA_PATH, "utf-8"));

// Sirve los archivos estáticos de /public (CSS, JS, index.html)
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  // ...
});

app.get("/catalogo", (req, res) => {
  // ...
});

app.get("/titulo/:title", (req, res) => {
  // ...
});

app.get("/categoria/:cat", (req, res) => {
  // ...
});

app.get("/reparto/:act", (req, res) => {
  // ...
});

app.get("/trailer/:id", (req, res) => {
  // ...
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
