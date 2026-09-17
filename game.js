// Helper to return a custom PNG emoji tag
function icon(name, className = "ui-emoji") {
    return `<img src="emoji/${name}.png" class="${className}" alt="${name}">`;
}

// Default Fallback Shortcuts
const DEFAULT_SHORTCUTS = {
    tank: "T",
    shop: "S",
    collection: "C",
    genetics: "G",
    log: "A",
    settings: "J",
    sellMode: "E",
    favoriteTank: "F",
    speed1: "1",
    speed2: "2",
    speed5: "3",
    speed20: "4",
    speed60: "5"
};

// Tracking active rebinding key actions
let rebindingAction = null;

// Independent drift physics for up to 3 Marimo balls
const marimoDriftList = [
    { x: 35, y: 76, vx: 0.045, vy: 0.012, rotation: 0, size: 48 },
    { x: 50, y: 79, vx: -0.050, vy: -0.015, rotation: 45, size: 44 },
    { x: 65, y: 74, vx: 0.038, vy: 0.018, rotation: 90, size: 52 }
];

const SAVE_KEY = "shrimpBreederSave_v1";

const GAME = {
    speed: 1,
    breedingInterval: 60,
    babyAgeMinutes: 30,
    juvenileAgeMinutes: 60,
    dayLengthMinutes: 1440,
    startingMoney: 100,
    tankCapacity: 100, // 100 per tank x 10 tanks = 1000 total
    totalTanks: 10
};

const ALL_TANKS = ["tank1", "tank2", "tank3", "tank4", "tank5", "tank6", "tank7", "tank8", "tank9", "tank10"];

/* =========================================================
   SHOP
========================================================= */

const SHOP_SHRIMP = [
    "redCherry",
    "yellow",
    "orange",
    "shoko",
    "wildPalmata",
    "sakuraRedA",
    "deepBlueNeo"
];

const SHOP_PLANTS = {
    breedingMoss: {
        name: "Christmas Moss",
        price: 850,
        description: "Each adult male can successfully breed up to 2 females during a breeding check.",
        effect: "extraFemale"
    },
    berriedPlant: {
        name: "Amazon Frogbit",
        price: 1380,
        description: "Reduces female resting/cooldown time by 15%.",
        effect: "restReduction"
    },
    pregnancyPlant: {
        name: "Java Moss",
        price: 1780,
        description: "Reduces pregnancy duration by 15%.",
        effect: "pregnancyReduction"
    },
    babyPlant: {
        name: "Water Sprite",
        price: 2400,
        description: "Increases babies born by 15%.",
        effect: "babyBoost"
    },
    growthPlant: {
        name: "Hornwort",
        price: 3820,
        description: "Shrimp mature 15% faster.",
        effect: "growthBoost"
    },
    mutationPlant: {
        name: "Mutation Algae",
        price: 5750,
        description: "Alters the water chemistry to double the baseline genetic mutation rate (increases it by 5%).",
        effect: "mutationBoost"
    },
    marimo: {
        name: "Marimo",
        price: 15750,
        description: "Makes the shrimp happy, increasing the genetic mutation rate (increases it by 10%).",
        effect: "superMutationBoost"
    }
};

/* =========================================================
   TANK UPGRADES
========================================================= */

const TANK_UPGRADES = [
    { unlockedTanks: 1, price: 0, name: "Starter Aquarium (Tank 1)" },
    { unlockedTanks: 2, price: 500, name: "Second Aquarium (Tank 2)" },
    { unlockedTanks: 3, price: 1500, name: "Third Aquarium (Tank 3)" },
    { unlockedTanks: 4, price: 3500, name: "Fourth Aquarium (Tank 4)" },
    { unlockedTanks: 5, price: 7000, name: "Fifth Aquarium (Tank 5)" },
    { unlockedTanks: 6, price: 12000, name: "Sixth Aquarium (Tank 6)" },
    { unlockedTanks: 7, price: 18000, name: "Seventh Aquarium (Tank 7)" },
    { unlockedTanks: 8, price: 26000, name: "Eighth Aquarium (Tank 8)" },
    { unlockedTanks: 9, price: 36000, name: "Ninth Aquarium (Tank 9)" },
    { unlockedTanks: 10, price: 50000, name: "Master Breeder (Tank 10)" }
];

function getUnlockedTanks() {
    if (!game) return ["tank1"];
    const count = Math.min(10, Math.max(1, (game.tankUpgradeLevel || 0) + 1));
    const list = [];
    for (let i = 1; i <= count; i++) {
        list.push(`tank${i}`);
    }
    return list;
}

/* =========================================================
   SPEED UPGRADES CONFIGURATION
========================================================= */

const SPEED_UPGRADES = [
    { speed: 2, price: 400, name: "2x Time Acceleration", desc: "Unlock 2x game speed to accelerate breeding checks." },
    { speed: 5, price: 3500, name: "5x Time Acceleration", desc: "Unlock 5x game speed to accelerate breeding checks." },
    { speed: 20, price: 7500, name: "20x Time Acceleration", desc: "Unlock 20x game speed to speed up growth rates." },
    { speed: 60, price: 15000, name: "60x Time Acceleration", desc: "Unlock 60x game speed for maximum breeding warp." },
    { speed: "game", price: 2000, name: `${icon('controller')} Evolution Console`, desc: "Unlocks an action minigame to play and earn extra cash!" },
    { speed: "game2", price: 6000, name: `${icon('microscope')} Clado Scanner Console`, desc: "Unlocks a minigame about identifying cladocera to earn extra cash!!" }
];

/* =========================================================
   GAME STATE & REUSABLE LOOKUP HELPERS
========================================================= */

let game = null;
let lastSelectedId = null;
let lastSidebarState = "";
let lastRenderedMoney = null;
let gamePlaying = false;
let activeCullFemaleId = null;

function isShrimpInTank(shrimp, tank = "tank1") {
    return (shrimp.tank || "tank1") === tank;
}

function hasLiveShrimp(species, tank = null, adultOnly = false) {
    if (!game || !game.shrimp) return false;
    return game.shrimp.some(s =>
        !s.dead &&
        s.species === species &&
        (!tank || isShrimpInTank(s, tank)) &&
        (!adultOnly || isAdult(s))
    );
}

function countLiveShrimp(species, tank = null, adultOnly = false) {
    if (!game || !game.shrimp) return 0;
    return game.shrimp.filter(s =>
        !s.dead &&
        s.species === species &&
        (!tank || isShrimpInTank(s, tank)) &&
        (!adultOnly || isAdult(s))
    ).length;
}

function createNewGame() {
    return {
        money: GAME.startingMoney,
        minutes: 0,
        lastRealTime: Date.now(),
        lastBreedingCheck: 0,
        lastDailyPayment: 0,
        capacity: GAME.tankCapacity,
        shrimp: [],
        plants: [],
        logs: [],
        selectedShrimpId: null,
        nextShrimpId: 1,
        tankUpgradeLevel: 0,
        pendingKeepBaby: null,
        pendingKeepFemale: null,
        pendingKeepIndex: null,
        discovered: [],
        discoveredAlleles: [],
        sellModeActive: false,
        selectedForSaleIds: [],
        shrimpListSort: "HighValue",
        unlockedSpeeds: [1],
        bgmVolume: 1,
        bgmMuted: false,
        sfxVolume: 0.5,
        sfxMuted: false,
        darkModeActive: false,
        favoritesTankUnlocked: false,
        favoritesTankLevel: 0,
        activeAquarium: "tank1",
        purchaseGenderHistory: [],
        trackedAlleles: [],
        trackedSpecies: [],
        shortcuts: { ...DEFAULT_SHORTCUTS }
    };
}

/* =========================================================
   SAVE / LOAD
========================================================= */

function saveGame() {
    if (!game) return;
    game.lastRealTime = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    addLog("Game saved.");
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) {
        game = createNewGame();
        saveGame();
        return;
    }

    try {
        game = JSON.parse(saved);

        if (!game.discovered) game.discovered = [];
        if (!game.discoveredAlleles) game.discoveredAlleles = [...game.discovered];
        if (!game.achievements) game.achievements = [];
        if (!game.plants) game.plants = [];
        if (game.tankUpgradeLevel === undefined) game.tankUpgradeLevel = 0;
        if (game.sellModeActive === undefined) game.sellModeActive = false;
        if (!game.selectedForSaleIds) game.selectedForSaleIds = [];
        if (game.shrimpListSort === undefined) game.shrimpListSort = "HighValue";
        if (game.bgmVolume === undefined) game.bgmVolume = 0.5;
        if (game.bgmMuted === undefined) game.bgmMuted = false;
        if (game.sfxVolume === undefined) game.sfxVolume = 0.5;
        if (game.sfxMuted === undefined) game.sfxMuted = false;
        if (game.darkModeActive === undefined) game.darkModeActive = false;
        if (!game.unlockedSpeeds) game.unlockedSpeeds = [1];
        if (game.favoritesTankUnlocked === undefined) game.favoritesTankUnlocked = false;
        if (game.favoritesTankLevel === undefined) game.favoritesTankLevel = 0;
        if (game.purchaseGenderHistory === undefined) game.purchaseGenderHistory = [];
        if (!game.trackedAlleles) game.trackedAlleles = [];
        if (!game.trackedSpecies) game.trackedSpecies = [];

        if (!game.shortcuts) {
            game.shortcuts = { ...DEFAULT_SHORTCUTS };
        } else {
            if (game.shortcuts.log === "L") game.shortcuts.log = "A";
            if (game.shortcuts.settings === "A") game.shortcuts.settings = "J";

            for (const key of Object.keys(DEFAULT_SHORTCUTS)) {
                if (game.shortcuts[key] === undefined) {
                    game.shortcuts[key] = DEFAULT_SHORTCUTS[key];
                }
            }
        }

        for (const s of game.shrimp) {
            if (!s.hiddenGenes || !s.hiddenGenes.allele1) {
                s.hiddenGenes = generateHiddenGenes(s.species);
            }
            if (isAdult(s) && s.sex === "female" && s.species !== "galaxySulawesi" && !s.pregnant && !s.resting && !s.readyToBirth && !s.saddle) {
                s.saddle = true;
            }
        }

        /* =========================================================
           SAFE BACKWARD COMPATIBLE MULTI-TANK MIGRATION
        ========================================================= */
        const oldUpgradeToNewLevel = {
            0: 0, 1: 0, 2: 1, 3: 2, 4: 4, 5: 9
        };

        // Perform one-time tier conversion for legacy saves ONLY
        if (game.saveVersion === undefined || game.saveVersion < 2) {
            const generalShrimp = game.shrimp.filter(s => s.tank !== "favorites");
            const tanksNeededForShrimp = Math.max(1, Math.ceil(generalShrimp.length / GAME.tankCapacity));
            const minLevelForShrimp = Math.min(9, tanksNeededForShrimp - 1);

            const oldLevel = game.tankUpgradeLevel || 0;
            const convertedLevel = oldUpgradeToNewLevel[oldLevel] !== undefined ? oldUpgradeToNewLevel[oldLevel] : oldLevel;
            game.tankUpgradeLevel = Math.min(9, Math.max(convertedLevel, minLevelForShrimp));

            const totalUnlockedTanks = Math.min(10, Math.max(1, (game.tankUpgradeLevel || 0) + 1));

            // Distribute only legacy shrimp that do not have a tank assigned yet
            generalShrimp.forEach((s, index) => {
                if (!s.tank || s.tank === "main") {
                    const tankIndex = Math.min(totalUnlockedTanks, Math.floor(index / GAME.tankCapacity) + 1);
                    s.tank = `tank${tankIndex}`;
                }
            });

            game.saveVersion = 2;
        }

        // Validate tank assignment for each shrimp without overwriting custom placements
        const unlockedTanksList = getUnlockedTanks();
        for (const s of game.shrimp) {
            if (!s.tank || (s.tank !== "favorites" && !unlockedTanksList.includes(s.tank))) {
                s.tank = "tank1";
            }
        }

        // Ensure active aquarium selection is valid
        if (!game.activeAquarium || game.activeAquarium === "main" || (!unlockedTanksList.includes(game.activeAquarium) && game.activeAquarium !== "favorites")) {
            game.activeAquarium = "tank1";
        }

        applyOfflineProgress();

        for (const s of game.shrimp) {
            if (s.pattern === "wild") {
                discoverWildPattern(s);
            }
        }

        addLog("Welcome back to your aquarium!");

    } catch (error) {
        console.error(error);
        game = createNewGame();
    }
}


/* =========================================================
   TRACKED TARGET ALLELES ENGINE
========================================================= */

function renderTrackedAllelesList() {
    const list = document.getElementById("trackedAllelesList");
    const label = document.getElementById("trackedAllelesBtnLabel");
    const selectAllCheckbox = document.getElementById("selectAllTrackedAlleles");
    const searchInput = document.getElementById("trackedAllelesSearch");
    if (!list || !game || !game.discoveredAlleles) return;

    if (!game.trackedAlleles) game.trackedAlleles = [];

    const count = game.trackedAlleles.length;
    if (label) label.textContent = `Target Alleles (${count})`;

    const filterText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const discovered = [...game.discoveredAlleles];

    // Check if all discovered are selected
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = discovered.length > 0 && discovered.every(a => game.trackedAlleles.includes(a));
    }

    list.innerHTML = "";

    discovered.forEach(alleleId => {
        const data = SHRRIMP_SAFE(alleleId);
        const name = data.name;

        if (filterText && !name.toLowerCase().includes(filterText)) {
            return;
        }

        const item = document.createElement("label");
        item.className = "multi-select-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = game.trackedAlleles.includes(alleleId);

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                if (!game.trackedAlleles.includes(alleleId)) {
                    game.trackedAlleles.push(alleleId);
                }
            } else {
                game.trackedAlleles = game.trackedAlleles.filter(a => a !== alleleId);
            }
            if (label) label.textContent = `Target Alleles (${game.trackedAlleles.length})`;
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = discovered.length > 0 && discovered.every(a => game.trackedAlleles.includes(a));
            }
            saveGame();
        });

        const span = document.createElement("span");
        span.textContent = name;

        item.appendChild(checkbox);
        item.appendChild(span);
        list.appendChild(item);
    });

    if (list.children.length === 0) {
        list.innerHTML = `<div class="small-text" style="padding: 8px; text-align: center;">No matching alleles.</div>`;
    }
}

// Setup Event Listeners for the Target Alleles Dropdown
function setupTrackedAllelesDropdown() {
    const btn = document.getElementById("trackedAllelesBtn");
    const menu = document.getElementById("trackedAllelesMenu");
    const searchInput = document.getElementById("trackedAllelesSearch");
    const selectAllBtn = document.getElementById("selectAllTrackedAllelesBtn");
    const deselectAllBtn = document.getElementById("deselectAllTrackedAllelesBtn");

    if (btn && menu) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            const isHidden = menu.classList.toggle("hidden");
            if (!isHidden) {
                renderTrackedAllelesList();
                if (searchInput) searchInput.focus();
            }
        });

        menu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.add("hidden");
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderTrackedAllelesList();
        });
    }

    if (selectAllBtn) {
        selectAllBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            game.trackedAlleles = [...game.discoveredAlleles];
            saveGame();
            renderTrackedAllelesList();
        });
    }

    if (deselectAllBtn) {
        deselectAllBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            game.trackedAlleles = [];
            saveGame();
            renderTrackedAllelesList();
        });
    }
}


/* =========================================================
   TRACKED TARGET SHRIMP (SPECIES) ENGINE
========================================================= */

function renderTrackedShrimpList() {
    const list = document.getElementById("trackedShrimpList");
    const label = document.getElementById("trackedShrimpBtnLabel");
    const selectAllCheckbox = document.getElementById("selectAllTrackedShrimp");
    const searchInput = document.getElementById("trackedShrimpSearch");
    if (!list || !game || !game.discovered) return;

    if (!game.trackedSpecies) game.trackedSpecies = [];

    const count = game.trackedSpecies.length;
    if (label) label.textContent = `Target Shrimp (${count})`;

    const filterText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const discovered = [...game.discovered];

    if (selectAllCheckbox) {
        selectAllCheckbox.checked = discovered.length > 0 && discovered.every(s => game.trackedSpecies.includes(s));
    }

    list.innerHTML = "";

    discovered.forEach(speciesId => {
        const data = SHRIMP[speciesId] || WILD_PATTERNS[speciesId] || { name: speciesId };
        const name = data.name;

        if (filterText && !name.toLowerCase().includes(filterText)) {
            return;
        }

        const item = document.createElement("label");
        item.className = "multi-select-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = game.trackedSpecies.includes(speciesId);

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                if (!game.trackedSpecies.includes(speciesId)) {
                    game.trackedSpecies.push(speciesId);
                }
            } else {
                game.trackedSpecies = game.trackedSpecies.filter(s => s !== speciesId);
            }
            if (label) label.textContent = `Target Shrimp (${game.trackedSpecies.length})`;
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = discovered.length > 0 && discovered.every(s => game.trackedSpecies.includes(s));
            }
            saveGame();
        });

        const span = document.createElement("span");
        span.textContent = name;

        item.appendChild(checkbox);
        item.appendChild(span);
        list.appendChild(item);
    });

    if (list.children.length === 0) {
        list.innerHTML = `<div class="small-text" style="padding: 8px; text-align: center;">No matching shrimp.</div>`;
    }
}

function setupTrackedShrimpDropdown() {
    const btn = document.getElementById("trackedShrimpBtn");
    const menu = document.getElementById("trackedShrimpMenu");
    const searchInput = document.getElementById("trackedShrimpSearch");
    const selectAllBtn = document.getElementById("selectAllTrackedShrimpBtn");
    const deselectAllBtn = document.getElementById("deselectAllTrackedShrimpBtn");

    if (btn && menu) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            const isHidden = menu.classList.toggle("hidden");
            if (!isHidden) {
                renderTrackedShrimpList();
                if (searchInput) searchInput.focus();
            }
        });

        menu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.add("hidden");
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderTrackedShrimpList();
        });
    }

    if (selectAllBtn) {
        selectAllBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            game.trackedSpecies = [...game.discovered];
            saveGame();
            renderTrackedShrimpList();
        });
    }

    if (deselectAllBtn) {
        deselectAllBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            game.trackedSpecies = [];
            saveGame();
            renderTrackedShrimpList();
        });
    }
}


