/* =========================================================
   UI & DOM RENDERING ENGINE (render.js)
========================================================= */

let lastCollectionState = "";
let lastSidebarDiscoveredCount = -1;
const failedImages = new Set();


function toggleVisible(el, isVisible, displayStyle = "block") {
  if (!el) return;
  el.classList.toggle("hidden", !isVisible);
  el.style.display = isVisible ? displayStyle : "none";
}

function render() {
  renderHeader();
  renderAquarium();
  renderTankInfo();
  renderSelectedShrimp();
  renderGenetics();
  renderAchievements();
  renderShop();
  renderMovableShrimpList();
}

function renderHeader() {
  const currentTank = game.activeAquarium || "tank1";
  const unlockedTanks = getUnlockedTanks();
  const tankDropdown = document.getElementById("tankSelectDropdown");
  const singleTankTitle = document.getElementById("singleTankTitle");
  const listBtn = document.getElementById("shrimpListBtn");

  const hasMultipleTanks = unlockedTanks.length > 1 || Boolean(game.favoritesTankUnlocked);

  // Show List of Shrimp button only when multiple tanks exist
  if (listBtn) {
    toggleVisible(listBtn, hasMultipleTanks, "inline-block");
    if (!hasMultipleTanks) {
      const movableWin = document.getElementById("movableShrimpList");
      if (movableWin && !movableWin.classList.contains("hidden")) {
        movableWin.classList.add("hidden");
      }
    }
  }

  // Target Alleles Dropdown Visibility (Requires "firstBirth" achievement)
  const hasFirstBirth = game.achievements && game.achievements.includes("firstBirth");

  const cullingGroup = document.getElementById("cullingTargetsGroup");
  toggleVisible(cullingGroup, hasFirstBirth, "flex");

  const filterAllelesLabel = document.getElementById("tankFilterAllelesBtnLabel");
  if (filterAllelesLabel && game && game.tankFilterAlleles) {
    filterAllelesLabel.textContent = `Alleles (${game.tankFilterAlleles.length})`;
  }

  const filterShrimpLabel = document.getElementById("tankFilterShrimpBtnLabel");
  if (filterShrimpLabel && game && game.tankFilterSpecies) {
    filterShrimpLabel.textContent = `Shrimp (${game.tankFilterSpecies.length})`;
  }

  const trackedAllelesLabel = document.getElementById("trackedAllelesBtnLabel");
  if (trackedAllelesLabel && game && game.trackedAlleles) {
    trackedAllelesLabel.textContent = `Alleles (${game.trackedAlleles.length})`;
  }

  const trackedShrimpLabel = document.getElementById("trackedShrimpBtnLabel");
  if (trackedShrimpLabel && game && game.trackedSpecies) {
    trackedShrimpLabel.textContent = `Shrimp (${game.trackedSpecies.length})`;
  }

  if (tankDropdown) {
    if (!hasMultipleTanks) {
      tankDropdown.classList.add("hidden");
      if (singleTankTitle) singleTankTitle.classList.remove("hidden");
    } else {
      tankDropdown.classList.remove("hidden");
      if (singleTankTitle) singleTankTitle.classList.add("hidden");

      const favKey = game.favoritesTankUnlocked ? "+fav" : "";
      const optionsSignature = unlockedTanks.join(",") + favKey;

      if (tankDropdown.dataset.signature !== optionsSignature) {
        tankDropdown.dataset.signature = optionsSignature;

        let optionsHTML = unlockedTanks.map((t) => {
          return `<option value="${t}">${formatTankName(t)}</option>`;
        }).join("");

        if (game.favoritesTankUnlocked) {
          optionsHTML += `<option value="favorites">★ Favorites Tank</option>`;
        }

        tankDropdown.innerHTML = optionsHTML;
        tankDropdown.value = currentTank;
        tankDropdown.dataset.currentTank = currentTank;
      }

      // Only sync if the active aquarium changed in game state
      if (tankDropdown.dataset.currentTank !== currentTank) {
        tankDropdown.dataset.currentTank = currentTank;
        tankDropdown.value = currentTank;
      }
    }
  }

  // Calculate live count and capacity for active tank
  const activeCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && !s.dead
  ).length;
  const activeCapacity = getTankCapacity(currentTank);

  document.getElementById("money").textContent = "$" + Math.floor(game.money);
  document.getElementById("population").textContent = `${activeCount} / ${activeCapacity}`;
  document.getElementById("day").textContent = getDay();
  document.getElementById("clock").textContent = formatClock();
  document.getElementById("tankStatus").textContent = `${activeCount} / ${activeCapacity}`;

  const minigameBtn = document.getElementById("playMinigameBtn");
  toggleVisible(minigameBtn, game.unlockedSpeeds.includes("game"), "inline-block");

  const minigame2Btn = document.getElementById("playMinigame2Btn");
  toggleVisible(minigame2Btn, game.unlockedSpeeds.includes("game2"), "inline-block");
}

function renderTankInfo() {
  const currentTank = game.activeAquarium || "tank1";
  const tankShrimp = game.shrimp.filter((s) => (s.tank || "tank1") === currentTank && !s.dead);
  const males = tankShrimp.filter((s) => s.sex === "male").length;
  const females = tankShrimp.filter((s) => s.sex === "female").length;
  const juveniles = tankShrimp.filter((s) => lifeStage(s) !== "Adult").length;
  const pregnant = tankShrimp.filter((s) => s.pregnant).length;

  document.getElementById("capacityInfo").textContent = getTankCapacity(currentTank);
  document.getElementById("maleCount").textContent = males;
  document.getElementById("femaleCount").textContent = females;
  document.getElementById("juvenileCount").textContent = juveniles;
  document.getElementById("pregnantCount").textContent = pregnant;
  document.getElementById("plantCount").textContent = game.plants.length;
}


