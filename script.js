let backgroundColor;
let typeName;
let typeIcon;
let indexPokemonMain;
let currentIndex = 0;
let cardsPerLoad = 20;
let pokemon = [];
let pokemonMain = [];
let pokemonEvo = [];
let pokemonList = [];
let detailedpokemonMain = [];
let evoChain = [];

const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=500&offset=0";

async function onloadFunc() {
  showLoadingMessage();
  disableLoadMoreButton();

  await loadPokemonList();
  await loadPokemonDetails();
  await loadEvolutionChains();

  currentIndex = 0;
  renderCards();

  hideLoadingMessage();
  enableLoadMoreButton();
}

function showLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "flex";
}

function hideLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "none";
}

async function loadPokemonList() {
  let pokemonListe = await getAllPokemon();
  pokemon.push(...pokemonListe);
}

async function loadPokemonDetails() {
  const detailsPromises = pokemon.map((p) => getPokemonDetails(p.url));
  pokemonMain = await Promise.all(detailsPromises);
}

async function loadEvolutionChains() {
  const evoPromises = pokemonMain.map(async (evo) => {
    try {
      const speciesData = await getPokemonDetails(evo.species.url);
      return await getEvoChainDetails(speciesData.evolution_chain.url);
    } catch (error) {
      return [];
    }
  });
  pokemonEvo = await Promise.all(evoPromises);
}

async function getAllPokemon() {
  let response = await fetch(BASE_URL);
  try {
    let responseToJson = await response.json();
    return responseToJson.results;
  } catch (error) {
    console.error("Fehler beim Parsen der Antwort:", error);
    return [];
  }
}

async function getPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

async function getEvoChainDetails(evolutionChainUrl) {
  try {
    let response = await fetch(evolutionChainUrl);
    let evolutionData = await response.json();

    let evolutions = [];
    let currentChain = evolutionData.chain;

    while (currentChain) {
      evolutions.push(currentChain.species.name);
      currentChain = currentChain.evolves_to[0];
    }

    return evolutions;
  } catch (error) {
    console.error("Fehler beim Abrufen der Evolutionskette:", error);
    return [];
  }
}

function renderCards() {
  let myCardRef = document.getElementById("cardContainer");
  let pokemonToRender = pokemonMain.slice(currentIndex, currentIndex + cardsPerLoad);
  currentIndex += cardsPerLoad;

  pokemonToRender.forEach((pokemonList, index) => {
    let backgroundColor = typeColors[pokemonList.types[0].type.name];
    let typeIconsHTML = generateTypeIconsHTML(pokemonList, backgroundColor);
    const modalId = `pokemonModal_${index + currentIndex - cardsPerLoad}`;
    myCardRef.innerHTML += getCard(index + currentIndex - cardsPerLoad, pokemonList, backgroundColor, typeIconsHTML, modalId);
  });
}

function generateTypeIconsHTML(pokemonList, backgroundColor) {
  return pokemonList.types.map((type) => getIcon(backgroundColor, typeIcons[type.type.name])).join("");
}

function openModal(index) {
  let pokemon = pokemonMain[index];
  let backgroundColor = typeColors[pokemon.types[0].type.name];
  let typeIconsHTML = "";

  for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
    let typeName = pokemon.types[typeIndex].type.name;
    let typeIcon = typeIcons[typeName];
    typeIconsHTML += getIcon(backgroundColor, typeIcon);
  }

  renderModal(index, pokemon, backgroundColor, typeIconsHTML);

  let modal = new bootstrap.Modal(document.getElementById("modalContainer"));
  let modalElement = document.getElementById("modalContainer");

  modalElement.removeAttribute("aria-hidden");

  modal.show();
}

document.getElementById("modalContainer").addEventListener("hidden.bs.modal", function () {
  this.setAttribute("aria-hidden", "true");
});

function renderModal(index, pokemon, backgroundColor, typeIconsHTML) {
  let myModalRef = document.getElementById("pokemonModalBody");

  if (!myModalRef) {
    console.error("Element 'pokemonModalBody' wurde nicht gefunden!");
    return;
  }

  myModalRef.innerHTML = "";

  let abilityList = renderAbilities(pokemon);

  myModalRef.innerHTML += getModal(pokemon, backgroundColor, abilityList, index);
  renderAbilities(pokemon);
  renderStats(pokemon);
  renderEvo(index);
}