/* =========================================================
   DYNAMIC SHORTCUT CONFIGURATION ENGINE
========================================================= */

function renderShortcutsConfig() {
    const grid = document.getElementById("shortcutsConfigGrid");
    if (!grid || !game || !game.shortcuts) return;

    grid.innerHTML = "";

    const actionLabels = {
        tank: "Tank Tab",
        shop: "Shop Tab",
        collection: "Collection Tab",
        genetics: "Genetics Tab",
        log: "Achievements Tab",
        settings: "Settings Tab",
        sellMode: "Toggle Sell Mode",
        favoriteTank: "Toggle Favorites",
        speed1: "Speed 1x",
        speed2: "Speed 2x",
        speed5: "Speed 5x",
        speed20: "Speed 20x",
        speed60: "Speed 60x"
    };

    for (const [action, key] of Object.entries(game.shortcuts)) {
        const label = actionLabels[action] || action;

        const item = document.createElement("div");
        item.className = "detail-item";
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.padding = "8px 12px";

        const labelSpan = document.createElement("span");
        labelSpan.style.fontSize = "13px";
        labelSpan.style.fontWeight = "bold";
        labelSpan.style.color = "var(--text)";
        labelSpan.textContent = label;
        item.appendChild(labelSpan);

        const rebindBtn = document.createElement("button");
        rebindBtn.className = "secondary-button";
        rebindBtn.style.minWidth = "75px";
        rebindBtn.style.fontSize = "12px";
        rebindBtn.style.padding = "4px 8px";

        if (rebindingAction === action) {
            rebindBtn.textContent = "Press...";
            rebindBtn.style.background = "var(--primary)";
            rebindBtn.style.color = "white";
        } else {
            rebindBtn.textContent = key || "None";
        }

        rebindBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            rebindingAction = (rebindingAction === action) ? null : action;
            renderShortcutsConfig();
        });

        item.appendChild(rebindBtn);
        grid.appendChild(item);
    }
}

function updateHelpModalShortcuts() {
    if (!game || !game.shortcuts) return;

    const helpActions = [
        "tank", "shop", "collection", "genetics", "log", "settings",
        "sellMode", "favoriteTank", "speed1", "speed2", "speed5", "speed20", "speed60"
    ];

    helpActions.forEach(action => {
        const el = document.getElementById(`help-key-${action}`);
        if (el) {
            if (rebindingAction === action) {
                el.textContent = "Press...";
                el.style.background = "var(--primary)";
                el.style.color = "white";
            } else {
                el.textContent = game.shortcuts[action] || "None";
                el.style.background = "";
                el.style.color = "";
            }
        }
    });
}

function isShortcutsBlocked() {
    const mainMenu = document.getElementById("mainMenu");
    if (mainMenu && !mainMenu.classList.contains("hidden")) return true;
    if (!gamePlaying) return true;

    const blockingModalIds = ["helpModal", "shrimpModal", "capacityModal", "foodPrepOverlay"];
    for (const id of blockingModalIds) {
        const el = document.getElementById(id);
        if (el && !el.classList.contains("hidden")) return true;
    }

    const zoomModal = document.getElementById("zoomModal");
    if (zoomModal && zoomModal.style.display === "flex") return true;

    return false;
}

/* =========================================================
   GAME TIME & BACKGROUND CATCHUP ENGINE
========================================================= */

function applyOfflineProgress() {
    if (!game || !game.lastRealTime) return;

    const now = Date.now();
    let elapsedSeconds = (now - game.lastRealTime) / 1000;
    // Cap offline time at 7 days max
    elapsedSeconds = Math.min(elapsedSeconds, 7 * 24 * 60 * 60);

    if (elapsedSeconds <= 0) return;

    // Convert to in-game minutes including current speed multiplier
    const totalInGameMinutes = (elapsedSeconds / 60) * GAME.speed;

    // Step in small 1-minute slices so breeding checks and growth trigger accurately
    const stepSize = 1; // 1 in-game minute per step
    let remainingMinutes = totalInGameMinutes;

    while (remainingMinutes > 0) {
        const chunk = Math.min(remainingMinutes, stepSize);
        advanceGameMinuteFraction(chunk);
        remainingMinutes -= chunk;
    }

    game.lastRealTime = now;
    if (elapsedSeconds >= 60) {
        addLog(`Your aquariums processed ${formatDuration(elapsedSeconds / 60)} of growth.`);
    }
}

/* =========================================================
   SHRIMP CREATION
========================================================= */

function addShrimp(
    species,
    sex = randomSex(),
    adult = false,
    parentIds = [],
    hiddenGenes = null,
    tank = null
) {
    if (!SHRIMP[species]) return null;

    const id = game.nextShrimpId++;
    const genes = hiddenGenes || generateHiddenGenes(species);
    const targetTank = tank || (game ? game.activeAquarium : "tank1") || "tank1";

    const shrimp = {
        id,
        species,
        sex,
        ageMinutes: adult ? GAME.juvenileAgeMinutes + 100 : 0,
        pattern: determineInitialPattern(species),
        hiddenGenes: genes,
        parentIds,
        pregnant: false,
        pregnancyRemaining: 0,
        pregnancyTotal: 0,
        resting: false,
        restRemaining: 0,
        saddle: adult && sex === "female" && species !== "galaxySulawesi",
        breedingCount: 0,
        x: Math.random() * 85 + 5,
        y: Math.random() * 70 + 8,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .15,
        direction: Math.random() > .5 ? 1 : -1,
        bornAt: game.minutes,
        dead: false,
        readyToBirth: false,
        pendingBabies: [],
        tank: targetTank
    };

    game.shrimp.push(shrimp);
    discover(species);
    discoverWildPattern(shrimp);
    return shrimp;
}

/* =========================================================
   HIDDEN GENETICS
========================================================= */

function generateHiddenGenes(species) {
    const data = SHRRIMP_SAFE(species);
    let a1 = species;
    let a2 = species;

    if (Math.random() < 0.30 && data.children && data.children.length > 0) {
        a2 = data.children[Math.floor(Math.random() * data.children.length)];
    }

    return { allele1: a1, allele2: a2 };
}

/* =========================================================
   PATTERN GENETICS
========================================================= */

function determineInitialPattern(species) {
    const rarity = SHRRIMP_SAFE(species).rarity;
    const wildChance = RARITY[rarity].wildChance;
    return Math.random() < wildChance ? "wild" : "solid";
}

function determineBabyPattern(mother, father, species) {
    const data = SHRRIMP_SAFE(species);
    const canHaveWildPattern = [
        "wildDavidi", "wildPalmata", "redCherry",
        "yellow", "orange", "shoko", "deepBlueNeo"
    ].includes(species);

    if (!canHaveWildPattern) return "solid";

    let wildChance = RARITY[data.rarity] ? RARITY[data.rarity].wildChance : 0.40;
    if (mother.pattern === "wild" && father.pattern === "wild") wildChance += 0.20;
    if (mother.pattern === "solid" && father.pattern === "solid") wildChance -= 0.15;

    wildChance = clamp(wildChance, 0.10, 0.90);
    return Math.random() < wildChance ? "wild" : "solid";
}

/* =========================================================
   BREEDING COMPATIBILITY
========================================================= */

function sameBreedingFamily(a, b) {
    const familyA = SHRRIMP_SAFE(a.species).family;
    const familyB = SHRRIMP_SAFE(b.species).family;

    const isolatedFamilies = ["bamboo", "scud", "crawfish", "palmata", "rednose", "vampire", "babaulti"];
    for (const iso of isolatedFamilies) {
        if (familyA === iso || familyB === iso) {
            return familyA === familyB;
        }
    }

    if (familyA === familyB) return true;
    if (familyA === "davidi" || familyB === "davidi") return true;

    const davidiFamilies = ["davidi", "red", "yellow", "green", "shoko", "deepblue", "transparent"];
    if (davidiFamilies.includes(familyA) && davidiFamilies.includes(familyB)) {
        return true;
    }

    return false;
}

function getTankCapacity(tank = "tank1") {
    if (!game) return GAME.tankCapacity;
    if (tank === "favorites") {
        const favCap = (game.favoritesTankLevel || 0) * 10;
        const vampireCount = countLiveShrimp("vampireShrimp", "favorites", true);
        return favCap + (vampireCount * 5);
    }
    const vampireCount = countLiveShrimp("vampireShrimp", tank, true);
    return GAME.tankCapacity + (vampireCount * 5);
}


function canDescendFrom(target, source) {
    if (target === source) return true;
    const visited = new Set();

    function walk(current) {
        if (visited.has(current)) return false;
        visited.add(current);
        const data = SHRRIMP_SAFE(current);

        for (const child of data.children || []) {
            if (child === target || walk(child)) return true;
        }
        return false;
    }

    return walk(source);
}

/* =========================================================
   PHENOTYPE DETERMINATION
========================================================= */

function determinePhenotype(a1, a2) {
    if (a1 === a2) return a1;

    if ((a1 === "yellow" && a2 === "orange") || (a1 === "orange" && a2 === "yellow")) {
        return "green";
    }

    if (canDescendFrom(a2, a1)) return a1;
    if (canDescendFrom(a1, a2)) return a2;

    const f1 = SHRRIMP_SAFE(a1).family;
    const f2 = SHRRIMP_SAFE(a2).family;
    if (f1 === "babaulti" || f2 === "babaulti") return "babaultiWild";
    if (f1 === "palmata" || f2 === "palmata") return "wildPalmata";

    return "wildDavidi";
}

/* =========================================================
   BREEDING CHECK
========================================================= */

function breedingCheck() {
    ALL_TANKS.forEach(tank => {
        runBreedingCheckForTank(tank);
    });
    if (game.favoritesTankUnlocked) {
        runBreedingCheckForTank("favorites");
    }
}


function runBreedingCheckForTank(tank) {
    const mCount = game.shrimp.filter(
        shrimp =>
            shrimp.sex === "male" &&
            isAdult(shrimp) &&
            !shrimp.dead &&
            shrimp.species !== "amanoShrimp" &&
            shrimp.species !== "galaxySulawesi" &&
            isShrimpInTank(shrimp, tank)
    );

    const females = game.shrimp.filter(
        shrimp =>
            shrimp.sex === "female" &&
            isAdult(shrimp) &&
            !shrimp.dead &&
            shrimp.species !== "amanoShrimp" &&
            shrimp.species !== "galaxySulawesi" &&
            !shrimp.pregnant &&
            !shrimp.readyToBirth &&
            !shrimp.resting &&
            shrimp.saddle &&
            isShrimpInTank(shrimp, tank)
    );

    if (mCount.length === 0 || females.length === 0) return;

    const extraFemale = countPlantEffects("extraFemale") > 0;
    const maxFemalesPerMale = extraFemale ? 2 : 1;

    let availableFemales = [...females];
    let breedingEvents = 0;

    for (const male of mCount) {
        if (availableFemales.length === 0) break;

        let bred = 0;
        while (bred < maxFemalesPerMale) {
            const compatible = availableFemales.filter(f => sameBreedingFamily(male, f));
            if (compatible.length === 0) break;

            const selectedFemale = compatible[Math.floor(Math.random() * compatible.length)];
            const fIndex = availableFemales.indexOf(selectedFemale);
            if (fIndex > -1) availableFemales.splice(fIndex, 1);

            const hasVampire = hasLiveShrimp("vampireShrimp", tank, true);
            const breedingChance = hasVampire ? 0.65 : 0.40;

            if (Math.random() < breedingChance) {
                makePregnant(selectedFemale, male);
                breedingEvents++;
            }
            bred++;
        }
    }

    if (breedingEvents > 0) {
        const tankName = tank === "main" ? "main aquarium" : "favorites tank";
        addLog(`${breedingEvents} female shrimp in the ${tankName} became berried.`);
    }
}

/* =========================================================
   PREGNANCY
========================================================= */

function makePregnant(female, male) {
    const species = female.species;
    const rarity = SHRRIMP_SAFE(species).rarity;
    let duration = RARITY[rarity].pregnancy;

    const pregnancyPlants = countPlantEffects("pregnancyReduction");
    duration *= Math.pow(0.85, pregnancyPlants);

    const motherTank = female.tank || "main";
    if (hasLiveShrimp("blueCrawfish", motherTank)) {
        duration *= 0.85;
    }

    female.pregnant = true;
    female.pregnancyTotal = duration;
    female.pregnancyRemaining = duration;
    female.saddle = false;
    female.breedingCount++;
    female.lastFatherSpecies = male.species;
    female.lastFatherGenes = {
        allele1: male.hiddenGenes.allele1,
        allele2: male.hiddenGenes.allele2
    };

    female.eggColor = Math.random() < 0.5 ? "yellow" : "green";

    addLog(`${displayName(female)} is now berried by a ${displayName(male)}. Pregnancy: ${Math.ceil(duration)} minutes.`);
    playBerriedSound();
}

/* =========================================================
   BIRTH PREPARATION
========================================================= */

function prepareBirth(female) {
    const fatherGenes = female.lastFatherGenes || {
        allele1: female.species,
        allele2: female.species
    };

    const father = {
        species: female.lastFatherSpecies || female.species,
        hiddenGenes: fatherGenes
    };

    const mother = female;
    const rarity = SHRRIMP_SAFE(female.species).rarity;
    const settings = RARITY[rarity];

    let babyCount = randomInt(settings.babiesMin, settings.babiesMax);
    const babyPlants = countPlantEffects("babyBoost");
    babyCount = Math.round(babyCount * Math.pow(1.15, babyPlants));

    female.pendingBabies = [];

    for (let i = 0; i < babyCount; i++) {
        const genes = inheritGenes(mother, father, female.species);
        const species = determinePhenotype(genes.allele1, genes.allele2);
        const sex = randomSex();
        const pattern = determineBabyPattern(mother, father, species);

        female.pendingBabies.push({
            species,
            sex,
            pattern,
            hiddenGenes: genes
        });
    }

    female.readyToBirth = true;
    female.pregnant = false;
    female.pregnancyRemaining = 0;
    female.pregnancyTotal = 0;

    addLog(`${displayName(female)} is ready to spawn. Click her to cull the offspring!`);
    playPregnantSound();
}

/* =========================================================
   GENE INHERITANCE
========================================================= */