function renderAquarium() {
  const currentTank = game.activeAquarium || "tank1";
  const layer = document.getElementById("shrimpLayer");
  if (!layer) return;

  const totalInGame = game.shrimp.length;
  const inThisTank = game.shrimp.filter(s => (s.tank || "tank1") === currentTank && !s.dead).length;

  // Log once when tank changes
  if (layer.dataset.activeTank !== currentTank) {
    console.log(`DEBUG: renderAquarium switched view to '${currentTank}'. Total shrimp: ${totalInGame}, In this tank: ${inThisTank}`);
    layer.dataset.activeTank = currentTank;
  }

  const sellControls = document.querySelector(".aquarium-sell-controls");
  if (sellControls) {
    sellControls.style.display = "flex";
  }


  const nurseryBtn = document.getElementById("tankBulkCullBtn");
  if (nurseryBtn) {
    const hasUpgrade = game && game.plants && game.plants.includes("autoNursery");
    const spawningCount = game ? game.shrimp.filter(s => (s.tank || "tank1") === currentTank && s.readyToBirth && !s.dead).length : 0;

    toggleVisible(nurseryBtn, hasUpgrade, "inline-flex");
    nurseryBtn.disabled = spawningCount === 0;
    nurseryBtn.innerHTML = `<img src="emoji/baby.png" alt="Nursery" class="ui-emoji"> Nursery Harvest (${spawningCount})`;
  }

  const leftPlant = document.getElementById("aquariumPlantLeft");
  const rightPlant = document.getElementById("aquariumPlantRight");
  if (leftPlant || rightPlant) {
    const minHeight = 144;
    const shrinkFactor = 25;
    const maxUpgradeIndex = 5;
    const remainingSteps = Math.max(0, maxUpgradeIndex - game.tankUpgradeLevel);
    const targetHeight = minHeight + remainingSteps * shrinkFactor;

    if (leftPlant) {
      leftPlant.style.height = targetHeight + "px";
      leftPlant.style.width = "auto";
    }
    if (rightPlant) {
      rightPlant.style.height = targetHeight + "px";
      rightPlant.style.width = "auto";
      const hasMutation = game.plants.includes("mutationPlant");
      rightPlant.src = hasMutation
        ? "plants/planbg2Moss.png"
        : "plants/planbg2.png";
    }
  }

  const hasMutation = game.plants.includes("mutationPlant");

  const floater = document.getElementById("aquariumFloater");
  toggleVisible(floater, game.plants.includes("berriedPlant"));

  const breedingMoss = document.getElementById("aquariumBreedingMoss");
  if (breedingMoss) {
    const hasIt = game.plants.includes("breedingMoss");
    toggleVisible(breedingMoss, hasIt);
    if (hasIt) {
      breedingMoss.src = hasMutation
        ? "plants/breedingMossAlt.png"
        : "plants/breedingMoss.png";
    }
  }

  const pregnancyMoss = document.getElementById("aquariumPregnancyMoss");
  if (pregnancyMoss) {
    const hasIt = game.plants.includes("pregnancyPlant");
    toggleVisible(pregnancyMoss, hasIt);
    if (hasIt) {
      pregnancyMoss.src = hasMutation
        ? "plants/pregnancyMossAlt.png"
        : "plants/pregnancyMoss.png";
    }
  }

  const babyPlant = document.getElementById("aquariumBabyPlant");
  if (babyPlant) {
    const hasIt = game.plants.includes("babyPlant");
    toggleVisible(babyPlant, hasIt);
    if (hasIt) {
      const minWidth = 144;
      const shrinkStep = 20;
      const maxUpgradeIndex = 5;
      const remainingSteps = Math.max(0, maxUpgradeIndex - game.tankUpgradeLevel);
      const targetWidth = minWidth + remainingSteps * shrinkStep;

      babyPlant.style.width = targetWidth + "px";
      babyPlant.style.height = "auto";
      babyPlant.src = hasMutation
        ? "plants/babyPlantAlt.png"
        : "plants/babyPlant.png";
    }
  }

  const growthPlant = document.getElementById("aquariumGrowthPlant");
  if (growthPlant) {
    const hasIt = game.plants.includes("growthPlant");
    toggleVisible(growthPlant, hasIt);
    if (hasIt) {
      const minWidth = 144;
      const shrinkStep = 20;
      const maxUpgradeIndex = 5;
      const remainingSteps = Math.max(0, maxUpgradeIndex - game.tankUpgradeLevel);
      const targetWidth = minWidth + remainingSteps * shrinkStep;

      growthPlant.style.width = targetWidth + "px";
      growthPlant.style.height = "auto";
      growthPlant.src = hasMutation
        ? "plants/growthPlantAlt.png"
        : "plants/growthPlant.png";
    }
  }

  const marimoOwned = countPlants("marimo");
  for (let i = 1; i <= 3; i++) {
    const marimoEl = document.getElementById(`aquariumMarimo${i}`);
    if (marimoEl) {
      const isOwned = i <= marimoOwned;
      toggleVisible(marimoEl, isOwned);
      if (isOwned) {
        const mData = marimoDriftList[i - 1];
        marimoEl.style.width = `${mData.size}px`;
        marimoEl.style.height = `${mData.size}px`;
        marimoEl.style.left = `${mData.x}%`;
        marimoEl.style.top = `${mData.y}%`;
        marimoEl.style.transform = `translate(-50%, -50%) rotate(${mData.rotation}deg)`;
      }
    }
  }

  const existing = new Map();

  layer.querySelectorAll(".shrimp").forEach((element) => {
    existing.set(Number(element.dataset.id), element);
  });

  // Strict check against active aquarium
  for (const shrimp of game.shrimp) {
    const sTank = shrimp.tank || "tank1";

    if (sTank !== currentTank || shrimp.dead) {
      const el = existing.get(shrimp.id);
      if (el) {
        el.remove();
        existing.delete(shrimp.id);
      }
      continue;
    }

    let element = existing.get(shrimp.id);
    if (!element) {
      element = createShrimpElement(shrimp);
      layer.appendChild(element);
    }

    updateShrimpElement(element, shrimp);
    existing.delete(shrimp.id);
  }

  // Remove any leftover elements from other tanks
  for (const element of existing.values()) {
    element.remove();
  }
}

