function getCard(indexPokemonMain, pokemonList, backgroundColor, typeIconsHTML) {
  return `
    <div class="col" onclick="openModal(${indexPokemonMain})">
      <div class="card h-100">
        <div class="card-head">
          <small class="text-muted">${pokemonList.name}</small>
        </div>
        <img src="${pokemonList.sprites.other.home.front_default}" class="card-img-top" style="background-color:${backgroundColor}" alt="..." loading="lazy" />
        <div class="card-footer">
          ${typeIconsHTML}
        </div>
      </div>
    </div>`;
}

function getIcon(backgroundColor, typeIcon) {
  return `<div class="type-icon" style="background-color:${backgroundColor}">
          <i class="${typeIcon}"></i>
        </div>`;
}

function getModal(pokemon, backgroundColor, abilityList, index) {
  return ` 
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="card-header position-relative" style="text-align: center">
          <small class="text-muted">${pokemon.name}</small>
          <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body d-flex justify-content-center align-items-center position-relative" style="background-color:${backgroundColor}">
          <button class="btn btn-light position-absolute" style="left: 10px; top: 50%; transform: translateY(-50%);" id="prevButton" onclick="navigatePokemon(${index - 1})" ${index === 0 ? "disabled" : ""}>
            <i class="bi bi-chevron-left"></i>
          </button>
          <img src="${pokemon.sprites.other.home.front_default}" class="card-img-top" alt="..." />
          <button class="btn btn-light position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%);" id="nextButton" onclick="navigatePokemon(${index + 1})" ${index === pokemonMain.length - 1 ? "disabled" : ""}>
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
        <ul class="nav nav-tabs w-100" id="myTab" role="tablist">
          <li class="nav-item" role="presentation" style="width: 33.33%">
            <a class="nav-link active w-100 text-center" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Main</a>
          </li>
          <li class="nav-item" role="presentation" style="width: 33.33%">
            <a class="nav-link w-100 text-center" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Stats</a>
          </li>
          <li class="nav-item" role="presentation" style="width: 33.33%">
            <a class="nav-link w-100 text-center" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Evo Chain</a>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <table>
              <tr>
                <td>Height</td>
                <td>: ${pokemon.height} cm</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>: ${pokemon.weight} g</td>
              </tr>
              <tr>
                <td>Base experience</td>
                <td>: ${pokemon.base_experience}</td>
              </tr>
              <tr>
                <td>Abilities</td>
                <td>: ${abilityList}</td>
              </tr>
            </table>
          </div>
          <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <ul id="statsContainer" class="list-group">
            </ul>
          </div>
          <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
            <div class="d-flex justify-content-center align-items-center mt-3">
              <div class="mx-2 text-center">
                <div class="row justify-content-center" id="evoContainer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getStats(statsName, statsValue) {
  return `
    <li class="list-group-item">
      <div class="d-flex justify-content-between align-items-center">
        <span style="margin-right: 8px;">${statsName}</span>
        <div class="progress" style="width: 70%; height: 20px">
          <div class="progress-bar" role="progressbar" style="width: ${statsValue}%;"
               aria-valuenow="${statsValue}" aria-valuemin="0" aria-valuemax="100">
            ${statsValue}
          </div>
        </div>
      </div>
    </li>
  `;
}

function getEvo(evoName, evoImgUrl) {
  return `
    <div class="col-3 text-center mx-2">
      <img src="${evoImgUrl}" class="img-fluid" alt="${evoName}" />
      <figcaption style="color: white; font-size: 1.2rem;">${evoName}</figcaption>
    </div>
  `;
}