function inheritGenes(mother, father, species) {
    if (mother.species === "bambooShrimp" || father.species === "bambooShrimp") {
        return { allele1: "bambooShrimp", allele2: "bambooShrimp" };
    }

    const isRedCrawfishPair = (mother.species === "redCrawfish" && father.species === "redCrawfish");
    if (isRedCrawfishPair && Math.random() < 0.05) {
        addLog("Incredibly rare! A brilliant, shiny Blue Crawfish was born!");
        return { allele1: "blueCrawfish", allele2: "blueCrawfish" };
    }

    const isKanokoRedRiliPair = (mother.species === "kanoko" && father.species === "redRili") || (mother.species === "redRili" && father.species === "kanoko");
    if (isKanokoRedRiliPair && Math.random() < 0.01) {
        addLog("Amazing! A rare mutation occurred: A Crystal Red Shrimp was born!");
        return { allele1: "crystalRed", allele2: "crystalRed" };
    }

    const hasFireRedPaintedParent = (mother.species === "fireRedPainted" || father.species === "fireRedPainted");
    if (hasFireRedPaintedParent && Math.random() < 0.05) {
        addLog("Extremely rare mutation! A Dark Blue Cherry Shrimp was born!");
        return { allele1: "darkBlueCherry", allele2: "darkBlueCherry" };
    }

    const hasDarkBlueCherryParent = (mother.species === "darkBlueCherry" || father.species === "darkBlueCherry");
    if (hasDarkBlueCherryParent && Math.random() < 0.15) {
        addLog("Dominant phenotype expressed! A Green Nessie Shrimp was born!");
        return { allele1: "greenNessie", allele2: "greenNessie" };
    }

    const hasSakuraRedAParent = (mother.species === "sakuraRedA" || father.species === "sakuraRedA");
    if (hasSakuraRedAParent && Math.random() < 0.02) {
        addLog("Extremely rare mutation! A Purple Shrimp was born!");
        return { allele1: "purple", allele2: "purple" };
    }

    const motherData = SHRRIMP_SAFE(mother.species);
    const fatherData = SHRRIMP_SAFE(father.species);
    const isLegendary = motherData.rarity === "legendary" || fatherData.rarity === "legendary";

    if (!isLegendary) {
        const throwbackChance = (mother.species === father.species) ? 0.08 : 0.15;

        if (Math.random() < throwbackChance) {
            const family = motherData.family;

            if (family === "green") {
                const throwbackSpecies = Math.random() < 0.5 ? "yellow" : "orange";
                addLog(`An ancestral throwback occurred! A wild-pattern offspring was born from ${motherData.name}.`);
                return { allele1: throwbackSpecies, allele2: "wildDavidi" };
            } else if (family === "red") {
                addLog(`An ancestral throwback occurred! A wild red offspring was born.`);
                return { allele1: "redCherry", allele2: "wildDavidi" };
            } else if (family === "yellow") {
                addLog(`An ancestral throwback occurred! A wild yellow offspring was born.`);
                return { allele1: "yellow", allele2: "wildDavidi" };
            } else if (family === "shoko") {
                addLog(`An ancestral throwback occurred! A wild shoko offspring was born.`);
                return { allele1: "shoko", allele2: "wildDavidi" };
            } else if (family === "deepblue") {
                addLog(`An ancestral throwback occurred! A wild blue offspring was born.`);
                return { allele1: "deepBlueNeo", allele2: "wildDavidi" };
            } else if (family === "palmata") {
                addLog(`An ancestral throwback occurred! A wild palmata offspring was born.`);
                return { allele1: "wildPalmata", allele2: "wildPalmata" };
            } else if (family === "babaulti") {
                addLog(`An ancestral throwback occurred! A base wild Babaulti offspring was born.`);
                return { allele1: "babaultiWild", allele2: "babaultiWild" };
            }
        }
    }

    const mAlleles = [mother.hiddenGenes.allele1, mother.hiddenGenes.allele2];
    const fAlleles = [father.hiddenGenes.allele1, father.hiddenGenes.allele2];

    let a1 = mAlleles[Math.floor(Math.random() * 2)];
    let a2 = fAlleles[Math.floor(Math.random() * 2)];

    const pureBreedBoost = (mother.species === father.species) ? 0.20 : 0.0;

    const STABILITY_BY_RARITY = {
        wild: 1.00,
        common: 0.85,
        uncommon: 0.70,
        rare: 0.45,
        epic: 0.20,
        legendary: 0.15
    };

    function processStability(allele) {
        const data = SHRIMP[allele];
        if (!data) return allele;

        let finalStability;
        if (allele === "crystalRed") {
            finalStability = 0.05;
        } else {
            const baseStability = STABILITY_BY_RARITY[data.rarity] || 1.00;
            finalStability = Math.min(1.00, baseStability + pureBreedBoost);
        }

        if (Math.random() > finalStability) {
            if (data.parents && data.parents.length > 0) {
                const parent = data.parents[Math.floor(Math.random() * data.parents.length)];
                return processStability(parent);
            }
        }
        return allele;
    }

    const oldA1 = a1;
    const oldA2 = a2;
    a1 = processStability(a1);
    a2 = processStability(a2);

    if (a1 !== oldA1) {
        addLog(`An unstable allele reverted from ${SHRRIMP_SAFE(oldA1).name} to ${SHRRIMP_SAFE(a1).name}.`);
    }
    if (a2 !== oldA2 && a1 === oldA1) {
        addLog(`An unstable allele reverted from ${SHRRIMP_SAFE(oldA2).name} to ${SHRRIMP_SAFE(a2).name}.`);
    }

    let mutationRate = 0.03;
    if (countPlantEffects("mutationBoost") > 0) mutationRate += 0.05;

    const marimoCount = countPlants("marimo");
    if (marimoCount > 0) mutationRate += (0.10 * marimoCount);

    const motherTank = mother.tank || "main";
    if (hasLiveShrimp("galaxySulawesi", motherTank)) {
        mutationRate += 0.05;
    }

    function tryMutate(allele) {
        if (Math.random() < mutationRate) {
            const data = SHRRIMP_SAFE(allele);
            if (data.children && data.children.length > 0) {
                return data.children[Math.floor(Math.random() * data.children.length)];
            }
        }
        return allele;
    }

    const mutA1 = a1;
    const mutA2 = a2;
    a1 = tryMutate(a1);
    a2 = tryMutate(a2);

    if (a1 !== mutA1) {
        addLog(`A genetic mutation occurred! An allele mutated from ${SHRRIMP_SAFE(mutA1).name} to ${SHRRIMP_SAFE(a1).name}.`);
    }
    if (a2 !== mutA2 && a1 === mutA1) {
        addLog(`A genetic mutation occurred! An allele mutated from ${SHRRIMP_SAFE(mutA2).name} to ${SHRRIMP_SAFE(a2).name}.`);
    }

    const mPheno = mother.species;
    const fPheno = father.species;
    const isGreen = (p) => p === "green" || p === "greenJade";

    if (isGreen(mPheno) && isGreen(fPheno)) {
        if ((a1 === "yellow" && a2 === "orange") || (a1 === "orange" && a2 === "yellow")) {
            if (Math.random() < 0.50) {
                const stable = generateHiddenGenes("green");
                a1 = stable.allele1;
                a2 = stable.allele2;
            }
        }
    }

    return { allele1: a1, allele2: a2 };
}

/* =========================================================
   GAME TIME
========================================================= */

// Threshold (in seconds) beyond which we run offline simulation instead of a single delta tick
const MAX_DELTA_TICK_SECONDS = 5;

function handleCatchupProgress() {
    if (!game || !gamePlaying || !game.lastRealTime) return;
    applyOfflineProgress();
    render();
}

// Catch up whenever tab/window regains focus or visibility
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        handleCatchupProgress();
    }
});

window.addEventListener("focus", () => {
    handleCatchupProgress();
});

/* =========================================================
   GAME TIME & UNPAUSED ENGINE
========================================================= */

let lastAutosaveTimestamp = Date.now();

function isGamePaused() {
    // Only pause if the main title screen is active
    const mainMenu = document.getElementById("mainMenu");
    if (mainMenu && !mainMenu.classList.contains("hidden")) return true;

    // Or if currently playing inside a full-screen minigame
    const mg1 = document.getElementById("minigameOverlay");
    if (mg1 && !mg1.classList.contains("hidden")) return true;

    const mg2 = document.getElementById("minigame2Overlay");
    if (mg2 && !mg2.classList.contains("hidden")) return true;

    const prep = document.getElementById("foodPrepOverlay");
    if (prep && !prep.classList.contains("hidden")) return true;

    return false;
}

function gameLoop() {
    const now = Date.now();
    if (!game) return;

    if (!isGamePaused()) {
        const deltaSeconds = (now - game.lastRealTime) / 1000;

        if (deltaSeconds > 0) {
            if (deltaSeconds > 3) {
                applyOfflineProgress();
            } else {
                advanceGameMinuteFraction((deltaSeconds / 60) * GAME.speed);
                game.lastRealTime = now;
            }
        }

        // Automatic background save every 60 seconds
        if (now - lastAutosaveTimestamp >= 60000) {
            saveGame();
            lastAutosaveTimestamp = now;
        }

        render();
    } else {
        game.lastRealTime = now;
    }

    requestAnimationFrame(gameLoop);
}
function advanceGameMinuteFraction(minutes, isFastForward = false) {
    game.minutes += minutes;

    const adultBambooCount = countLiveShrimp("bambooShrimp", null, true);
    if (adultBambooCount > 0) {
        game.money += 2 * minutes * adultBambooCount;
    }

    for (const shrimp of game.shrimp) {
        if (shrimp.dead) continue;

        const wasAdult = isAdult(shrimp);
        shrimp.ageMinutes += minutes;

        if (!wasAdult && isAdult(shrimp)) {
            if (shrimp.sex === "female" && shrimp.species !== "galaxySulawesi") {
                shrimp.saddle = true;
                addLog(` ${displayName(shrimp)} has matured into an adult and developed a saddle!`);
            } else {
                addLog(` ${displayName(shrimp)} has matured into an adult!`);
            }
        }

        if (shrimp.pregnant) {
            shrimp.pregnancyRemaining -= minutes;
            if (shrimp.pregnancyRemaining <= 0) {
                prepareBirth(shrimp);
            }
        }

        const marimoCount = countPlants("marimo");
        if (marimoCount > 0) {
            const driftSpeed = minutes * 1.8;
            for (let i = 0; i < marimoCount; i++) {
                const m = marimoDriftList[i];
                m.x += m.vx * driftSpeed;
                m.y += m.vy * driftSpeed;
                m.rotation += (m.vx >= 0 ? 1 : -1) * Math.abs(m.vx) * 320 * driftSpeed;

                const xMin = 12 + (i * 3);
                const xMax = 88 - (i * 3);
                const yMin = 65;
                const yMax = 82;

                if (m.x <= xMin) { m.x = xMin; m.vx = Math.abs(m.vx); }
                else if (m.x >= xMax) { m.x = xMax; m.vx = -Math.abs(m.vx); }

                if (m.y <= yMin) { m.y = yMin; m.vy = Math.abs(m.vy); }
                else if (m.y >= yMax) { m.y = yMax; m.vy = -Math.abs(m.vy); }

                if (Math.random() < 0.03) {
                    m.vx = (Math.random() - 0.5) * 0.09;
                    m.vy = (Math.random() - 0.5) * 0.03;
                }
            }
        }

        if (shrimp.resting) {
            shrimp.restRemaining -= minutes;
            if (shrimp.restRemaining <= 0) {
                shrimp.resting = false;
                if (shrimp.sex === "female" && shrimp.species !== "galaxySulawesi") {
                    shrimp.saddle = true;
                }
                addLog(`${displayName(shrimp)} has finished resting and is saddled again.`);
            }
        }

        if (!isFastForward) {
            updateShrimpMovement(shrimp, minutes);
        }
    }

    if (game.minutes - game.lastBreedingCheck >= (GAME.breedingInterval / 60)) {
        breedingCheck();
        game.lastBreedingCheck = game.minutes;
    }

    const currentDay = Math.floor(game.minutes / GAME.dayLengthMinutes);
    if (currentDay > game.lastDailyPayment) {
        const daysPassed = currentDay - game.lastDailyPayment;
        game.money += daysPassed * 5;
        game.lastDailyPayment = currentDay;
        addLog(`Daily income received: +$${daysPassed * 5}.`);
    }

    game.shrimp = game.shrimp.filter(shrimp => !shrimp.dead);
    game.selectedForSaleIds = game.selectedForSaleIds.filter(id => game.shrimp.some(s => s.id === id));
}

/* =========================================================
   SHRIMP MOVEMENT
========================================================= */

function updateShrimpMovement(shrimp, minutes) {
    const movementMod = shrimp.readyToBirth ? 0.1 : 1.6;
    const movement = minutes * movementMod;

    let pushX = 0;
    let pushY = 0;
    const minDistance = 6.0;
    const minDistanceSq = minDistance * minDistance;
    const currentTank = shrimp.tank || "main";

    for (const other of game.shrimp) {
        if (other.id === shrimp.id || other.dead || (other.tank || "main") !== currentTank) {
            continue;
        }
        const dx = shrimp.x - other.x;
        const dy = shrimp.y - other.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < minDistanceSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = ((minDistance - dist) / dist) * 0.008;
            pushX += dx * force;
            pushY += dy * force;
        }
    }

    const margin = 12.0;
    if (shrimp.x < margin) {
        pushX += (margin - shrimp.x) * 0.015;
    } else if (shrimp.x > 100 - margin) {
        pushX -= (shrimp.x - (100 - margin)) * 0.015;
    }

    if (shrimp.y < margin) {
        pushY += (margin - shrimp.y) * 0.015;
    } else if (shrimp.y > 90 - margin) {
        pushY -= (shrimp.y - (90 - margin)) * 0.015;
    }

    const maxPush = 0.2;
    const pushMagSq = pushX * pushX + pushY * pushY;
    if (pushMagSq > maxPush * maxPush) {
        const pushMag = Math.sqrt(pushMagSq);
        pushX = (pushX / pushMag) * maxPush;
        pushY = (pushY / pushMag) * maxPush;
    }

    shrimp.x += (shrimp.vx + pushX) * movement;
    shrimp.y += (shrimp.vy + pushY) * movement;

    const xMin = 4.0;
    const xMax = 92.0;
    const yMin = 8.0;
    const yMax = 82.0;

    if (shrimp.x <= xMin) {
        shrimp.x = xMin;
        shrimp.vx = Math.random() * 0.15 + 0.10;
        shrimp.direction = 1;
    } else if (shrimp.x >= xMax) {
        shrimp.x = xMax;
        shrimp.vx = -(Math.random() * 0.15 + 0.10);
        shrimp.direction = -1;
    }

    if (shrimp.y <= yMin) {
        shrimp.y = yMin;
        shrimp.vy = Math.random() * 0.08 + 0.04;
    } else if (shrimp.y >= yMax) {
        shrimp.y = yMax;
        shrimp.vy = -(Math.random() * 0.08 + 0.04);
    }

    if (Math.random() < 0.03) {
        shrimp.vx = (Math.random() - 0.5) * 0.25;
        shrimp.vy = (Math.random() - 0.5) * 0.12;
        shrimp.direction = shrimp.vx >= 0 ? 1 : -1;
    }
}

/* =========================================================
   MATURATION
========================================================= */

function isAdult(shrimp) {
    let requiredAge = GAME.juvenileAgeMinutes;
    const currentTank = shrimp.tank || "main";

    const growthPlants = countPlantEffects("growthBoost");
    requiredAge *= Math.pow(0.85, growthPlants);

    if (hasLiveShrimp("legendaryScud", currentTank)) {
        requiredAge *= 0.90;
    }
    if (hasLiveShrimp("amanoShrimp", currentTank)) {
        requiredAge *= 0.95;
    }

    return shrimp.ageMinutes >= requiredAge;
}

function lifeStage(shrimp) {
    if (isAdult(shrimp)) return "Adult";
    if (shrimp.ageMinutes >= GAME.babyAgeMinutes) return "Juvenile";
    return "Baby";
}

/* =========================================================
   DAILY / CLOCK
========================================================= */

function getDay() {
    return Math.floor(game.minutes / GAME.dayLengthMinutes) + 1;
}

function getDayMinute() {
    return game.minutes % GAME.dayLengthMinutes;
}

function formatClock() {
    const minutes = Math.floor(getDayMinute());
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return String(hours).padStart(2, "0") + ":" + String(mins).padStart(2, "0");
}

/* =========================================================
   PLANTS
========================================================= */

function getPlantPrice(id) {
    const plant = SHOP_PLANTS[id];
    if (!plant) return 0;

    if (id === "marimo") {
        const count = countPlants("marimo");
        if (count === 0) return 15750;
        if (count === 1) return 15750 * 2;
        if (count === 2) return 15750 * 2 * 3;
        return 94500;
    }
    return plant.price;
}

function buyPlant(id) {
    const plant = SHOP_PLANTS[id];
    if (!plant) return;

    const ownedCount = countPlants(id);
    const isMarimo = (id === "marimo");

    if (isMarimo && ownedCount >= 3) {
        addLog("You already own the maximum amount of Marimo balls (3/3).");
        return;
    } else if (!isMarimo && ownedCount >= 1) {
        addLog("You already own this individual upgrade plant.");
        return;
    }

    const price = getPlantPrice(id);
    if (game.money < price) {
        addLog("Not enough money.");
        return;
    }

    game.money -= price;
    game.plants.push(id);
    playSellSound();

    if (isMarimo) {
        addLog(`Purchased Marimo (${ownedCount + 1}/3)! Mutation rate increased by +10%.`);
    } else {
        addLog(`Purchased ${plant.name}.`);
    }

    lastRenderedMoney = null;
    renderShop();
}

function countPlants(id) {
    return game.plants.filter(plant => plant === id).length;
}

function countPlantEffects(effectName) {
    if (!game || !game.plants) return 0;
    return game.plants.filter(plantId => {
        const plantData = SHOP_PLANTS[plantId];
        return plantData && plantData.effect === effectName;
    }).length;
}

/* =========================================================
   TANK UPGRADES
========================================================= */

function buyNextTankUpgrade() {
    const nextIndex = (game.tankUpgradeLevel || 0) + 1;
    if (nextIndex >= TANK_UPGRADES.length) {
        addLog("You have unlocked all 10 available tanks!");
        return;
    }

    const upgrade = TANK_UPGRADES[nextIndex];
    if (game.money < upgrade.price) {
        addLog("Not enough money.");
        return;
    }

    game.money -= upgrade.price;
    playSellSound();

    game.tankUpgradeLevel = nextIndex;
    addLog(`Unlocked ${upgrade.name}! You now own ${upgrade.unlockedTanks} tanks.`);

    lastRenderedMoney = null;
    render();
    renderShop();
}

/* =========================================================
   BUY SHRIMP
========================================================= */

function buyShrimp(species, sourceBtn = null) {
    const targetTank = (game ? game.activeAquarium : "tank1") || "tank1";
    const currentTankCount = game.shrimp.filter(s => (s.tank || "tank1") === targetTank && !s.dead).length;
    const currentTankCapacity = getTankCapacity(targetTank);

    if (currentTankCount >= currentTankCapacity) {
        showCapacityWarning();
        return;
    }

    const data = SHRRIMP_SAFE(species);
    const price = SHRIMP_PRICES[species] || 10;
    if (game.money < price) {
        addLog("Not enough money.");
        return;
    }

    if (species === "galaxySulawesi" && hasLiveShrimp("galaxySulawesi")) {
        addLog("You can only own one Galaxy Sulawesi at a time!");
        return;
    }

    const isFirstTime = !game.discovered.includes(species);

    game.money -= price;
    playSellSound();

    let sex = randomSex();
    const history = game.purchaseGenderHistory || [];
    if (history.length >= 3 && history.slice(-3).every(s => s === "male")) sex = "female";
    else if (history.length >= 3 && history.slice(-3).every(s => s === "female")) sex = "male";

    if (!game.purchaseGenderHistory) game.purchaseGenderHistory = [];
    game.purchaseGenderHistory.push(sex);
    if (game.purchaseGenderHistory.length > 5) game.purchaseGenderHistory.shift();

    const shrimp = addShrimp(species, sex, true);
    if (shrimp) {
        if (shrimp.sex === "female" && species !== "galaxySulawesi") shrimp.saddle = true;
        discoverAllele(shrimp.hiddenGenes.allele1);
        discoverAllele(shrimp.hiddenGenes.allele2);
    }

    discover(species);

    if (isFirstTime) {
        if (sourceBtn) triggerShopConfetti(sourceBtn);
        playAchievementSound();
    }

    lastCollectionState = "";
    lastRenderedMoney = null;

    // Invalidate sidebar list cache and render immediately so new shrimp appears instantly!
    const listBody = document.querySelector("#movableShrimpList .movable-body");
    if (listBody) delete listBody.dataset.cache;

    saveGame();
    render();
    renderCollection();
    renderShop();

    addLog(`Purchased a ${data.name}.`);
}

/* =========================================================
   SELL SHRIMP
========================================================= */

function getShrimpSellValue(shrimp) {
    const data = SHRRIMP_SAFE(shrimp.species);
    let value = (shrimp.species === "amanoShrimp") ? 2500 : RARITY[data.rarity].value;

    if (isAdult(shrimp)) value *= 1.5;
    if (shrimp.pregnant) value *= 1.5;

    const currentTank = shrimp.tank || "main";
    if (shrimp.species !== "redCrawfish" && hasLiveShrimp("redCrawfish", currentTank)) {
        value *= 1.10;
    }

    return Math.max(1, Math.round(value));
}