function renderMovableShrimpList() {
  const movable = document.getElementById("movableShrimpList");
  if (!movable || movable.classList.contains("hidden")) return;

  const searchInput = document.getElementById("tankListSearchInput");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const body = movable.querySelector(".movable-body");
  if (!body) return;

  const currentAquarium = game.activeAquarium || "tank1";
  const sortState = game.shrimpListSort || "HighValue";
  const selectedId = game.selectedShrimpId || "none";
  const sellModeKey = game.sellModeActive ? "sel_" + (game.selectedForSaleIds || []).join(",") : "noSel";

  const tankShrimp = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentAquarium && !s.dead
  );

  const discCount = (game.discovered || []).length;
  const filterKey = (game.tankFilterAlleles || []).join(",") + "_" + (game.tankFilterSpecies || []).join(",");
  const shrimpIdString =
    filterKey +
    "|" +
    query +
    "|" +
    discCount +
    "|" +
    currentAquarium +
    "|" +
    sortState +
    "|" +
    selectedId +
    "|" +
    sellModeKey +
    "|" +
    tankShrimp
      .map(
        (s) =>
          s.id +
          "_" +
          lifeStage(s) +
          "_" +
          (s.pregnant ? "p" : "n") +
          "_" +
          (s.readyToBirth ? "r" : "o") +
          "_" +
          (s.tank || "tank1")
      )
      .join("|");

  if (body.dataset.cache === shrimpIdString) return;
  body.dataset.cache = shrimpIdString;

  body.innerHTML = "";

  if (tankShrimp.length === 0) {
    body.innerHTML = `<div class="empty-selection" style="padding: 20px; text-align: center;">No shrimp in ${formatTankName(currentAquarium)}.</div>`;
    return;
  }

  let sortedList = [...tankShrimp];
  const getShrimpValue = (s) => getShrimpSellValue(s);

  const getStatusPriority = (s) => {
    if (s.readyToBirth) return 5;
    if (s.pregnant) return 4;
    if (s.sex === "female" && isAdult(s) && s.saddle) return 3;
    if (isAdult(s)) return 2;
    return 1;
  };

  const RARITY_PRIORITY = {
    wild: 1,
    common: 2,
    uncommon: 3,
    rare: 4,
    epic: 5,
    legendary: 6,
  };

  if (sortState === "HighValue") {
    sortedList.sort((a, b) => getShrimpValue(b) - getShrimpValue(a));
  } else if (sortState === "LowValue") {
    sortedList.sort((a, b) => getShrimpValue(a) - getShrimpValue(b));
  } else if (sortState === "Name") {
    sortedList.sort((a, b) => displayName(a).localeCompare(displayName(b)));
  } else if (sortState === "Gender") {
    sortedList.sort((a, b) => a.sex.localeCompare(b.sex));
  } else if (sortState === "Age") {
    sortedList.sort((a, b) => b.ageMinutes - a.ageMinutes);
  } else if (sortState === "Status") {
    sortedList.sort((a, b) => getStatusPriority(b) - getStatusPriority(a));
  } else if (sortState === "Rarity") {
    sortedList.sort((a, b) => {
      const rA = SHRRIMP_SAFE(a.species).rarity;
      const rB = SHRRIMP_SAFE(b.species).rarity;
      return (RARITY_PRIORITY[rB] || 0) - (RARITY_PRIORITY[rA] || 0);
    });
  }

  // Filter list by search query if typed
  if (query) {
    sortedList = sortedList.filter(s => {
      const name = displayName(s).toLowerCase();
      const a1 = SHRRIMP_SAFE(s.hiddenGenes.allele1).name.toLowerCase();
      const a2 = SHRRIMP_SAFE(s.hiddenGenes.allele2).name.toLowerCase();
      const sex = s.sex.toLowerCase();
      const stage = lifeStage(s).toLowerCase();
      const status = s.readyToBirth ? "spawning" : s.pregnant ? "berried" : s.resting ? "resting" : "";

      return name.includes(query) || a1.includes(query) || a2.includes(query) ||
        sex.includes(query) || stage.includes(query) || status.includes(query);
    });
  }

  sortedList.forEach((shrimp) => {
    const imgPrefix = getShrimpImagePrefix(shrimp);
    const data = SHRRIMP_SAFE(shrimp.species);
    const nameToDisplay = displayName(shrimp);
    const activeValue = getShrimpValue(shrimp);

    const card = document.createElement("div");
    card.className = "cull-row shrimp-list-item";
    card.dataset.id = shrimp.id;
    card.style.cursor = "pointer";
    card.style.transition = "background-color 0.2s, border-color 0.2s";

    const isSingleSelected = game.selectedShrimpId !== null && Number(game.selectedShrimpId) === Number(shrimp.id);
    const isSellSelected = game.sellModeActive && game.selectedForSaleIds && game.selectedForSaleIds.includes(shrimp.id);

    if (isSingleSelected || isSellSelected) {
      card.classList.add("selected-shrimp-card");
    }

    // TANK SEARCH GREEN HIGHLIGHT (placed safely inside the forEach loop where shrimp and card exist)
    if (typeof isShrimpTankFiltered === "function" && isShrimpTankFiltered(shrimp)) {
      card.classList.add("tank-filter-highlighted");
    }

    const mediaDiv = document.createElement("div");
    mediaDiv.className = "cull-media";
    mediaDiv.style.width = "40px";
    mediaDiv.style.height = "28px";

    const imgPath = `shrimp/${imgPrefix}1.png`;

    if (failedImages.has(imgPath)) {
      mediaDiv.appendChild(createCssShrimpFallback(data.color, 0.8));
    } else {
      const img = document.createElement("img");
      img.src = imgPath;
      img.className = "cull-baby-img";
      img.onerror = () => {
        failedImages.add(imgPath);
        img.style.display = "none";
        if (!mediaDiv.querySelector(".css-shrimp")) {
          mediaDiv.appendChild(createCssShrimpFallback(data.color, 0.8));
        }
      };
      mediaDiv.appendChild(img);
    }
    card.appendChild(mediaDiv);

    const infoDiv = document.createElement("div");
    infoDiv.className = "cull-info";
    infoDiv.style.paddingLeft = "5px";

    const nameStrong = document.createElement("strong");
    nameStrong.textContent = nameToDisplay;
    nameStrong.style.fontSize = "12px";
    infoDiv.appendChild(nameStrong);

    const detailsSpan = document.createElement("span");
    detailsSpan.className = "small-text";
    detailsSpan.style.fontSize = "11px";

    let statusLabel = "";
    if (shrimp.readyToBirth)
      statusLabel =
        " • <span style='color:var(--danger); font-weight:bold;'>" +
        icon("exclamation") +
        " Spawning</span>";
    else if (shrimp.pregnant)
      statusLabel =
        " • <span style='color:var(--success); font-weight:bold;'>" +
        icon("berried") +
        " Berried</span>";
    else if (shrimp.resting) statusLabel = " • " + icon("sleep") + " Resting";

    detailsSpan.innerHTML = `${capitalize(shrimp.sex)} • ${lifeStage(shrimp)}${statusLabel}`;
    infoDiv.appendChild(detailsSpan);

    const genesSpan = document.createElement("span");
    genesSpan.className = "small-text";
    genesSpan.style.display = "block";
    genesSpan.style.fontSize = "10px";
    genesSpan.style.marginTop = "2px";
    genesSpan.style.color = "var(--muted)";
    genesSpan.innerHTML = `${icon("dna")} Alleles: ${formatAlleleDisplay(shrimp.hiddenGenes.allele1)} / ${formatAlleleDisplay(shrimp.hiddenGenes.allele2)}`; 
    infoDiv.appendChild(genesSpan);

    card.appendChild(infoDiv);

    const valueDiv = document.createElement("div");
    valueDiv.style.marginLeft = "auto";
    valueDiv.style.paddingRight = "10px";
    valueDiv.style.fontWeight = "bold";
    valueDiv.style.color = "var(--success)";
    valueDiv.textContent = `$${activeValue}`;
    card.appendChild(valueDiv);

    body.appendChild(card);
  });
}

