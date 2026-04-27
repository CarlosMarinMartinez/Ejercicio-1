let offset = 0;
const limit = 50; // 50 Pokémon → 5 columnas → 10 filas
let totalPokemons = 1025;

// Cargar lista
async function loadList() {

  const status = document.getElementById("status");
  const listView = document.getElementById("list-view");
  const detailView = document.getElementById("detail-view");
  const pagination = document.getElementById("pagination");

  detailView.style.display = "none";
  listView.style.display = "grid";
  pagination.style.display = "block";

  status.textContent = "Cargando...";
  listView.innerHTML = "";

  try {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Error");

    const data = await response.json();

    status.textContent = "";

    for (let pokemon of data.results) {

      const res = await fetch(pokemon.url);
      const pokeData = await res.json();

      const div = document.createElement("div");
      div.classList.add("pokemon-card");

      div.innerHTML = `
        <h4>#${pokeData.id}</h4>
        <img src="${pokeData.sprites.front_default}">
        <p>${pokeData.name}</p>
      `;

      div.onclick = () => loadDetail(pokeData.id);

      listView.appendChild(div);
    }

    // Control botones
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    prevBtn.disabled = offset === 0;
    nextBtn.disabled = offset + limit >= totalPokemons;

  } catch (error) {
    status.innerHTML = `
      Error al cargar.
      <button onclick="loadList()">Reintentar</button>
    `;
  }
}

// Cargar detalle
async function loadDetail(id) {


  const status = document.getElementById("status");
  const listView = document.getElementById("list-view");
  const detailView = document.getElementById("detail-view");
  const pagination = document.getElementById("pagination");

  listView.style.display = "none";
  pagination.style.display = "none";
  detailView.style.display = "block";

  status.textContent = "Cargando...";
  detailView.innerHTML = "";

  try {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error("Error");

    const data = await response.json();

    status.textContent = "";

    detailView.innerHTML = `
      <h2>${data.name}</h2>
      <img src="${data.sprites.front_default}">
      <p>ID: ${data.id}</p>
      <p>Altura: ${data.height}</p>
      <p>Peso: ${data.weight}</p>
      <p>Tipos: ${data.types.map(t => t.type.name).join(", ")}</p>

      <br>

      <button ${data.id === 1 ? "disabled" : ""} 
        onclick="loadDetail(${data.id - 1})">Anterior</button>

      <button ${data.id === 10025 ? "disabled" : ""} 
        onclick="loadDetail(${data.id + 1})">Siguiente</button>

      <br><br>

      <button onclick="loadList()">Volver</button>
    `;

  } catch (error) {
    status.innerHTML = `
      Error al cargar detalle.
      <button onclick="loadDetail(${id})">Reintentar</button>
    `;
  }
}

// Botones paginación
document.getElementById("next").addEventListener("click", () => {
  if (offset + limit < totalPokemons) {
    offset += limit;
    loadList();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (offset >= limit) {
    offset -= limit;
    loadList();
  }
});

// Cargar al iniciar
loadList();