function sellShrimp(id) {
    const shrimp = game.shrimp.find(s => s.id === id);
    if (!shrimp) return;

    const data = SHRRIMP_SAFE(shrimp.species);
    const value = getShrimpSellValue(shrimp);

    game.money += value;
    shrimp.dead = true;
    game.shrimp = game.shrimp.filter(s => !s.dead);

    playSellSound();

    if (game.selectedShrimpId === id) {
        game.selectedShrimpId = null;
    }

    // Check if the sold shrimp was part of the Select Mode selection
    if (game.selectedForSaleIds && game.selectedForSaleIds.includes(id)) {
        game.selectedForSaleIds = game.selectedForSaleIds.filter(selId => selId !== id);

        // If that was the only one selected, turn Select Mode OFF
        if (game.selectedForSaleIds.length === 0) {
            game.sellModeActive = false;
        }

        // Update the button counters ("Sell Selected (X)" / "Move Selected (X)")
        updateSellModeUI();
    }

    addLog(`Sold ${data.name} for $${value}.`);
    closeModal();
    saveGame();
    render();
}

function sellOldestShrimp() {
    const adults = game.shrimp
        .filter(s => !s.dead && isAdult(s))
        .sort((a, b) => b.ageMinutes - a.ageMinutes);

    if (adults.length === 0) {
        addLog("There are no adult shrimp to sell.");
        return;
    }

    sellShrimp(adults[0].id);
}

function sellOldestAdultForReplacement() {
    const adults = game.shrimp
        .filter(s => !s.dead && isAdult(s))
        .sort((a, b) => b.ageMinutes - a.ageMinutes);

    if (adults.length === 0) {
        addLog("There are no adult shrimp to sell.");
        return false;
    }

    const oldest = adults[0];
    const data = SHRRIMP_SAFE(oldest.species);
    const value = getShrimpSellValue(oldest);

    game.money += value;
    oldest.dead = true;

    if (game.selectedShrimpId === oldest.id) {
        game.selectedShrimpId = null;
    }

    addLog(`Sold oldest adult ${data.name} for $${value} to free up space.`);
    game.shrimp = game.shrimp.filter(shrimp => !shrimp.dead);
    return true;
}

/* =========================================================
   COLLECTION DISCOVERY HELPERS
========================================================= */

function discover(species) {
    if (!species) return;

    let data = SHRIMP[species] || WILD_PATTERNS[species];
    if (!data) {
        const foundKey = Object.keys(SHRIMP).find(k => k.toLowerCase() === species.toLowerCase()) ||
            Object.keys(WILD_PATTERNS).find(k => k.toLowerCase() === species.toLowerCase());
        if (foundKey) {
            species = foundKey;
            data = SHRIMP[species] || WILD_PATTERNS[species];
        } else {
            return;
        }
    }

    if (!game.discovered.includes(species)) {
        game.discovered.push(species);
        if (game.shrimp.length > 0) {
            addLog(`🦐 New shrimp variant added to collection: ${data.name}!`);
        }
    }
}

function discoverWildPattern(shrimp) {
    if (!shrimp || shrimp.pattern !== "wild") return;
    const data = SHRRIMP_SAFE(shrimp.species);
    if (!data) return;

    const family = data.family;
    if (family === "yellow") {
        if (!shrimp.wildPatternImage) {
            shrimp.wildPatternImage = Math.random() < 0.5 ? "WildY1" : "WildY2";
        }
        discover(shrimp.wildPatternImage);
    } else if (family === "red") {
        if (!shrimp.wildPatternImage) {
            shrimp.wildPatternImage = Math.random() < 0.5 ? "WildR1" : "WildR2";
        }
        discover(shrimp.wildPatternImage);
    } else if (family === "shoko") {
        discover("WildS");
    } else if (family === "deepblue") {
        discover("WildB");
    }
}

function discoverAllele(species) {
    if (!species) return;

    if (!SHRIMP[species]) {
        const foundKey = Object.keys(SHRIMP).find(k => k.toLowerCase() === species.toLowerCase());
        if (foundKey) {
            species = foundKey;
        } else {
            return;
        }
    }

    if (!game.discoveredAlleles) {
        game.discoveredAlleles = [];
    }

    if (!game.discoveredAlleles.includes(species)) {
        game.discoveredAlleles.push(species);
        addLog(`New genetic allele sequenced: ${SHRIMP[species].name}!`);
    }
}

/* =========================================================
   WILD PATTERN MAPPER
========================================================= */

function getShrimpImagePrefix(shrimp) {
    const data = SHRRIMP_SAFE(shrimp.species);

    if (shrimp.pattern === "wild") {
        const family = data.family;
        if (family === "yellow") {
            if (!shrimp.wildPatternImage) {
                shrimp.wildPatternImage = Math.random() < 0.5 ? "WildY1" : "WildY2";
            }
            return shrimp.wildPatternImage;
        }
        if (family === "red") {
            if (!shrimp.wildPatternImage) {
                shrimp.wildPatternImage = Math.random() < 0.5 ? "WildR1" : "WildR2";
            }
            return shrimp.wildPatternImage;
        }
        if (family === "shoko") return "WildS";
        if (family === "deepblue") return "WildB";
    }

    return data.image;
}

/* =========================================================
   GLOBAL ANIMATION TICKER (Replaces 100+ individual intervals)
========================================================= */
let globalShrimpFrame = 1;
setInterval(() => {
    globalShrimpFrame = globalShrimpFrame === 1 ? 2 : 1;
    const layer = document.getElementById("shrimpLayer");
    if (!layer) return;

    layer.querySelectorAll(".shrimp").forEach(el => {
        const id = Number(el.dataset.id);
        const shrimp = game.shrimp.find(s => s.id === id);
        if (!shrimp) return;

        el.dataset.frame = globalShrimpFrame;
        const img = el.querySelector(".shrimp-img");
        if (img && img.style.display !== "none") {
            const prefix = getShrimpImagePrefix(shrimp);
            img.src = `shrimp/${prefix}${globalShrimpFrame}.png`;
        }
    });
}, 750);

function createShrimpElement(shrimp) {
    const element = document.createElement("div");
    element.className = "shrimp";
    element.dataset.id = shrimp.id;
    element.dataset.frame = globalShrimpFrame;

    const bodyWrapper = document.createElement("div");
    bodyWrapper.className = "shrimp-body-wrapper";
    element.appendChild(bodyWrapper);

    const data = SHRRIMP_SAFE(shrimp.species);
    const image = document.createElement("img");
    image.className = "shrimp-img";
    image.alt = data.name;
    image.src = `shrimp/${getShrimpImagePrefix(shrimp)}${globalShrimpFrame}.png`;

    image.onerror = function () {
        image.style.display = "none";
        if (!bodyWrapper.querySelector(".css-shrimp")) {
            bodyWrapper.appendChild(createCssShrimpFallback(data.color));
        }
    };

    bodyWrapper.appendChild(image);

    const tag = document.createElement("div");
    tag.className = "shrimp-name-tag";
    tag.textContent = data.name;
    element.appendChild(tag);

    element.addEventListener("click", function (event) {
        event.stopPropagation();
        selectShrimp(shrimp.id);
    });

    return element;
}

function updateShrimpElement(element, shrimp) {
    element.style.left = shrimp.x + "%";
    element.style.top = shrimp.y + "%";

    const stage = lifeStage(shrimp);
    element.classList.remove("baby-shrimp", "juvenile-shrimp", "bamboo-shrimp");

    if (shrimp.species === "bambooShrimp") {
        element.classList.add("bamboo-shrimp");
    }

    if (stage === "Baby") {
        element.classList.add("baby-shrimp");
    } else if (stage === "Juvenile") {
        element.classList.add("juvenile-shrimp");
    }

    const bodyWrapper = element.querySelector(".shrimp-body-wrapper");
    if (bodyWrapper) {
        const flipScale = shrimp.sex === "male" ? -1 : 1;
        let scaleFactor = 1.0;

        if (isAdult(shrimp)) {
            if (shrimp.species === "galaxySulawesi") {
                scaleFactor = 1.0;
            } else if (shrimp.species === "amanoShrimp" || shrimp.species === "vampireShrimp") {
                scaleFactor = 2.55;
            } else if (shrimp.species === "legendaryScud") {
                scaleFactor = 0.75;
            } else {
                scaleFactor = (shrimp.sex === "female") ? 1.2 : 1.0;
            }
        }

        bodyWrapper.style.transform = `scaleX(${flipScale * scaleFactor}) scaleY(${scaleFactor})`;
    }

    let sellIndicator = element.querySelector(".sell-indicator");
    if (game.sellModeActive && game.selectedForSaleIds.includes(shrimp.id)) {
        element.classList.add("selected-for-sale");
        if (!sellIndicator) {
            sellIndicator = document.createElement("div");
            sellIndicator.className = "sell-indicator";
            sellIndicator.innerHTML = '<img src="emoji/dollar.png" alt="Dollar" class="ui-emoji">';
            element.appendChild(sellIndicator);
        }
    } else {
        element.classList.remove("selected-for-sale");
        if (sellIndicator) sellIndicator.remove();
    }

    let warning = element.querySelector(".birth-warning");
    if (shrimp.readyToBirth) {
        if (!warning) {
            warning = document.createElement("img");
            warning.className = "birth-warning";
            warning.src = "emoji/exclamation.png";
            warning.alt = "Spawning Warning";
            element.appendChild(warning);
        }
    } else if (warning) {
        warning.remove();
    }

    let eggCluster = bodyWrapper ? bodyWrapper.querySelector(".egg-cluster") : null;
    if ((shrimp.pregnant || shrimp.readyToBirth) && bodyWrapper) {
        if (!eggCluster) {
            eggCluster = document.createElement("div");
            for (let i = 0; i < 4; i++) {
                const egg = document.createElement("span");
                egg.className = "egg";
                eggCluster.appendChild(egg);
            }
            bodyWrapper.appendChild(eggCluster);
        }

        if (shrimp.readyToBirth) {
            eggCluster.className = "egg-cluster white-eggs";
        } else {
            const activeColorClass = (shrimp.eggColor || "green") + "-eggs";
            eggCluster.className = "egg-cluster " + activeColorClass;
        }
    } else if (eggCluster) {
        eggCluster.remove();
    }
}

/* =========================================================
   SELECT MODE & BULK MOVE / SELL CONTROLS
========================================================= */

function toggleSellMode() {
    game.sellModeActive = !game.sellModeActive;
    if (!game.sellModeActive) {
        game.selectedForSaleIds = [];
    }
    updateSellModeUI();
    renderAquarium();
}

function updateSellModeUI() {
    const btn = document.getElementById("sellModeButton");
    const moveBtn = document.getElementById("moveSelectedButton");
    const sellBtn = document.getElementById("sellSelectedButton");
    if (!btn) return;

    const count = (game.selectedForSaleIds || []).length;

    if (game.sellModeActive) {
        btn.innerHTML = `<img src="emoji/shrimp.png" alt="Select Mode" class="ui-emoji"> Select Mode : ON`;
        btn.classList.add("active");

        if (moveBtn) {
            moveBtn.classList.remove("hidden");
            moveBtn.innerHTML = `<img src="emoji/herb.png" alt="Move" class="ui-emoji"> Move Selected (${count})`;
            moveBtn.disabled = count === 0;
        }

        if (sellBtn) {
            sellBtn.classList.remove("hidden");
            sellBtn.innerHTML = `<img src="emoji/dollar.png" alt="Sell" class="ui-emoji"> Sell Selected (${count})`;
            sellBtn.disabled = count === 0;
        }
    } else {
        btn.innerHTML = `<img src="emoji/shrimp.png" alt="Select Mode" class="ui-emoji"> Select Mode : OFF`;
        btn.classList.remove("active");
        if (moveBtn) moveBtn.classList.add("hidden");
        if (sellBtn) sellBtn.classList.add("hidden");
    }
}

function showMoveSelectedModal() {
    const selectedCount = (game.selectedForSaleIds || []).length;
    if (selectedCount === 0) return;

    const currentTank = game.activeAquarium || "tank1";
    const unlockedTanks = getUnlockedTanks();
    const modal = document.getElementById("shrimpModal");
    const content = document.getElementById("modalContent");
    if (!modal || !content) return;

    let destinationTanks = [...unlockedTanks];
    if (game.favoritesTankUnlocked) {
        destinationTanks.push("favorites");
    }

    content.innerHTML = `
        <h2><img src="emoji/herb.png" alt="Move" class="ui-emoji"> Move ${selectedCount} Selected Shrimp</h2>
        <p class="small-text">Select which aquarium tank you would like to transfer your selected shrimp to.</p>
        <div id="moveTankList" class="cull-list" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
        </div>
    `;

    const listContainer = content.querySelector("#moveTankList");

    destinationTanks.forEach(tankId => {
        const isCurrent = tankId === currentTank;
        const tankCount = game.shrimp.filter(s => (s.tank || "tank1") === tankId && !s.dead).length;
        const tankCap = getTankCapacity(tankId);
        const remainingSpace = Math.max(0, tankCap - tankCount);
        const isFull = remainingSpace === 0;

        let badge = `<span style="color: var(--success); font-weight: bold;">Space: +${remainingSpace}</span>`;
        if (isCurrent) badge = `<span style="color: var(--muted); font-weight: bold;">(Current Tank)</span>`;
        else if (isFull) badge = `<span style="color: var(--danger); font-weight: bold;">(Full: 0 space)</span>`;
        else if (remainingSpace < selectedCount) badge = `<span style="color: var(--danger); font-weight: bold;">(Only ${remainingSpace} can fit)</span>`;

        const row = document.createElement("div");
        row.className = "cull-row";
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;";

        row.innerHTML = `
            <div>
                <strong>${formatTankName(tankId)}</strong>
                <div class="small-text">Population: ${tankCount} / ${tankCap} • ${badge}</div>
            </div>
        `;

        const btn = document.createElement("button");
        btn.className = "primary-button";
        btn.textContent = "Move Here";

        if (isCurrent || isFull) {
            btn.disabled = true;
            btn.style.opacity = "0.4";
            btn.style.cursor = "not-allowed";
        } else {
            // Direct event listener — guaranteed to work without scope or popup issues
            btn.addEventListener("click", () => {
                executeMoveSelected(tankId);
            });
        }

        row.appendChild(btn);
        listContainer.appendChild(row);
    });

    modal.classList.remove("hidden");
}

function executeMoveSelected(targetTank) {
    const currentTank = game.activeAquarium || "tank1";
    if (targetTank === currentTank) return;

    const selectedShrimp = game.shrimp.filter(s => (game.selectedForSaleIds || []).includes(s.id) && !s.dead);
    if (selectedShrimp.length === 0) return;

    const targetCap = getTankCapacity(targetTank);
    const targetCurrentCount = game.shrimp.filter(s => (s.tank || "tank1") === targetTank && !s.dead).length;
    const availableSpace = targetCap - targetCurrentCount;

    if (availableSpace <= 0) {
        addLog(`${formatTankName(targetTank)} is already full!`);
        return;
    }

    const moveCount = Math.min(selectedShrimp.length, availableSpace);

    for (let i = 0; i < moveCount; i++) {
        selectedShrimp[i].tank = targetTank;
    }

    addLog(`Transferred ${moveCount} shrimp from ${formatTankName(currentTank)} to ${formatTankName(targetTank)}.`);
    playKeepSound();

    // Reset selection and turn Select Mode OFF
    game.selectedForSaleIds = [];
    game.selectedShrimpId = null;
    game.sellModeActive = false;

    // Invalidate sidebar cache so the list immediately updates
    const listBody = document.querySelector("#movableShrimpList .movable-body");
    if (listBody) delete listBody.dataset.cache;

    closeModal();
    updateSellModeUI();
    saveGame();
    render();
}

function sellSelectedShrimp() {
    if (game.selectedForSaleIds.length === 0) return;

    const confirmed = confirm(`Are you sure you want to sell the ${game.selectedForSaleIds.length} selected shrimp?`);
    if (!confirmed) return;

    let totalValue = 0;
    let count = 0;

    for (const id of game.selectedForSaleIds) {
        const shrimp = game.shrimp.find(s => s.id === id);
        if (!shrimp) continue;

        const value = getShrimpSellValue(shrimp);
        totalValue += value;
        shrimp.dead = true;
        count++;

        if (game.selectedShrimpId === id) {
            game.selectedShrimpId = null;
        }
    }

    game.money += totalValue;
    addLog(`Bulk sold ${count} selected shrimp for $${totalValue}.`);

    playBigSaleSound();
    game.selectedForSaleIds = [];
    game.shrimp = game.shrimp.filter(s => !s.dead);

    updateSellModeUI();
    render();
}

/* =========================================================
   SELECTED SHRIMP
========================================================= */

function showFloatingMessage(text, shrimp) {
    const aquarium = document.getElementById("aquarium");
    if (!aquarium) return;

    const msg = document.createElement("div");
    msg.className = "shrimp-floating-bubble";
    msg.textContent = text;
    msg.style.left = shrimp.x + "%";
    msg.style.top = shrimp.y + "%";

    aquarium.appendChild(msg);
    setTimeout(() => { msg.remove(); }, 1500);
}