function renderSelectedShrimp() {
  const container = document.getElementById("selectedShrimp");

  if (game.selectedShrimpId === null) {
    lastSelectedId = null;
    lastSidebarState = "empty";
    container.innerHTML = `
        <div class="empty-selection">
            Click a shrimp in the aquarium to inspect it.
        </div>
    `;
    return;
  }

  const shrimp = game.shrimp.find(
    (s) => Number(s.id) === Number(game.selectedShrimpId) && !s.dead
  );

  if (!shrimp) {
    lastSelectedId = null;
    lastSidebarState = "empty";
    container.innerHTML = `
        <div class="empty-selection">
            No shrimp selected.
        </div>
    `;
    return;
  }

  const data = SHRRIMP_SAFE(shrimp.species);
  let currentState = "other";
  if (shrimp.readyToBirth) currentState = "readyToBirth";
  else if (shrimp.pregnant) currentState = "pregnant";
  else if (shrimp.resting) currentState = "resting";
  else if (shrimp.sex === "female" && isAdult(shrimp) && shrimp.saddle)
    currentState = "saddled";

  const currentDiscoveredCount = (game.discovered || []).length;
  if (
    game.selectedShrimpId !== lastSelectedId ||
    currentState !== lastSidebarState ||
    currentDiscoveredCount !== lastSidebarDiscoveredCount
  ) {
    lastSelectedId = game.selectedShrimpId;
    lastSidebarState = currentState;
    lastSidebarDiscoveredCount = currentDiscoveredCount;

    let pregnancyHTML = "";

    if (currentState === "readyToBirth") {
      pregnancyHTML = `
            <div class="panel" style="margin-top: 10px; margin-bottom: 10px;">
                <strong>${icon("exclamation")} Ready to give birth</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px;">
                    She is ready to release her offspring. Click "Give Birth / Cull" below to choose which babies to keep or sell.
                </p>
            </div>
      `;
    } else if (currentState === "pregnant") {
      pregnancyHTML = `
            <div class="panel" style="margin-top: 10px; margin-bottom: 10px;">
                <strong>${icon("berried")} Berried</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px;">
                    Time remaining: <span id="sidebarPregTimer">...</span>
                </p>
                <div class="progress-bar">
                    <div id="sidebarPregProgress" class="progress-fill" style="width: 0%;"></div>
                </div>
            </div>
      `;
    } else if (currentState === "resting") {
      pregnancyHTML = `
            <div class="panel" style="margin-top: 10px; margin-bottom: 10px;">
                <strong>${icon("sleep")} Resting</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px;">
                    Resting for: <span id="sidebarRestTimer">...</span>
                </p>
            </div>
      `;
    } else if (currentState === "saddled") {
      pregnancyHTML = `
            <div class="panel" style="margin-top: 10px; margin-bottom: 10px;">
                <strong>${icon("egg")} Saddled</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px;">
                    She is ready to be bred during the next breeding check.
                </p>
            </div>
      `;
    }

    const isSpawning = shrimp.readyToBirth;
    const sellDisabledAttr = isSpawning ? "disabled" : "";
    const sellStyle = isSpawning
      ? "width: 100%; opacity: 0.5; cursor: not-allowed;"
      : "width: 100%;";

    let val = getShrimpSellValue(shrimp);

    let controlButtonsHTML = "";
    if (currentState === "readyToBirth") {
      controlButtonsHTML = `
            <button id="sidebarCullBtn" class="primary-button" style="width: 100%; margin-bottom: 8px;">
                ${icon("baby")} Give Birth / Cull
            </button>
      `;
    } else if (currentState === "pregnant") {
      controlButtonsHTML = `
            <button class="primary-button" style="width: 100%; margin-bottom: 8px;" disabled>
                ${icon("baby")} Give Birth / Cull (Berried)
            </button>
      `;
    }

    // Build multi-tank move dropdown ONLY if player owns more than 1 tank
    const currentShrimpTank = shrimp.tank || "tank1";
    const unlockedTanks = getUnlockedTanks();
    const hasMultipleTanks = unlockedTanks.length > 1 || Boolean(game.favoritesTankUnlocked);

    let transferHTML = "";
    let locationHTML = "";

    if (hasMultipleTanks) {
      locationHTML = `
          <p style="margin: 2px 0 0 0; font-size: 12px; color: var(--muted);">
              Location: <strong>${formatTankName(currentShrimpTank)}</strong>
          </p>
      `;

      let tankOptions = unlockedTanks.map((t) => {
        const count = game.shrimp.filter((s) => (s.tank || "tank1") === t && !s.dead).length;
        const cap = getTankCapacity(t);
        const selected = (t === currentShrimpTank) ? "selected" : "";
        return `<option value="${t}" ${selected}>${formatTankName(t)} (${count}/${cap})</option>`;
      }).join("");

      if (game.favoritesTankUnlocked) {
        const favCount = game.shrimp.filter((s) => s.tank === "favorites" && !s.dead).length;
        const favCap = getTankCapacity("favorites");
        const favSelected = (currentShrimpTank === "favorites") ? "selected" : "";
        tankOptions += `<option value="favorites" ${favSelected}>★ Favorites (${favCount}/${favCap})</option>`;
      }

      transferHTML = `
          <div class="panel" style="margin-top: 10px; margin-bottom: 10px;">
              <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: var(--muted);">Move to Tank:</label>
              <select id="sidebarMoveTankSelect" class="secondary-button" style="width: 100%; font-size: 13px; padding: 6px 8px; cursor: pointer;">
                  ${tankOptions}
              </select>
          </div>
      `;
    }

    const sellButtonHTML = `
        <button id="sidebarSellBtn" class="danger-button" style="${sellStyle}" ${sellDisabledAttr}>
            Sell ($${val})
        </button>
    `;

    const imgPrefix = getShrimpImagePrefix(shrimp);
    const nameToDisplay = displayName(shrimp);

    const newHTML = `
        <div class="selected-card-layout">
            <div class="selected-card">
                <div class="selected-image">
                    <img id="selectedShrimpSidebarImg" src="shrimp/${imgPrefix}1.png" alt="${data.name}" style="width: 100%; height: 100%; object-fit: contain; cursor: zoom-in;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="css-shrimp" style="--shrimp-color:${data.color}; display: none;"></div>
                </div>
                <div>
                    <h3>${nameToDisplay}</h3>
                    <p style="margin: 2px 0 0 0; font-size: 13px;">
                        Rarity: <span class="rarity-${data.rarity}">${capitalize(data.rarity)}</span>
                    </p>
                    ${locationHTML}
                </div>
            </div>

            <div class="detail-list" style="margin-top: 10px;">
                <div class="detail-item">
                    <span>Sex</span>
                    <strong>${capitalize(shrimp.sex)}</strong>
                </div>
                <div class="detail-item">
                    <span>Life Stage</span>
                    <strong id="sidebarStageText">${lifeStage(shrimp)}</strong>
                </div>
                <div class="detail-item">
                    <span>Age</span>
                    <strong id="sidebarAgeText">${Math.floor(shrimp.ageMinutes)} min</strong>
                </div>
                <div class="detail-item">
                    <span>Pattern</span>
                    <strong>${capitalize(shrimp.pattern)}</strong>
                </div>
            </div>

            ${pregnancyHTML}
            ${transferHTML}

            <div class="panel" style="margin-top: 10px; margin-bottom: 10px;">
                <h3 style="margin: 0 0 8px 0; font-size: 15px;"><img src="emoji/dna.png" alt="DNA" class="ui-emoji"> Genetics Profile</h3>
                <p style="margin: 4px 0; font-size: 13px;">
                    <strong>Allele 1:</strong> ${formatAlleleDisplay(shrimp.hiddenGenes.allele1)}
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                    <strong>Allele 2:</strong> ${formatAlleleDisplay(shrimp.hiddenGenes.allele2)}
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                    <strong>Pattern:</strong> ${capitalize(shrimp.pattern)}
                </p>
            </div>

            <div class="control-row" style="margin-top: 10px; display: flex; flex-direction: column;">
                ${controlButtonsHTML}
                ${sellButtonHTML}
            </div>
        </div>
    `;

    container.innerHTML = newHTML;

    const moveSelect = container.querySelector("#sidebarMoveTankSelect");
    if (moveSelect) {
      moveSelect.onchange = function () {
        moveShrimpToTank(shrimp.id, this.value);
      };
    }
  }

  // Update real-time progress bars and timers without wiping DOM
  if (currentState === "pregnant") {
    const timerEl = container.querySelector("#sidebarPregTimer");
    const progressEl = container.querySelector("#sidebarPregProgress");
    if (timerEl) {
      timerEl.textContent = formatDuration(shrimp.pregnancyRemaining);
    }
    if (progressEl) {
      const progress = 100 * (1 - shrimp.pregnancyRemaining / shrimp.pregnancyTotal);
      progressEl.style.width = `${progress}%`;
    }
  } else if (currentState === "resting") {
    const timerEl = container.querySelector("#sidebarRestTimer");
    if (timerEl) {
      timerEl.textContent = formatDuration(shrimp.restRemaining);
    }
  }

  const ageEl = container.querySelector("#sidebarAgeText");
  const stageEl = container.querySelector("#sidebarStageText");
  if (ageEl) ageEl.textContent = `${Math.floor(shrimp.ageMinutes)} min`;
  if (stageEl) stageEl.textContent = lifeStage(shrimp);
}


