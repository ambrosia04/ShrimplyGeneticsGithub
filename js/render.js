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

function renderDecorShop() {
    const container = document.getElementById("decorShop");
    if (!container || !isFavoritesMaxed()) return;

    container.innerHTML = "";
    for (const [id, item] of Object.entries(SHOP_DECOR)) {
        if (item.isPlant) continue; // Base/upgrade plants are not bought here

        const canAfford = game.money >= item.price;
        const card = document.createElement("div");
        card.className = "shop-card";
        card.innerHTML = `
            <div class="shrimp-preview" style="height: 60px;">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <h3>${item.name}</h3>
            <p class="small-text">${item.desc}</p>
            <div class="shop-price">$${item.price}</div>
            <button class="shop-button" ${!canAfford ? "disabled" : ""}>Purchase</button>
        `;

        card.querySelector(".shop-button").addEventListener("click", () => {
            buyDecor(id);
        });

        container.appendChild(card);
    }
}

//SHRIMP OVERHAUL
function renderHeader() {
  const currentTank = game.activeAquarium || "tank1";
  const unlockedTanks = getUnlockedTanks();
  const tankDropdown = document.getElementById("tankSelectDropdown");
  const singleTankTitle = document.getElementById("singleTankTitle");
  const listBtn = document.getElementById("shrimpListBtn");
  // Toggle Decorate button: visible ONLY when in Favorites Tank AND Lv 10
  const isFavMaxed =
    typeof isFavoritesMaxed === "function" && isFavoritesMaxed();
  const isViewingFavorites = game.activeAquarium === "favorites";
  const decorBtn = document.getElementById("decorateTankBtn");
  if (decorBtn) {
    toggleVisible(decorBtn, isFavMaxed && isViewingFavorites, "inline-flex");
  }

  // Toggle Decor Shop Panel inside Shop tab
  const decorPanel = document.getElementById("decorShopPanel");
  if (decorPanel) {
    toggleVisible(decorPanel, isFavMaxed && isViewingFavorites, "block");
  }

  const hasMultipleTanks =
    unlockedTanks.length > 1 || Boolean(game.favoritesTankUnlocked);

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

  const bmUnlocked =
    typeof isBlackMarketUnlocked === "function" && isBlackMarketUnlocked();
  const discCount = game && game.discovered ? game.discovered.length : 0;

  // 1. Black Market Button: Always visible, grey/disabled until 20 varieties discovered
  const openBmBtn = document.getElementById("openBlackMarketBtn");
  if (openBmBtn) {
    openBmBtn.classList.remove("hidden");
    openBmBtn.style.display = "inline-block";
    if (bmUnlocked) {
      openBmBtn.disabled = false;
      openBmBtn.style.opacity = "1";
      openBmBtn.style.cursor = "pointer";
      openBmBtn.style.background = "#2b2038";
      openBmBtn.style.border = "1.5px solid #8658b5";
      openBmBtn.textContent = "Black Market";
    } else {
      openBmBtn.disabled = true;
      openBmBtn.style.opacity = "0.55";
      openBmBtn.style.cursor = "not-allowed";
      openBmBtn.style.background = "#3a3a3a";
      openBmBtn.style.border = "1.5px solid #555555";
      openBmBtn.innerHTML = `${icon("lock")} 20 Varieties to Unlock (${discCount}/20)`;
    }
  }

  // 2. Breeder's Journal Button: Always visible, grey/disabled until 20 varieties discovered
  const openJournalBtn = document.getElementById("openJournalBtn");
  if (openJournalBtn) {
    openJournalBtn.classList.remove("hidden");
    openJournalBtn.style.display = "inline-flex";
    if (bmUnlocked) {
      openJournalBtn.disabled = false;
      openJournalBtn.style.opacity = "1";
      openJournalBtn.style.cursor = "pointer";
      openJournalBtn.style.background = "#395244";
      openJournalBtn.style.border = "1.5px solid #52a56c";
      openJournalBtn.innerHTML = `<img src="emoji/book.png" alt="Journal" class="ui-emoji"> Breeder's Journal`;
    } else {
      openJournalBtn.disabled = true;
      openJournalBtn.style.opacity = "0.55";
      openJournalBtn.style.cursor = "not-allowed";
      openJournalBtn.style.background = "#3a3a3a";
      openJournalBtn.style.border = "1.5px solid #555555";
      openJournalBtn.innerHTML = `<img src="emoji/book.png" alt="Journal" class="ui-emoji"> ${icon("lock")} 20 Varieties to Unlock (${discCount}/20)`;
    }
  }

  // 3. Specials Button: Stays hidden until all Black Market hints are maxed
  const allHintsBought =
    typeof areAllHintsPurchased === "function" && areAllHintsPurchased();
  const openSpecialsBtn = document.getElementById("openSpecialsBtn");
  if (openSpecialsBtn) {
    toggleVisible(openSpecialsBtn, allHintsBought, "inline-flex");
  }

  // Target Alleles Dropdown Visibility (Requires "firstBirth" achievement)
  const hasFirstBirth =
    game.achievements && game.achievements.includes("firstBirth");

  const cullingGroup = document.getElementById("cullingTargetsGroup");
  toggleVisible(cullingGroup, hasFirstBirth, "flex");

  const filterAllelesLabel = document.getElementById(
    "tankFilterAllelesBtnLabel",
  );
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
        //SHRIMP OVERHAUL
        tankDropdown.dataset.signature = optionsSignature;

        let optionsHTML = unlockedTanks
          .map((t) => {
            return `<option value="${t}">${formatTankName(t)}</option>`;
          })
          .join("");

        if (game.favoritesTankUnlocked) {
          optionsHTML += `<option value="favorites">★ Favorites Tank</option>`;
        }

        tankDropdown.innerHTML = optionsHTML;
        tankDropdown.value = currentTank;
        tankDropdown.dataset.currentTank = currentTank;
      }

      // Always sync dropdown value to current tank when not actively opened
      if (document.activeElement !== tankDropdown && tankDropdown.value !== currentTank) {
        tankDropdown.value = currentTank;
      }
    }
  }

  // Calculate live count and capacity for active tank
  const activeCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && !s.dead,
  ).length;
  const activeCapacity = getTankCapacity(currentTank);

  document.getElementById("money").textContent = "$" + Math.floor(game.money);
  document.getElementById("population").textContent =
    `${activeCount} / ${activeCapacity}`;
  document.getElementById("day").textContent = getDay();
  document.getElementById("clock").textContent = formatClock();
  document.getElementById("tankStatus").textContent =
    `${activeCount} / ${activeCapacity}`;

  // SHRIMP OVERHAUL
  const minigame1Wrap = document.getElementById("minigame1Wrapper");
  const minigame1HS = document.getElementById("minigame1HS");
  if (minigame1Wrap) {
    toggleVisible(
      minigame1Wrap,
      game.unlockedSpeeds.includes("game"),
      "inline-flex",
    );
    if (minigame1HS)
      minigame1HS.textContent = `HS: $${game.minigame1HighScore || 0}`;
  }

  const minigame2Wrap = document.getElementById("minigame2Wrapper");
  const minigame2HS = document.getElementById("minigame2HS");
  if (minigame2Wrap) {
    toggleVisible(
      minigame2Wrap,
      game.unlockedSpeeds.includes("game2"),
      "inline-flex",
    );
    if (minigame2HS)
      minigame2HS.textContent = `HS: $${game.minigame2HighScore || 0}`;
  }
}