function selectShrimp(id) {
    const shrimp = game.shrimp.find(s => Number(s.id) === Number(id));
    if (!shrimp) return;

    const cullModal = document.getElementById("shrimpModal");
    const isCullModalActive = cullModal && !cullModal.classList.contains("hidden") && cullModal.querySelector(".cull-list");
    if (isCullModalActive) return;

    if (game.sellModeActive && shrimp.readyToBirth) {
        showFloatingMessage("You cannot sell spawning females!", shrimp);
        return;
    }

    if (shrimp.readyToBirth) {
        game.selectedShrimpId = id;
        renderSelectedShrimp();
        if (!FOOD_PREP.cullFilters) {
            FOOD_PREP.cullFilters = { allele: "all", type: "all", gender: "all", targetTank: shrimp.tank || "tank1" };
        } else {
            FOOD_PREP.cullFilters.targetTank = shrimp.tank || "tank1";
        }
        showCullModal(shrimp);
        renderMovableShrimpList();
        return;
    }

    if (game.sellModeActive) {
        const idx = game.selectedForSaleIds.indexOf(id);
        if (idx > -1) {
            game.selectedForSaleIds.splice(idx, 1);
        } else {
            game.selectedForSaleIds.push(id);
        }

        game.selectedShrimpId = id;
        renderSelectedShrimp();
        updateSellModeUI();
        renderAquarium();
        renderMovableShrimpList();
    } else {
        game.selectedShrimpId = id;
        renderSelectedShrimp();

        const tankTab = document.querySelector('[data-tab="tank"]');
        if (tankTab) tankTab.click();
        renderMovableShrimpList();
    }
}

function moveShrimpToTank(shrimpId, targetTank) {
    const shrimp = game.shrimp.find(s => Number(s.id) === Number(shrimpId));
    if (!shrimp) return;

    const currentTank = shrimp.tank || "tank1";
    if (currentTank === targetTank) return;

    const targetCap = getTankCapacity(targetTank);
    const targetCount = game.shrimp.filter(s => (s.tank || "tank1") === targetTank && !s.dead).length;

    if (targetCount >= targetCap) {
        addLog(`Cannot transfer: ${formatTankName(targetTank)} is full (${targetCount}/${targetCap})!`);
        playBtnSound();
        return;
    }

    shrimp.tank = targetTank;
    addLog(`Transferred ${displayName(shrimp)} to ${formatTankName(targetTank)}.`);
    playKeepSound();

    // Deselect shrimp once moved to another tank
    game.selectedShrimpId = null;
    lastSelectedId = null;
    lastSidebarState = "";

    // If the moved shrimp was part of the Select Mode selection:
    const numId = Number(shrimp.id);
    if (game.selectedForSaleIds && game.selectedForSaleIds.some(id => Number(id) === numId)) {
        game.selectedForSaleIds = game.selectedForSaleIds.filter(id => Number(id) !== numId);

        // If it was the only one selected, exit Select Mode
        if (game.selectedForSaleIds.length === 0) {
            game.sellModeActive = false;
        }

        // Update the button counts ("Move Selected (X)" / "Sell Selected (X)")
        updateSellModeUI();
    }

    const listBody = document.querySelector("#movableShrimpList .movable-body");
    if (listBody) delete listBody.dataset.cache;

    saveGame();
    render();
}

function formatTankName(tankId) {
    if (tankId === "favorites") return "Favorites Tank";
    const num = tankId.replace("tank", "");
    return `Tank ${num}`;
}


window.openCullModalFromSidebar = function (id) {
    const shrimp = game.shrimp.find(s => Number(s.id) === Number(id));
    if (shrimp && shrimp.readyToBirth) {
        showCullModal(shrimp);
    }
};

/* =========================================================
   SHRIMP MODAL
========================================================= */

function showShrimpModal(shrimp) {
    const modal = document.getElementById("shrimpModal");
    const content = document.getElementById("modalContent");
    const data = SHRRIMP_SAFE(shrimp.species);

    let pregnancyHTML = "";

    if (shrimp.pregnant) {
        const progress = 100 * (1 - shrimp.pregnancyRemaining / shrimp.pregnancyTotal);
        pregnancyHTML = `
            <div class="panel">
                <strong>` + icon("berried") + ` Berried</strong>
                <p>Time remaining: ${formatDuration(shrimp.pregnancyRemaining)}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${progress}%"></div>
                </div>
            </div>
        `;
    } else if (shrimp.resting) {
        pregnancyHTML = `
            <div class="panel">
                <strong>` + icon("sleep") + ` Resting</strong>
                <p>Resting for: ${formatDuration(shrimp.restRemaining)}</p>
            </div>
        `;
    } else if (shrimp.sex === "female" && isAdult(shrimp)) {
        pregnancyHTML = `
            <div class="panel">
                <strong>` + icon("egg") + ` Saddled</strong>
                <p>She is ready to be bred during the next breeding check.</p>
            </div>
        `;
    }

    content.innerHTML = `
        <h2>${data.name}</h2>
        <p>
            <strong>Rarity:</strong>
            <span class="rarity-${data.rarity}">${capitalize(data.rarity)}</span>
        </p>

        <div class="detail-list">
            <div class="detail-item">
                <span>Sex</span>
                <strong>${capitalize(shrimp.sex)}</strong>
            </div>
            <div class="detail-item">
                <span>Stage</span>
                <strong>${lifeStage(shrimp)}</strong>
            </div>
            <div class="detail-item">
                <span>Age</span>
                <strong>${Math.floor(shrimp.ageMinutes)} minutes</strong>
            </div>
            <div class="detail-item">
                <span>Pattern</span>
                <strong>${capitalize(shrimp.pattern)}</strong>
            </div>
        </div>

        ${pregnancyHTML}

        <div class="panel">
            <h3><img src="emoji/dna.png" alt="DNA" class="ui-emoji"> Genetics Profile</h3>
            <p><strong>Allele 1:</strong> ${formatAlleleDisplay(shrimp.hiddenGenes.allele1)}</p>
            <p><strong>Allele 2:</strong> ${formatAlleleDisplay(shrimp.hiddenGenes.allele2)}</p>
            <p><strong>Pattern:</strong> ${capitalize(shrimp.pattern)}</p>
        </div>

        <div class="control-row">
            <button class="danger-button" onclick="sellShrimp(${shrimp.id})">Sell Shrimp</button>
        </div>
    `;

    modal.classList.remove("hidden");
}

function closeModal() {
    activeCullFemaleId = null;
    const modal = document.getElementById("shrimpModal");
    modal.classList.add("hidden");

    const modalBox = modal.querySelector(".modal-box");
    if (modalBox) {
        modalBox.classList.remove("modal-box-fixed");
        modalBox.style.height = "";
    }
}

/* =========================================================
   CULLING MODAL SYSTEM
========================================================= */

function matchesCullFilters(baby) {
    if (!FOOD_PREP.cullFilters) return true;
    const alleleFilter = FOOD_PREP.cullFilters.allele || "all";
    const typeFilter = FOOD_PREP.cullFilters.type || "all";
    const genderFilter = FOOD_PREP.cullFilters.gender || "all";

    const matchAllele = (alleleFilter === "all" ||
        baby.hiddenGenes.allele1 === alleleFilter ||
        baby.hiddenGenes.allele2 === alleleFilter);
    const matchType = (typeFilter === "all" || baby.species === typeFilter);
    const matchGender = (genderFilter === "all" || baby.sex === genderFilter);

    return matchAllele && matchType && matchGender;
}

function showCullModal(female) {
    activeCullFemaleId = female.id;

    const modal = document.getElementById("shrimpModal");
    const modalBox = modal.querySelector(".modal-box");
    const content = document.getElementById("modalContent");

    const existingList = content.querySelector(".cull-list");
    const preservedScrollTop = existingList ? existingList.scrollTop : 0;

    content.innerHTML = "";

    // 1. Sleek Compact Header Title
    const headerRow = document.createElement("div");
    headerRow.style.display = "flex";
    headerRow.style.justifyContent = "space-between";
    headerRow.style.alignItems = "baseline";
    headerRow.style.marginRight = "25px";
    headerRow.style.marginBottom = "4px";

    const title = document.createElement("h2");
    title.textContent = "Time to cull";
    title.style.margin = "0";
    title.style.fontSize = "20px";
    headerRow.appendChild(title);

    const desc = document.createElement("span");
    desc.className = "small-text";
    desc.style.fontSize = "12px";
    desc.textContent = `Offspring from ${displayName(female)}`;
    headerRow.appendChild(desc);

    content.appendChild(headerRow);

    const hasNewShrimp = female.pendingBabies.some(baby => !game.discovered.includes(baby.species));
    const hasNewAllele = female.pendingBabies.some(baby => !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) || !game.discoveredAlleles.includes(baby.hiddenGenes.allele2));

    // Check for tracked target alleles & target shrimp in this clutch
    const trackedAllelesPresent = new Set();
    if (game.trackedAlleles && game.trackedAlleles.length > 0) {
        female.pendingBabies.forEach(b => {
            if (game.trackedAlleles.includes(b.hiddenGenes.allele1)) trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele1).name);
            if (game.trackedAlleles.includes(b.hiddenGenes.allele2)) trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele2).name);
        });
    }

    const trackedShrimpPresent = new Set();
    if (game.trackedSpecies && game.trackedSpecies.length > 0) {
        female.pendingBabies.forEach(b => {
            if (game.trackedSpecies.includes(b.species)) {
                const sName = (SHRIMP[b.species] || WILD_PATTERNS[b.species] || { name: b.species }).name;
                trackedShrimpPresent.add(sName);
            }
        });
    }

    const hasAnyTarget = trackedAllelesPresent.size > 0 || trackedShrimpPresent.size > 0;

    if (modalBox) {
        modalBox.classList.add("modal-box-fixed");
    }

    // 2. Compact Target Warning Banner
    if (hasAnyTarget) {
        const targetNotice = document.createElement("div");
        targetNotice.style.margin = "3px 0 4px 0";
        targetNotice.style.padding = "5px 10px";
        targetNotice.style.borderRadius = "7px";
        targetNotice.style.border = "1.5px solid #d47b32";
        targetNotice.style.background = "rgba(212, 123, 50, 0.16)";
        targetNotice.style.color = "var(--text)";
        targetNotice.style.fontSize = "11px";
        targetNotice.style.fontWeight = "bold";

        let noticeMsg = `${icon("shrimp")} `;
        if (trackedShrimpPresent.size > 0 && trackedAllelesPresent.size > 0) {
            noticeMsg += `<strong>Target Detected:</strong> Shrimp [<u>${Array.from(trackedShrimpPresent).join(", ")}</u>] & Alleles [<u>${Array.from(trackedAllelesPresent).join(", ")}</u>] in this clutch!`;
        } else if (trackedShrimpPresent.size > 0) {
            noticeMsg += `<strong>Target Shrimp Detected:</strong> <u>${Array.from(trackedShrimpPresent).join(", ")}</u> present in this clutch!`;
        } else {
            noticeMsg += `<strong>Target Alleles Detected:</strong> <u>${Array.from(trackedAllelesPresent).join(", ")}</u> present in this clutch!`;
        }

        targetNotice.innerHTML = noticeMsg;
        content.appendChild(targetNotice);
    }

    // ✨ New Variant / Allele Banner (Matching Green accent background)
    if (hasNewShrimp || hasNewAllele) {
        const noticeBox = document.createElement("div");
        noticeBox.style.margin = "3px 0 4px 0";
        noticeBox.style.padding = "5px 10px";
        noticeBox.style.borderRadius = "7px";
        noticeBox.style.border = "1.5px solid #52a56c";
        noticeBox.style.background = "rgba(82, 165, 108, 0.16)";
        noticeBox.style.color = "var(--text)";
        noticeBox.style.fontSize = "11px";
        noticeBox.style.fontWeight = "bold";

        let noticeText = "✨ ";
        if (hasNewShrimp && hasNewAllele) {
            noticeText += "<strong>New Variant & Allele detected!</strong> Keep them to expand collection & genetics.";
        } else if (hasNewShrimp) {
            noticeText += "<strong>New Variant detected!</strong> Keep them to unlock them in your collection.";
        } else if (hasNewAllele) {
            noticeText += "<strong>New Genetic Allele detected!</strong> Keep them to sequence their lineage.";
        }
        noticeBox.innerHTML = noticeText;
        content.appendChild(noticeBox);
    }


    // Ensure cullFilters state exists and retains selections
    if (!FOOD_PREP.cullFilters) {
        FOOD_PREP.cullFilters = { allele: "all", type: "all", gender: "all", targetTank: female.tank || "tank1" };
    }
    if (!FOOD_PREP.cullFilters.targetTank) {
        FOOD_PREP.cullFilters.targetTank = female.tank || "tank1";
    }

    const presentAlleles = new Set();
    const presentTypes = new Set();
    const presentGenders = new Set();
    female.pendingBabies.forEach(baby => {
        if (!matchesCullFilters(baby)) return;
        if (baby.hiddenGenes) {
            if (baby.hiddenGenes.allele1) presentAlleles.add(baby.hiddenGenes.allele1);
            if (baby.hiddenGenes.allele2) presentAlleles.add(baby.hiddenGenes.allele2);
        }
        if (baby.species) presentTypes.add(baby.species);
        if (baby.sex) presentGenders.add(baby.sex);
    });

    if (FOOD_PREP.cullFilters.allele !== "all" && !presentAlleles.has(FOOD_PREP.cullFilters.allele)) {
        FOOD_PREP.cullFilters.allele = "all";
    }
    if (FOOD_PREP.cullFilters.type !== "all" && !presentTypes.has(FOOD_PREP.cullFilters.type)) {
        FOOD_PREP.cullFilters.type = "all";
    }
    if (FOOD_PREP.cullFilters.gender !== "all" && !presentGenders.has(FOOD_PREP.cullFilters.gender)) {
        FOOD_PREP.cullFilters.gender = "all";
    }

    const bulkRow = document.createElement("div");
    bulkRow.className = "cull-bulk-actions";
    bulkRow.style.display = "flex";
    bulkRow.style.justifyContent = "space-between";
    bulkRow.style.alignItems = "center";
    bulkRow.style.gap = "8px";
    bulkRow.style.flexWrap = "wrap";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "6px";

    const keepAllBtn = document.createElement("button");
    keepAllBtn.className = "primary-button";
    keepAllBtn.style.padding = "5px 10px";
    keepAllBtn.style.fontSize = "12px";
    keepAllBtn.textContent = "Keep All (←)";
    keepAllBtn.addEventListener("click", () => cullKeepAll(female.id));
    buttonsContainer.appendChild(keepAllBtn);

    const sellAllBtn = document.createElement("button");
    sellAllBtn.className = "danger-button";
    sellAllBtn.style.padding = "5px 10px";
    sellAllBtn.style.fontSize = "12px";
    sellAllBtn.textContent = "Sell All (→)";
    sellAllBtn.addEventListener("click", () => cullSellAll(female.id));
    buttonsContainer.appendChild(sellAllBtn);

    bulkRow.appendChild(buttonsContainer);

    const filtersContainer = document.createElement("div");
    filtersContainer.style.display = "flex";
    filtersContainer.style.gap = "6px";
    filtersContainer.style.alignItems = "center";
    filtersContainer.style.flexWrap = "wrap";

    // 1. Destination Tank Dropdown
    const unlockedTanks = getUnlockedTanks();
    if (unlockedTanks.length > 1 || game.favoritesTankUnlocked) {
        const tankSelect = document.createElement("select");
        tankSelect.className = "secondary-button";
        tankSelect.style.padding = "4px 8px";
        tankSelect.style.fontSize = "12px";
        tankSelect.style.cursor = "pointer";
        tankSelect.style.borderRadius = "6px";
        tankSelect.style.border = "1.5px solid var(--border)";

        unlockedTanks.forEach(t => {
            const count = game.shrimp.filter(s => (s.tank || "tank1") === t && !s.dead).length;
            const cap = getTankCapacity(t);
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = `Dest: ${formatTankName(t)} (${count}/${cap})`;
            if (FOOD_PREP.cullFilters.targetTank === t) opt.selected = true;
            tankSelect.appendChild(opt);
        });

        if (game.favoritesTankUnlocked) {
            const favCount = game.shrimp.filter(s => s.tank === "favorites" && !s.dead).length;
            const favCap = getTankCapacity("favorites");
            const opt = document.createElement("option");
            opt.value = "favorites";
            opt.textContent = `Dest: ★ Favorites (${favCount}/${favCap})`;
            if (FOOD_PREP.cullFilters.targetTank === "favorites") opt.selected = true;
            tankSelect.appendChild(opt);
        }

        tankSelect.addEventListener("change", () => {
            FOOD_PREP.cullFilters.targetTank = tankSelect.value;
            showCullModal(female);
        });
        filtersContainer.appendChild(tankSelect);
    }

    // 2. Allele Filter Dropdown
    const alleleSelect = document.createElement("select");
    alleleSelect.className = "secondary-button";
    alleleSelect.style.padding = "4px 8px";
    alleleSelect.style.fontSize = "12px";
    alleleSelect.style.cursor = "pointer";
    alleleSelect.style.borderRadius = "6px";
    alleleSelect.style.border = "1.5px solid var(--border)";

    const allAllelesOpt = document.createElement("option");
    allAllelesOpt.value = "all";
    allAllelesOpt.textContent = "All Alleles";
    alleleSelect.appendChild(allAllelesOpt);

    presentAlleles.forEach(alleleId => {
        const opt = document.createElement("option");
        opt.value = alleleId;
        opt.textContent = (SHRIMP[alleleId] || { name: alleleId }).name;
        if (FOOD_PREP.cullFilters.allele === alleleId) opt.selected = true;
        alleleSelect.appendChild(opt);
    });

    alleleSelect.addEventListener("change", () => {
        FOOD_PREP.cullFilters.allele = alleleSelect.value;
        showCullModal(female);
    });
    filtersContainer.appendChild(alleleSelect);

    // 3. Type Filter Dropdown
    const typeSelect = document.createElement("select");
    typeSelect.className = "secondary-button";
    typeSelect.style.padding = "4px 8px";
    typeSelect.style.fontSize = "12px";
    typeSelect.style.cursor = "pointer";
    typeSelect.style.borderRadius = "6px";
    typeSelect.style.border = "1.5px solid var(--border)";

    const allTypesOpt = document.createElement("option");
    allTypesOpt.value = "all";
    allTypesOpt.textContent = "All Types";
    typeSelect.appendChild(allTypesOpt);

    presentTypes.forEach(typeId => {
        const opt = document.createElement("option");
        opt.value = typeId;
        opt.textContent = (SHRIMP[typeId] || WILD_PATTERNS[typeId] || { name: typeId }).name;
        if (FOOD_PREP.cullFilters.type === typeId) opt.selected = true;
        typeSelect.appendChild(opt);
    });

    typeSelect.addEventListener("change", () => {
        FOOD_PREP.cullFilters.type = typeSelect.value;
        showCullModal(female);
    });
    filtersContainer.appendChild(typeSelect);

    // 4. Gender Filter Dropdown
    const genderSelect = document.createElement("select");
    genderSelect.className = "secondary-button";
    genderSelect.style.padding = "4px 8px";
    genderSelect.style.fontSize = "12px";
    genderSelect.style.cursor = "pointer";
    genderSelect.style.borderRadius = "6px";
    genderSelect.style.border = "1.5px solid var(--border)";

    const allGendersOpt = document.createElement("option");
    allGendersOpt.value = "all";
    allGendersOpt.textContent = "All Genders";
    genderSelect.appendChild(allGendersOpt);

    presentGenders.forEach(genderId => {
        const opt = document.createElement("option");
        opt.value = genderId;
        opt.textContent = capitalize(genderId);
        if (FOOD_PREP.cullFilters.gender === genderId) opt.selected = true;
        genderSelect.appendChild(opt);
    });

    genderSelect.addEventListener("change", () => {
        FOOD_PREP.cullFilters.gender = genderSelect.value;
        showCullModal(female);
    });
    filtersContainer.appendChild(genderSelect);

    bulkRow.appendChild(filtersContainer);
    content.appendChild(bulkRow);

    const listDiv = document.createElement("div");
    listDiv.className = "cull-list";
    let renderedCount = 0;

    female.pendingBabies.forEach((baby, idx) => {
        if (!matchesCullFilters(baby)) return;

        renderedCount++;
        const babyImgPrefix = getShrimpImagePrefix(baby);
        const data = SHRRIMP_SAFE(baby.species);
        const rarity = data.rarity;
        const value = RARITY[rarity].value;

        const row = document.createElement("div");
        row.className = "cull-row";

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "cull-buttons";

        const keepBtn = document.createElement("button");
        keepBtn.className = "primary-button keep-btn";
        keepBtn.textContent = "Keep";
        keepBtn.addEventListener("click", () => cullKeep(female.id, idx));
        buttonsDiv.appendChild(keepBtn);

        const sellBtn = document.createElement("button");
        sellBtn.className = "danger-button sell-btn";
        sellBtn.textContent = `Sell ($${value})`;
        sellBtn.addEventListener("click", () => cullSell(female.id, idx));
        buttonsDiv.appendChild(sellBtn);

        row.appendChild(buttonsDiv);

        const mediaDiv = document.createElement("div");
        mediaDiv.className = "cull-media";

        const img = document.createElement("img");
        img.src = `shrimp/${babyImgPrefix}1.png`;
        img.className = "cull-baby-img";
        img.id = `cull-img-${idx}`;
        img.addEventListener("error", () => cullImageError(img, data.color));
        mediaDiv.appendChild(img);

        row.appendChild(mediaDiv);

        const infoDiv = document.createElement("div");
        infoDiv.className = "cull-info";

        const nameStrong = document.createElement("strong");
        nameStrong.textContent = data.name;
        infoDiv.appendChild(nameStrong);

        const detailsSpan = document.createElement("span");
        detailsSpan.className = "small-text";
        detailsSpan.innerHTML = `${capitalize(baby.sex)} • ${capitalize(baby.pattern)} Pattern • <span class="rarity-${rarity}">${capitalize(rarity)}</span>`;
        infoDiv.appendChild(detailsSpan);

        const genesSpan = document.createElement("span");
        genesSpan.className = "small-text";
        genesSpan.style.display = "block";
        genesSpan.style.marginTop = "4px";
        genesSpan.style.color = "var(--muted)";

        genesSpan.innerHTML = `<img src="emoji/dna.png" alt="DNA" class="ui-emoji"> Alleles: ${formatAlleleDisplay(baby.hiddenGenes.allele1)} / ${formatAlleleDisplay(baby.hiddenGenes.allele2)}`;
        infoDiv.appendChild(genesSpan);

        row.appendChild(infoDiv);

        const isNewShrimp = !game.discovered.includes(baby.species);
        const isNewAllele = !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) || !game.discoveredAlleles.includes(baby.hiddenGenes.allele2);

        if (isNewShrimp || isNewAllele) {
            const badgeContainer = document.createElement("div");
            badgeContainer.style.marginLeft = "auto";
            badgeContainer.style.marginRight = "15px";
            badgeContainer.style.display = "flex";
            badgeContainer.style.gap = "8px";
            badgeContainer.style.alignItems = "center";
            badgeContainer.style.flexShrink = "0";

            if (isNewShrimp) {
                const shrimpBadge = document.createElement("span");
                shrimpBadge.style.fontWeight = "bold";
                shrimpBadge.style.color = "var(--success)";
                shrimpBadge.style.fontSize = "13px";
                shrimpBadge.innerHTML = '<img src="emoji/shrimp.png" alt="Shrimp" class="ui-emoji"> NEW';
                badgeContainer.appendChild(shrimpBadge);
            }

            if (isNewAllele) {
                const alleleBadge = document.createElement("span");
                alleleBadge.style.fontWeight = "bold";
                alleleBadge.style.color = "var(--success)";
                alleleBadge.style.fontSize = "13px";
                alleleBadge.innerHTML = '<img src="emoji/dna.png" alt="DNA" class="ui-emoji"> NEW';
                badgeContainer.appendChild(alleleBadge);
            }

            row.appendChild(badgeContainer);
        }

        listDiv.appendChild(row);
    });

    if (renderedCount === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.className = "empty-selection";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.padding = "40px";
        emptyMsg.textContent = "No offspring match your current filter selections.";
        listDiv.appendChild(emptyMsg);
    }

    content.appendChild(listDiv);

    const newList = content.querySelector(".cull-list");
    if (newList) {
        newList.scrollTop = preservedScrollTop;
    }

    modal.classList.remove("hidden");
}