function renderGenetics() {
  const container = document.getElementById("geneticsTree");
  const families = {};

  for (const [id, data] of Object.entries(SHRIMP)) {
    if (data.family === "amano") {
      const isUnlocked =
        isAmanoUnlocked() || game.discovered.includes("amanoShrimp");
      if (!isUnlocked) continue;
    }
    if (data.family === "bamboo") {
      const isUnlocked =
        isBambooShrimpUnlocked() || game.discovered.includes("bambooShrimp");
      if (!isUnlocked) continue;
    }
    if (data.family === "sulawesi") {
      const isUnlocked =
        game.tankUpgradeLevel >= 5 ||
        game.discovered.includes("galaxySulawesi");
      if (!isUnlocked) continue;
    }
    if (data.family === "scud") {
      const isUnlocked =
        isScudUnlocked() || game.discovered.includes("legendaryScud");
      if (!isUnlocked) continue;
    }
    if (data.family === "crawfish") {
      const isUnlocked =
        isRedCrawfishUnlocked() ||
        game.discovered.includes("redCrawfish") ||
        game.discovered.includes("blueCrawfish");
      if (!isUnlocked) continue;
    }
    if (data.family === "rednose") {
      const isUnlocked =
        isRedNoseUnlocked() ||
        (game.discovered && game.discovered.includes("redNose"));
      if (!isUnlocked) continue;
    }
    if (data.family === "vampire") {
      const isUnlocked =
        isVampireUnlocked() ||
        (game.discovered && game.discovered.includes("vampireShrimp"));
      if (!isUnlocked) continue;
    }

    if (data.family === "babaulti") {
      const isUnlocked = isBabaultiUnlocked() || (game.discovered && game.discovered.includes("babaultiWild"));
      if (!isUnlocked) continue;
    }

    if (!families[data.family]) families[data.family] = [];
    families[data.family].push(id);
  }

  container.innerHTML = "";

  for (const [family, speciesList] of Object.entries(families)) {
    const section = document.createElement("div");
    section.className = "genetic-family";
    section.innerHTML = `<h3>${capitalize(family)} Line</h3>`;

    for (const id of speciesList) {
      const data = SHRRIMP_SAFE(id);
      const discovered = game.discoveredAlleles.includes(id);

      const node = document.createElement("span");
      node.className = "genetic-node " + (discovered ? "discovered" : "locked");
      node.textContent = discovered ? data.name : "???";
      section.appendChild(node);
    }

    container.appendChild(section);
  }
}