function renderTankInfo() {
  const currentTank = game.activeAquarium || "tank1";
  const tankShrimp = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && !s.dead,
  );
  const males = tankShrimp.filter((s) => s.sex === "male").length;
  const females = tankShrimp.filter((s) => s.sex === "female").length;
  const juveniles = tankShrimp.filter((s) => lifeStage(s) !== "Adult").length;
  const pregnant = tankShrimp.filter((s) => s.pregnant).length;

  document.getElementById("capacityInfo").textContent =
    getTankCapacity(currentTank);
  document.getElementById("maleCount").textContent = males;
  document.getElementById("femaleCount").textContent = females;
  document.getElementById("juvenileCount").textContent = juveniles;
  document.getElementById("pregnantCount").textContent = pregnant;
  document.getElementById("plantCount").textContent =
    getTankPlants(currentTank).length;
}

function renderAquarium() {
  const currentTank = game.activeAquarium || "tank1";
  const currentTankPlants = getTankPlants(currentTank);

  const layer = document.getElementById("shrimpLayer");
  if (!layer) return;

  // 1. Query all plant & background DOM nodes first
  const leftPlant = document.getElementById("aquariumPlantLeft");
  const rightPlant = document.getElementById("aquariumPlantRight");
  const floater = document.getElementById("aquariumFloater");
  const breedingMoss = document.getElementById("aquariumBreedingMoss");
  const pregnancyMoss = document.getElementById("aquariumPregnancyMoss");
  const babyPlant = document.getElementById("aquariumBabyPlant");
  const growthPlant = document.getElementById("aquariumGrowthPlant");

  const isFavorites = currentTank === "favorites";
  const isCustomScaped = isFavorites && (typeof isFavoritesMaxed === "function" && isFavoritesMaxed());

  // 2. Hide static background & upgrade plants in Favorites Tank (they are managed by the custom decor layer)
  if (leftPlant) toggleVisible(leftPlant, !isCustomScaped);
  if (rightPlant) toggleVisible(rightPlant, !isCustomScaped);
  if (breedingMoss) toggleVisible(breedingMoss, !isCustomScaped && currentTankPlants.includes("breedingMoss"));
  if (pregnancyMoss) toggleVisible(pregnancyMoss, !isCustomScaped && currentTankPlants.includes("pregnancyPlant"));
  if (babyPlant) toggleVisible(babyPlant, !isCustomScaped && currentTankPlants.includes("babyPlant"));
  if (growthPlant) toggleVisible(growthPlant, !isCustomScaped && currentTankPlants.includes("growthPlant"));

  // 3. Regular non-favorites plant graphics setup
  if (!isCustomScaped) {
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
        const hasMutation = currentTankPlants.includes("mutationPlant");
        rightPlant.src = hasMutation ? "plants/planbg2Moss.png" : "plants/planbg2.png";
      }
    }

    const hasMutation = currentTankPlants.includes("mutationPlant");

    if (floater) toggleVisible(floater, currentTankPlants.includes("berriedPlant"));

    if (breedingMoss && currentTankPlants.includes("breedingMoss")) {
      breedingMoss.src = hasMutation ? "plants/breedingMossAlt.png" : "plants/breedingMoss.png";
    }

    if (pregnancyMoss && currentTankPlants.includes("pregnancyPlant")) {
      pregnancyMoss.src = hasMutation ? "plants/pregnancyMossAlt.png" : "plants/pregnancyMoss.png";
    }

    if (babyPlant && currentTankPlants.includes("babyPlant")) {
      const minWidth = 144;
      const shrinkStep = 20;
      const maxUpgradeIndex = 5;
      const remainingSteps = Math.max(0, maxUpgradeIndex - game.tankUpgradeLevel);
      const targetWidth = minWidth + remainingSteps * shrinkStep;

      babyPlant.style.width = targetWidth + "px";
      babyPlant.style.height = "auto";
      babyPlant.src = hasMutation ? "plants/babyPlantAlt.png" : "plants/babyPlant.png";
    }

    if (growthPlant && currentTankPlants.includes("growthPlant")) {
      const minWidth = 144;
      const shrinkStep = 20;
      const maxUpgradeIndex = 5;
      const remainingSteps = Math.max(0, maxUpgradeIndex - game.tankUpgradeLevel);
      const targetWidth = minWidth + remainingSteps * shrinkStep;

      growthPlant.style.width = targetWidth + "px";
      growthPlant.style.height = "auto";
      growthPlant.src = hasMutation ? "plants/growthPlantAlt.png" : "plants/growthPlant.png";
    }
  }

  // 4. Render Unified Decor Layer for Custom Scaped Favorites Tank
  let decorLayer = document.getElementById("aquariumDecorLayer");
  if (!decorLayer) {
    decorLayer = document.createElement("div");
    decorLayer.id = "aquariumDecorLayer";
    decorLayer.style.cssText = "position: absolute; inset: 0; pointer-events: none;";
    const aq = document.getElementById("aquarium");
    const sand = aq.querySelector(".sand");
    aq.insertBefore(decorLayer, sand);
  }

  decorLayer.innerHTML = "";

  if (isCustomScaped) {
    const items =
      game.favoritesDecor && game.favoritesDecor.length > 0
        ? game.favoritesDecor
        : typeof getDefaultFavoritesDecor === "function"
          ? getDefaultFavoritesDecor()
          : [];

    items
      .slice()
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
      .forEach((item) => {
        // Skip rendering if toggled off by user
        if (item.enabled === false) return;

        const data = SHOP_DECOR[item.id];
        if (!data) return;

        const wrapper = document.createElement("div");
        wrapper.className = "placed-decor-item";
        wrapper.style.position = "absolute";
        wrapper.style.left = `${item.x}%`;
        wrapper.style.top = `${item.y}%`;
        wrapper.style.width = `${item.width || data.width || 100}px`;
        wrapper.style.zIndex = item.zIndex || 1;
        wrapper.style.pointerEvents = "none";

        const img = document.createElement("img");
        img.src = data.image;
        img.className = "decor-graphic";
        img.alt = data.name;

        wrapper.appendChild(img);
        decorLayer.appendChild(wrapper);
      });
  }

  // 5. Marimo Balls
  const marimoOwned = countPlants("marimo", currentTank);
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

  // 6. Nursery Harvest button toggle
  const nurseryBtn = document.getElementById("tankBulkCullBtn");
  if (nurseryBtn) {
    const hasUpgrade = currentTankPlants.includes("autoNursery");
    const spawningCount = game
      ? game.shrimp.filter(
          (s) =>
            (s.tank || "tank1") === currentTank && s.readyToBirth && !s.dead,
        ).length
      : 0;
    toggleVisible(nurseryBtn, hasUpgrade, "inline-flex");
    nurseryBtn.disabled = spawningCount === 0;
    const newHTML = `<img src="emoji/baby.png" alt="Nursery" class="ui-emoji"> Nursery Harvest (${spawningCount})`;
    if (nurseryBtn.dataset.cachedHtml !== newHTML) { //cached check so that the button's DOM is not constantly rebuilt 60 times per second during clicks
      nurseryBtn.dataset.cachedHtml = newHTML;
      nurseryBtn.innerHTML = newHTML;
    }
  }

  // 7. Render Shrimp Sprites
  const existing = new Map();
  layer.querySelectorAll(".shrimp").forEach((element) => {
    existing.set(Number(element.dataset.id), element);
  });

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
  const sellModeKey = game.sellModeActive
    ? "sel_" + (game.selectedForSaleIds || []).join(",")
    : "noSel";

  const tankShrimp = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentAquarium && !s.dead,
  );

  const discCount = (game.discovered || []).length;
  const filterKey =
    (game.tankFilterAlleles || []).join(",") +
    "_" +
    (game.tankFilterSpecies || []).join(",");
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
          (s.tank || "tank1"),
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
    special: 7,
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
    sortedList = sortedList.filter((s) => {
      const name = displayName(s).toLowerCase();
      const a1 = SHRRIMP_SAFE(s.hiddenGenes.allele1).name.toLowerCase();
      const a2 = SHRRIMP_SAFE(s.hiddenGenes.allele2).name.toLowerCase();
      const sex = s.sex.toLowerCase();
      const stage = lifeStage(s).toLowerCase();
      const status = s.readyToBirth
        ? "spawning"
        : s.pregnant
          ? "berried"
          : s.resting
            ? "resting"
            : "";

      return (
        name.includes(query) ||
        a1.includes(query) ||
        a2.includes(query) ||
        sex.includes(query) ||
        stage.includes(query) ||
        status.includes(query)
      );
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

    const isSingleSelected =
      game.selectedShrimpId !== null &&
      Number(game.selectedShrimpId) === Number(shrimp.id);
    const isSellSelected =
      game.sellModeActive &&
      game.selectedForSaleIds &&
      game.selectedForSaleIds.includes(shrimp.id);

    if (isSingleSelected || isSellSelected) {
      card.classList.add("selected-shrimp-card");
    }

    // TANK SEARCH GREEN HIGHLIGHT (placed safely inside the forEach loop where shrimp and card exist)
    if (
      typeof isShrimpTankFiltered === "function" &&
      isShrimpTankFiltered(shrimp)
    ) {
      card.classList.add("tank-filter-highlighted");
    }

    // SHRIMP OVERHAUL
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "cull-media";
    mediaDiv.style.width = "40px";
    mediaDiv.style.height = "28px";

    const sexSuffix = shrimp.sex === "male" ? "M" : "F";
    const imgPath = `shrimp/${imgPrefix}${sexSuffix}2.png`;

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
    (s) => Number(s.id) === Number(game.selectedShrimpId) && !s.dead,
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
    const hasMultipleTanks =
      unlockedTanks.length > 1 || Boolean(game.favoritesTankUnlocked);

    let transferHTML = "";
    let locationHTML = "";

    if (hasMultipleTanks) {
      locationHTML = `
          <p style="margin: 2px 0 0 0; font-size: 12px; color: var(--muted);">
              Location: <strong>${formatTankName(currentShrimpTank)}</strong>
          </p>
      `;

      let tankOptions = unlockedTanks
        .map((t) => {
          const count = game.shrimp.filter(
            (s) => (s.tank || "tank1") === t && !s.dead,
          ).length;
          const cap = getTankCapacity(t);
          const selected = t === currentShrimpTank ? "selected" : "";
          return `<option value="${t}" ${selected}>${formatTankName(t)} (${count}/${cap})</option>`;
        })
        .join("");

      if (game.favoritesTankUnlocked) {
        const favCount = game.shrimp.filter(
          (s) => s.tank === "favorites" && !s.dead,
        ).length;
        const favCap = getTankCapacity("favorites");
        const favSelected = currentShrimpTank === "favorites" ? "selected" : "";
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

    // SHRIMP OVERHAUL
    const imgPrefix = getShrimpImagePrefix(shrimp);
    const nameToDisplay = displayName(shrimp);
    const sexSuffix = shrimp.sex === "male" ? "M" : "F";

    const newHTML = `
        <div class="selected-card-layout">
            <div class="selected-card">
                <div class="selected-image">
                    <img id="selectedShrimpSidebarImg" src="shrimp/${imgPrefix}${sexSuffix}2.png" alt="${data.name}" style="width: 100%; height: 100%; object-fit: contain; cursor: zoom-in;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
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
      const progress =
        100 * (1 - shrimp.pregnancyRemaining / shrimp.pregnancyTotal);
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
// SHRIMP OVERHAUL
function createGeneticNode(id) {
  const data = SHRRIMP_SAFE(id);
  const discovered =
    game.discoveredAlleles && game.discoveredAlleles.includes(id);

  const node = document.createElement("span");
  node.className = "genetic-node " + (discovered ? "discovered" : "locked");
  node.textContent = discovered ? data.name : "???";
  return node;
}
// SHRIMP OVERHAUL
function renderGenetics() {
  const container = document.getElementById("geneticsTree");
  if (!container) return;

  const page2Families = [
    "cantonensis",
    "sulawesi",
    "tiger",
    "bee",
    "tibee",
    "boa",
    "malawa",
    "raccoon",
    "lace",
  ];
  const isUnlocked =
    typeof isCaridinaPageUnlocked === "function"
      ? isCaridinaPageUnlocked()
      : false;
  const currentPage = game.geneticsPage || 1;

  const geneticsCacheKey = `${currentPage}_${isUnlocked}_${(game.discoveredAlleles || []).length}_${JSON.stringify(game.discoveredAlleles || [])}`;
  if (container.dataset.cache === geneticsCacheKey) return;
  container.dataset.cache = geneticsCacheKey;

  container.innerHTML = "";

  // Pagination navigation bar
  if (isUnlocked) {
    const navBar = document.createElement("div");
    navBar.style.display = "flex";
    navBar.style.justifyContent = currentPage === 1 ? "flex-end" : "flex-start";
    navBar.style.marginBottom = "15px";

    const pageBtn = document.createElement("button");
    pageBtn.type = "button";
    pageBtn.className = "primary-button";
    pageBtn.style.padding = "6px 14px";
    pageBtn.style.fontSize = "13px";
    pageBtn.style.cursor = "pointer";

    if (currentPage === 1) {
      pageBtn.innerHTML = `Next Page &rarr;`;
      pageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof playPageFlipSound === "function") playPageFlipSound();
        game.geneticsPage = 2;
        delete container.dataset.cache;
        renderGenetics();
      });
    } else {
      pageBtn.innerHTML = `&larr; Previous Page`;
      pageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof playPageFlipSound === "function") playPageFlipSound();
        game.geneticsPage = 1;
        delete container.dataset.cache;
        renderGenetics();
      });
    }

    navBar.appendChild(pageBtn);
    container.appendChild(navBar);
  }

  // Page 2: Sulawesi, Cantonensis Subfamilies & Secret Lines
  if (currentPage === 2) {
    // 1. Sulawesi Line
    const sulawesiList = Object.keys(SHRIMP).filter(
      (k) => SHRIMP[k].family === "sulawesi",
    );
    if (sulawesiList.length > 0) {
      const sulawesiSec = document.createElement("div");
      sulawesiSec.className = "genetic-family";
      sulawesiSec.innerHTML = `<h3>Sulawesi Line</h3>`;
      sulawesiList.forEach((id) => {
        sulawesiSec.appendChild(createGeneticNode(id));
      });
      container.appendChild(sulawesiSec);
    }

    // 2. Caridina Cantonensis Line with Nested Subfamily Boxes
    const cantonensisSec = document.createElement("div");
    cantonensisSec.className = "genetic-family";
    cantonensisSec.innerHTML = `<h3>Caridina Cantonensis Line</h3>`;

    // Wild Base
    const baseCantonensis = Object.keys(SHRIMP).filter(
      (k) => SHRIMP[k].family === "cantonensis",
    );
    if (baseCantonensis.length > 0) {
      const baseRow = document.createElement("div");
      baseRow.style.marginBottom = "12px";
      baseCantonensis.forEach((id) =>
        baseRow.appendChild(createGeneticNode(id)),
      );
      cantonensisSec.appendChild(baseRow);
    }

    // Subfamilies: Tiger, Bee, TiBee
    const subfamilies = [
      { key: "tiger", name: "Tiger Subfamily" },
      { key: "bee", name: "Bee Subfamily" },
      { key: "tibee", name: "TiBee Subfamily" },
    ];

    subfamilies.forEach((sub) => {
      const subMembers = Object.keys(SHRIMP).filter(
        (k) => SHRIMP[k].family === sub.key,
      );
      if (subMembers.length > 0) {
        const subBox = document.createElement("div");
        subBox.style.margin = "10px 0";
        subBox.style.padding = "10px 12px";
        subBox.style.background = "rgba(0, 0, 0, 0.08)";
        subBox.style.borderRadius = "8px";
        subBox.style.border = "1px solid var(--border)";

        const subTitle = document.createElement("h4");
        subTitle.style.margin = "0 0 8px 0";
        subTitle.style.fontSize = "13px";
        subTitle.style.color = "var(--text)";
        subTitle.textContent = sub.name;
        subBox.appendChild(subTitle);

        subMembers.forEach((id) => subBox.appendChild(createGeneticNode(id)));
        cantonensisSec.appendChild(subBox);
      }
    });

    container.appendChild(cantonensisSec);

    // 3. Secret Lines (Metallic Boa, Malawa, Raccoon, Glass Lace)
    const secretFamilies = [
      { key: "boa", name: "Metallic Boa Line" },
      { key: "malawa", name: "Malawa Line" },
      { key: "raccoon", name: "Raccoon Line" },
      { key: "lace", name: "Glass Lace Line" },
    ];

    secretFamilies.forEach((secFam) => {
      const members = Object.keys(SHRIMP).filter(
        (k) => SHRIMP[k].family === secFam.key,
      );
      const hasAnyDiscovered = members.some(
        (id) => game.discoveredAlleles && game.discoveredAlleles.includes(id),
      );

      if (hasAnyDiscovered) {
        const secDiv = document.createElement("div");
        secDiv.className = "genetic-family";
        secDiv.innerHTML = `<h3>${secFam.name}</h3>`;
        members.forEach((id) => secDiv.appendChild(createGeneticNode(id)));
        container.appendChild(secDiv);
      }
    });

    return;
  }

  // Page 1: Neocaridina Lines & Standard Isolated Lines
  const families = {};

  for (const [id, data] of Object.entries(SHRIMP)) {
    const isPage2Family = page2Families.includes(data.family);
    if (isPage2Family) continue;

    if (
      data.family === "amano" &&
      !isAmanoUnlocked() &&
      !game.discovered.includes("amanoShrimp")
    )
      continue;
    if (
      data.family === "bamboo" &&
      !isBambooShrimpUnlocked() &&
      !game.discovered.includes("bambooShrimp")
    )
      continue;
    if (
      data.family === "scud" &&
      !isScudUnlocked() &&
      !game.discovered.includes("legendaryScud")
    )
      continue;
    if (
      data.family === "crawfish" &&
      !isRedCrawfishUnlocked() &&
      !game.discovered.includes("redCrawfish") &&
      !game.discovered.includes("blueCrawfish")
    )
      continue;
    if (
      data.family === "rednose" &&
      !isRedNoseUnlocked() &&
      !(game.discovered && game.discovered.includes("redNose"))
    )
      continue;
    if (
      data.family === "vampire" &&
      !isVampireUnlocked() &&
      !(game.discovered && game.discovered.includes("vampireShrimp"))
    )
      continue;
    if (
      data.family === "babaulti" &&
      !isBabaultiUnlocked() &&
      !(game.discovered && game.discovered.includes("babaultiWild"))
    )
      continue;
    if (data.family === "glasslace") {
      const isUnlocked =
        isGlassLaceUnlocked() ||
        (game.discovered && game.discovered.includes("glassLaceShrimp"));
      if (!isUnlocked) continue;
    }

    if (data.family === "special") {
      const isGoodsUnlocked =
        (typeof areAllHintsPurchased === "function" && areAllHintsPurchased()) ||
        (game.discovered && game.discovered.includes("zombieShrimp")) ||
        (game.discoveredAlleles && game.discoveredAlleles.includes("zombieShrimp"));
      if (!isGoodsUnlocked) continue;
    }
    
    if (!families[data.family]) families[data.family] = [];
    families[data.family].push(id);
  }

  for (const [family, speciesList] of Object.entries(families)) {
    const section = document.createElement("div");
    section.className = "genetic-family";
    section.innerHTML = `<h3>${capitalize(family)} Line</h3>`;

    for (const id of speciesList) {
      section.appendChild(createGeneticNode(id));
    }

    container.appendChild(section);
  }
}

let lastRenderedShopState = "";

function renderShop() {
  if (!game) return;

  const currentTank = game.activeAquarium || "tank1";
  const currentMoney = Math.floor(game.money);
  const plantListSig = getTankPlants(currentTank).join(",");
  const shopSignature = `${currentTank}_${currentMoney}_${(game.discovered || []).length}_${game.tankUpgradeLevel}_${(game.unlockedSpeeds || []).join(",")}_${plantListSig}_${game.favoritesTankLevel}`;

  if (shopSignature === lastRenderedShopState) return;
  lastRenderedShopState = shopSignature;

  renderShrimpShop();
  renderTankShop();
  renderSpeedShop();
  renderPlantShop();
  renderDecorShop();
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

// SHRIMP OVERHAUL
function renderShrimpShop() {
  const container = document.getElementById("shrimpShop");
  if (!container) return;

  container.innerHTML = "";

  const activeShopShrimp = [...SHOP_SHRIMP];
  if (isBabaultiUnlocked()) activeShopShrimp.push("babaultiWild");
  if (isBambooShrimpUnlocked()) activeShopShrimp.push("bambooShrimp");
  if (isSulawesiUnlocked() || hasDiscoveredOrOwnedGalaxySulawesi()) {
    activeShopShrimp.push("galaxySulawesi");
  }
  if (isAmanoUnlocked()) activeShopShrimp.push("amanoShrimp");
  if (isScudUnlocked()) activeShopShrimp.push("legendaryScud");
  if (isRedCrawfishUnlocked()) activeShopShrimp.push("redCrawfish");
  if (isRedNoseUnlocked()) activeShopShrimp.push("redNose");
  if (isVampireUnlocked()) activeShopShrimp.push("vampireShrimp");
  if (isGlassLaceUnlocked()) activeShopShrimp.push("glassLaceShrimp");

  // Unlocked once you obtain/discover your first TiBee hybrid
  if (typeof isMalawaUnlocked === "function" && isMalawaUnlocked()) {
    activeShopShrimp.push("malawaShrimp");
  }
  // Unlocked once all 6 TiBee mutations are discovered
  if (typeof isMetallicBoaUnlocked === "function" && isMetallicBoaUnlocked()) {
    activeShopShrimp.push("metallicBoaBlack");
  }

  // Unlocked once Galaxy Sulawesi has been obtained / discovered
  if (hasDiscoveredOrOwnedGalaxySulawesi()) {
    activeShopShrimp.push("wildSulawesi");
    activeShopShrimp.push("wildCaridinaCantonensis");
  }

  // Iterate over activeShopShrimp (NOT the static SHOP_SHRIMP array)
  for (const shopEntry of activeShopShrimp) {
    const species = typeof shopEntry === "string" ? shopEntry : shopEntry.id;
    const reqCount =
      typeof shopEntry === "object" &&
      shopEntry.requiredDiscoveries !== undefined
        ? shopEntry.requiredDiscoveries
        : 0;
    const currentDiscovered = (game.discovered || []).length;
    const isUnlockedByMilestone = currentDiscovered >= reqCount;

    const data = SHRRIMP_SAFE(species);
    const price = SHRIMP_PRICES[species] || 10;
    const canAfford = game.money >= price;
    const isDiscovered = Boolean(
      game && (
        (game.discovered && game.discovered.includes(species)) ||
        (game.discoveredAlleles && game.discoveredAlleles.includes(species))
      )
    );

    const isOwnedSulawesi =
      species === "galaxySulawesi" &&
      game.shrimp.some((s) => s.species === "galaxySulawesi" && !s.dead);

    const isLocked = !isUnlockedByMilestone;
    const isDisabled =
      isLocked || !canAfford || isOwnedSulawesi ? "disabled" : "";

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
                <img src="shrimp/${data.image}F2.png" alt="${data.name}" class="shop-preview-img ${isDiscovered ? "collection-shrimp-img" : ""}">
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
    if (buyBtn && canAfford && !isOwnedSulawesi && !isLocked) {
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

  const currentTank = game.activeAquarium || "tank1";

  for (const [id, plant] of Object.entries(SHOP_PLANTS)) {
    const isMarimo = id === "marimo";
    const ownedCount = countPlants(id, currentTank);
    const isMaxed = isMarimo ? ownedCount >= 3 : ownedCount >= 1;
    const currentPrice = getPlantPrice(id, currentTank);
    const canAfford = game.money >= currentPrice;
    const isDisabled = isMaxed || !canAfford;

    let statusText = "Not Owned in " + formatTankName(currentTank);
    let buttonText = "Buy for " + formatTankName(currentTank);

    if (isMarimo) {
      statusText = `${ownedCount}/3 in ${formatTankName(currentTank)}`;
      buttonText = isMaxed
        ? "Max (3/3)"
        : ownedCount > 0
          ? `Buy (${ownedCount + 1}/3)`
          : "Buy for " + formatTankName(currentTank);
    } else if (ownedCount >= 1) {
      statusText = "Installed in " + formatTankName(currentTank);
      buttonText = "Owned";
    }

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
            <h3><img src="emoji/herb.png" alt="Herb" class="ui-emoji"> ${plant.name}</h3>
            <p class="small-text">${plant.description}</p>
            <p style="font-size: 12px; margin: 6px 0;">Status: <strong>${statusText}</strong></p>
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
    60: 20,
  };

  SPEED_UPGRADES.forEach((upgrade) => {
    const owned = game.unlockedSpeeds.includes(upgrade.speed);
    const prevRequired = SPEED_PREREQUISITES[upgrade.speed];
    const hasPrerequisite =
      !prevRequired || game.unlockedSpeeds.includes(prevRequired);

    const canAfford = game.money >= upgrade.price;
    const canBuy = !owned && hasPrerequisite && canAfford;

    let buttonText = "Unlock";
    let statusText = owned ? "Unlocked" : "Locked";
    let priceHTML = `$${upgrade.price}`;

    if (owned) {
      buttonText = "Unlocked";
    } else if (!hasPrerequisite) {
      buttonText = `${icon("lock")} Requires ${prevRequired}x`;
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
// SHRIMP OVERHAUL
function renderCollection() {
  const container = document.getElementById("collection");
  if (!container) return;

  const page2Families = [
    "cantonensis",
    "sulawesi",
    "tiger",
    "bee",
    "tibee",
    "boa",
    "malawa",
    "raccoon",
    "lace",
  ];
  const isUnlocked =
    typeof isCaridinaPageUnlocked === "function"
      ? isCaridinaPageUnlocked()
      : false;
  const currentPage = game.collectionPage || 1;

  const collectionState =
    JSON.stringify(game.discovered) + `_p${currentPage}_u${isUnlocked}`;
  if (collectionState === lastCollectionState) return;
  lastCollectionState = collectionState;

  container.innerHTML = "";

  // Pagination navigation bar
  if (isUnlocked) {
    const navBar = document.createElement("div");
    navBar.style.gridColumn = "1 / -1";
    navBar.style.display = "flex";
    navBar.style.justifyContent = currentPage === 1 ? "flex-end" : "flex-start";
    navBar.style.marginBottom = "10px";

    const pageBtn = document.createElement("button");
    pageBtn.type = "button";
    pageBtn.className = "primary-button";
    pageBtn.style.padding = "6px 14px";
    pageBtn.style.fontSize = "13px";
    pageBtn.style.cursor = "pointer";

    if (currentPage === 1) {
      pageBtn.innerHTML = `Next Page &rarr;`;
      pageBtn.addEventListener("click", () => {
        if (typeof playPageFlipSound === "function") playPageFlipSound();
        game.collectionPage = 2;
        lastCollectionState = "";
        renderCollection();
      });
    } else {
      pageBtn.innerHTML = `&larr; Previous Page`;
      pageBtn.addEventListener("click", () => {
        if (typeof playPageFlipSound === "function") playPageFlipSound();
        game.collectionPage = 1;
        lastCollectionState = "";
        renderCollection();
      });
    }

    navBar.appendChild(pageBtn);
    container.appendChild(navBar);
  }

  const allItems = { ...SHRIMP, ...WILD_PATTERNS };

  for (const [id, data] of Object.entries(allItems)) {
    if (data.rarity === "special") continue;

    const isPage2Family = page2Families.includes(data.family);

    if (currentPage === 1 && isPage2Family) continue;
    if (currentPage === 2 && !isPage2Family) continue;

    const discovered = game.discovered.includes(id);
    const card = document.createElement("div");
    card.className = "collection-card " + (discovered ? "" : "locked");

    if (discovered) {
      card.innerHTML = `
            <strong>${data.name}</strong>
            <div class="collection-image-container" style="width: 70px; height: 50px; margin: 10px auto; position: relative;">
                <img src="shrimp/${data.image}F2.png" alt="${data.name}" class="collection-shrimp-img" style="width: 100%; height: 100%; object-fit: contain; cursor: zoom-in;">
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