window.cullImageError = function (img, color) {
    img.style.display = "none";
    const parent = img.parentNode;
    if (!parent.querySelector(".css-shrimp")) {
        parent.appendChild(createCssShrimpFallback(color));
    }
};

function finishCullStep(female) {
    // Keep user's active filter selections intact between individual keeps/sells
    if (female.pendingBabies.length === 0) {
        completeFemaleBirth(female);
        closeModal();
    } else {
        showCullModal(female);
    }
    render();
    renderCollection();
}

window.cullKeepAll = function (femaleId) {
    const female = game.shrimp.find(s => Number(s.id) === Number(femaleId));
    if (!female || !female.pendingBabies) return;

    let fitCount = 0;
    // Use selected destination tank from dropdown if available, else female's current tank
    const motherTank = (FOOD_PREP.cullFilters && FOOD_PREP.cullFilters.targetTank) ? FOOD_PREP.cullFilters.targetTank : (female.tank || "tank1");
    const capacityLimit = getTankCapacity(motherTank);
    const matchingBabies = female.pendingBabies.filter(baby => matchesCullFilters(baby));

    while (matchingBabies.length > 0) {
        const currentCount = game.shrimp.filter(s => (s.tank || "tank1") === motherTank && !s.dead).length;
        if (currentCount >= capacityLimit) {
            const firstRemaining = matchingBabies[0];
            const originalIdx = female.pendingBabies.indexOf(firstRemaining);
            game.pendingKeepBaby = firstRemaining;
            game.pendingKeepFemale = female;
            game.pendingKeepIndex = originalIdx;
            showCapacityWarning();
            break;
        }

        const baby = matchingBabies.shift();
        const originalIdx = female.pendingBabies.indexOf(baby);

        if (originalIdx > -1) {
            const newShrimp = addShrimp(baby.species, baby.sex, false, [female.id], baby.hiddenGenes, motherTank);
            if (newShrimp) {
                newShrimp.pattern = baby.pattern;
                discoverWildPattern(newShrimp);
            }

            discoverAllele(baby.hiddenGenes.allele1);
            discoverAllele(baby.hiddenGenes.allele2);

            female.pendingBabies.splice(originalIdx, 1);
            fitCount++;
        }
    }

    if (fitCount > 0) {
        addLog(`Kept ${fitCount} filtered babies in ${formatTankName(motherTank)}.`);
    }
    playKeepSound();
    finishCullStep(female);
};


window.cullKeep = function (femaleId, idx) {
    const female = game.shrimp.find(s => Number(s.id) === Number(femaleId));
    if (!female || !female.pendingBabies || !female.pendingBabies[idx]) return;

    const baby = female.pendingBabies[idx];
    const motherTank = (FOOD_PREP.cullFilters && FOOD_PREP.cullFilters.targetTank) ? FOOD_PREP.cullFilters.targetTank : (female.tank || "tank1");
    const capacityLimit = getTankCapacity(motherTank);
    const currentCount = game.shrimp.filter(s => (s.tank || "tank1") === motherTank && !s.dead).length;

    if (currentCount >= capacityLimit) {
        game.pendingKeepBaby = baby;
        game.pendingKeepFemale = female;
        game.pendingKeepIndex = idx;
        showCapacityWarning();
        return;
    }

    const newShrimp = addShrimp(baby.species, baby.sex, false, [female.id], baby.hiddenGenes, motherTank);
    if (newShrimp) {
        newShrimp.pattern = baby.pattern;
        discoverWildPattern(newShrimp);
    }

    discoverAllele(baby.hiddenGenes.allele1);
    discoverAllele(baby.hiddenGenes.allele2);
    playKeepSound();

    female.pendingBabies.splice(idx, 1);
    finishCullStep(female);
};

window.cullSellAll = function (femaleId) {
    const female = game.shrimp.find(s => Number(s.id) === Number(femaleId));
    if (!female || !female.pendingBabies) return;

    const matchingBabies = female.pendingBabies.filter(baby => matchesCullFilters(baby));
    const hasNewShrimp = matchingBabies.some(baby => !game.discovered.includes(baby.species));
    const hasNewAllele = matchingBabies.some(baby =>
        !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) ||
        !game.discoveredAlleles.includes(baby.hiddenGenes.allele2)
    );

    // Check for target alleles in matching babies
    const trackedAllelesPresent = new Set();
    if (game.trackedAlleles && game.trackedAlleles.length > 0) {
        matchingBabies.forEach(b => {
            if (game.trackedAlleles.includes(b.hiddenGenes.allele1)) trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele1).name);
            if (game.trackedAlleles.includes(b.hiddenGenes.allele2)) trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele2).name);
        });
    }

    // Check for target shrimp variants in matching babies
    const trackedShrimpPresent = new Set();
    if (game.trackedSpecies && game.trackedSpecies.length > 0) {
        matchingBabies.forEach(b => {
            if (game.trackedSpecies.includes(b.species)) {
                const sName = (SHRIMP[b.species] || WILD_PATTERNS[b.species] || { name: b.species }).name;
                trackedShrimpPresent.add(sName);
            }
        });
    }

    const hasTarget = trackedAllelesPresent.size > 0 || trackedShrimpPresent.size > 0;

    if (hasNewShrimp || hasNewAllele || hasTarget) {
        let warningMsg = "Are you sure you want to sell all matching offspring?";

        if (trackedShrimpPresent.size > 0) {
            warningMsg += `\n\nWarning: Some offspring match your TARGET SHRIMP (${Array.from(trackedShrimpPresent).join(", ")})!`;
        }
        if (trackedAllelesPresent.size > 0) {
            warningMsg += `\n\nWarning: Some offspring carry your TARGET ALLELE(S) (${Array.from(trackedAllelesPresent).join(", ")})!`;
        }
        if (hasNewShrimp && hasNewAllele) {
            warningMsg += "\n\n✨ Warning: Some offspring contain a NEW variant and a NEW genetic allele that you have not discovered yet!";
        } else if (hasNewShrimp) {
            warningMsg += "\n\n✨ Warning: Some offspring contain a NEW variant that you have not discovered yet!";
        } else if (hasNewAllele) {
            warningMsg += "\n\n✨ Warning: Some offspring contain a NEW genetic allele that you have not discovered yet!";
        }

        const confirmed = confirm(warningMsg);
        if (!confirmed) return;
    }

    let totalValue = 0;
    let soldCount = 0;

    matchingBabies.forEach(baby => {
        const originalIdx = female.pendingBabies.indexOf(baby);
        if (originalIdx > -1) {
            const data = SHRRIMP_SAFE(baby.species);
            totalValue += RARITY[data.rarity].value;
            female.pendingBabies.splice(originalIdx, 1);
            soldCount++;
        }
    });

    game.money += totalValue;
    addLog(`Sold ${soldCount} filtered babies for $${totalValue}.`);

    playBigSaleSound();
    finishCullStep(female);
};

window.cullSell = function (femaleId, idx) {
    const female = game.shrimp.find(s => Number(s.id) === Number(femaleId));
    if (!female || !female.pendingBabies || !female.pendingBabies[idx]) return;

    const baby = female.pendingBabies[idx];
    const data = SHRRIMP_SAFE(baby.species);
    const value = RARITY[data.rarity].value;

    game.money += value;
    addLog(`Sold baby ${data.name} for $${value}.`);

    playSellSound();

    female.pendingBabies.splice(idx, 1);
    finishCullStep(female);
};

function completeFemaleBirth(female) {
    const rarity = SHRRIMP_SAFE(female.species).rarity;
    female.readyToBirth = false;
    female.pendingBabies = [];
    female.resting = true;
    female.saddle = false;

    let rest = RARITY[rarity].rest;

    const motherTank = female.tank || "main";
    if (hasLiveShrimp("redNose", motherTank)) {
        rest *= 0.80;
    }

    const restPlants = countPlantEffects("restReduction");
    rest *= Math.pow(0.85, restPlants);
    female.restRemaining = rest;

    addLog(`${displayName(female)} has finished culling and is now resting.`);

    if (game.selectedShrimpId === female.id) {
        lastSidebarState = "";
        renderSelectedShrimp();
    }
}

function isBambooShrimpUnlocked() {
    if (!game) return false;
    const commonKeys = Object.keys(SHRIMP).filter(key => SHRIMP[key].rarity === "common");
    return commonKeys.every(key => game.discovered.includes(key));
}

function isAmanoUnlocked() {
    if (!game || !game.plants) return false;
    const requiredPlants = Object.keys(SHOP_PLANTS);
    return requiredPlants.every(plantId => game.plants.includes(plantId));
}

function isSulawesiUnlocked() {
    return !!game && game.tankUpgradeLevel >= 5;
}

function isBambooUnlocked() {
    return isBambooShrimpUnlocked();
}

function isScudUnlocked() {
    return !!game && !!game.unlockedSpeeds && game.unlockedSpeeds.includes("game2");
}

function isRedCrawfishUnlocked() {
    return !!game && game.favoritesTankUnlocked === true;
}

function isRedNoseUnlocked() {
    if (!game || !game.discoveredAlleles) return false;

    const palmataSpecies = Object.keys(SHRIMP).filter(k => SHRIMP[k].family === "palmata");
    const redSpecies = Object.keys(SHRIMP).filter(k => SHRIMP[k].family === "red");

    const palmataComplete = palmataSpecies.length > 0 && palmataSpecies.every(k => game.discoveredAlleles.includes(k));
    const redComplete = redSpecies.length > 0 && redSpecies.every(k => game.discoveredAlleles.includes(k));

    return palmataComplete && redComplete;
}

function isBabaultiUnlocked() {
    if (!game || !game.discoveredAlleles) return false;
    const redSpecies = Object.keys(SHRIMP).filter(k => SHRIMP[k].family === "red");
    return redSpecies.length > 0 && redSpecies.every(k => game.discoveredAlleles.includes(k));
}

function isVampireUnlocked() {
    if (!game || !game.discoveredAlleles) return false;
    const requiredFamilies = ["red", "yellow", "deepblue", "palmata"];

    return requiredFamilies.every(family => {
        const familySpecies = Object.keys(SHRIMP).filter(key => SHRIMP[key].family === family);
        return familySpecies.length > 0 && familySpecies.every(species => game.discoveredAlleles.includes(species));
    });
}

function getFavoritesUpgradeData(level) {
    if (level > 10) return null;
    const capacity = level * 10;
    const price = Math.round(1000 * Math.pow(1.5, level - 1));
    return { level, capacity, price, name: `Favorites Tank Lv. ${level}` };
}

function buyFavoritesTankUpgrade() {
    const nextFavLevel = (game.favoritesTankLevel || 0) + 1;
    const upgrade = getFavoritesUpgradeData(nextFavLevel);
    if (!upgrade) return;

    if (game.money < upgrade.price) {
        addLog("Not enough money.");
        return;
    }

    game.money -= upgrade.price;
    playSellSound();

    game.favoritesTankLevel = nextFavLevel;
    game.favoritesTankUnlocked = true;

    const logMsg = nextFavLevel === 1
        ? "Purchased the Favorites Tank! Click a selected shrimp's star to transfer them."
        : `Upgraded Favorites Tank to Lv. ${nextFavLevel} (Capacity: ${upgrade.capacity} shrimp).`;

    addLog(logMsg);

    lastRenderedMoney = null;
    render();
}

function buySpeedUpgrade(upgrade) {
    if (game.money < upgrade.price) return;
    if (game.unlockedSpeeds.includes(upgrade.speed)) return;

    game.money -= upgrade.price;
    game.unlockedSpeeds.push(upgrade.speed);

    playSellSound();
    updateSpeedButtons();
    lastRenderedMoney = null;
    renderShop();

    addLog(`Successfully unlocked the ${upgrade.speed}x speed acceleration!`);
}