function renderAbilities(pokemon) {
  let abilitiesPokemon = "";
  for (let abilityIndex = 0; abilityIndex < pokemon.abilities.length; abilityIndex++) {
    let abilityName = pokemon.abilities[abilityIndex].ability.name;
    abilitiesPokemon += abilityName + ", ";
  }
  return abilitiesPokemon.slice(0, -2);
}

function renderStats(pokemon) {
  let myStatsRef = document.getElementById("statsContainer");
  myStatsRef.innerHTML = "";
  let statsPokemon = "";

  for (let statsIndex = 0; statsIndex < pokemon.stats.length; statsIndex++) {
    let statsyName = pokemon.stats[statsIndex].stat.name;
    let statsValue = pokemon.stats[statsIndex].base_stat;
    statsPokemon += getStats(statsyName, statsValue);
  }
  myStatsRef.innerHTML = statsPokemon;
}

function getPokemonIdByName(name) {
  let pokemon = pokemonMain.find((p) => p.name === name);
  return pokemon ? pokemon.id : null;
}

function renderEvo(index) {
  let myEvoRef = document.getElementById("evoContainer");
  myEvoRef.innerHTML = "";

  let evoChains = pokemonEvo[index];

  for (let evoIndex = 0; evoIndex < evoChains.length; evoIndex++) {
    let evoName = evoChains[evoIndex];
    let pokemonId = getPokemonIdByName(evoName);
    let evoImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;
    myEvoRef.innerHTML += getEvo(evoName, evoImgUrl);
  }
}

function loadMoreCards() {
  disableLoadMoreButton();

  let pokemonToLoad = pokemonMain.slice(currentIndex, currentIndex + cardsPerLoad);
  renderCards(pokemonToLoad);
  currentIndex += cardsPerLoad;

  const lastCard = document.querySelector("#cardContainer").lastElementChild;
  if (lastCard) {
    lastCard.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  enableLoadMoreButton();
}

function disableLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.disabled = true;
  loadMoreBtn.innerHTML = "Lädt...";
}

function enableLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.disabled = false;
  loadMoreBtn.innerHTML = "Mehr laden";
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
  const searchInput = document.getElementById("searchInput");
  const searchMessageContainer = document.getElementById("searchMessageContainer");

  e.preventDefault();

  if (searchInput.value.length < 3) {
    searchMessageContainer.style.display = "block";
  } else {
    searchMessageContainer.style.display = "none";
    searchPokemon(searchInput.value);
  }
});

document.getElementById("searchInput").addEventListener("input", function () {
  const searchInput = document.getElementById("searchInput");

  if (searchInput.value === "") {
    resetSearch();
  }
});

function searchPokemon(query) {
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";

  const filteredPokemon = pokemonMain.filter((pokemon) => pokemon.name && pokemon.name.toLowerCase().includes(query.toLowerCase()));

  if (filteredPokemon.length > 0) {
    filteredPokemon.forEach((pokemon, index) => {
      const backgroundColor = typeColors[pokemon.types[0].type.name];
      const typeIconsHTML = pokemon.types.map((type) => getIcon(backgroundColor, typeIcons[type.type.name])).join("");
      const modalId = `pokemonModal_${index}`;
      cardContainer.innerHTML += getCard(index, pokemon, backgroundColor, typeIconsHTML, modalId);
    });
  } else {
    cardContainer.innerHTML = getSearchError(query);
  }
}

function resetSearch() {
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";

  const allPokemonToRender = pokemonMain.slice(0, currentIndex);
  allPokemonToRender.forEach((pokemon, index) => {
    const backgroundColor = typeColors[pokemon.types[0].type.name];
    const typeIconsHTML = pokemon.types.map((type) => getIcon(backgroundColor, typeIcons[type.type.name])).join("");

    const modalId = `pokemonModal_${index}`;
    cardContainer.innerHTML += getCard(index, pokemon, backgroundColor, typeIconsHTML, modalId);
  });
}

function navigatePokemon(index) {
  if (index < 0 || index >= pokemonMain.length) return;

  const selectedPokemon = pokemonMain[index];
  const backgroundColor = typeColors[selectedPokemon.types[0].type.name];
  const abilityList = renderAbilities(selectedPokemon);

  updateModalContent(selectedPokemon, backgroundColor, abilityList, index);
}

function updateModalContent(pokemon, backgroundColor, abilityList, index) {
  const modalBody = getModal(pokemon, backgroundColor, abilityList, index);

  const modalContainer = document.getElementById("pokemonModalBody");
  modalContainer.innerHTML = modalBody;

  renderStats(pokemon);
  renderEvo(index);
}