function renderShop() {
  if (!game) return;
  // Use Math.floor so fractional tick income (e.g., from Bamboo Shrimp) doesn't wipe the DOM every frame
  const shopState = `${Math.floor(game.money)}_${(game.discovered || []).length}_${(game.discoveredAlleles || []).length}_${(game.plants || []).length}_${game.tankUpgradeLevel}_${(game.unlockedSpeeds || []).join(",")}`;
  if (shopState === lastRenderedMoney) return;
  lastRenderedMoney = shopState;

  renderShrimpShop();
  renderTankShop();
  renderSpeedShop();
  renderPlantShop();
}
function triggerShopConfetti(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const colors = [
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
  ];

  for (let i = 0; i < 24; i++) {
    const p = document.createElement("div");
    p.className = "confetti-particle";

    const angle = Math.random() * 2 * Math.PI;
    const distance = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * distance + "px";
    const ty = Math.sin(angle) * distance - 20 + "px";

    p.style.setProperty("--tx", tx);
    p.style.setProperty("--ty", ty);
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = rect.left + rect.width / 2 + window.scrollX + "px";
    p.style.top = rect.top + rect.height / 2 + window.scrollY + "px";
    p.style.position = "absolute";

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

function renderShrimpShop() {
  const container = document.getElementById("shrimpShop");
  if (!container) return;

  container.innerHTML = "";

  const activeShopShrimp = [...SHOP_SHRIMP];
  if (isBabaultiUnlocked()) activeShopShrimp.push("babaultiWild");
  if (isBambooShrimpUnlocked()) activeShopShrimp.push("bambooShrimp");
  if (game.tankUpgradeLevel >= 5) activeShopShrimp.push("galaxySulawesi");
  if (isAmanoUnlocked()) activeShopShrimp.push("amanoShrimp");
  if (isScudUnlocked()) activeShopShrimp.push("legendaryScud");
  if (isRedCrawfishUnlocked()) activeShopShrimp.push("redCrawfish");
  if (isRedNoseUnlocked()) activeShopShrimp.push("redNose");
  if (isVampireUnlocked()) activeShopShrimp.push("vampireShrimp");


  for (const shopEntry of activeShopShrimp) {
    const species = typeof shopEntry === "string" ? shopEntry : shopEntry.id;
    const reqCount = shopEntry.requiredDiscoveries || 0;
    const currentDiscovered = (game.discovered || []).length;
    const isUnlockedByMilestone = currentDiscovered >= reqCount;

    const data = SHRRIMP_SAFE(species);
    const price = SHRIMP_PRICES[species] || 10;
    const canAfford = game.money >= price;
    const isDiscovered = game.discovered && game.discovered.includes(species);
    const isOwnedSulawesi =
      species === "galaxySulawesi" &&
      game.shrimp.some((s) => s.species === "galaxySulawesi" && !s.dead);

    const isLocked = !isUnlockedByMilestone;
    const isDisabled = isLocked || !canAfford || isOwnedSulawesi ? "disabled" : "";

    let buttonText = "Buy";
    if (isLocked) {
      buttonText = `${icon("lock")} ${currentDiscovered}/${reqCount} Unlocked`;
    } else if (isOwnedSulawesi) {
      buttonText = "Owned";
    }

    const card = document.createElement("div");
    card.className = `shop-card ${isDiscovered ? "" : "locked-preview"}`;
    card.dataset.species = species;

    const previewId = `shop-preview-${species}`;
    const displayedName = isDiscovered ? data.name : "???";

    card.innerHTML = `
            <div class="shrimp-preview" id="${previewId}">
                <img src="shrimp/${data.image}1.png" alt="${data.name}" class="shop-preview-img ${isDiscovered ? "collection-shrimp-img" : ""}">
            </div>
            <h3>${displayedName}</h3>
            <div class="small-text">${capitalize(data.rarity)}</div>
            <div class="shop-price">${isLocked ? `<span style="font-size: 11px; color: var(--muted);">${reqCount} varieties required</span>` : "$" + price}</div>
            <button class="shop-button" ${isDisabled}>${buttonText}</button>
        `;

    const collectionImg = card.querySelector(".collection-shrimp-img");
    if (collectionImg && isDiscovered) {
      collectionImg.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        zoomShrimpImage(this);
      };
    }

    container.appendChild(card);

    const buyBtn = card.querySelector(".shop-button");
    if (buyBtn && canAfford && !isOwnedSulawesi) {
      buyBtn.addEventListener("click", () => {
        buyShrimp(species, buyBtn);
      });
    }

    const img = card.querySelector(".shop-preview-img");
    img.onerror = function () {
      img.style.display = "none";
      const previewBox = card.querySelector(".shrimp-preview");
      const fallback = createCssShrimpFallback(data.color, 1.5);
      fallback.style.left = "20px";
      fallback.style.top = "20px";
      previewBox.appendChild(fallback);
    };
  }
}

function renderPlantShop() {
  const container = document.getElementById("plantShop");
  if (!container) return;
  container.innerHTML = "";

  for (const [id, plant] of Object.entries(SHOP_PLANTS)) {
    const isMarimo = id === "marimo";
    const ownedCount = countPlants(id);
    const isMaxed = isMarimo ? ownedCount >= 3 : ownedCount >= 1;
    const currentPrice = getPlantPrice(id);
    const canAfford = game.money >= currentPrice;
    const isDisabled = isMaxed || !canAfford;

    let statusText = "Not Owned";
    let buttonText = "Buy Plant";

    if (isMarimo) {
      statusText = `${ownedCount}/3 Owned`;
      buttonText = isMaxed
        ? "Max (3/3)"
        : ownedCount > 0
          ? `Buy (${ownedCount + 1}/3)`
          : "Buy Plant";
    } else if (ownedCount >= 1) {
      statusText = "Owned";
      buttonText = "Owned";
    }

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
            <h3><img src="emoji/herb.png" alt="Herb" class="ui-emoji"> ${plant.name}</h3>
            <p class="small-text">${plant.description}</p>
            <p>Status: <strong>${statusText}</strong></p>
            <div class="shop-price">${isMaxed ? "MAX" : "$" + currentPrice}</div>
            <button class="shop-button" ${isDisabled ? "disabled" : ""}>${buttonText}</button>
        `;

    container.appendChild(card);

    const buyBtn = card.querySelector(".shop-button");
    if (buyBtn && !isMaxed && canAfford) {
      buyBtn.addEventListener("click", () => {
        buyPlant(id);
      });
    }
  }
}

function renderTankShop() {
  const container = document.getElementById("tankShop");
  if (!container) return;

  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(2, 1fr)";
  container.style.gap = "12px";

  // 1. Main Tank Expansion Card
  const nextLevel = (game.tankUpgradeLevel || 0) + 1;
  const mainUpgrade = TANK_UPGRADES[nextLevel];
  const mainCard = document.createElement("div");
  mainCard.className = "shop-card";

  if (!mainUpgrade) {
    mainCard.innerHTML = `
        <h3><img src="emoji/herb.png" alt="Herb" class="ui-emoji"> Tank Expansion</h3>
        <strong>All 10 Tanks Unlocked!</strong>
        <p class="small-text">You own the maximum capacity of 10 aquariums (1,000 shrimp capacity).</p>
    `;
  } else {
    const canAffordMain = game.money >= mainUpgrade.price;
    mainCard.innerHTML = `
        <h3><img src="emoji/herb.png" alt="herb" class="ui-emoji"> ${mainUpgrade.name}</h3>
        <p class="small-text">Unlock an additional separate tank holding up to <strong>100</strong> shrimp.</p>
        <div class="shop-price">$${mainUpgrade.price}</div>
        <button class="shop-button" id="buyMainUpgradeBtn" ${!canAffordMain ? "disabled" : ""}>Unlock Tank</button>
    `;
  }
  container.appendChild(mainCard);

  const mainBtn = mainCard.querySelector("#buyMainUpgradeBtn");
  if (mainBtn && mainUpgrade && game.money >= mainUpgrade.price) {
    mainBtn.addEventListener("click", () => {
      buyNextTankUpgrade();
    });
  }

  // 2. Favorites Tank Upgrade Card
  const favCard = document.createElement("div");
  favCard.className = "shop-card";

  const nextFavLevel = (game.favoritesTankLevel || 0) + 1;
  const favUpgrade = getFavoritesUpgradeData(nextFavLevel);

  if (!favUpgrade) {
    favCard.innerHTML = `
        <h3>Favorites Tank</h3>
        <strong>Maximum favorites capacity reached!</strong>
        <p>Current Capacity: ${game.favoritesTankLevel * 10} shrimp</p>
    `;
  } else {
    const canAffordFav = game.money >= favUpgrade.price;
    const headerText =
      game.favoritesTankLevel === 0
        ? `${icon("star")} Buy Favorites Tank`
        : `${icon("star")} Favorites Tank: Lv. ${favUpgrade.level}`;
    const descText =
      game.favoritesTankLevel === 0
        ? `Unlock a separate favorites aquarium holding up to <strong>${favUpgrade.capacity}</strong> shrimp.`
        : `Increase favorites capacity to <strong>${favUpgrade.capacity}</strong> shrimp.`;

    favCard.innerHTML = `
        <h3>${headerText}</h3>
        <p>${descText}</p>
        <div class="shop-price">$${favUpgrade.price}</div>
        <button class="shop-button" id="buyFavUpgradeBtn" ${!canAffordFav ? "disabled" : ""}>
            ${game.favoritesTankLevel === 0 ? "Purchase" : "Upgrade"}
        </button>
    `;
  }
  container.appendChild(favCard);

  const favBtn = favCard.querySelector("#buyFavUpgradeBtn");
  if (favBtn && favUpgrade && game.money >= favUpgrade.price) {
    favBtn.addEventListener("click", () => {
      buyFavoritesTankUpgrade();
    });
  }
}

function renderSpeedShop() {
  const container = document.getElementById("speedShop");
  if (!container) return;

  container.innerHTML = "";

  const SPEED_PREREQUISITES = {
    5: 2,
    20: 5,
    60: 20
  };

  SPEED_UPGRADES.forEach((upgrade) => {
    const owned = game.unlockedSpeeds.includes(upgrade.speed);
    const prevRequired = SPEED_PREREQUISITES[upgrade.speed];
    const hasPrerequisite = !prevRequired || game.unlockedSpeeds.includes(prevRequired);

    const canAfford = game.money >= upgrade.price;
    const canBuy = !owned && hasPrerequisite && canAfford;

    let buttonText = "Unlock";
    let statusText = owned ? "Unlocked" : "Locked";
    let priceHTML = `$${upgrade.price}`;

    if (owned) {
      buttonText = "Unlocked";
    } else if (!hasPrerequisite) {
      buttonText = `🔒 Requires ${prevRequired}x`;
      statusText = `Requires ${prevRequired}x`;
      priceHTML = `<span style="font-size: 11px; color: var(--muted);">${prevRequired}x speed required</span>`;
    }

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
            <h3>⚡ ${upgrade.name}</h3>
            <p class="small-text">${upgrade.desc}</p>
            <p>Status: <strong>${statusText}</strong></p>
            <div class="shop-price">${priceHTML}</div>
            <button class="shop-button" ${!canBuy ? "disabled" : ""}>${buttonText}</button>
        `;

    container.appendChild(card);

    const buyBtn = card.querySelector(".shop-button");
    if (buyBtn && canBuy) {
      buyBtn.addEventListener("click", () => {
        buySpeedUpgrade(upgrade);
      });
    }
  });
}