function updateSpeedButtons() {
    const speeds = {
        speed1: 1,
        speed2: 2,
        speed5: 5,
        speed20: 20,
        speed60: 60
    };

    for (const [id, value] of Object.entries(speeds)) {
        const btn = document.getElementById(id);
        if (btn) {
            const unlocked = game.unlockedSpeeds.includes(value);
            if (unlocked) {
                btn.removeAttribute("disabled");
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            } else {
                btn.setAttribute("disabled", "true");
                btn.style.opacity = "0.4";
                btn.style.cursor = "not-allowed";

                if (GAME.speed === value) {
                    GAME.speed = 1;
                    const speed1Btn = document.getElementById("speed1");
                    if (speed1Btn) speed1Btn.classList.add("active");
                    btn.classList.remove("active");
                }
            }
        }
    }
}

/* =========================================================
   SHARED SHRIMP IMAGE ZOOM
========================================================= */

let zoomAnimInterval = null;

function zoomShrimpImage(img) {
    const zModal = document.getElementById("zoomModal");
    const zImg = document.getElementById("zoomImg");
    if (!zModal || !zImg || !img) return;

    if (zoomAnimInterval) clearInterval(zoomAnimInterval);

    const src = img.currentSrc || img.src || "";
    // Extract base path (e.g., "shrimp/redcherry" from "shrimp/redcherry1.png")
    const basePath = src.replace(/[12]\.png$/, "");
    let frame = src.endsWith("2.png") ? 2 : 1;

    zImg.src = `${basePath}${frame}.png`;
    zModal.style.display = "flex";

    // Alternate frames every 500ms
    zoomAnimInterval = setInterval(() => {
        frame = (frame === 1) ? 2 : 1;
        zImg.src = `${basePath}${frame}.png`;
    }, 500);
}

/* =========================================================
   LOG SYSTEM
========================================================= */

function addLog(message) {
    if (!game) return;
    if (!game.logs) game.logs = [];

    game.logs.unshift({ time: game.minutes, message });
    game.logs = game.logs.slice(0, 100);
}

function showCapacityWarning() {
    document.getElementById("capacityModal").classList.remove("hidden");
}

/* =========================================================
   TAB SYSTEM
========================================================= */

function setupTabs() {
    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", () => {
            playBtnSound();
            document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

            button.classList.add("active");
            const tab = document.getElementById("tab-" + button.dataset.tab);
            if (tab) tab.classList.add("active");
        });
    });
}

/* =========================================================
   SPEED CONTROLS
========================================================= */

function setupSpeedControls() {
    const speeds = {
        speed1: 1,
        speed2: 2,
        speed5: 5,
        speed20: 20,
        speed60: 60
    };

    for (const [id, speed] of Object.entries(speeds)) {
        document.getElementById(id).addEventListener("click", () => {
            GAME.speed = speed;
            document.querySelectorAll(".speed-button").forEach(b => b.classList.remove("active"));
            document.getElementById(id).classList.add("active");
        });
    }
}

/* =========================================================
   UTILITIES
========================================================= */

