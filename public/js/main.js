// Retraso escalonado en la aparición de cada endpoint
document.querySelectorAll(".endpoint").forEach((el, i) => {
  el.style.animationDelay = `${i * 0.08}s`;
});

// Año dinámico en el pie de página
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// ---- Buscador: consume los endpoints de la API ----
const form = document.getElementById("search-form");
const tipo = document.getElementById("search-type");
const input = document.getElementById("search-input");
const status = document.getElementById("search-status");
const results = document.getElementById("results");

const placeholders = {
  catalogo: "Se muestra todo el catálogo",
  titulo: "Ej: casa, dark, stranger...",
  categoria: "Ej: serie o película",
  reparto: "Ej: Al Pacino, Winona...",
};

function actualizarFormulario() {
  const esCatalogo = tipo.value === "catalogo";
  input.disabled = esCatalogo;
  input.placeholder = placeholders[tipo.value];
  if (esCatalogo) input.value = "";
}

function setStatus(texto, esError = false) {
  status.textContent = texto;
  status.classList.toggle("error", esError);
}

function crearTarjeta(item) {
  const card = document.createElement("article");
  card.className = "card";

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = item.categoria;

  const titulo = document.createElement("h3");
  titulo.textContent = item.titulo;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = item.temporadas
    ? `${item.temporadas} temporadas · ${item.reparto}`
    : item.reparto;

  const resumen = document.createElement("p");
  resumen.className = "resumen";
  resumen.textContent = item.resumen;

  const trailer = document.createElement("div");
  trailer.className = "trailer";
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "Ver trailer";
  boton.addEventListener("click", () => cargarTrailer(item.id, trailer));
  trailer.append(boton);

  card.append(badge, titulo, meta, resumen, trailer);
  return card;
}

// Usa el endpoint /trailer/:id para obtener la URL (o el aviso de no disponibilidad)
async function cargarTrailer(id, contenedor) {
  contenedor.replaceChildren();
  try {
    const res = await fetch(`/trailer/${id}`);
    const data = await res.json();

    if (res.ok) {
      const link = document.createElement("a");
      link.href = data.trailer;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "▶ Abrir trailer";
      contenedor.append(link);
    } else {
      const aviso = document.createElement("span");
      aviso.className = "no-disponible";
      aviso.textContent = data.mensaje;
      contenedor.append(aviso);
    }
  } catch {
    contenedor.textContent = "No se pudo consultar el trailer.";
  }
}

async function buscar() {
  const valor = input.value.trim();
  let ruta = "/catalogo";

  if (tipo.value !== "catalogo") {
    if (!valor) {
      results.replaceChildren();
      setStatus("Escribí algo para buscar.", true);
      return;
    }
    ruta = `/${tipo.value}/${encodeURIComponent(valor)}`;
  }

  setStatus(`GET ${ruta}`);
  try {
    const res = await fetch(ruta);
    const data = await res.json();

    if (!res.ok) {
      results.replaceChildren();
      setStatus(data.mensaje, true);
      return;
    }

    results.replaceChildren(...data.map(crearTarjeta));
    setStatus(`GET ${ruta} · ${data.length} resultado${data.length === 1 ? "" : "s"}`);
  } catch {
    results.replaceChildren();
    setStatus("No se pudo conectar con el servidor.", true);
  }
}

tipo.addEventListener("change", () => {
  actualizarFormulario();
  if (tipo.value === "catalogo") buscar();
  else input.focus();
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  buscar();
});

actualizarFormulario();
buscar(); // Al abrir la página se muestra todo el catálogo