function renderCollection() {
  const container = document.getElementById("collection");
  if (!container) return;

  const collectionState = JSON.stringify(game.discovered);
  if (collectionState === lastCollectionState) return;
  lastCollectionState = collectionState;

  container.innerHTML = "";
  const allItems = { ...SHRIMP, ...WILD_PATTERNS };

  for (const [id, data] of Object.entries(allItems)) {
    const discovered = game.discovered.includes(id);
    const card = document.createElement("div");
    card.className = "collection-card " + (discovered ? "" : "locked");

    if (discovered) {
      card.innerHTML = `
                <strong>${data.name}</strong>
                <div class="collection-image-container" style="width: 70px; height: 50px; margin: 10px auto; position: relative;">
                    <img src="shrimp/${data.image}1.png" alt="${data.name}" class="collection-shrimp-img" style="width: 100%; height: 100%; object-fit: contain; cursor: zoom-in;">
                    <div class="collection-color" style="--shrimp-color:${data.color}; display:none; width:35px; height:25px; border-radius:50%; margin:10px auto; background:var(--shrimp-color);"></div>
                </div>
                <small class="rarity-${data.rarity}">${capitalize(data.rarity)}</small>
            `;

      const shrimpImage = card.querySelector(".collection-shrimp-img");
      if (shrimpImage) {
        shrimpImage.addEventListener("click", function (event) {
          event.stopPropagation();
          zoomShrimpImage(this);
        });
        shrimpImage.addEventListener("error", function () {
          this.style.display = "none";
          const fallback = this.nextElementSibling;
          if (fallback) fallback.style.display = "block";
        });
      }
    } else {
      card.innerHTML = `
                <strong>???</strong>
                <div class="collection-image-container" style="width:70px; height:50px; margin:10px auto; position:relative;">
                    <div class="collection-color" style="--shrimp-color:#888; width:35px; height:25px; border-radius:50%; margin:10px auto; background:var(--shrimp-color);"></div>
                </div>
                <small>Undiscovered</small>
            `;
    }

    container.appendChild(card);
  }
}