function randomSex() {
    return Math.random() < .5 ? "male" : "female";
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function capitalize(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function displayName(shrimp) {
    const baseName = SHRRIMP_SAFE(shrimp.species).name;
    return shrimp.pattern === "wild" ? `${baseName} (Wild)` : baseName;
}

function formatDuration(minutes) {
    minutes = Math.max(0, minutes);
    const totalSeconds = Math.round(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

function formatGameMinute(minutes) {
    const dayMinute = minutes % GAME.dayLengthMinutes;
    const hours = Math.floor(dayMinute / 60);
    const mins = Math.floor(dayMinute % 60);
    return (String(hours).padStart(2, "0") + ":" + String(mins).padStart(2, "0"));
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/* =========================================================
   RESET
========================================================= */

/* =========================================================
   RESET
========================================================= */

function resetGame() {
    const confirmed = confirm("Are you sure you want to erase your aquarium and start over?");
    if (!confirmed) return;

    localStorage.removeItem(SAVE_KEY);
    game = createNewGame();

    // Reset speeds to 1x default
    GAME.speed = 1;
    document.querySelectorAll(".speed-button").forEach(b => b.classList.remove("active"));
    const speed1Btn = document.getElementById("speed1");
    if (speed1Btn) speed1Btn.classList.add("active");

    updateSpeedButtons();

    // Reset keyboard shortcuts to factory defaults
    game.shortcuts = { ...DEFAULT_SHORTCUTS };
    rebindingAction = null;
    renderShortcutsConfig();
    updateHelpModalShortcuts();

    // Sync Audio & Theme UI controls to default states
    const bgmToggle = document.getElementById("bgmToggleBtn");
    const bgmSlider = document.getElementById("bgmVolumeSlider");
    const bgmLabel = document.getElementById("bgmVolumeLabel");
    const sfxToggle = document.getElementById("sfxToggleBtn");
    const sfxSlider = document.getElementById("sfxVolumeSlider");
    const sfxLabel = document.getElementById("sfxVolumeLabel");

    const menuBgmToggle = document.getElementById("menuBgmToggleBtn");
    const menuBgmSlider = document.getElementById("menuBgmVolumeSlider");
    const menuBgmLabel = document.getElementById("menuBgmVolumeLabel");
    const menuSfxToggle = document.getElementById("menuSfxToggleBtn");
    const menuSfxSlider = document.getElementById("menuSfxVolumeSlider");
    const menuSfxLabel = document.getElementById("menuSfxVolumeLabel");

    const themeToggle = document.getElementById("themeToggleBtn");
    const themeLabel = document.getElementById("themeLabel");
    const menuThemeToggle = document.getElementById("menuThemeToggleBtn");
    const menuThemeLabel = document.getElementById("menuThemeLabel");

    function syncControls(slider, label, toggle, volume, isMuted) {
        const pct = Math.round(volume * 100) + "%";
        if (slider) slider.value = volume;
        if (label) label.textContent = pct;
        if (toggle) {
            toggle.textContent = isMuted ? "Unmute" : "Mute";
            toggle.className = isMuted ? "secondary-button" : "primary-button";
        }
    }

    syncControls(bgmSlider, bgmLabel, bgmToggle, game.bgmVolume, game.bgmMuted);
    syncControls(menuBgmSlider, menuBgmLabel, menuBgmToggle, game.bgmVolume, game.bgmMuted);
    syncControls(sfxSlider, sfxLabel, sfxToggle, game.sfxVolume, game.sfxMuted);
    syncControls(menuSfxSlider, menuSfxLabel, menuSfxToggle, game.sfxVolume, game.sfxMuted);

    document.body.classList.remove("dark-theme");
    if (themeToggle) { themeToggle.textContent = "Dark"; themeToggle.className = "secondary-button"; }
    if (themeLabel) themeLabel.textContent = "Light Mode";
    if (menuThemeToggle) { menuThemeToggle.textContent = "Dark"; menuThemeToggle.className = "secondary-button"; }
    if (menuThemeLabel) menuThemeLabel.textContent = "Light Mode";

    updateAudioVolumes();

    // Reset render caches
    lastRenderedMoney = null;
    lastCollectionState = "";
    lastSelectedId = null;
    lastSidebarState = "";

    saveGame();
    addLog("New aquarium started!");

    render();
    renderCollection();
    renderShop();
}

/* =========================================================
   INITIALIZATION
========================================================= */

function initialize() {
    loadGame();
    updateSpeedButtons();
    updateHelpModalShortcuts();
    setupTrackedAllelesDropdown();
    setupTrackedShrimpDropdown();

    // Setup Tank Dropdown Switcher
    const tankDropdown = document.getElementById("tankSelectDropdown");
    if (tankDropdown) {
        tankDropdown.addEventListener("change", (e) => {
            const newTank = e.target.value;
            if (!newTank) return;

            game.activeAquarium = newTank;
            game.selectedShrimpId = null;

            if (game.sellModeActive) {
                game.selectedForSaleIds = [];
                updateSellModeUI();
            }

            const listBody = document.querySelector("#movableShrimpList .movable-body");
            if (listBody) delete listBody.dataset.cache;

            lastSelectedId = null;
            lastSidebarState = "";

            playBtnSound();
            saveGame();
            render();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
            return;
        }

        const shrimpModal = document.getElementById("shrimpModal");
        const isCullModalOpen = shrimpModal && !shrimpModal.classList.contains("hidden") && document.querySelector(".cull-list");

        if (isCullModalOpen && activeCullFemaleId !== null) {
            const activeFemale = game.shrimp.find(s => Number(s.id) === Number(activeCullFemaleId));
            if (activeFemale && activeFemale.readyToBirth && activeFemale.pendingBabies && activeFemale.pendingBabies.length > 0) {
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    cullKeepAll(activeFemale.id);
                    return;
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    cullSellAll(activeFemale.id);
                    return;
                }
            }
        }

        if (FOOD_PREP.active) {
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                if (FOOD_PREP.stage === 1) {
                    FOOD_PREP.chop();
                } else if (FOOD_PREP.stage === 2) {
                    FOOD_PREP.blanchClick();
                }
            }
            return;
        }

        if (rebindingAction) {
            e.preventDefault();
            e.stopPropagation();

            const inputKey = e.key.toUpperCase();
            if (e.key === "Escape") {
                rebindingAction = null;
                renderShortcutsConfig();
                updateHelpModalShortcuts();
                return;
            }

            const isAlphanumeric = /^[A-Z0-9]$/.test(inputKey);
            if (!isAlphanumeric) return;

            for (const [action, key] of Object.entries(game.shortcuts)) {
                if (key === inputKey) {
                    game.shortcuts[action] = "";
                    addLog(`Cleared duplicate shortcut '${inputKey}' from ${action}.`);
                }
            }

            game.shortcuts[rebindingAction] = inputKey;
            addLog(`Assigned shortcut '${inputKey}' to ${rebindingAction}.`);
            rebindingAction = null;

            saveGame();
            renderShortcutsConfig();
            updateHelpModalShortcuts();
            return;
        }

        if (isShortcutsBlocked()) return;

        const key = e.key.toUpperCase();
        let triggeredAction = null;
        for (const [action, mappedKey] of Object.entries(game.shortcuts)) {
            if (mappedKey === key) {
                triggeredAction = action;
                break;
            }
        }

        if (triggeredAction) {
            if (triggeredAction === "tank") {
                const btn = document.querySelector('.tab-button[data-tab="tank"]');
                if (btn) btn.click();
            } else if (triggeredAction === "shop") {
                const btn = document.querySelector('.tab-button[data-tab="shop"]');
                if (btn) btn.click();
            } else if (triggeredAction === "collection") {
                const btn = document.querySelector('.tab-button[data-tab="collection"]');
                if (btn) btn.click();
            } else if (triggeredAction === "genetics") {
                const btn = document.querySelector('.tab-button[data-tab="genetics"]');
                if (btn) btn.click();
            } else if (triggeredAction === "log") {
                const btn = document.querySelector('.tab-button[data-tab="achievements"]');
                if (btn) btn.click();
            } else if (triggeredAction === "settings") {
                const btn = document.querySelector('.tab-button[data-tab="settings"]');
                if (btn) btn.click();
            } else if (triggeredAction === "sellMode") {
                toggleSellMode();
            } else if (triggeredAction === "favoriteTank") {
                if (game && game.favoritesTankUnlocked) {
                    const switchBtn = document.getElementById("switchAquariumBtn");
                    if (switchBtn && !switchBtn.classList.contains("hidden")) {
                        switchBtn.click();
                    }
                }
            } else if (triggeredAction === "speed1") {
                const btn = document.getElementById("speed1");
                if (btn && !btn.disabled) btn.click();
            } else if (triggeredAction === "speed2") {
                const btn = document.getElementById("speed2");
                if (btn && !btn.disabled && game.unlockedSpeeds.includes(2)) btn.click();
            } else if (triggeredAction === "speed5") {
                const btn = document.getElementById("speed5");
                if (btn && !btn.disabled && game.unlockedSpeeds.includes(5)) btn.click();
            } else if (triggeredAction === "speed20") {
                const btn = document.getElementById("speed20");
                if (btn && !btn.disabled && game.unlockedSpeeds.includes(20)) btn.click();
            } else if (triggeredAction === "speed60") {
                const btn = document.getElementById("speed60");
                if (btn && !btn.disabled && game.unlockedSpeeds.includes(60)) btn.click();
            }
        }
    });

    document.addEventListener("click", () => {
        if (rebindingAction !== null) {
            rebindingAction = null;
            renderShortcutsConfig();
        }
    });

    const resetShortcutsBtn = document.getElementById("resetShortcutsBtn");
    if (resetShortcutsBtn) {
        resetShortcutsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            game.shortcuts = { ...DEFAULT_SHORTCUTS };
            saveGame();
            renderShortcutsConfig();
            updateHelpModalShortcuts();
            addLog("⌨️ Keyboard shortcuts reset to defaults.");
        });
    }

    const resetShortcutsHelpBtn = document.getElementById("resetShortcutsHelpBtn");
    if (resetShortcutsHelpBtn) {
        resetShortcutsHelpBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playBtnSound();
            game.shortcuts = { ...DEFAULT_SHORTCUTS };
            saveGame();
            renderShortcutsConfig();
            updateHelpModalShortcuts();
            addLog("⌨️ Keyboard shortcuts reset to defaults.");
        });
    }

    const bgmToggle = document.getElementById("bgmToggleBtn");
    const bgmSlider = document.getElementById("bgmVolumeSlider");
    const bgmLabel = document.getElementById("bgmVolumeLabel");
    const sfxToggle = document.getElementById("sfxToggleBtn");
    const sfxSlider = document.getElementById("sfxVolumeSlider");
    const sfxLabel = document.getElementById("sfxVolumeLabel");

    const menuBgmToggle = document.getElementById("menuBgmToggleBtn");
    const menuBgmSlider = document.getElementById("menuBgmVolumeSlider");
    const menuBgmLabel = document.getElementById("menuBgmVolumeLabel");
    const menuSfxToggle = document.getElementById("menuSfxToggleBtn");
    const menuSfxSlider = document.getElementById("menuSfxVolumeSlider");
    const menuSfxLabel = document.getElementById("menuSfxVolumeLabel");

    const themeToggle = document.getElementById("themeToggleBtn");
    const themeLabel = document.getElementById("themeLabel");
    const menuThemeToggle = document.getElementById("menuThemeToggleBtn");
    const menuThemeLabel = document.getElementById("menuThemeLabel");

    const switchBtn = document.getElementById("switchAquariumBtn");

    function syncAudioControls(slider, label, toggle, volume, isMuted) {
        const pct = Math.round(volume * 100) + "%";
        if (slider) slider.value = volume;
        if (label) label.textContent = pct;
        if (toggle) {
            toggle.textContent = isMuted ? "Unmute" : "Mute";
            toggle.className = isMuted ? "secondary-button" : "primary-button";
        }
    }

    function updateSettingsUI() {
        syncAudioControls(bgmSlider, bgmLabel, bgmToggle, game.bgmVolume, game.bgmMuted);
        syncAudioControls(menuBgmSlider, menuBgmLabel, menuBgmToggle, game.bgmVolume, game.bgmMuted);
        syncAudioControls(sfxSlider, sfxLabel, sfxToggle, game.sfxVolume, game.sfxMuted);
        syncAudioControls(menuSfxSlider, menuSfxLabel, menuSfxToggle, game.sfxVolume, game.sfxMuted);

        if (game.darkModeActive) {
            document.body.classList.add("dark-theme");
            if (themeToggle) { themeToggle.textContent = "Light"; themeToggle.className = "primary-button"; }
            if (themeLabel) themeLabel.textContent = "Dark Mode";
            if (menuThemeToggle) { menuThemeToggle.textContent = "Light"; menuThemeToggle.className = "primary-button"; }
            if (menuThemeLabel) menuThemeLabel.textContent = "Dark Mode";
        } else {
            document.body.classList.remove("dark-theme");
            if (themeToggle) { themeToggle.textContent = "Dark"; themeToggle.className = "secondary-button"; }
            if (themeLabel) themeLabel.textContent = "Light Mode";
            if (menuThemeToggle) { menuThemeToggle.textContent = "Dark"; menuThemeToggle.className = "secondary-button"; }
            if (menuThemeLabel) menuThemeLabel.textContent = "Light Mode";
        }

        updateAudioVolumes();
    }

    updateSettingsUI();

    function startBgmOnInteraction() {
        bgm.play().then(() => {
            document.removeEventListener("click", startBgmOnInteraction);
        }).catch(() => {
            console.log("Autoplay blocked. Awaiting user click to initialize music.");
        });
    }
    document.addEventListener("click", startBgmOnInteraction);

    if (switchBtn) {
        switchBtn.addEventListener("click", () => {
            playBtnSound();
            game.activeAquarium = game.activeAquarium === "main" ? "favorites" : "main";
            render();
        });
    }

    if (bgmToggle) {
        bgmToggle.addEventListener("click", () => {
            playBtnSound();
            game.bgmMuted = !game.bgmMuted;
            updateSettingsUI();
            saveGame();
        });
    }

    if (menuBgmToggle) {
        menuBgmToggle.addEventListener("click", () => {
            playBtnSound();
            game.bgmMuted = !game.bgmMuted;
            updateSettingsUI();
            saveGame();
        });
    }

    if (bgmSlider) {
        bgmSlider.addEventListener("input", (e) => {
            game.bgmVolume = parseFloat(e.target.value);
            if (game.bgmVolume > 0) game.bgmMuted = false;
            updateSettingsUI();
        });
        bgmSlider.addEventListener("change", () => saveGame());
    }

    if (menuBgmSlider) {
        menuBgmSlider.addEventListener("input", (e) => {
            game.bgmVolume = parseFloat(e.target.value);
            if (game.bgmVolume > 0) game.bgmMuted = false;
            updateSettingsUI();
        });
        menuBgmSlider.addEventListener("change", () => saveGame());
    }

    if (sfxToggle) {
        sfxToggle.addEventListener("click", () => {
            game.sfxMuted = !game.sfxMuted;
            updateSettingsUI();
            playBtnSound();
            saveGame();
        });
    }

    if (menuSfxToggle) {
        menuSfxToggle.addEventListener("click", () => {
            game.sfxMuted = !game.sfxMuted;
            updateSettingsUI();
            playBtnSound();
            saveGame();
        });
    }

    if (sfxSlider) {
        sfxSlider.addEventListener("input", (e) => {
            game.sfxVolume = parseFloat(e.target.value);
            if (game.sfxVolume > 0) game.sfxMuted = false;
            updateSettingsUI();
        });
        sfxSlider.addEventListener("change", () => {
            playBtnSound();
            saveGame();
        });
    }

    if (menuSfxSlider) {
        menuSfxSlider.addEventListener("input", (e) => {
            game.sfxVolume = parseFloat(e.target.value);
            if (game.sfxVolume > 0) game.sfxMuted = false;
            updateSettingsUI();
        });
        menuSfxSlider.addEventListener("change", () => {
            playBtnSound();
            saveGame();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            playBtnSound();
            game.darkModeActive = !game.darkModeActive;
            updateSettingsUI();
            saveGame();
        });
    }

    if (menuThemeToggle) {
        menuThemeToggle.addEventListener("click", () => {
            playBtnSound();
            game.darkModeActive = !game.darkModeActive;
            updateSettingsUI();
            saveGame();
        });
    }

    const menuPlayBtn = document.getElementById("menuPlayBtn");
    const menuSettingsBtn = document.getElementById("menuSettingsBtn");
    const menuExitBtn = document.getElementById("menuExitBtn");

    const menuSettingsPanel = document.getElementById("menuSettingsPanel");
    if (menuSettingsPanel) {
        menuSettingsPanel.style.display = "none";
        menuSettingsPanel.classList.add("hidden");
    }

    if (menuPlayBtn) {
        menuPlayBtn.addEventListener("click", () => {
            playBtnSound();
            const menu = document.getElementById("mainMenu");
            if (menu) menu.classList.add("hidden");
            document.body.style.overflow = "";
            gamePlaying = true;
            game.lastRealTime = Date.now();

            if (typeof checkAchievements === "function") {
                checkAchievements();
            }
        });
    }

    if (menuSettingsBtn) {
        menuSettingsBtn.addEventListener("click", () => {
            playBtnSound();
            const settingsPanel = document.getElementById("menuSettingsPanel");
            if (settingsPanel) {
                const isHidden = settingsPanel.classList.toggle("hidden");
                settingsPanel.style.display = isHidden ? "none" : "block";
            }
        });
    }

    if (menuExitBtn) {
        menuExitBtn.addEventListener("click", () => {
            playBtnSound();
            window.close();
            setTimeout(() => {
                alert("Exit command received. You can now safely close this browser tab.");
            }, 100);
        });
    }

    const zoomModal = document.getElementById("zoomModal");
    if (zoomModal) {
        zoomModal.onclick = function () {
            if (zoomAnimInterval) {
                clearInterval(zoomAnimInterval);
                zoomAnimInterval = null;
            }
            zoomModal.style.display = "none";
        };
    }

    const helpBtn = document.getElementById("helpBtn");
    const helpModal = document.getElementById("helpModal");
    const closeHelpModal = document.getElementById("closeHelpModal");

    if (helpBtn && helpModal) {
        helpBtn.addEventListener("click", () => {
            playBtnSound();
            helpModal.classList.remove("hidden");
        });
    }

    if (closeHelpModal && helpModal) {
        closeHelpModal.addEventListener("click", () => {
            playBtnSound();
            helpModal.classList.add("hidden");
        });
    }

    const aquarium = document.getElementById("aquarium");
    if (aquarium) {
        aquarium.addEventListener("click", () => {
            game.selectedShrimpId = null;
            renderSelectedShrimp();

            const body = document.querySelector("#movableShrimpList .movable-body");
            if (body) {
                delete body.dataset.cache;
                renderMovableShrimpList();
            }
        });
    }

    const listBtn = document.getElementById("shrimpListBtn");
    if (listBtn) {
        listBtn.addEventListener("click", () => {
            const movableWin = document.getElementById("movableShrimpList");
            if (movableWin) {
                const isHidden = movableWin.classList.toggle("hidden");
                if (isHidden) {
                    listBtn.textContent = "📋 List of Shrimp";
                } else {
                    listBtn.textContent = "📋 Close Shrimp List";
                    const body = movableWin.querySelector(".movable-body");
                    if (body) delete body.dataset.cache;
                    renderMovableShrimpList();
                }
            }
        });
    }

    const sortBtn = document.getElementById("sortShrimpListBtn");
    if (sortBtn) {
        const sortLabels = {
            HighValue: "Sort: High Value",
            LowValue: "Sort: Low Value",
            Name: "Sort: Name",
            Gender: "Sort: Gender",
            Age: "Sort: Age",
            Status: "Sort: Status",
            Rarity: "Sort: Rarity"
        };

        const currentSort = game.shrimpListSort || "HighValue";
        sortBtn.textContent = sortLabels[currentSort] || "Sort: High Value";

        sortBtn.addEventListener("click", () => {
            const cycle = ["HighValue", "LowValue", "Name", "Gender", "Age", "Status", "Rarity"];
            const currentIndex = cycle.indexOf(game.shrimpListSort || "HighValue");
            const nextIndex = (currentIndex + 1) % cycle.length;
            const nextSort = cycle[nextIndex];

            game.shrimpListSort = nextSort;
            sortBtn.textContent = sortLabels[nextSort];

            const body = document.querySelector("#movableShrimpList .movable-body");
            if (body) delete body.dataset.cache;
            renderMovableShrimpList();
        });
    }

    document.addEventListener("click", (e) => {
        const helpRebindBtn = e.target.closest(".help-rebind-btn");
        if (helpRebindBtn) {
            e.stopPropagation();
            playBtnSound();
            const action = helpRebindBtn.dataset.action;
            rebindingAction = (rebindingAction === action) ? null : action;
            renderShortcutsConfig();
            updateHelpModalShortcuts();
        }
    });

    const listBody = document.querySelector("#movableShrimpList .movable-body");
    if (listBody) {
        listBody.addEventListener("click", (e) => {
            const item = e.target.closest(".shrimp-list-item");
            if (item) {
                selectShrimp(Number(item.dataset.id));
            }
        });
    }

    const collectionContainer = document.getElementById("collection");
    if (collectionContainer) {
        collectionContainer.addEventListener("click", (event) => {
            const img = event.target.closest(".collection-shrimp-img");
            if (img) {
                event.stopPropagation();
                zoomShrimpImage(img);
            }
        });
    }

    const selectedShrimpContainer = document.getElementById("selectedShrimp");
    if (selectedShrimpContainer) {
        selectedShrimpContainer.addEventListener("click", (event) => {
            const cullBtn = event.target.closest("#sidebarCullBtn");
            const sellBtn = event.target.closest("#sidebarSellBtn");
            const favBtn = event.target.closest("#sidebarFavoriteBtn");
            const sidebarImg = event.target.closest("#selectedShrimpSidebarImg");

            if (cullBtn) {
                const shrimp = game.shrimp.find(s => Number(s.id) === Number(game.selectedShrimpId));
                if (shrimp && shrimp.readyToBirth) {
                    FOOD_PREP.cullFilters = { allele: "all", type: "all", gender: "all" };
                    showCullModal(shrimp);
                }
            } else if (sellBtn) {
                if (game.selectedShrimpId !== null) {
                    sellShrimp(game.selectedShrimpId);
                }
            } else if (favBtn) {
                toggleFavoriteShrimp(game.selectedShrimpId);
            } else if (sidebarImg) {
                event.stopPropagation();
                zoomShrimpImage(sidebarImg);
            }
        });
    }

    const initialMenu = document.getElementById("mainMenu");
    if (initialMenu && !initialMenu.classList.contains("hidden")) {
        document.body.style.overflow = "hidden";
    }

    setupTabs();
    setupSpeedControls();

    const headerSaveBtn = document.getElementById("headerSaveBtn");
    if (headerSaveBtn) {
        headerSaveBtn.addEventListener("click", () => {
            playBtnSound();
            saveGame();
            alert("Progress saved successfully!");
        });
    }

    const headerSaveExitBtn = document.getElementById("headerSaveExitBtn");
    if (headerSaveExitBtn) {
        headerSaveExitBtn.addEventListener("click", () => {
            playBtnSound();
            saveGame();
            alert("Progress saved successfully!");

            const menu = document.getElementById("mainMenu");
            if (menu) {
                menu.classList.remove("hidden");
                const settingsPanel = document.getElementById("menuSettingsPanel");
                if (settingsPanel) {
                    settingsPanel.classList.add("hidden");
                    settingsPanel.style.display = "none";
                }
            }

            document.body.style.overflow = "hidden";
            gamePlaying = false;
            game.selectedShrimpId = null;
            renderSelectedShrimp();
        });
    }

    const resetBtn = document.getElementById("resetButton");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            playBtnSound();
            resetGame();
        });
    }

    const closeModBtn = document.getElementById("closeModal");
    if (closeModBtn) {
        closeModBtn.addEventListener("click", () => {
            playBtnSound();
            closeModal();
        });
    }

    const sellModeBtn = document.getElementById("sellModeButton");
    if (sellModeBtn) {
        sellModeBtn.addEventListener("click", () => {
            playBtnSound();
            toggleSellMode();
        });
    }

    const moveSelectedBtn = document.getElementById("moveSelectedButton");
    if (moveSelectedBtn) {
        moveSelectedBtn.addEventListener("click", () => {
            playBtnSound();
            showMoveSelectedModal();
        });
    }

    const sellSelectedBtn = document.getElementById("sellSelectedButton");
    if (sellSelectedBtn) {
        sellSelectedBtn.addEventListener("click", () => {
            sellSelectedShrimp();
        });
    }

    updateSellModeUI();

    const openShopBtn = document.getElementById("openShopButton");
    if (openShopBtn) {
        openShopBtn.addEventListener("click", () => {
            const capModal = document.getElementById("capacityModal");
            if (capModal) capModal.classList.add("hidden");
            const shopTab = document.querySelector('[data-tab="shop"]');
            if (shopTab) shopTab.click();
        });
    }

    // Minigame 1 Handlers
    const playMinigameBtn = document.getElementById("playMinigameBtn");
    if (playMinigameBtn) {
        playMinigameBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME.start();
        });
    }

    const minigameBackBtn = document.getElementById("minigameBackBtn");
    if (minigameBackBtn) {
        minigameBackBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME.finishGame();
        });
    }

    const minigameRetryBtn = document.getElementById("minigameRetryBtn");
    if (minigameRetryBtn) {
        minigameRetryBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME.start();
        });
    }

    const minigameReturnBtn = document.getElementById("minigameReturnBtn");
    if (minigameReturnBtn) {
        minigameReturnBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME.stop();
        });
    }

    // Minigame 2 Handlers
    const playMinigame2Btn = document.getElementById("playMinigame2Btn");
    if (playMinigame2Btn) {
        playMinigame2Btn.addEventListener("click", () => {
            playBtnSound();
            document.getElementById("minigame2Overlay").classList.remove("hidden");
            document.getElementById("minigame2Selection").classList.remove("hidden");
            document.getElementById("minigame2Game").classList.add("hidden");
        });
    }

    const minigame2EasyBtn = document.getElementById("minigame2EasyBtn");
    if (minigame2EasyBtn) {
        minigame2EasyBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME2.start("easy");
        });
    }

    const minigame2HardBtn = document.getElementById("minigame2HardBtn");
    if (minigame2HardBtn) {
        minigame2HardBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME2.start("hard");
        });
    }

    const minigame2CancelBtn = document.getElementById("minigame2CancelBtn");
    if (minigame2CancelBtn) {
        minigame2CancelBtn.addEventListener("click", () => {
            playBtnSound();
            document.getElementById("minigame2Overlay").classList.add("hidden");
            game.lastRealTime = Date.now();
            render();
        });
    }

    const minigame2BackBtn = document.getElementById("minigame2BackBtn");
    if (minigame2BackBtn) {
        minigame2BackBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME2.finishGame();
        });
    }

    const minigame2RetryBtn = document.getElementById("minigame2RetryBtn");
    if (minigame2RetryBtn) {
        minigame2RetryBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME2.start(MINIGAME2.mode);
        });
    }

    const minigame2ReturnBtn = document.getElementById("minigame2ReturnBtn");
    if (minigame2ReturnBtn) {
        minigame2ReturnBtn.addEventListener("click", () => {
            playBtnSound();
            MINIGAME2.stop();
        });
    }

    // Food Prep Handlers
    const playFoodPrepBtn = document.getElementById("playFoodPrepBtn");
    if (playFoodPrepBtn) {
        playFoodPrepBtn.addEventListener("click", () => {
            playBtnSound();
            document.getElementById("foodPrepOverlay").classList.remove("hidden");
            document.getElementById("foodPrepIntro").classList.remove("hidden");
            document.getElementById("foodPrepGame").classList.add("hidden");
        });
    }

    const startFoodPrepBtn = document.getElementById("startFoodPrepBtn");
    if (startFoodPrepBtn) {
        startFoodPrepBtn.addEventListener("click", () => {
            playBtnSound();
            FOOD_PREP.start();
        });
    }

    const foodPrepCancelBtn = document.getElementById("foodPrepCancelBtn");
    if (foodPrepCancelBtn) {
        foodPrepCancelBtn.addEventListener("click", () => {
            playBtnSound();
            document.getElementById("foodPrepOverlay").classList.add("hidden");
            game.lastRealTime = Date.now();
            render();
        });
    }

    const foodPrepBackBtn = document.getElementById("foodPrepBackBtn");
    if (foodPrepBackBtn) {
        foodPrepBackBtn.addEventListener("click", () => {
            playBtnSound();
            FOOD_PREP.stop();
        });
    }

    const chopBtn = document.getElementById("chopBtn");
    if (chopBtn) {
        chopBtn.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            FOOD_PREP.chop();
        });
    }

    const blanchBtn = document.getElementById("blanchBtn");
    if (blanchBtn) {
        blanchBtn.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            FOOD_PREP.blanchClick();
        });
    }

    const foodPrepRetryBtn = document.getElementById("foodPrepRetryBtn");
    if (foodPrepRetryBtn) {
        foodPrepRetryBtn.addEventListener("click", () => {
            playBtnSound();
            FOOD_PREP.start();
        });
    }

    const foodPrepReturnBtn = document.getElementById("foodPrepReturnBtn");
    if (foodPrepReturnBtn) {
        foodPrepReturnBtn.addEventListener("click", () => {
            playBtnSound();
            FOOD_PREP.stop();
        });
    }

    const submitPelletsBtn = document.getElementById("submitPelletsBtn");
    if (submitPelletsBtn) {
        submitPelletsBtn.addEventListener("click", () => {
            playBtnSound();
            FOOD_PREP.finishGame();
        });
    }

    const sellOldBtn = document.getElementById("sellOldButton");
    if (sellOldBtn) {
        sellOldBtn.addEventListener("click", () => {
            playBtnSound();

            // Close the capacity modal and the culling modal
            const capModal = document.getElementById("capacityModal");
            if (capModal) capModal.classList.add("hidden");
            closeModal();

            // Switch view to the Tank tab
            const tankTab = document.querySelector('.tab-button[data-tab="tank"]');
            if (tankTab) tankTab.click();

            // Turn on Select Mode so you can choose which shrimp to sell or move
            game.sellModeActive = true;
            updateSellModeUI();
            render();

            addLog("Select Mode activated: Click shrimp in the tank to move them to another tank or sell them.");
        });
    }

    const exportSaveBtn = document.getElementById("exportSaveBtn");
    if (exportSaveBtn) {
        exportSaveBtn.addEventListener("click", () => {
            playBtnSound();
            exportSaveFile();
        });
    }

    const importSaveBtn = document.getElementById("importSaveBtn");
    const importSaveFileInput = document.getElementById("importSaveFileInput");
    if (importSaveBtn && importSaveFileInput) {
        importSaveBtn.addEventListener("click", () => {
            playBtnSound();
            importSaveFileInput.click();
        });

        importSaveFileInput.addEventListener("change", (e) => {
            importSaveFile(e);
        });
    }

    const clearLogBtn = document.getElementById("clearLog");
    if (clearLogBtn) {
        clearLogBtn.addEventListener("click", () => {
            game.logs = [];
            renderLog();
        });
    }

    window.addEventListener("beforeunload", (event) => {
        if (game && gamePlaying) {
            saveGame();
            event.preventDefault();
            event.returnValue = "";
        }
    });

    render();
    renderCollection();
    renderShop();
    gameLoop();
}

/* =========================================================
   SAVE FILE EXPORT & IMPORT SYSTEM
========================================================= */

function exportSaveFile() {
    if (!game) return;
    saveGame(); // Ensure current minute is saved

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(game, null, 2));
    const downloadAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);

    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shrimply_genetics_save_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addLog("💾 Save file exported to your downloads.");
}

function importSaveFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Basic validation check
            if (typeof importedData !== "object" || importedData === null || !Array.isArray(importedData.shrimp)) {
                alert("Invalid save file! Please make sure this is a valid Shrimply Genetics JSON save.");
                return;
            }

            const confirmed = confirm("Are you sure you want to load this save file? Your current aquarium will be replaced.");
            if (!confirmed) return;

            localStorage.setItem(SAVE_KEY, JSON.stringify(importedData));
            loadGame();

            // Sync controls & cached elements
            updateSpeedButtons();
            updateHelpModalShortcuts();
            if (typeof renderShortcutsConfig === "function") renderShortcutsConfig();

            lastRenderedMoney = null;
            lastCollectionState = "";
            lastSelectedId = null;
            lastSidebarState = "";

            render();
            renderCollection();
            renderShop();

            addLog("📁 Save file loaded successfully!");
            alert("Save file loaded successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to parse the save file. Please make sure it is a valid .json file.");
        } finally {
            event.target.value = ""; // Reset input so you can re-import if needed
        }
    };
    reader.readAsText(file);
}

/* =========================================================
   START
========================================================= */

initialize();