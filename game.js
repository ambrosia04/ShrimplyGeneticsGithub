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
  speedDown: ",",
  speedUp: ".",
  tank1: "1",
  tank2: "2",
  tank3: "3",
  tank4: "4",
  tank5: "5",
  tank6: "6",
  tank7: "7",
  tank8: "8",
  tank9: "9",
  tank10: "0",
};

// Tracking active rebinding key actions
let rebindingAction = null;

// Independent drift physics for up to 3 Marimo balls
const marimoDriftList = [
  { x: 35, y: 76, vx: 0.045, vy: 0.012, rotation: 0, size: 48 },
  { x: 50, y: 79, vx: -0.05, vy: -0.015, rotation: 45, size: 44 },
  { x: 65, y: 74, vx: 0.038, vy: 0.018, rotation: 90, size: 52 },
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
  totalTanks: 10,
};

const ALL_TANKS = [
  "tank1",
  "tank2",
  "tank3",
  "tank4",
  "tank5",
  "tank6",
  "tank7",
  "tank8",
  "tank9",
  "tank10",
];

/* =========================================================
   SHOP
========================================================= */

const SHOP_SHRIMP = [
  { id: "redCherry", requiredDiscoveries: 0 },
  { id: "yellow", requiredDiscoveries: 2 },
  { id: "orange", requiredDiscoveries: 4 },
  { id: "shoko", requiredDiscoveries: 8 },
  { id: "wildPalmata", requiredDiscoveries: 12 },
  { id: "sakuraRedA", requiredDiscoveries: 16 },
  { id: "deepBlueNeo", requiredDiscoveries: 22 },
];

const SHOP_PLANTS = {
  breedingMoss: {
    name: "Christmas Moss",
    price: 850,
    description:
      "Each adult male can successfully breed up to 2 females during a breeding check.",
    effect: "extraFemale",
  },
  berriedPlant: {
    name: "Amazon Frogbit",
    price: 1800,
    description: "Reduces female resting/cooldown time by 15%.",
    effect: "restReduction",
  },
  pregnancyPlant: {
    name: "Java Moss",
    price: 3200,
    description: "Reduces pregnancy duration by 15%.",
    effect: "pregnancyReduction",
  },
  babyPlant: {
    name: "Water Sprite",
    price: 5500,
    description: "Increases babies born by 15%.",
    effect: "babyBoost",
  },
  growthPlant: {
    name: "Hornwort",
    price: 9200,
    description: "Shrimp mature 15% faster.",
    effect: "growthBoost",
  },
  mutationPlant: {
    name: "Mutation Algae",
    price: 16000,
    description:
      "Alters the water chemistry to double the baseline genetic mutation rate (increases it by 5%).",
    effect: "mutationBoost",
  },
  autoNursery: {
    name: "Automated Nursery",
    price: 32000,
    description:
      "Unlocks the 'Nursery Harvest' button. Auto-sells duplicate tank offspring for cash while opening a cull menu for only new variants, new alleles, and target shrimp.",
    effect: "autoNursery",
  },
  marimo: {
    name: "Marimo",
    price: 25000,
    description:
      "Makes the shrimp happy, increasing the genetic mutation rate (increases it by 10%).",
    effect: "superMutationBoost",
  },
};

/* =========================================================
   FAVORITES TANK DECOR & PLANT CONFIGURATION
========================================================= */

const SHOP_DECOR = {
  // Standard Background Plants
  plant_bg1: {
    id: "plant_bg1",
    name: "Limnophila Sessiflora",
    width: 140,
    minWidth: 60,
    maxWidth: 300,
    isPlant: true,
    image: "plants/planbg1.png",
    desc: "Background aquarium stem flora.",
  },
  plant_bg2: {
    id: "plant_bg2",
    name: "Java Fern and Driftwood",
    width: 150,
    minWidth: 60,
    maxWidth: 300,
    isPlant: true,
    image: "plants/planbg2.png",
    desc: "Rooted aquatic wood plant.",
  },

  // Installed Plant Upgrades
  breedingMoss: {
    id: "breedingMoss",
    name: "Christmas Moss",
    width: 160,
    minWidth: 60,
    maxWidth: 300,
    isPlant: true,
    image: "plants/breedingMoss.png",
    desc: "Breeding boost moss patch.",
  },
  pregnancyPlant: {
    id: "pregnancyPlant",
    name: "Java Moss",
    width: 160,
    minWidth: 60,
    maxWidth: 300,
    isPlant: true,
    image: "plants/pregnancyMoss.png",
    desc: "Pregnancy booster moss.",
  },
  babyPlant: {
    id: "babyPlant",
    name: "Water Sprite",
    width: 140,
    minWidth: 60,
    maxWidth: 300,
    isPlant: true,
    image: "plants/babyPlant.png",
    desc: "Offspring booster plant.",
  },
  growthPlant: {
    id: "growthPlant",
    name: "Hornwort",
    width: 140,
    minWidth: 60,
    maxWidth: 300,
    isPlant: true,
    image: "plants/growthPlant.png",
    desc: "Maturation booster plant.",
  },

  // Purchasable Decor Items
  driftwood: {
    id: "driftwood",
    name: "Ancient Driftwood",
    price: 35000,
    width: 120,
    minWidth: 50,
    maxWidth: 260,
    image: "decor/driftwood.png",
    desc: "A seasoned, gnarly piece of aquatic bogwood.",
  },
  dragon_stone: {
    id: "dragon_stone",
    name: "Dragon Stone",
    price: 50000,
    width: 90,
    minWidth: 40,
    maxWidth: 220,
    image: "decor/dragon_stone.png",
    desc: "Clay-like stone with natural pores and crevices.",
  },
  castle: {
    id: "castle",
    name: "Sunken Castle Ruins",
    price: 85000,
    width: 120,
    minWidth: 50,
    maxWidth: 260,
    image: "decor/castle.png",
    desc: "A forgotten medieval citadel claimed by water.",
  },
  buddha: {
    id: "buddha",
    name: "Zen Buddha Statue",
    price: 120000,
    width: 90,
    minWidth: 40,
    maxWidth: 220,
    image: "decor/buddha.png",
    desc: "Brings serenity to your prize shrimp.",
  },
  shipwreck: {
    id: "shipwreck",
    name: "Pirate Galleon Wreck",
    price: 200000,
    width: 150,
    minWidth: 60,
    maxWidth: 320,
    image: "decor/shipwreck.png",
    desc: "A barnacle-encrusted pirate ship hull.",
  },
  neon_sign: {
    id: "neon_sign",
    name: "Cyber Neon Sign",
    price: 300000,
    width: 90,
    minWidth: 40,
    maxWidth: 200,
    image: "decor/neon_sign.png",
    desc: "Electrifying underwater neon glow.",
  },
};

function isFavoritesMaxed() {
  return Boolean(game && (game.favoritesTankLevel || 0) >= 10);
}

function getDefaultFavoritesDecor() {
  const list = [
    {
      id: "plant_bg1",
      uid: "default_bg1",
      x: 15,
      y: 94,
      width: 140,
      zIndex: 1,
    },
    {
      id: "plant_bg2",
      uid: "default_bg2",
      x: 85,
      y: 94,
      width: 150,
      zIndex: 2,
    },
  ];

  const favPlants =
    game && game.plants && game.plants.favorites ? game.plants.favorites : [];
  let z = 3;
  favPlants.forEach((plantId) => {
    if (SHOP_DECOR[plantId]) {
      const data = SHOP_DECOR[plantId];
      list.push({
        id: plantId,
        uid: "plant_" + plantId,
        x: 25 + z * 12,
        y: 94,
        width: data.width || 140,
        zIndex: z++,
      });
    }
  });

  return list;
}

/* =========================================================
   TANK UPGRADES
========================================================= */

const TANK_UPGRADES = [
  { unlockedTanks: 1, price: 0, name: "Starter Aquarium (Tank 1)" },
  { unlockedTanks: 2, price: 400, name: "Second Aquarium (Tank 2)" },
  { unlockedTanks: 3, price: 1500, name: "Third Aquarium (Tank 3)" },
  { unlockedTanks: 4, price: 3500, name: "Fourth Aquarium (Tank 4)" },
  { unlockedTanks: 5, price: 9000, name: "Fifth Aquarium (Tank 5)" },
  { unlockedTanks: 6, price: 20000, name: "Sixth Aquarium (Tank 6)" },
  { unlockedTanks: 7, price: 42000, name: "Seventh Aquarium (Tank 7)" },
  { unlockedTanks: 8, price: 80000, name: "Eighth Aquarium (Tank 8)" },
  { unlockedTanks: 9, price: 150000, name: "Ninth Aquarium (Tank 9)" },
  { unlockedTanks: 10, price: 275000, name: "Master Breeder (Tank 10)" },
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
// SHRIMP OVERHAUL
const SPEED_UPGRADES = [
  {
    speed: 2,
    price: 500,
    name: "2x Time Acceleration",
    desc: "Unlock 2x game speed to accelerate breeding checks.",
  },
  {
    speed: 5,
    price: 6000,
    name: "5x Time Acceleration",
    desc: "Unlock 5x game speed to accelerate breeding checks.",
  },
  {
    speed: 20,
    price: 45000,
    name: "20x Time Acceleration",
    desc: "Unlock 20x game speed to speed up growth rates.",
  },
  {
    speed: 60,
    price: 125000,
    name: "60x Time Acceleration",
    desc: "Unlock 60x game speed for maximum breeding warp.",
  },
  {
    speed: "game",
    price: 5000,
    name: `${icon("controller")} Evolution Console`,
    desc: "Unlocks an action minigame to play and earn extra cash!",
  },
  {
    speed: "game2",
    price: 10000,
    name: `${icon("microscope")} Clado Scanner Console`,
    desc: "Unlocks a minigame about identifying cladocera to earn extra cash!!",
  },
];

/* =========================================================
   GAME STATE & REUSABLE LOOKUP HELPERS
========================================================= */

let game = null;
let lastSelectedId = null;
let lastSidebarState = "";
let lastRenderedMoney = null;
let activeCullFemaleId = null;
let gamePlaying = false;

function isShrimpInTank(shrimp, tank = "tank1") {
  return (shrimp.tank || "tank1") === tank;
}

function hasLiveShrimp(species, tank = null, adultOnly = false) {
  if (!game || !game.shrimp) return false;
  return game.shrimp.some(
    (s) =>
      !s.dead &&
      s.species === species &&
      (!tank || isShrimpInTank(s, tank)) &&
      (!adultOnly || isAdult(s)),
  );
}

function countLiveShrimp(species, tank = null, adultOnly = false) {
  if (!game || !game.shrimp) return 0;
  return game.shrimp.filter(
    (s) =>
      !s.dead &&
      s.species === species &&
      (!tank || isShrimpInTank(s, tank)) &&
      (!adultOnly || isAdult(s)),
  ).length;
}
// SHRIMP OVERHAUL
function createNewGame() {
  return {
    money: GAME.startingMoney,
    minutes: 0,
    realPlaytimeSeconds: 0,
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
    tankFilterAlleles: [],
    tankFilterSpecies: [],
    collectionPage: 1, // SHRIMP OVERHAUL
    geneticsPage: 1, // SHRIMP OVERHAUL
    purchasedHints: [],
    minigame1HighScore: 0,
    minigame2HighScore: 0,
    favoritesDecor: [], // Stores: [{ id, uid, x, y, zIndex }]
    ownedDecor: [],
    shortcuts: { ...DEFAULT_SHORTCUTS },
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
    if (game.favoritesTankUnlocked === undefined)
      game.favoritesTankUnlocked = false;
    if (game.favoritesTankLevel === undefined) game.favoritesTankLevel = 0;
    if (game.purchaseGenderHistory === undefined)
      game.purchaseGenderHistory = [];
    if (!game.trackedAlleles) game.trackedAlleles = [];
    if (!game.trackedSpecies) game.trackedSpecies = [];
    if (game.realPlaytimeSeconds === undefined) game.realPlaytimeSeconds = 0;
    if (!game.tankFilterAlleles) game.tankFilterAlleles = [];
    if (!game.tankFilterSpecies) game.tankFilterSpecies = [];
    if (game.collectionPage === undefined) game.collectionPage = 1; // SHRIMP OVERHAUL
    if (game.geneticsPage === undefined) game.geneticsPage = 1; // SHRIMP OVERHAUL
    if (game.minigame1HighScore === undefined) game.minigame1HighScore = 0;
    if (game.minigame2HighScore === undefined) game.minigame2HighScore = 0;
    if (!game.purchasedHints) game.purchasedHints = [];
    if (!game.favoritesDecor) game.favoritesDecor = [];
    if (!game.ownedDecor) game.ownedDecor = [];

    if (game.purchasedHints) {
      game.purchasedHints = game.purchasedHints.filter((k) =>
        isLineUnlockedForHints(k),
      );
    }

    if (!game.shortcuts) {
      game.shortcuts = { ...DEFAULT_SHORTCUTS };
    } else {
      if (game.shortcuts.log === "L") game.shortcuts.log = "A";
      if (game.shortcuts.settings === "A") game.shortcuts.settings = "J";

      // Clean up obsolete speed keys if present from older versions
      delete game.shortcuts.speed1;
      delete game.shortcuts.speed2;
      delete game.shortcuts.speed5;
      delete game.shortcuts.speed20;
      delete game.shortcuts.speed60;

      // Merge any missing defaults (including speedDown, speedUp, and tank1-tank10)
      for (const key of Object.keys(DEFAULT_SHORTCUTS)) {
        if (game.shortcuts[key] === undefined) {
          game.shortcuts[key] = DEFAULT_SHORTCUTS[key];
        }
      }
    }

    // Convert legacy plant arrays to per-tank plant mapping
    if (Array.isArray(game.plants)) {
      const oldPlants = [...game.plants];
      game.plants = { tank1: oldPlants };
    }
    if (typeof game.plants !== "object" || game.plants === null) {
      game.plants = {};
    }
    ALL_TANKS.concat(["favorites"]).forEach((t) => {
      if (!game.plants[t]) game.plants[t] = [];
    });

    for (const s of game.shrimp) {
      if (!s.hiddenGenes || !s.hiddenGenes.allele1) {
        s.hiddenGenes = generateHiddenGenes(s.species);
      }
      if (
        isAdult(s) &&
        s.sex === "female" &&
        s.species !== "galaxySulawesi" &&
        s.species !== "zombieShrimp" &&
        !s.pregnant &&
        !s.resting &&
        !s.readyToBirth &&
        !s.saddle
      ) {
        s.saddle = true;
      }
      // Ensure no existing female zombies have saddles
      if (s.species === "zombieShrimp" && s.sex === "female") {
        s.saddle = false;
      }
    }

    /* =========================================================
           SAFE BACKWARD COMPATIBLE MULTI-TANK MIGRATION
        ========================================================= */
    const oldUpgradeToNewLevel = {
      0: 0,
      1: 0,
      2: 1,
      3: 2,
      4: 4,
      5: 9,
    };

    // Perform one-time tier conversion for legacy saves ONLY
    if (game.saveVersion === undefined || game.saveVersion < 2) {
      const generalShrimp = game.shrimp.filter((s) => s.tank !== "favorites");
      const tanksNeededForShrimp = Math.max(
        1,
        Math.ceil(generalShrimp.length / GAME.tankCapacity),
      );
      const minLevelForShrimp = Math.min(9, tanksNeededForShrimp - 1);

      const oldLevel = game.tankUpgradeLevel || 0;
      const convertedLevel =
        oldUpgradeToNewLevel[oldLevel] !== undefined
          ? oldUpgradeToNewLevel[oldLevel]
          : oldLevel;
      game.tankUpgradeLevel = Math.min(
        9,
        Math.max(convertedLevel, minLevelForShrimp),
      );

      const totalUnlockedTanks = Math.min(
        10,
        Math.max(1, (game.tankUpgradeLevel || 0) + 1),
      );

      // Distribute only legacy shrimp that do not have a tank assigned yet
      generalShrimp.forEach((s, index) => {
        if (!s.tank || s.tank === "main") {
          const tankIndex = Math.min(
            totalUnlockedTanks,
            Math.floor(index / GAME.tankCapacity) + 1,
          );
          s.tank = `tank${tankIndex}`;
        }
      });

      game.saveVersion = 2;
    }

    // Validate tank assignment for each shrimp without overwriting custom placements
    const unlockedTanksList = getUnlockedTanks();
    for (const s of game.shrimp) {
      if (
        !s.tank ||
        (s.tank !== "favorites" && !unlockedTanksList.includes(s.tank))
      ) {
        s.tank = "tank1";
      }
    }

    // Ensure active aquarium selection is valid
    if (
      !game.activeAquarium ||
      game.activeAquarium === "main" ||
      (!unlockedTanksList.includes(game.activeAquarium) &&
        game.activeAquarium !== "favorites")
    ) {
      game.activeAquarium = "tank1";
    }

    applyOfflineProgress();

    addLog("Welcome back to your aquarium!");
  } catch (error) {
    console.error(error);
    if (!game) game = createNewGame();
  }
}

/* =========================================================
   BLACK MARKET & BREEDER'S JOURNAL SYSTEM
========================================================= */

// Informant active dialogue state
let currentInformantDialogue = null;

// Base prices per tier (wilds excluded from purchase)
const HINT_BASE_PRICES = {
  common: 550,
  uncommon: 800,
  rare: 1500,
  epic: 4500,
  legendary: 15000,
};

// Unlocks once you have 20 discovered varieties
function isBlackMarketUnlocked() {
  if (!game || !game.discovered) return false;
  return game.discovered.length >= 20;
}

// Check if a tier has locked hints waiting on wildCaridinaCantonensis discovery
function hasPendingCantonensisHintsForTier(tier) {
  if (!game || (game.discovered && game.discovered.includes("wildCaridinaCantonensis"))) {
    return false;
  }
  return Object.keys(SHRIMP).some((k) => {
    const s = SHRIMP[k];
    if (s.rarity !== tier || !s.hint_text) return false;
    if (game.purchasedHints.includes(k) || game.discovered.includes(k)) return false;

    const isCantonensisBranch =
      ["cantonensis", "tiger", "bee", "tibee", "boa", "raccoon"].includes(s.family) ||
      k === "raccoonShrimp" ||
      k === "orangeEyeTiger";

    return isCantonensisBranch && k !== "wildCaridinaCantonensis";
  });
}

function areAllHintsPurchased() {
  if (!game || !game.purchasedHints) return false;
  // If wildCaridinaCantonensis is not yet discovered, there are still pending hints to unlock!
  if (!game.discovered || !game.discovered.includes("wildCaridinaCantonensis")) {
    return false;
  }
  const tiers = ["common", "uncommon", "rare", "epic", "legendary"];
  for (const tier of tiers) {
    const remaining = getCandidatesForTier(tier);
    if (remaining.length > 0) return false;
  }
  return true;
}

// Check if a species is eligible for Black Market rumors
function isLineUnlockedForHints(species) {
  const data = SHRIMP[species];
  if (!data || !data.hint_text) return false;

  // 1. Gate all Cantonensis, Tiger, Bee, TiBee, Boa, and descendant strains until wildCaridinaCantonensis is discovered
  const isCantonensisBranch =
    ["cantonensis", "tiger", "bee", "tibee", "boa", "raccoon"].includes(data.family) ||
    species === "raccoonShrimp" ||
    species === "orangeEyeTiger";

  if (isCantonensisBranch && species !== "wildCaridinaCantonensis") {
    const hasCantonensisDiscovered =
      game.discovered && game.discovered.includes("wildCaridinaCantonensis");
    if (!hasCantonensisDiscovered) {
      return false;
    }
  }

  // 2. Metallic Boa color variants require Metallic Boa (Black) hint or discovery first
  const boaOffspring = [
    "metallicBoaRed",
    "metallicBoaYellow",
    "metallicBoaOrange",
    "metallicBoaGreen",
    "metallicBoaBlue",
    "metallicBoaPurple",
  ];
  if (boaOffspring.includes(species)) {
    const hasBlackBoa =
      (game.purchasedHints &&
        game.purchasedHints.includes("metallicBoaBlack")) ||
      (game.discovered && game.discovered.includes("metallicBoaBlack"));
    if (!hasBlackBoa) {
      return false;
    }
  }

  return true;
}

// Get candidate hints for a specific tier
function getCandidatesForTier(tier) {
  return Object.keys(SHRIMP).filter((k) => {
    const s = SHRIMP[k];
    return (
      s.rarity === tier &&
      Boolean(s.hint_text) &&
      isLineUnlockedForHints(k) &&
      !game.purchasedHints.includes(k) &&
      !game.discovered.includes(k)
    );
  });
}

// Calculate current exponential price per tier
function getTierHintPrice(tier) {
  const boughtInTier = (game.purchasedHints || []).filter(
    (k) => SHRIMP[k] && SHRIMP[k].rarity === tier,
  ).length;
  const basePrice = HINT_BASE_PRICES[tier] || 1000;
  return Math.round(basePrice * Math.pow(1.06, boughtInTier));
}

// Variable to block clicks during the animation
let isInformantBusy = false;

function buyHintForTier(tier) {
  if (isInformantBusy) return;

  const candidates = getCandidatesForTier(tier);

  if (candidates.length === 0) {
    if (hasPendingCantonensisHintsForTier(tier)) {
      currentInformantDialogue = `"My contacts are out searching. Discover that wild mountain stream jumper first."`;
    } else {
      currentInformantDialogue = `"My contacts don't have any more leads on this species for now."`;
    }
    renderBlackMarket();
    return;
  }

  const price = getTierHintPrice(tier);
  if (game.money < price) {
    currentInformantDialogue = `"You don't have enough cash for this ${capitalize(tier)} rumor, pal."`;
    renderBlackMarket();
    return;
  }

  // Lock interaction for 1 second
  isInformantBusy = true;

  // Pick one random candidate from the unrevealed pool (NO repeats, NO discovered)
  const chosenKey = candidates[Math.floor(Math.random() * candidates.length)];
  const hintText = SHRIMP[chosenKey].hint_text;

  game.money -= price;
  game.purchasedHints.push(chosenKey);

  // Check for "What a gossip" achievement immediately
  if (typeof checkAchievements === "function") {
    checkAchievements();
  }

  // Trigger NPC jump animation
  const keeperImg = document.querySelector(".bm-shopkeeper-img");
  if (keeperImg) {
    keeperImg.classList.remove("npc-bounce");
    void keeperImg.offsetWidth; // Force reflow
    keeperImg.classList.add("npc-bounce");
  }

  // Set dialogue to show the bought hint
  currentInformantDialogue = `I've been told this: "${hintText}"`;

  playSellSound();
  addLog(`Purchased a ${capitalize(tier)} rumor from the Informant!`);

  lastRenderedMoney = null;
  lastRenderedShopState = "";
  lastCollectionState = "";

  saveGame();
  renderBlackMarket();

  // Release lock after 1 second
  setTimeout(() => {
    isInformantBusy = false;
    renderBlackMarket();
  }, 1000);
}

function renderBlackMarket() {
  const moneyEl = document.getElementById("blackMarketMoney");
  if (moneyEl) moneyEl.textContent = `$${Math.floor(game.money)}`;

  const dialogue = document.getElementById("informantDialogue");
  const actions = document.getElementById("informantActionArea");
  const overlay = document.getElementById("blackMarketOverlay");
  if (!dialogue || !actions || !overlay) return;

  const allHintsMaxed =
    typeof areAllHintsPurchased === "function" && areAllHintsPurchased();

  if (allHintsMaxed) {
    dialogue.textContent =
      currentInformantDialogue ||
      `"I may have no more information for you, but I have some goods you may like."`;
  } else {
    dialogue.textContent =
      currentInformantDialogue ||
      `"Choose a rarity tier and pay the fee. I'll tell you what my contacts know."`;
  }

  const tiers = ["common", "uncommon", "rare", "epic", "legendary"];
  actions.innerHTML = "";

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "bm-buttons-grid";

tiers.forEach((tier) => {
    const candidates = getCandidatesForTier(tier);
    const isMax = candidates.length === 0;
    const isContacting = isMax && hasPendingCantonensisHintsForTier(tier);
    const price = getTierHintPrice(tier);
    const canAfford = game.money >= price;

    const btn = document.createElement("button");
    btn.className = `primary-button bm-tier-btn rarity-btn-${tier}`;

    if (isContacting) {
      // Pending discovery of wildCaridinaCantonensis
      btn.innerHTML = `
        <span class="rarity-${tier}">${capitalize(tier)}</span>
        <strong style="font-size: 11px; display: inline-flex; align-items: center; justify-content: center; gap: 3px; margin-top: 3px; color: var(--muted);">
          <img src="emoji/lock.png" alt="Lock" class="ui-emoji" style="width: 13px !important; height: 13px !important; margin: 0 !important;"> Contacting...
        </strong>
      `;
      btn.disabled = true;
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
    } else if (isMax) {
      btn.innerHTML = `<span class="rarity-${tier}">${capitalize(tier)}</span><br><strong style="font-size: 11px; opacity: 0.7;">(MAX)</strong>`;
      btn.disabled = isInformantBusy;
      btn.addEventListener("click", () => {
        if (isInformantBusy) return;
        currentInformantDialogue = allHintsMaxed
          ? `"I may have no more information for you, but I have some goods you may like."`
          : `"My contacts don't have any more leads on this species for now."`;
        renderBlackMarket();
      });
    } else {
      btn.innerHTML = `<span class="rarity-${tier}">${capitalize(tier)}</span><br><strong>$${price}</strong>`;
      btn.disabled = !canAfford || isInformantBusy;
      btn.addEventListener("click", () => {
        buyHintForTier(tier);
      });
    }

    buttonsWrapper.appendChild(btn);
  });

  actions.appendChild(buttonsWrapper);

  // Big Center GOODS Button
  let centerWrapper = document.getElementById("bmGoodsCenterWrapper");
  if (allHintsMaxed) {
    if (!centerWrapper) {
      centerWrapper = document.createElement("div");
      centerWrapper.id = "bmGoodsCenterWrapper";
      centerWrapper.className = "bm-goods-center-wrapper";
      overlay.appendChild(centerWrapper);
    }
    centerWrapper.innerHTML = `
            <button id="bmGoodsBtn" class="primary-button bm-goods-btn">
                <img src="emoji/shrimp.png" alt="Goods" class="ui-emoji" style="width: 24px; height: 24px; vertical-align: -3px;"> GOODS
            </button>
        `;
    centerWrapper.querySelector("#bmGoodsBtn").addEventListener("click", () => {
      playBtnSound();
      openBmGoodsModal();
    });
  } else if (centerWrapper) {
    centerWrapper.remove();
  }
}

function openBmGoodsModal() {
  const modal = document.getElementById("bmGoodsModal");
  const container = document.getElementById("bmGoodsListContainer");
  if (!modal || !container) return;

  container.innerHTML = "";

  // List of Black Market goods (with fallback to zombieF1.png if M2 doesn't exist yet)
  const goods = [
    {
      id: "zombieShrimp",
      name: "Zombie Shrimp (Male Breeder)",
      price: 250000,
      image: "shrimp/zombieM2.png",
      fallbackImage: "shrimp/zombieF1.png",
      description:
        "A reanimated male specimen. Breeds exclusively with Green Nessies! Males sell for $10, while female offspring sell for $500,000.",
    },
  ];

  goods.forEach((item) => {
    const canAfford = game.money >= item.price;
    const card = document.createElement("div");
    card.className = "shop-card";
    card.style.cssText =
      "display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; gap: 15px;";

    card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='${item.fallbackImage}';" style="width: 65px; height: 50px; object-fit: contain;">
                <div>
                    <h3 style="margin: 0 0 4px 0; color: var(--text);">${item.name}</h3>
                    <div class="small-text">${item.description}</div>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div class="shop-price" style="font-size: 16px; margin-bottom: 6px; color: #2ecc71;">$${item.price.toLocaleString()}</div>
                <button class="primary-button buy-goods-btn" ${!canAfford ? "disabled" : ""}>
                    Purchase
                </button>
            </div>
        `;

    card.querySelector(".buy-goods-btn").addEventListener("click", () => {
      playBtnSound();
      showSpecialPurchaseModal(item.id, item.price);
    });

    container.appendChild(card);
  });

  modal.classList.remove("hidden");
}

function showSpecialPurchaseModal(speciesId = "zombieShrimp", price = 250000) {
  const modal = document.getElementById("shrimpModal");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;

  const data = SHRRIMP_SAFE(speciesId);
  const unlockedTanks = getUnlockedTanks();
  let destinationTanks = [...unlockedTanks];
  if (game.favoritesTankUnlocked) {
    destinationTanks.push("favorites");
  }

  const canAfford = game.money >= price;

  content.innerHTML = `
        <h2 style="color: #2ecc71;"><img src="emoji/shrimp.png" alt="Special" class="ui-emoji"> Destination Tank for ${data.name}</h2>
        <p class="small-text">Price: <strong style="color: #2ecc71;">$${price.toLocaleString()}</strong></p>
        <p class="small-text">Select which aquarium tank you want to deliver this shrimp into:</p>
        
        <div id="specialTankList" class="cull-list" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;"></div>
    `;

  const listContainer = content.querySelector("#specialTankList");

  destinationTanks.forEach((tankId) => {
    const tankCount = game.shrimp.filter(
      (s) => (s.tank || "tank1") === tankId && !s.dead,
    ).length;
    const tankCap = getTankCapacity(tankId);
    const remainingSpace = Math.max(0, tankCap - tankCount);
    const isFull = remainingSpace === 0;

    const row = document.createElement("div");
    row.className = "cull-row";
    row.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;";

    row.innerHTML = `
            <div>
                <strong>${formatTankName(tankId)}</strong>
                <div class="small-text">Population: ${tankCount} / ${tankCap} • <span style="color: ${isFull ? "var(--danger)" : "var(--success)"}; font-weight: bold;">Space: +${remainingSpace}</span></div>
            </div>
        `;

    const btn = document.createElement("button");
    btn.className = "primary-button";
    btn.textContent = `Deliver to ${formatTankName(tankId)}`;

    if (isFull || !canAfford) {
      btn.disabled = true;
      btn.style.opacity = "0.4";
      btn.style.cursor = "not-allowed";
    } else {
      btn.addEventListener("click", () => {
        executeSpecialPurchase(speciesId, price, tankId);
      });
    }

    row.appendChild(btn);
    listContainer.appendChild(row);
  });

  modal.classList.remove("hidden");
}

function executeSpecialPurchase(speciesId, price, targetTank) {
  if (game.money < price) {
    addLog("Not enough money.");
    return;
  }

  const targetCap = getTankCapacity(targetTank);
  const targetCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === targetTank && !s.dead,
  ).length;
  if (targetCount >= targetCap) {
    addLog(`${formatTankName(targetTank)} is already full!`);
    return;
  }

  game.money -= price;
  playSellSound();

  const shrimp = addShrimp(
    speciesId,
    "male",
    true,
    [],
    { allele1: speciesId, allele2: speciesId },
    targetTank,
  );
  discover(speciesId);

  addLog(
    `Purchased a Male Zombie Shrimp (placed in ${formatTankName(targetTank)})!`,
  );

  // Close only the destination tank picker
  closeModal();

  // Keep the goods shop open and refreshed with your new balance
  openBmGoodsModal();

  lastRenderedMoney = null;
  if (typeof lastRenderedShopState !== "undefined") lastRenderedShopState = "";
  lastCollectionState = "";

  saveGame();
  render();
  renderBlackMarket();
  if (typeof checkAchievements === "function") checkAchievements();
}

/* =========================================================
   BLACK MARKET AMBIENT SWIMMING SHRIMP ENGINE
========================================================= */

const BM_SWIM = {
  active: false,
  animId: null,
  blobs: [],

  colors: [
    "#e63d3d",
    "#f2df19",
    "#4fba43",
    "#2374a8",
    "#f28c28",
    "#8e44ad",
    "#e5dfc8",
    "#2ecc71",
  ],

  init() {
    this.blobs = [];
    for (let tankNum = 1; tankNum <= 4; tankNum++) {
      const layer = document.getElementById(`bmShrimpLayer${tankNum}`);
      if (!layer) continue;
      layer.innerHTML = "";

      // Spawn 2 to 4 glowing creatures per tank
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const color =
          this.colors[Math.floor(Math.random() * this.colors.length)];
        const el = document.createElement("div");
        el.className = "bm-blob";
        el.style.color = color;
        el.style.backgroundColor = color;
        layer.appendChild(el);

        this.blobs.push({
          el,
          x: Math.random() * 70 + 15,
          y: Math.random() * 65 + 20,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.2,
          dir: 1,
        });
      }
    }
  },

  start() {
    this.active = true;
    this.init();
    this.tick();
  },

  stop() {
    this.active = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  },

  tick() {
    if (!this.active) return;

    this.blobs.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;

      // Horizontal bounds bounce
      if (b.x <= 8) {
        b.x = 8;
        b.vx = Math.abs(b.vx);
        b.dir = 1;
      } else if (b.x >= 85) {
        b.x = 85;
        b.vx = -Math.abs(b.vx);
        b.dir = -1;
      }

      // Vertical bounds bounce
      if (b.y <= 12) {
        b.y = 12;
        b.vy = Math.abs(b.vy);
      } else if (b.y >= 82) {
        b.y = 82;
        b.vy = -Math.abs(b.vy);
      }

      // Random subtle drift changes
      if (Math.random() < 0.03) {
        b.vx = (Math.random() - 0.5) * 0.4;
        b.vy = (Math.random() - 0.5) * 0.25;
        b.dir = b.vx >= 0 ? 1 : -1;
      }

      b.el.style.left = `${b.x}%`;
      b.el.style.top = `${b.y}%`;
      b.el.style.transform = `scaleX(${b.dir})`;
    });

    this.animId = requestAnimationFrame(() => this.tick());
  },
};

function buyDecor(id) {
  const item = SHOP_DECOR[id];
  if (!item) return;

  if (game.money < item.price) {
    addLog("Not enough money for this decoration.");
    return;
  }

  game.money -= item.price;
  if (!game.ownedDecor) game.ownedDecor = [];
  game.ownedDecor.push(id);

  // Auto-place in studio center
  const uid = "dec_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const z = (game.favoritesDecor ? game.favoritesDecor.length : 0) + 1;
  game.favoritesDecor.push({
    id,
    uid,
    x: 40 + Math.random() * 15,
    y: 85 + Math.random() * 5,
    width: item.width || 100,
    zIndex: z,
  });

  playSellSound();
  addLog(`Purchased ${item.name} for your Favorites Tank!`);
  lastRenderedShopState = "";
  saveGame();
  render();
  renderShop();
}

/* =========================================================
   INTERACTIVE DECORATING STUDIO
========================================================= */

/* =========================================================
   INTERACTIVE DECORATING STUDIO (WITH VISIBILITY TOGGLES)
========================================================= */

const DECOR_STUDIO = {
  active: false,
  selectedUid: null,
  tempDecor: [],
  dragging: false,
  resizing: false,
  activeUid: null,
  dragOffset: { x: 0, y: 0 },
  resizeStart: { x: 0, initialWidth: 0 },

  open() {
    if (!isFavoritesMaxed() || game.activeAquarium !== "favorites") return;
    this.active = true;
    this.selectedUid = null;

    if (!game.favoritesDecor || game.favoritesDecor.length === 0) {
      game.favoritesDecor = getDefaultFavoritesDecor();
    }

    // Ensure background plants exist in the database with enabled default
    ["plant_bg1", "plant_bg2"].forEach((bgId, index) => {
      if (!game.favoritesDecor.some((d) => d.id === bgId)) {
        const data = SHOP_DECOR[bgId];
        game.favoritesDecor.unshift({
          id: bgId,
          uid: "default_bg_" + (index + 1),
          x: index === 0 ? 15 : 85,
          y: 94,
          width: data.width || 140,
          zIndex: index + 1,
          enabled: true,
        });
      }
    });

    // Ensure newly bought upgrades appear
    const favPlants =
      game.plants && game.plants.favorites ? game.plants.favorites : [];
    favPlants.forEach((plantId) => {
      if (
        SHOP_DECOR[plantId] &&
        !game.favoritesDecor.some((d) => d.id === plantId)
      ) {
        const data = SHOP_DECOR[plantId];
        game.favoritesDecor.push({
          id: plantId,
          uid: "plant_" + plantId,
          x: 50,
          y: 94,
          width: data.width || 140,
          zIndex: game.favoritesDecor.length + 1,
          enabled: true,
        });
      }
    });

    // Set default enabled to true for any legacy items missing the property
    game.favoritesDecor.forEach((d) => {
      if (d.enabled === undefined) d.enabled = true;
    });

    this.tempDecor = JSON.parse(JSON.stringify(game.favoritesDecor));

    const overlay = document.getElementById("decorStudioOverlay");
    if (overlay) overlay.classList.remove("hidden");

    this.renderStudio();
    this.setupInteractions();
  },

  close(apply = false) {
    this.active = false;
    if (apply) {
      game.favoritesDecor = JSON.parse(JSON.stringify(this.tempDecor));
      addLog("Aquarium decor & plant layout saved!");
      playKeepSound();
      saveGame();
    }
    const overlay = document.getElementById("decorStudioOverlay");
    if (overlay) overlay.classList.add("hidden");
    renderAquarium();
  },

  toggleVisibility(uid) {
    const item = this.tempDecor.find((d) => d.uid === uid);
    if (!item) return;
    item.enabled = item.enabled === undefined ? false : !item.enabled;
    playBtnSound();
    this.renderStudio();
  },

  renderStudio() {
    const layer = document.getElementById("studioDecorLayer");
    const list = document.getElementById("decorStudioLayerList");
    if (!layer || !list) return;

    layer.innerHTML = "";
    list.innerHTML = "";

    this.tempDecor.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // Render In-Tank Elements (Only if enabled === true)
    this.tempDecor.forEach((item) => {
      const data = SHOP_DECOR[item.id];
      if (!data) return;

      const isEnabled = item.enabled !== false;
      if (!isEnabled) return; // Skip rendering if hidden

      const currentWidth = item.width || data.width || 100;

      const wrapper = document.createElement("div");
      wrapper.className =
        "placed-decor-item" +
        (item.uid === this.selectedUid ? " selected-decor" : "");
      wrapper.dataset.uid = item.uid;
      wrapper.style.left = `${item.x}%`;
      wrapper.style.top = `${item.y}%`;
      wrapper.style.width = `${currentWidth}px`;
      wrapper.style.zIndex = item.zIndex || 1;

      const img = document.createElement("img");
      img.src = data.image;
      img.className = "decor-graphic";
      img.alt = data.name;
      wrapper.appendChild(img);

      // Resize handle on top-right corner
      const handle = document.createElement("div");
      handle.className = "decor-resize-handle";
      handle.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        this.resizing = true;
        this.activeUid = item.uid;
        this.resizeStart = {
          x: e.clientX,
          initialWidth: item.width || data.width || 100,
        };
      });
      wrapper.appendChild(handle);

      // Drag listener
      wrapper.addEventListener("pointerdown", (e) => {
        if (e.target.classList.contains("decor-resize-handle")) return;
        e.stopPropagation();
        this.selectedUid = item.uid;
        this.dragging = true;
        this.activeUid = item.uid;

        const aquariumRect = document
          .getElementById("studioAquarium")
          .getBoundingClientRect();
        const itemPxX = (item.x / 100) * aquariumRect.width;
        const itemPxY = (item.y / 100) * aquariumRect.height;

        this.dragOffset.x = e.clientX - aquariumRect.left - itemPxX;
        this.dragOffset.y = e.clientY - aquariumRect.top - itemPxY;

        this.renderStudio();
      });

      layer.appendChild(wrapper);
    });

    // Render Sidebar Layer List with Visibility Toggles
    const reversedList = [...this.tempDecor].reverse();
    reversedList.forEach((item) => {
      const data = SHOP_DECOR[item.id];
      if (!data) return;

      const isEnabled = item.enabled !== false;

      const row = document.createElement("div");
      row.className =
        "decor-layer-row" +
        (item.uid === this.selectedUid ? " active-row" : "") +
        (!isEnabled ? " is-hidden-row" : "");

      row.innerHTML = `
                <img src="${data.image}" class="thumb" alt="${data.name}">
                <div style="min-width: 0; flex: 1;">
                    <strong style="font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${data.name}</strong>
                    <div class="small-text" style="font-size: 10px;">Layer: ${item.zIndex} • ${Math.round(item.width || data.width)}px</div>
                </div>
                <div class="decor-layer-actions">
                    <button class="decor-toggle-btn ${!isEnabled ? "hidden-decor" : ""}" title="${isEnabled ? "Hide item" : "Show item"}">
                        ${isEnabled ? "👁️" : "✕"}
                    </button>
                    <button class="secondary-button move-up-btn" title="Bring Forward">▲</button>
                    <button class="secondary-button move-down-btn" title="Send Backward">▼</button>
                </div>
            `;

      row.addEventListener("click", () => {
        this.selectedUid = item.uid;
        this.renderStudio();
      });

      row.querySelector(".decor-toggle-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleVisibility(item.uid);
      });

      row.querySelector(".move-up-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.shiftLayer(item.uid, 1);
      });

      row.querySelector(".move-down-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.shiftLayer(item.uid, -1);
      });

      list.appendChild(row);
    });
  },

  shiftLayer(uid, direction) {
    const idx = this.tempDecor.findIndex((d) => d.uid === uid);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.tempDecor.length) return;

    const temp = this.tempDecor[idx];
    this.tempDecor[idx] = this.tempDecor[targetIdx];
    this.tempDecor[targetIdx] = temp;

    this.tempDecor.forEach((d, i) => {
      d.zIndex = i + 1;
    });
    this.renderStudio();
  },

  setupInteractions() {
    const aquarium = document.getElementById("studioAquarium");
    if (!aquarium || aquarium.dataset.dragInit) return;
    aquarium.dataset.dragInit = "true";

    window.addEventListener("pointermove", (e) => {
      if (!this.active || !this.activeUid) return;
      const target = this.tempDecor.find((d) => d.uid === this.activeUid);
      if (!target || target.enabled === false) return;
      const data = SHOP_DECOR[target.id] || {};

      const rect = aquarium.getBoundingClientRect();
      const wrapperEl = document.querySelector(
        `.placed-decor-item[data-uid="${target.uid}"]`,
      );

      // 1. Resize Mode
      if (this.resizing) {
        const deltaX = (e.clientX - this.resizeStart.x) * 2;
        let newWidth = this.resizeStart.initialWidth + deltaX;

        const minW = data.minWidth || 40;
        const maxW = data.maxWidth || 320;
        target.width = Math.max(minW, Math.min(maxW, newWidth));

        if (wrapperEl) {
          wrapperEl.style.width = `${target.width}px`;
        }
        return;
      }

      // 2. Drag Mode
      if (this.dragging) {
        let newX =
          ((e.clientX - rect.left - this.dragOffset.x) / rect.width) * 100;
        let newY =
          ((e.clientY - rect.top - this.dragOffset.y) / rect.height) * 100;

        target.x = Math.max(0, Math.min(100, newX));
        target.y = Math.max(10, Math.min(99, newY));

        if (wrapperEl) {
          wrapperEl.style.left = `${target.x}%`;
          wrapperEl.style.top = `${target.y}%`;
        }
      }
    });

    window.addEventListener("pointerup", () => {
      if (this.dragging || this.resizing) {
        this.dragging = false;
        this.resizing = false;
        this.activeUid = null;
        this.renderStudio();
      }
    });
  },
};

function renderJournalModal() {
  const container = document.getElementById("journalEntriesContainer");
  if (!container) return;
  container.innerHTML = "";

  const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
  let anyDisplayed = false;

  rarities.forEach((rarity) => {
    // Collect species with hint_text whose prerequisite lines are unlocked
    const entries = Object.keys(SHRIMP).filter((k) => {
      const s = SHRIMP[k];
      return (
        s.rarity === rarity && Boolean(s.hint_text) && isLineUnlockedForHints(k)
      );
    });

    if (entries.length === 0) return;
    anyDisplayed = true;

    const revealedCount = entries.filter(
      (k) => game.purchasedHints.includes(k) || game.discovered.includes(k),
    ).length;

    const group = document.createElement("div");
    group.className = "journal-rarity-group";

    const header = document.createElement("div");
    header.className = "journal-rarity-header";
    header.innerHTML = `
            <span class="rarity-${rarity}" style="font-size: 15px; font-weight: bold;">
                ${capitalize(rarity)} Rumors & Formulas (${revealedCount}/${entries.length})
            </span>
            <span class="collapse-icon">►</span>
        `;

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "journal-cards-container hidden";
    cardsContainer.style.display = "none";

    header.addEventListener("click", () => {
      const isHidden = cardsContainer.classList.toggle("hidden");
      if (isHidden) {
        cardsContainer.style.display = "none";
        header.querySelector(".collapse-icon").textContent = "►";
      } else {
        cardsContainer.style.display = "flex";
        header.querySelector(".collapse-icon").textContent = "▼";
      }
    });

    entries.forEach((key) => {
      const data = SHRIMP[key];
      const isDiscovered = game.discovered.includes(key);
      const hasHint = game.purchasedHints.includes(key);

      const card = document.createElement("div");
      card.className = "journal-card";

      let textHTML = "";
      let imgHTML = "";

      if (isDiscovered) {
        let formula = "Base wild strain / Starter discovery";
        if (data.parents && data.parents.length > 0) {
          formula = data.parents
            .map((p) => (SHRIMP[p] || { name: p }).name)
            .join(" + ");
        }
        textHTML = `
                    <strong style="color: var(--text); font-size: 14px;">${data.name}</strong>
                    <div style="color: var(--muted); font-style: italic; margin-top: 3px;">"${data.hint_text}"</div>
                    <div style="color: var(--success); font-weight: bold; margin-top: 5px; font-size: 12px;">Formula: ${formula}</div>
                `;
        imgHTML = `<img src="shrimp/${data.image}F1.png" class="journal-card-img" alt="${data.name}" onerror="this.src='shrimp/fireredF1.png';">`;
      } else if (hasHint) {
        textHTML = `
                    <div style="color: var(--text); font-style: italic; font-size: 13px;">"${data.hint_text}"</div>
                    <div style="color: var(--muted); font-size: 11px; margin-top: 5px;">Undiscovered Variety</div>
                `;
        imgHTML = `<img src="shrimp/silhoutte.png" class="journal-card-img" alt="Silhouette" onerror="this.src='shrimp/fireredF1.png'; this.style.filter='brightness(0) opacity(0.3)';">`;
      } else {
        textHTML = `
                    <div style="color: var(--muted); font-style: italic; font-size: 15px; font-weight: bold;">???</div>
                    <div style="color: var(--muted); font-size: 11px; margin-top: 4px;">Locked Rumor (Visit the Black Market)</div>
                `;
        imgHTML = `<img src="shrimp/silhoutte.png" class="journal-card-img" alt="Locked" onerror="this.src='shrimp/fireredF1.png'; this.style.filter='brightness(0) opacity(0.18)';">`;
      }

      card.innerHTML = `
                <div class="journal-card-text">${textHTML}</div>
                ${imgHTML}
            `;
      cardsContainer.appendChild(card);
    });

    group.appendChild(header);
    group.appendChild(cardsContainer);
    container.appendChild(group);
  });

  if (!anyDisplayed) {
    container.innerHTML = `<div class="small-text" style="padding: 30px; text-align: center;">No journal entries available.</div>`;
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
  if (label) label.textContent = `Alleles (${game.trackedAlleles.length})`;

  const filterText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const discovered = [...game.discoveredAlleles];

  // Check if all discovered are selected
  if (selectAllCheckbox) {
    selectAllCheckbox.checked =
      discovered.length > 0 &&
      discovered.every((a) => game.trackedAlleles.includes(a));
  }

  list.innerHTML = "";

  discovered.forEach((alleleId) => {
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
        game.trackedAlleles = game.trackedAlleles.filter((a) => a !== alleleId);
      }
      if (label) label.textContent = `Alleles (${game.trackedAlleles.length})`;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked =
          discovered.length > 0 &&
          discovered.every((a) => game.trackedAlleles.includes(a));
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
  const deselectAllBtn = document.getElementById(
    "deselectAllTrackedAllelesBtn",
  );

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
  if (label) label.textContent = `Shrimp (${game.trackedSpecies.length})`;

  const filterText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const discovered = [...game.discovered];

  if (selectAllCheckbox) {
    selectAllCheckbox.checked =
      discovered.length > 0 &&
      discovered.every((s) => game.trackedSpecies.includes(s));
  }

  list.innerHTML = "";

  discovered.forEach((speciesId) => {
    const data = SHRIMP[speciesId] ||
      WILD_PATTERNS[speciesId] || { name: speciesId };
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
        game.trackedSpecies = game.trackedSpecies.filter(
          (s) => s !== speciesId,
        );
      }
      if (label) label.textContent = `Shrimp (${game.trackedSpecies.length})`;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked =
          discovered.length > 0 &&
          discovered.every((s) => game.trackedSpecies.includes(s));
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
   SEARCH IN CURRENT TANK DROPDOWNS ENGINE
========================================================= */

function renderTankFilterAllelesList() {
  const list = document.getElementById("tankFilterAllelesList");
  const label = document.getElementById("tankFilterAllelesBtnLabel");
  const searchInput = document.getElementById("tankFilterAllelesSearch");
  if (!list || !game || !game.discoveredAlleles) return;

  if (!game.tankFilterAlleles) game.tankFilterAlleles = [];
  if (label) label.textContent = `Alleles (${game.tankFilterAlleles.length})`;

  const filterText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  list.innerHTML = "";

  game.discoveredAlleles.forEach((alleleId) => {
    const data = SHRRIMP_SAFE(alleleId);
    if (filterText && !data.name.toLowerCase().includes(filterText)) return;

    const item = document.createElement("label");
    item.className = "multi-select-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = game.tankFilterAlleles.includes(alleleId);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        if (!game.tankFilterAlleles.includes(alleleId))
          game.tankFilterAlleles.push(alleleId);
      } else {
        game.tankFilterAlleles = game.tankFilterAlleles.filter(
          (a) => a !== alleleId,
        );
      }
      if (label)
        label.textContent = `Alleles (${game.tankFilterAlleles.length})`;
      onTankFilterChanged();
    });

    const span = document.createElement("span");
    span.textContent = data.name;
    item.appendChild(checkbox);
    item.appendChild(span);
    list.appendChild(item);
  });

  if (list.children.length === 0) {
    list.innerHTML = `<div class="small-text" style="padding: 8px; text-align: center;">No matching alleles.</div>`;
  }
}

function setupTankFilterAllelesDropdown() {
  const btn = document.getElementById("tankFilterAllelesBtn");
  const menu = document.getElementById("tankFilterAllelesMenu");
  const searchInput = document.getElementById("tankFilterAllelesSearch");
  const selectAllBtn = document.getElementById("selectAllTankFilterAllelesBtn");
  const deselectAllBtn = document.getElementById(
    "deselectAllTankFilterAllelesBtn",
  );

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtnSound();
      const isHidden = menu.classList.toggle("hidden");
      if (!isHidden) {
        renderTankFilterAllelesList();
        if (searchInput) searchInput.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => renderTankFilterAllelesList());
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtnSound();
      game.tankFilterAlleles = [...game.discoveredAlleles];
      onTankFilterChanged();
      renderTankFilterAllelesList();
    });
  }

  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtnSound();
      game.tankFilterAlleles = [];
      onTankFilterChanged();
      renderTankFilterAllelesList();
    });
  }
}

function renderTankFilterShrimpList() {
  const list = document.getElementById("tankFilterShrimpList");
  const label = document.getElementById("tankFilterShrimpBtnLabel");
  const searchInput = document.getElementById("tankFilterShrimpSearch");
  if (!list || !game || !game.discovered) return;

  if (!game.tankFilterSpecies) game.tankFilterSpecies = [];
  if (label) label.textContent = `Shrimp (${game.tankFilterSpecies.length})`;

  const filterText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  list.innerHTML = "";

  game.discovered.forEach((speciesId) => {
    const data = SHRIMP[speciesId] ||
      WILD_PATTERNS[speciesId] || { name: speciesId };
    if (filterText && !data.name.toLowerCase().includes(filterText)) return;

    const item = document.createElement("label");
    item.className = "multi-select-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = game.tankFilterSpecies.includes(speciesId);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        if (!game.tankFilterSpecies.includes(speciesId))
          game.tankFilterSpecies.push(speciesId);
      } else {
        game.tankFilterSpecies = game.tankFilterSpecies.filter(
          (s) => s !== speciesId,
        );
      }
      if (label)
        label.textContent = `Shrimp (${game.tankFilterSpecies.length})`;
      onTankFilterChanged();
    });

    const span = document.createElement("span");
    span.textContent = data.name;
    item.appendChild(checkbox);
    item.appendChild(span);
    list.appendChild(item);
  });

  if (list.children.length === 0) {
    list.innerHTML = `<div class="small-text" style="padding: 8px; text-align: center;">No matching shrimp.</div>`;
  }
}

function setupTankFilterShrimpDropdown() {
  const btn = document.getElementById("tankFilterShrimpBtn");
  const menu = document.getElementById("tankFilterShrimpMenu");
  const searchInput = document.getElementById("tankFilterShrimpSearch");
  const selectAllBtn = document.getElementById("selectAllTankFilterShrimpBtn");
  const deselectAllBtn = document.getElementById(
    "deselectAllTankFilterShrimpBtn",
  );

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtnSound();
      const isHidden = menu.classList.toggle("hidden");
      if (!isHidden) {
        renderTankFilterShrimpList();
        if (searchInput) searchInput.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => renderTankFilterShrimpList());
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtnSound();
      game.tankFilterSpecies = [...game.discovered];
      onTankFilterChanged();
      renderTankFilterShrimpList();
    });
  }

  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtnSound();
      game.tankFilterSpecies = [];
      onTankFilterChanged();
      renderTankFilterShrimpList();
    });
  }
}

function onTankFilterChanged() {
  saveGame();
  const listBody = document.querySelector("#movableShrimpList .movable-body");
  if (listBody) delete listBody.dataset.cache;
  render();
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
    speedDown: "Speed Down (,)",
    speedUp: "Speed Up (.)",
    tank1: "Go to Tank 1",
    tank2: "Go to Tank 2",
    tank3: "Go to Tank 3",
    tank4: "Go to Tank 4",
    tank5: "Go to Tank 5",
    tank6: "Go to Tank 6",
    tank7: "Go to Tank 7",
    tank8: "Go to Tank 8",
    tank9: "Go to Tank 9",
    tank10: "Go to Tank 10",
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
      rebindingAction = rebindingAction === action ? null : action;
      renderShortcutsConfig();
    });

    item.appendChild(rebindBtn);
    grid.appendChild(item);
  }
}

function updateHelpModalShortcuts() {
  if (!game || !game.shortcuts) return;

  const helpActions = [
    "tank",
    "shop",
    "collection",
    "genetics",
    "log",
    "settings",
    "sellMode",
    "favoriteTank",
    "speedDown",
    "speedUp",
    "tank1",
    "tank2",
    "tank3",
    "tank4",
    "tank5",
    "tank6",
    "tank7",
    "tank8",
    "tank9",
    "tank10",
  ];

  helpActions.forEach((action) => {
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

  const blockingModalIds = [
    "helpModal",
    "shrimpModal",
    "capacityModal",
    "foodPrepOverlay",
  ];
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
    addLog(
      `Your aquariums processed ${formatDuration(elapsedSeconds / 60)} of growth.`,
    );
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
  tank = null,
  patternOverride = null,
) {
  if (!SHRIMP[species]) return null;

  const id = game.nextShrimpId++;
  const genes = hiddenGenes || generateHiddenGenes(species);
  const targetTank = tank || (game ? game.activeAquarium : "tank1") || "tank1";
  const pattern = patternOverride || determineInitialPattern(species);

  const shrimp = {
    id,
    species,
    sex,
    ageMinutes: adult
      ? SHRRIMP_SAFE(species).rarity === "special"
        ? 48 * 60 + 100
        : GAME.juvenileAgeMinutes + 100
      : 0,
    pattern,
    hiddenGenes: genes,
    parentIds,
    pregnant: false,
    pregnancyRemaining: 0,
    pregnancyTotal: 0,
    resting: false,
    restRemaining: 0,
    saddle:
      adult &&
      sex === "female" &&
      species !== "galaxySulawesi" &&
      species !== "zombieShrimp",
    breedingCount: 0,
    x: Math.random() * 85 + 5,
    y: Math.random() * 70 + 8,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.15,
    direction: Math.random() > 0.5 ? 1 : -1,
    bornAt: game.minutes,
    dead: false,
    readyToBirth: false,
    pendingBabies: [],
    tank: targetTank,
  };

  game.shrimp.push(shrimp);

  const baseWildSpecies = ["redCherry", "yellow", "shoko", "deepBlueNeo"];

  if (shrimp.pattern === "wild" && baseWildSpecies.includes(species)) {
    discoverWildPattern(shrimp);
  } else {
    discover(species);
  }

  return shrimp;
}

/* =========================================================
   HIDDEN GENETICS
========================================================= */

function generateHiddenGenes(species) {
  const data = SHRRIMP_SAFE(species);
  let a1 = species;
  let a2 = species;

  if (Math.random() < 0.3 && data.children && data.children.length > 0) {
    a2 = data.children[Math.floor(Math.random() * data.children.length)];
  }

  return { allele1: a1, allele2: a2 };
}

/* =========================================================
   PATTERN GENETICS
========================================================= */

function determineInitialPattern(species) {
  const rarity = SHRRIMP_SAFE(species).rarity;
  const wildChance = RARITY[rarity] ? RARITY[rarity].wildChance : 0.4;
  return Math.random() < wildChance ? "wild" : "solid";
}

function determineBabyPattern(mother, father, species) {
  const data = SHRRIMP_SAFE(species);
  const canHaveWildPattern = [
    "wildDavidi",
    "wildPalmata",
    "redCherry",
    "yellow",
    "orange",
    "shoko",
    "deepBlueNeo",
  ].includes(species);

  if (!canHaveWildPattern) return "solid";

  let wildChance = RARITY[data.rarity] ? RARITY[data.rarity].wildChance : 0.4;
  if (mother.pattern === "wild" && father.pattern === "wild") wildChance += 0.2;
  if (mother.pattern === "solid" && father.pattern === "solid")
    wildChance -= 0.15;

  wildChance = clamp(wildChance, 0.1, 0.9);
  return Math.random() < wildChance ? "wild" : "solid";
}

/* =========================================================
   BREEDING COMPATIBILITY
========================================================= */
// SHRIMP OVERHAUL
function sameBreedingFamily(a, b) {
  // Zombie Breeding Rule: Male Zombie can ONLY breed with Female Green Nessie
  if (a.species === "zombieShrimp" || b.species === "zombieShrimp") {
    const isAZombieMale = a.species === "zombieShrimp" && a.sex === "male";
    const isBZombieMale = b.species === "zombieShrimp" && b.sex === "male";
    if (isAZombieMale && b.species === "greenNessie" && b.sex === "female")
      return true;
    if (isBZombieMale && a.species === "greenNessie" && a.sex === "female")
      return true;
    return false;
  }

  const familyA = SHRRIMP_SAFE(a.species).family;
  const familyB = SHRRIMP_SAFE(b.species).family;

  // 1. Strictly isolated families
  const isolatedFamilies = [
    "bamboo",
    "scud",
    "crawfish",
    "palmata",
    "rednose",
    "vampire",
    "babaulti",
    "sulawesi",
    "malawa",
    "raccoon",
    "lace",
    "boa",
    "amano",
    "glasslace",
    "special",
  ];
  for (const iso of isolatedFamilies) {
    if (familyA === iso || familyB === iso) {
      return familyA === familyB;
    }
  }

  // 2. Caridina Cantonensis complex
  const caridinaFamilies = ["cantonensis", "tiger", "bee", "tibee"];
  const isCaridinaA = caridinaFamilies.includes(familyA);
  const isCaridinaB = caridinaFamilies.includes(familyB);
  if (isCaridinaA || isCaridinaB) {
    return isCaridinaA && isCaridinaB;
  }

  // 3. Neocaridina Davidi complex
  const davidiFamilies = [
    "davidi",
    "red",
    "yellow",
    "green",
    "shoko",
    "deepblue",
    "transparent",
  ];
  if (davidiFamilies.includes(familyA) && davidiFamilies.includes(familyB)) {
    return true;
  }

  return familyA === familyB;
}

function getTankCapacity(tank = "tank1") {
  if (!game) return GAME.tankCapacity;
  if (tank === "favorites") {
    const favCap = (game.favoritesTankLevel || 0) * 10;
    const vampireCount = countLiveShrimp("vampireShrimp", "favorites", true);
    return favCap + vampireCount * 5;
  }
  const vampireCount = countLiveShrimp("vampireShrimp", tank, true);
  return GAME.tankCapacity + vampireCount * 5;
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
// SHRIMP OVERHAUL
function determinePhenotype(a1, a2) {
  if (a1 === a2) return a1;

  if (
    (a1 === "yellow" && a2 === "orange") ||
    (a1 === "orange" && a2 === "yellow")
  ) {
    return "green";
  }

  // Bloody Mary + Red Rili expresses Bloody Snowball
  if (
    ((a1 === "bloodyMaryA" || a1 === "bloodyMaryS") && a2 === "redRili") ||
    (a1 === "redRili" && (a2 === "bloodyMaryA" || a2 === "bloodyMaryS"))
  ) {
    return "bloodySnowball";
  }

  if (canDescendFrom(a2, a1)) return a1;
  if (canDescendFrom(a1, a2)) return a2;

  const f1 = SHRRIMP_SAFE(a1).family;
  const f2 = SHRRIMP_SAFE(a2).family;
  if (f1 === "babaulti" || f2 === "babaulti") return "babaultiWild";
  if (f1 === "palmata" || f2 === "palmata") return "wildPalmata";
  if (f1 === "sulawesi" || f2 === "sulawesi") return "wildSulawesi";
  if (f1 === "malawa" || f2 === "malawa") return "malawaShrimp";
  if (f1 === "lace" || f2 === "lace") return "glassLaceShrimp";
  if (f1 === "bamboo" || f2 === "bamboo") return "bambooShrimp";
  if (f1 === "crawfish" || f2 === "crawfish") return "redCrawfish";
  if (f1 === "scud" || f2 === "scud") return "legendaryScud";
  if (f1 === "rednose" || f2 === "rednose") return "redNose";
  if (f1 === "vampire" || f2 === "vampire") return "vampireShrimp";
  if (f1 === "amano" || f2 === "amano") return "amanoShrimp";

  // Caridina complex fallback to Wild Cantonensis
  const caridinaFamilies = ["cantonensis", "tiger", "bee", "tibee", "boa", "raccoon"];
  if (caridinaFamilies.includes(f1) || caridinaFamilies.includes(f2)) {
    return "wildCaridinaCantonensis";
  }

  return "wildDavidi";
}

/* =========================================================
   BREEDING CHECK
========================================================= */

function breedingCheck() {
  ALL_TANKS.forEach((tank) => {
    runBreedingCheckForTank(tank);
  });
  if (game.favoritesTankUnlocked) {
    runBreedingCheckForTank("favorites");
  }
}

function runBreedingCheckForTank(tank) {
  const mCount = game.shrimp.filter(
    (shrimp) =>
      shrimp.sex === "male" &&
      isAdult(shrimp) &&
      !shrimp.dead &&
      shrimp.species !== "amanoShrimp" &&
      shrimp.species !== "galaxySulawesi" &&
      isShrimpInTank(shrimp, tank),
  );

  const females = game.shrimp.filter(
    (shrimp) =>
      shrimp.sex === "female" &&
      isAdult(shrimp) &&
      !shrimp.dead &&
      shrimp.species !== "amanoShrimp" &&
      shrimp.species !== "galaxySulawesi" &&
      shrimp.species !== "zombieShrimp" &&
      !shrimp.pregnant &&
      !shrimp.readyToBirth &&
      !shrimp.resting &&
      shrimp.saddle &&
      isShrimpInTank(shrimp, tank),
  );

  if (mCount.length === 0 || females.length === 0) return;

  const extraFemale = countPlantEffects("extraFemale", tank) > 0;
  const maxFemalesPerMale = extraFemale ? 2 : 1;

  let availableFemales = [...females];
  let breedingEvents = 0;

  for (const male of mCount) {
    if (availableFemales.length === 0) break;

    let bred = 0;
    while (bred < maxFemalesPerMale) {
      const compatible = availableFemales.filter((f) =>
        sameBreedingFamily(male, f),
      );
      if (compatible.length === 0) break;

      const selectedFemale =
        compatible[Math.floor(Math.random() * compatible.length)];
      const fIndex = availableFemales.indexOf(selectedFemale);
      if (fIndex > -1) availableFemales.splice(fIndex, 1);

      const hasVampire = hasLiveShrimp("vampireShrimp", tank, true);
      const breedingChance = hasVampire ? 0.65 : 0.4;

      if (Math.random() < breedingChance) {
        makePregnant(selectedFemale, male);
        breedingEvents++;
      }
      bred++;
    }
  }

  if (breedingEvents > 0) {
    const tankName = tank === "main" ? "main aquarium" : "favorites tank";
    addLog(
      `${breedingEvents} female shrimp in the ${tankName} became berried.`,
    );
  }
}

/* =========================================================
   PREGNANCY
========================================================= */

function makePregnant(female, male) {
  const species = female.species;
  const rarity = SHRRIMP_SAFE(species).rarity;
  let duration = RARITY[rarity].pregnancy;

  const motherTank = female.tank || "tank1";
  const pregnancyPlants = countPlantEffects("pregnancyReduction", motherTank);
  duration *= Math.pow(0.85, pregnancyPlants);

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
    allele2: male.hiddenGenes.allele2,
  };

  female.eggColor = Math.random() < 0.5 ? "yellow" : "green";

  addLog(
    `${displayName(female)} is now berried by a ${displayName(male)}. Pregnancy: ${Math.ceil(duration)} minutes.`,
  );
  playBerriedSound(motherTank); // Only plays if viewing this tank
}

/* =========================================================
   BIRTH PREPARATION
========================================================= */
// SHRIMP OVERHAUL
function prepareBirth(female) {
  const fatherGenes = female.lastFatherGenes || {
    allele1: female.species,
    allele2: female.species,
  };

  const father = {
    species: female.lastFatherSpecies || female.species,
    hiddenGenes: fatherGenes,
  };

  const mother = female;
  const rarity = SHRRIMP_SAFE(female.species).rarity;
  const settings = RARITY[rarity];
  const motherTank = female.tank || "tank1";

  let babyCount = randomInt(settings.babiesMin, settings.babiesMax);
  const babyPlants = countPlantEffects("babyBoost", motherTank);
  babyCount = Math.round(babyCount * Math.pow(1.15, babyPlants));

  female.initialClutchSize = babyCount;
  female.pendingBabies = [];

  for (let i = 0; i < babyCount; i++) {
    const genes = inheritGenes(mother, father, female.species);
    const species = determinePhenotype(genes.allele1, genes.allele2);

    let sex = randomSex();
    if (species === "zombieShrimp") {
      sex = Math.random() < 0.05 ? "female" : "male";
    }

    const pattern = determineBabyPattern(mother, father, species);

    female.pendingBabies.push({
      species,
      sex,
      pattern,
      hiddenGenes: genes,
    });
  }

  female.readyToBirth = true;
  female.pregnant = false;
  female.pregnancyRemaining = 0;
  female.pregnancyTotal = 0;

  addLog(
    `${displayName(female)} is ready to spawn. Click her to cull the offspring!`,
  );
  playPregnantSound(motherTank); // Only plays if viewing this tank
}

/* =========================================================
   GENE INHERITANCE
========================================================= */
// SHRIMP OVERHAUL
function inheritGenes(mother, father, species) {
  // Zombie Breeding Rule: All-or-nothing 15% infection
  if (
    (father.species === "zombieShrimp" && mother.species === "greenNessie") ||
    (mother.species === "zombieShrimp" && father.species === "greenNessie")
  ) {
    if (Math.random() < 0.25) {
      addLog("The Green Nessie clutch succumbed to infection! A Zombie Shrimp was born!");
      return { allele1: "zombieShrimp", allele2: "zombieShrimp" };
    } else {
      // If infection fails, offspring inherits purely from Green Nessie (no carrier alleles)
      return { allele1: "greenNessie", allele2: "greenNessie" };
    }
  }

  if (mother.species === "bambooShrimp" || father.species === "bambooShrimp") {
    return { allele1: "bambooShrimp", allele2: "bambooShrimp" };
  }

  const isRedCrawfishPair =
    mother.species === "redCrawfish" && father.species === "redCrawfish";
  if (isRedCrawfishPair && Math.random() < 0.05) {
    addLog("Incredibly rare! A brilliant, shiny Blue Crawfish was born!");
    return { allele1: "blueCrawfish", allele2: "blueCrawfish" };
  }

  const isKanokoRedRiliPair =
    (mother.species === "kanoko" && father.species === "redRili") ||
    (mother.species === "redRili" && father.species === "kanoko");
  if (isKanokoRedRiliPair && Math.random() < 0.01) {
    addLog("Amazing! A rare mutation occurred: A Crystal Red Shrimp was born!");
    return { allele1: "crystalRed", allele2: "crystalRed" };
  }

  const isBloodyMaryRedRiliPair =
    ((mother.species === "bloodyMaryA" || mother.species === "bloodyMaryS") &&
      father.species === "redRili") ||
    (mother.species === "redRili" &&
      (father.species === "bloodyMaryA" || father.species === "bloodyMaryS"));
  if (isBloodyMaryRedRiliPair && Math.random() < 0.12) {
    addLog("A rare crossbreed occurred: A Bloody Snowball Shrimp was born!");
    return { allele1: "bloodySnowball", allele2: "bloodySnowball" };
  }

  const hasFireRedPaintedParent =
    mother.species === "fireRedPainted" || father.species === "fireRedPainted";
  if (hasFireRedPaintedParent && Math.random() < 0.05) {
    addLog("Extremely rare mutation! A Dark Blue Cherry Shrimp was born!");
    return { allele1: "darkBlueCherry", allele2: "darkBlueCherry" };
  }

  const hasDarkBlueCherryParent =
    mother.species === "darkBlueCherry" || father.species === "darkBlueCherry";
  if (hasDarkBlueCherryParent && Math.random() < 0.15) {
    addLog("Dominant phenotype expressed! A Green Nessie Shrimp was born!");
    return { allele1: "greenNessie", allele2: "greenNessie" };
  }

  const hasSakuraRedAParent =
    mother.species === "sakuraRedA" || father.species === "sakuraRedA";
  if (hasSakuraRedAParent && Math.random() < 0.02) {
    addLog("Extremely rare mutation! A Purple Shrimp was born!");
    return { allele1: "purple", allele2: "purple" };
  }

  // Galaxy Sulawesi rare mutation from Harlequin Sulawesi parents -- SHRIMP OVERHAUL
  const isHarlequinPair =
    mother.species === "harlequinSulawesi" &&
    father.species === "harlequinSulawesi";
  const hasHarlequinParent =
    mother.species === "harlequinSulawesi" ||
    father.species === "harlequinSulawesi";

  if (isHarlequinPair && Math.random() < 0.1) {
    // 10% chance when both parents are Harlequin
    addLog(
      "Extraordinary! An ethereal Galaxy Sulawesi was born from Harlequin Sulawesi parents!",
    );
    return { allele1: "galaxySulawesi", allele2: "galaxySulawesi" };
  } else if (hasHarlequinParent && Math.random() < 0.05) {
    // 5% chance when one parent is Harlequin
    addLog(
      "Extraordinary! A rare mutation occurred: A Galaxy Sulawesi was born!",
    );
    return { allele1: "galaxySulawesi", allele2: "galaxySulawesi" };
  }

  // 1. Raccoon Shrimp mutation (Blonde Blue Tiger x Red Stripes Blue Tiger)
  const isRaccoonCross =
    (mother.species === "blondeBlueTiger" &&
      father.species === "redStripesBlueTiger") ||
    (mother.species === "redStripesBlueTiger" &&
      father.species === "blondeBlueTiger");
  if (isRaccoonCross && Math.random() < 0.1) {
    addLog(
      "Incredible! A wild-patterned Legendary Raccoon Shrimp was mutated from Blue Tiger parents!",
    );
    return { allele1: "raccoonShrimp", allele2: "raccoonShrimp" };
  }

  // 2. Metallic Boa mutation check for SSS-grade parents
  const boaEligibleParents = [
    "shadowPandaSSS",
    "pandaSSS",
    "crystalSuperBlackSSS",
    "wineRedSSS",
    "crystalSuperRedSSS",
    "whiteKingKong",
  ];
  const isBoaEligible =
    boaEligibleParents.includes(mother.species) ||
    boaEligibleParents.includes(father.species);
  if (isBoaEligible && Math.random() < 0.06) {
    const boaColors = [
      "metallicBoaBlack",
      "metallicBoaRed",
      "metallicBoaYellow",
      "metallicBoaOrange",
      "metallicBoaGreen",
      "metallicBoaBlue",
      "metallicBoaPurple",
    ];
    const chosenBoa = boaColors[Math.floor(Math.random() * boaColors.length)];
    addLog(
      `Astonishing! A rare mutation occurred: A ${SHRRIMP_SAFE(chosenBoa).name} was born!`,
    );
    return { allele1: chosenBoa, allele2: chosenBoa };
  }

  // 3. Tiger x Bee TiBee Mutation Scaling
  const motherData = SHRRIMP_SAFE(mother.species);
  const fatherData = SHRRIMP_SAFE(father.species);
  const motherFamily = motherData.family;
  const fatherFamily = fatherData.family;
  const isTigerBeeCross =
    (motherFamily === "tiger" && fatherFamily === "bee") ||
    (motherFamily === "bee" && fatherFamily === "tiger");

  if (isTigerBeeCross) {
    const RARITY_SCORES = {
      wild: 1,
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
    };
    const mScore = RARITY_SCORES[motherData.rarity] || 1;
    const fScore = RARITY_SCORES[fatherData.rarity] || 1;
    const combinedScore = mScore + fScore;

    const tibeeMutationChance = Math.min(0.8, 0.15 + combinedScore * 0.08);

    if (Math.random() < tibeeMutationChance) {
      let pool = [];
      if (combinedScore <= 3) {
        pool = ["tibee1", "tibee2", "tibee3", "tibee4"];
      } else if (combinedScore <= 5) {
        pool = ["tibee1", "tibee2", "tibee3", "tibee4", "tibee5"];
      } else {
        pool = [
          "tibee1",
          "tibee2",
          "tibee3",
          "tibee4",
          "tibee5",
          "tibee6",
          "tibee6",
        ];
      }
      const chosenTibee = pool[Math.floor(Math.random() * pool.length)];
      addLog(
        `Hybrid vigor! A rare ${SHRRIMP_SAFE(chosenTibee).name} was born from ${motherData.name} and ${fatherData.name}!`,
      );
      return { allele1: chosenTibee, allele2: chosenTibee };
    }
  }

  // 4. Golden Bee crossbreeding check (White Bee High Grade x Orange Bee)
  const isGoldenBeePair =
    (mother.species === "whiteBeeHigh" && father.species === "wildOrangeBee") ||
    (mother.species === "wildOrangeBee" && father.species === "whiteBeeHigh");
  if (isGoldenBeePair && Math.random() < 0.25) {
    addLog(
      "A radiant Golden Bee was born from White Bee High & Orange Bee parents!",
    );
    return { allele1: "goldenBee", allele2: "goldenBee" };
  }

  const isLegendary =
    motherData.rarity === "legendary" || fatherData.rarity === "legendary";

  if (!isLegendary) {
    let throwbackChance = mother.species === father.species ? 0.08 : 0.15;

    if (mother.pattern === "wild") throwbackChance += 0.15;
    if (father.pattern === "wild") throwbackChance += 0.15;

    if (Math.random() < throwbackChance) {
      const family = motherData.family;

      if (family === "green") {
        const throwbackSpecies = Math.random() < 0.5 ? "yellow" : "orange";
        addLog(
          `An ancestral throwback occurred! A wild-pattern offspring was born from ${motherData.name}.`,
        );
        return { allele1: throwbackSpecies, allele2: "wildDavidi" };
      } else if (family === "red") {
        addLog(
          `An ancestral throwback occurred! A wild red offspring was born.`,
        );
        return { allele1: "redCherry", allele2: "wildDavidi" };
      } else if (family === "yellow") {
        addLog(
          `An ancestral throwback occurred! A wild yellow offspring was born.`,
        );
        return { allele1: "yellow", allele2: "wildDavidi" };
      } else if (family === "shoko") {
        addLog(
          `An ancestral throwback occurred! A wild shoko offspring was born.`,
        );
        return { allele1: "shoko", allele2: "wildDavidi" };
      } else if (family === "deepblue") {
        addLog(
          `An ancestral throwback occurred! A wild blue offspring was born.`,
        );
        return { allele1: "deepBlueNeo", allele2: "wildDavidi" };
      } else if (family === "palmata") {
        addLog(
          `An ancestral throwback occurred! A wild palmata offspring was born.`,
        );
        return { allele1: "wildPalmata", allele2: "wildPalmata" };
      } else if (family === "babaulti") {
        addLog(
          `An ancestral throwback occurred! A base wild Babaulti offspring was born.`,
        );
        return { allele1: "babaultiWild", allele2: "babaultiWild" };
      } else if (family === "tiger") {
        addLog(
          `An ancestral throwback occurred! A wild Tiger offspring was born.`,
        );
        return { allele1: "wildTiger", allele2: "wildCaridinaCantonensis" };
      } else if (family === "bee") {
        addLog(
          `An ancestral throwback occurred! A wild Bee offspring was born.`,
        );
        return { allele1: "wildCrystalBlack", allele2: "wildCaridinaCantonensis" };
      } else if (family === "sulawesi") {
        addLog(
          `An ancestral throwback occurred! A wild Sulawesi offspring was born.`,
        );
        return { allele1: "wildSulawesi", allele2: "wildSulawesi" };
      }
    }
  }

  const mAlleles = [mother.hiddenGenes.allele1, mother.hiddenGenes.allele2];
  const fAlleles = [father.hiddenGenes.allele1, father.hiddenGenes.allele2];

  let a1 = mAlleles[Math.floor(Math.random() * 2)];
  let a2 = fAlleles[Math.floor(Math.random() * 2)];

  const pureBreedBoost = mother.species === father.species ? 0.2 : 0.0;

  const STABILITY_BY_RARITY = {
    wild: 1.0,
    common: 0.85,
    uncommon: 0.7,
    rare: 0.45,
    epic: 0.2,
    legendary: 0.15,
  };

  function processStability(allele) {
    const data = SHRIMP[allele];
    if (!data) return allele;

    let finalStability;
    if (allele === "crystalRed") {
      finalStability = 0.05;
    } else {
      const baseStability = STABILITY_BY_RARITY[data.rarity] || 1.0;
      let stabilityPenalty = 0;

      // Wild pattern reduces stability, causing alleles to revert to earlier lineage parents
      if (mother.pattern === "wild") stabilityPenalty += 0.15;
      if (father.pattern === "wild") stabilityPenalty += 0.15;

      finalStability = Math.min(
        1.0,
        Math.max(0.05, baseStability + pureBreedBoost - stabilityPenalty),
      );
    }

    if (Math.random() > finalStability) {
      if (data.parents && data.parents.length > 0) {
        const parent =
          data.parents[Math.floor(Math.random() * data.parents.length)];
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
    addLog(
      `An unstable allele reverted from ${SHRRIMP_SAFE(oldA1).name} to ${SHRRIMP_SAFE(a1).name}.`,
    );
  }
  if (a2 !== oldA2 && a1 === oldA1) {
    addLog(
      `An unstable allele reverted from ${SHRRIMP_SAFE(oldA2).name} to ${SHRRIMP_SAFE(a2).name}.`,
    );
  }

  const motherTank = mother.tank || "tank1";
  let mutationRate = 0.03;
  if (countPlantEffects("mutationBoost", motherTank) > 0) mutationRate += 0.05;

  const marimoCount = countPlants("marimo", motherTank);
  if (marimoCount > 0) mutationRate += 0.15 * marimoCount;

  if (hasLiveShrimp("galaxySulawesi", motherTank)) {
    mutationRate += 0.15;
  }

  function tryMutate(allele) {
    if (Math.random() < mutationRate) {
      const data = SHRRIMP_SAFE(allele);
      if (data.children && data.children.length > 0) {
        let possibleChildren = data.children;

        // When mutating a wildDavidi allele, NEVER introduce color families that the parents do not carry!
        if (allele === "wildDavidi") {
          const parentAllelePool = [
            mother.hiddenGenes.allele1,
            mother.hiddenGenes.allele2,
            father.hiddenGenes.allele1,
            father.hiddenGenes.allele2,
            mother.species,
            father.species,
          ];

          const allowedFamilies = new Set();
          parentAllelePool.forEach((id) => {
            const fam = SHRRIMP_SAFE(id).family;
            if (fam && fam !== "davidi") {
              allowedFamilies.add(fam);
            }
          });

          if (allowedFamilies.size > 0) {
            const familyFiltered = possibleChildren.filter((childKey) => {
              const childData = SHRRIMP_SAFE(childKey);
              return allowedFamilies.has(childData.family);
            });

            if (familyFiltered.length > 0) {
              possibleChildren = familyFiltered;
            } else {
              return allele;
            }
          }
        }

        return possibleChildren[
          Math.floor(Math.random() * possibleChildren.length)
        ];
      }
    }
    return allele;
  }

  const mutA1 = a1;
  const mutA2 = a2;
  a1 = tryMutate(a1);
  a2 = tryMutate(a2);

  if (a1 !== mutA1) {
    addLog(
      `A genetic mutation occurred! An allele mutated from ${SHRRIMP_SAFE(mutA1).name} to ${SHRRIMP_SAFE(a1).name}.`,
    );
  }
  if (a2 !== mutA2 && a1 === mutA1) {
    addLog(
      `A genetic mutation occurred! An allele mutated from ${SHRRIMP_SAFE(mutA2).name} to ${SHRRIMP_SAFE(a2).name}.`,
    );
  }

  const mPheno = mother.species;
  const fPheno = father.species;
  const isGreen = (p) => p === "green" || p === "greenJade";

  if (isGreen(mPheno) && isGreen(fPheno)) {
    if (
      (a1 === "yellow" && a2 === "orange") ||
      (a1 === "orange" && a2 === "yellow")
    ) {
      if (Math.random() < 0.5) {
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
  if (!game || isGamePaused() || !game.lastRealTime) return;
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

let lastAutosaveTimestamp = Date.now();

function isGamePaused() {
  // ONLY pause time if the player is on the Title Screen / Main Menu
  const mainMenu = document.getElementById("mainMenu");
  return Boolean(mainMenu && !mainMenu.classList.contains("hidden"));
}

function gameLoop() {
  const now = Date.now();
  if (!game) return;

  if (!isGamePaused()) {
    const deltaSeconds = (now - game.lastRealTime) / 1000;

    if (deltaSeconds > 0) {
      // Track real active playtime (ticks 1s per 1s, unaffected by game speed multipliers)
      const activeDelta = Math.min(deltaSeconds, 3);
      game.realPlaytimeSeconds = (game.realPlaytimeSeconds || 0) + activeDelta;

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
    game.money += 1 * minutes * adultBambooCount;
  }

  for (const shrimp of game.shrimp) {
    if (shrimp.dead) continue;

    const wasAdult = isAdult(shrimp);
    shrimp.ageMinutes += minutes;

    if (!wasAdult && isAdult(shrimp)) {
      if (
        shrimp.sex === "female" &&
        shrimp.species !== "galaxySulawesi" &&
        shrimp.species !== "zombieShrimp"
      ) {
        shrimp.saddle = true;
        addLog(
          ` ${displayName(shrimp)} has matured into an adult and developed a saddle!`,
        );
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

    const currentActiveTank = game.activeAquarium || "tank1";
    const marimoCount = countPlants("marimo", currentActiveTank);
    if (marimoCount > 0) {
      const driftSpeed = minutes * 1.8;
      for (let i = 0; i < marimoCount; i++) {
        const m = marimoDriftList[i];
        m.x += m.vx * driftSpeed;
        m.y += m.vy * driftSpeed;
        m.rotation += (m.vx >= 0 ? 1 : -1) * Math.abs(m.vx) * 320 * driftSpeed;

        const xMin = 8 + i * 3;
        const xMax = 92 - i * 3;
        const yMin = 70;
        const yMax = 86;

        if (m.x <= xMin) {
          m.x = xMin;
          m.vx = Math.abs(m.vx);
        } else if (m.x >= xMax) {
          m.x = xMax;
          m.vx = -Math.abs(m.vx);
        }

        if (m.y <= yMin) {
          m.y = yMin;
          m.vy = Math.abs(m.vy);
        } else if (m.y >= yMax) {
          m.y = yMax;
          m.vy = -Math.abs(m.vy);
        }

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
        addLog(
          `${displayName(shrimp)} has finished resting and is saddled again.`,
        );
      }
    }

    if (!isFastForward) {
      updateShrimpMovement(shrimp, minutes);
    }
  }

  if (game.minutes - game.lastBreedingCheck >= GAME.breedingInterval / 60) {
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

  game.shrimp = game.shrimp.filter((shrimp) => !shrimp.dead);
  game.selectedForSaleIds = game.selectedForSaleIds.filter((id) =>
    game.shrimp.some((s) => s.id === id),
  );
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
    if (
      other.id === shrimp.id ||
      other.dead ||
      (other.tank || "main") !== currentTank
    ) {
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
    shrimp.vx = Math.random() * 0.15 + 0.1;
    shrimp.direction = 1;
  } else if (shrimp.x >= xMax) {
    shrimp.x = xMax;
    shrimp.vx = -(Math.random() * 0.15 + 0.1);
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

  // Special rarity takes 48 hours (2880 minutes) to reach adulthood
  const data = SHRRIMP_SAFE(shrimp.species);
  if (data.rarity === "special" || shrimp.species === "zombieShrimp") {
    requiredAge = 48 * 60; // 2880 minutes
  }

  const growthPlants = countPlantEffects("growthBoost", currentTank);
  requiredAge *= Math.pow(0.85, growthPlants);

  if (hasLiveShrimp("legendaryScud", currentTank)) {
    requiredAge *= 0.9;
  }
  if (hasLiveShrimp("amanoShrimp", currentTank)) {
    requiredAge *= 0.95;
  }

  return shrimp.ageMinutes >= requiredAge;
}

function lifeStage(shrimp) {
  if (isAdult(shrimp)) return "Adult";

  // Special shrimp remain babies for the first 24 hours, then juveniles until 48 hours
  const data = SHRRIMP_SAFE(shrimp.species);
  const babyAge =
    data.rarity === "special" || shrimp.species === "zombieShrimp"
      ? 24 * 60
      : GAME.babyAgeMinutes;

  if (shrimp.ageMinutes >= babyAge) return "Juvenile";
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
  const totalSecs = Math.floor(
    Math.max(0, game ? game.realPlaytimeSeconds || 0 : 0),
  );
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  // Displays MM:SS when under 1 hour, and HH:MM:SS once over 1 hour
  // if (hour > 0)
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/* =========================================================
   PLANTS
========================================================= */

function getPlantPrice(id, tank = null) {
  const plant = SHOP_PLANTS[id];
  if (!plant) return 0;

  const currentTank = tank || (game ? game.activeAquarium : "tank1") || "tank1";
  if (id === "marimo") {
    const count = countPlants("marimo", currentTank);
    if (count === 0) return 25000;
    if (count === 1) return 25000 * 3;
    if (count === 2) return 25000 * 8;
    return 200000;
  }
  return plant.price;
}

function buyPlant(id) {
  const plant = SHOP_PLANTS[id];
  if (!plant) return;

  const currentTank = (game ? game.activeAquarium : "tank1") || "tank1";
  if (!game.plants || Array.isArray(game.plants)) {
    const existing = Array.isArray(game.plants) ? [...game.plants] : [];
    game.plants = { tank1: existing };
  }
  if (!game.plants[currentTank]) game.plants[currentTank] = [];

  const ownedCount = countPlants(id, currentTank);
  const isMarimo = id === "marimo";

  if (isMarimo && ownedCount >= 3) {
    addLog(
      `You already own the maximum amount of Marimo balls (3/3) in ${formatTankName(currentTank)}.`,
    );
    return;
  } else if (!isMarimo && ownedCount >= 1) {
    addLog(`You already own this plant in ${formatTankName(currentTank)}.`);
    return;
  }

  const price = getPlantPrice(id, currentTank);
  if (game.money < price) {
    addLog("Not enough money.");
    return;
  }

  game.money -= price;
  game.plants[currentTank].push(id);
  playSellSound();

  if (isMarimo) {
    addLog(
      `Purchased Marimo (${ownedCount + 1}/3) for ${formatTankName(currentTank)}!`,
    );
  } else {
    addLog(`Purchased ${plant.name} for ${formatTankName(currentTank)}.`);
  }

  lastRenderedMoney = null;
  if (typeof lastRenderedShopState !== "undefined") lastRenderedShopState = "";
  saveGame();
  render();
  renderShop();
}

function getTankPlants(tank = null) {
  if (!game || !game.plants) return [];
  const t = tank || (game ? game.activeAquarium : "tank1") || "tank1";
  if (Array.isArray(game.plants)) return t === "tank1" ? game.plants : [];
  return game.plants[t] || [];
}

function countPlants(id, tank = null) {
  const list = getTankPlants(tank);
  return list.filter((plant) => plant === id).length;
}

function countPlantEffects(effectName, tank = null) {
  const list = getTankPlants(tank);
  return list.filter((plantId) => {
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
  addLog(
    `Unlocked ${upgrade.name}! You now own ${upgrade.unlockedTanks} tanks.`,
  );

  lastRenderedMoney = null;
  lastRenderedShopState = "";
  render();
  renderShop();
}

/* =========================================================
   BUY SHRIMP
========================================================= */

function getAvailableTankForPurchase() {
  if (!game) return "tank1";
  const active = game.activeAquarium || "tank1";
  const activeCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === active && !s.dead,
  ).length;

  // 1. If the current active tank has space, prioritize it
  if (activeCount < getTankCapacity(active)) {
    return active;
  }

  // 2. Otherwise, automatically find the first unlocked tank with available space
  const unlocked = getUnlockedTanks();
  for (const t of unlocked) {
    const count = game.shrimp.filter(
      (s) => (s.tank || "tank1") === t && !s.dead,
    ).length;
    if (count < getTankCapacity(t)) {
      return t;
    }
  }

  // 3. Check Favorites tank if unlocked and has space
  if (game.favoritesTankUnlocked) {
    const favCount = game.shrimp.filter(
      (s) => s.tank === "favorites" && !s.dead,
    ).length;
    if (favCount < getTankCapacity("favorites")) {
      return "favorites";
    }
  }

  return null; // All tanks are full
}

function showFloatingButtonMessage(btn, text) {
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const msg = document.createElement("div");
  msg.className = "shrimp-floating-bubble";
  msg.textContent = text;
  msg.style.position = "fixed";
  msg.style.left = `${rect.left + rect.width / 2}px`;
  msg.style.top = `${rect.top}px`;
  msg.style.zIndex = "10050";
  msg.style.background = "rgba(217, 92, 92, 0.95)";

  document.body.appendChild(msg);
  setTimeout(() => {
    msg.remove();
  }, 1500);
}

function buyShrimp(species, sourceBtn = null) {
  const currentTank = (game ? game.activeAquarium : "tank1") || "tank1";
  const currentTankCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && !s.dead,
  ).length;
  const currentTankCapacity = getTankCapacity(currentTank);

  if (currentTankCount >= currentTankCapacity) {
    if (sourceBtn) {
      showFloatingButtonMessage(sourceBtn, "Tank full!");
    }
    playBtnSound();
    addLog(
      `Cannot purchase: ${formatTankName(currentTank)} is full (${currentTankCount}/${currentTankCapacity})!`,
    );
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

  // Count discoveries before adding the shrimp
  const countBefore = (game.discovered || []).length;

  game.money -= price;
  playSellSound();

  let sex = randomSex();
  const history = game.purchaseGenderHistory || [];
  if (history.length >= 3 && history.slice(-3).every((s) => s === "male"))
    sex = "female";
  else if (
    history.length >= 3 &&
    history.slice(-3).every((s) => s === "female")
  )
    sex = "male";

  if (!game.purchaseGenderHistory) game.purchaseGenderHistory = [];
  game.purchaseGenderHistory.push(sex);
  if (game.purchaseGenderHistory.length > 5) game.purchaseGenderHistory.shift();

  const shrimp = addShrimp(species, sex, true, [], null, currentTank);
  if (shrimp) {
    if (shrimp.sex === "female" && species !== "galaxySulawesi")
      shrimp.saddle = true;

    // Sequences the species you bought so the shop and alleles recognize it
    discoverAllele(species);
  }

  // Check if adding this shrimp unlocked a new variant (solid OR wild pattern)
  const isNewDiscovery = (game.discovered || []).length > countBefore;

  if (isNewDiscovery) {
    if (sourceBtn) triggerShopConfetti(sourceBtn);
    playAchievementSound();
  }

  lastCollectionState = "";
  lastRenderedMoney = null;
  lastRenderedShopState = "";

  const listBody = document.querySelector("#movableShrimpList .movable-body");
  if (listBody) delete listBody.dataset.cache;

  saveGame();
  render();
  renderCollection();
  renderShop();

  addLog(
    `Purchased a ${displayName(shrimp || { species })} (placed in ${formatTankName(currentTank)}).`,
  );
}

/* =========================================================
   SELL SHRIMP
========================================================= */
// SHRIMP OVERHAUL
function getShrimpSellValue(shrimp) {
  const data = SHRRIMP_SAFE(shrimp.species);
  let value;

  // 1. Standalone Late-Game Trophies (Recovers purchase in 3 baby or 2 adult sales)
  const STANDALONE_PRICES = {
    galaxySulawesi: 30000, // Buy: $90,000   -> 3 babies ($30k) = $90k,  2 adults ($45k) = $90k
    malawaShrimp: 65000, // Buy: $195,000  -> 3 babies ($65k) = $195k, 2 adults ($97.5k) = $195k
    glassLaceShrimp: 85000, // Buy: $250,000  -> 3 babies ($85k) = $255k, 2 adults ($127.5k) = $255k
    raccoonShrimp: 110000, // Buy: $325,000  -> 3 babies ($110k) = $330k, 2 adults ($165k) = $330k
    amanoShrimp: 2500, // Original Amano value
  };
  if (shrimp.species === "zombieShrimp") {
    let val = shrimp.sex === "male" ? 10 : 1000;
    if (isAdult(shrimp) && shrimp.sex !== "male") {
      val *= 100; // Adult female bonus = $100,000
    }
    return Math.round(val);
  }

  if (STANDALONE_PRICES[shrimp.species]) {
    value = STANDALONE_PRICES[shrimp.species];
  }
  // 2. Caridina Cantonensis Lineage (Tigers, Bees, TiBees, Boas)
  // Base wild recovers $155k buy in ~3 sales; rarer morphs scale up progressively
  else if (
    ["cantonensis", "tiger", "bee", "tibee", "boa"].includes(data.family)
  ) {
    const CARIDINA_BASE_TIERS = {
      wild: 50000, // Wild Cantonensis (Buy: $155k) -> 3 babies = $150k, 2 adults = $150k
      common: 55000, // Wild Tiger, Wild Bee, Crystal Black
      uncommon: 85000, // Blue Tiger, Black Tiger, Extreme Black
      rare: 140000, // Blonde Blue Tiger, Panda A, Wine Red A, TiBee 1-4
      epic: 250000, // OEBT, Panda SSS, TiBee 5-6, Metallic Boas
      legendary: 350000, // White King Kong, Orange Eye Tiger
    };
    value = CARIDINA_BASE_TIERS[data.rarity] || 50000;
  }
  // 3. Sulawesi Lineage
  // Base wild recovers $115k buy in ~3 sales; rarer morphs scale up progressively
  else if (data.family === "sulawesi") {
    const SULAWESI_BASE_TIERS = {
      wild: 38000, // Wild Sulawesi (Buy: $115k) -> 3 babies = $114k, 2 adults = $114k
      rare: 75000, // Snow Sulawesi, Pink Boxer
      epic: 150000, // Harlequin Sulawesi
      legendary: 250000, // Blue Ghost Sulawesi
    };
    value = SULAWESI_BASE_TIERS[data.rarity] || 38000;
  }
  // 4. Classic Neocaridina & Standard Lines (100% Original Values)
  // Wild = $1, Common = $2, Uncommon = $5, Rare = $10, Epic = $150, Legendary = $2,500
  else {
    value = RARITY[data.rarity] ? RARITY[data.rarity].value : 2;
  }

  // Adult bonus (+50%)
  if (isAdult(shrimp)) value *= 1.5;

  // Pregnant bonus (+50%)
  if (shrimp.pregnant) value *= 1.5;

  // Red Crawfish in-tank sell boost (+10%)
  const currentTank = shrimp.tank || "tank1";
  if (
    shrimp.species !== "redCrawfish" &&
    hasLiveShrimp("redCrawfish", currentTank)
  ) {
    value *= 1.1;
  }

  return Math.max(1, Math.round(value));
}

function sellShrimp(id) {
  const shrimp = game.shrimp.find((s) => s.id === id);
  if (!shrimp) return;

  const data = SHRRIMP_SAFE(shrimp.species);
  const value = getShrimpSellValue(shrimp);

  game.money += value;
  shrimp.dead = true;
  game.shrimp = game.shrimp.filter((s) => !s.dead);

  playSellSound();

  if (game.selectedShrimpId === id) {
    game.selectedShrimpId = null;
  }

  // Check if the sold shrimp was part of the Select Mode selection
  if (game.selectedForSaleIds && game.selectedForSaleIds.includes(id)) {
    game.selectedForSaleIds = game.selectedForSaleIds.filter(
      (selId) => selId !== id,
    );

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
    .filter((s) => !s.dead && isAdult(s))
    .sort((a, b) => b.ageMinutes - a.ageMinutes);

  if (adults.length === 0) {
    addLog("There are no adult shrimp to sell.");
    return;
  }

  sellShrimp(adults[0].id);
}

function sellOldestAdultForReplacement() {
  const adults = game.shrimp
    .filter((s) => !s.dead && isAdult(s))
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
  game.shrimp = game.shrimp.filter((shrimp) => !shrimp.dead);
  return true;
}

/* =========================================================
   COLLECTION DISCOVERY HELPERS
========================================================= */

function discover(species) {
  if (!species) return;

  let data = SHRIMP[species] || WILD_PATTERNS[species];
  if (!data) {
    const foundKey =
      Object.keys(SHRIMP).find(
        (k) => k.toLowerCase() === species.toLowerCase(),
      ) ||
      Object.keys(WILD_PATTERNS).find(
        (k) => k.toLowerCase() === species.toLowerCase(),
      );
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
    shrimp.wildPatternImage = "WildS";
    discover("WildS");
  } else if (family === "deepblue") {
    shrimp.wildPatternImage = "WildB";
    discover("WildB");
  } else {
    discover(shrimp.species);
  }
}

function discoverAllele(species) {
  if (!species) return;

  if (!SHRIMP[species]) {
    const foundKey = Object.keys(SHRIMP).find(
      (k) => k.toLowerCase() === species.toLowerCase(),
    );
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

  // Only the base color strains use the wild camouflage pattern sprites
  const baseWildSpecies = ["redCherry", "yellow", "shoko", "deepBlueNeo"];

  if (shrimp.pattern === "wild" && baseWildSpecies.includes(shrimp.species)) {
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

  // All other species (Green Nessie, Purple, Fire Red, etc.) always use their own sprite
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

  layer.querySelectorAll(".shrimp").forEach((el) => {
    const id = Number(el.dataset.id);
    const shrimp = game.shrimp.find((s) => s.id === id);
    if (!shrimp) return;

    // SHRIMP OVERHAUL
    el.dataset.frame = globalShrimpFrame;
    const img = el.querySelector(".shrimp-img");
    if (img && img.style.display !== "none") {
      const prefix = getShrimpImagePrefix(shrimp);
      const sexSuffix = shrimp.sex === "male" ? "M" : "F";
      img.src = `shrimp/${prefix}${sexSuffix}${globalShrimpFrame}.png`;
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

  // SHRIMP OVERHAUL
  const data = SHRRIMP_SAFE(shrimp.species);
  const image = document.createElement("img");
  image.className = "shrimp-img";
  image.alt = data.name;
  const sexSuffix = shrimp.sex === "male" ? "M" : "F";
  image.src = `shrimp/${getShrimpImagePrefix(shrimp)}${sexSuffix}${globalShrimpFrame}.png`;

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

/* =========================================================
   SHRIMP VISUAL IDENTITY & TANK FILTER HELPER
========================================================= */

function getShrimpVisualIdentity(shrimp) {
  if (!shrimp) return "";
  const baseWildSpecies = ["redCherry", "yellow", "shoko", "deepBlueNeo"];
  if (shrimp.pattern === "wild" && baseWildSpecies.includes(shrimp.species)) {
    const prefix = getShrimpImagePrefix(shrimp);
    if (typeof WILD_PATTERNS !== "undefined" && WILD_PATTERNS[prefix]) {
      return prefix;
    }
  }
  return shrimp.species;
}

window.getShrimpVisualIdentity = getShrimpVisualIdentity;

function isShrimpTankFiltered(shrimp) {
  if (!game) return false;
  const filterAlleles = game.tankFilterAlleles || [];
  const filterSpecies = game.tankFilterSpecies || [];

  if (filterAlleles.length === 0 && filterSpecies.length === 0) {
    return false;
  }

  const matchAllele =
    filterAlleles.length === 0 ||
    filterAlleles.includes(shrimp.hiddenGenes.allele1) ||
    filterAlleles.includes(shrimp.hiddenGenes.allele2);

  // Matches the exact visual pattern (WildR1, WildR2, or solid species)
  const visualId = getShrimpVisualIdentity(shrimp);
  const matchSpecies =
    filterSpecies.length === 0 || filterSpecies.includes(visualId);

  return matchAllele && matchSpecies;
}

window.isShrimpTankFiltered = isShrimpTankFiltered;

function isAnyTankFilterActive() {
  if (!game) return false;
  return (
    (game.tankFilterAlleles && game.tankFilterAlleles.length > 0) ||
    (game.tankFilterSpecies && game.tankFilterSpecies.length > 0)
  );
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

  // SHRIMP OVERHAUL
  const bodyWrapper = element.querySelector(".shrimp-body-wrapper");
  if (bodyWrapper) {
    let scaleFactor = 1.0;

    if (isAdult(shrimp)) {
      if (shrimp.species === "galaxySulawesi") {
        scaleFactor = 1.0;
      } else if (
        shrimp.species === "amanoShrimp" ||
        shrimp.species === "vampireShrimp"
      ) {
        scaleFactor = 2.55;
      } else if (shrimp.species === "legendaryScud") {
        scaleFactor = 0.75;
      } else {
        scaleFactor = shrimp.sex === "female" ? 1.2 : 1.0;
      }
    }

    bodyWrapper.style.transform = `scale(${scaleFactor})`;
  }

  let sellIndicator = element.querySelector(".sell-indicator");
  if (game.sellModeActive && game.selectedForSaleIds.includes(shrimp.id)) {
    element.classList.add("selected-for-sale");
    if (!sellIndicator) {
      sellIndicator = document.createElement("div");
      sellIndicator.className = "sell-indicator";
      sellIndicator.innerHTML =
        '<img src="emoji/dollar.png" alt="Dollar" class="ui-emoji">';
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

  let eggCluster = bodyWrapper
    ? bodyWrapper.querySelector(".egg-cluster")
    : null;
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

  // Live Search in Current Tank Highlight / Dim
  const filterActive = isAnyTankFilterActive();
  const isMatch = isShrimpTankFiltered(shrimp);

  if (filterActive) {
    if (isMatch) {
      element.classList.add("tank-highlighted");
      element.classList.remove("tank-dimmed");
    } else {
      element.classList.remove("tank-highlighted");
      element.classList.add("tank-dimmed");
    }
  } else {
    element.classList.remove("tank-highlighted", "tank-dimmed");
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

  destinationTanks.forEach((tankId) => {
    const isCurrent = tankId === currentTank;
    const tankCount = game.shrimp.filter(
      (s) => (s.tank || "tank1") === tankId && !s.dead,
    ).length;
    const tankCap = getTankCapacity(tankId);
    const remainingSpace = Math.max(0, tankCap - tankCount);
    const isFull = remainingSpace === 0;

    let badge = `<span style="color: var(--success); font-weight: bold;">Space: +${remainingSpace}</span>`;
    if (isCurrent)
      badge = `<span style="color: var(--muted); font-weight: bold;">(Current Tank)</span>`;
    else if (isFull)
      badge = `<span style="color: var(--danger); font-weight: bold;">(Full: 0 space)</span>`;
    else if (remainingSpace < selectedCount)
      badge = `<span style="color: var(--danger); font-weight: bold;">(Only ${remainingSpace} can fit)</span>`;

    const row = document.createElement("div");
    row.className = "cull-row";
    row.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;";

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

  const selectedShrimp = game.shrimp.filter(
    (s) => (game.selectedForSaleIds || []).includes(s.id) && !s.dead,
  );
  if (selectedShrimp.length === 0) return;

  const targetCap = getTankCapacity(targetTank);
  const targetCurrentCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === targetTank && !s.dead,
  ).length;
  const availableSpace = targetCap - targetCurrentCount;

  if (availableSpace <= 0) {
    addLog(`${formatTankName(targetTank)} is already full!`);
    return;
  }

  const moveCount = Math.min(selectedShrimp.length, availableSpace);

  for (let i = 0; i < moveCount; i++) {
    selectedShrimp[i].tank = targetTank;
  }

  addLog(
    `Transferred ${moveCount} shrimp from ${formatTankName(currentTank)} to ${formatTankName(targetTank)}.`,
  );
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

// Also expose globally just in case
window.executeMoveSelected = executeMoveSelected;
window.showMoveSelectedModal = showMoveSelectedModal;

function sellSelectedShrimp() {
  if (game.selectedForSaleIds.length === 0) return;

  const confirmed = confirm(
    `Are you sure you want to sell the ${game.selectedForSaleIds.length} selected shrimp?`,
  );
  if (!confirmed) return;

  let totalValue = 0;
  let count = 0;

  for (const id of game.selectedForSaleIds) {
    const shrimp = game.shrimp.find((s) => s.id === id);
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
  game.shrimp = game.shrimp.filter((s) => !s.dead);

  updateSellModeUI();
  render();
}

/* =========================================================
   AUTOMATED NURSERY: SMART TANK-WIDE CULLING
========================================================= */

const NURSERY_CULL = {
  active: false,
  babies: [],
  normalSoldValue: 0,
  normalSoldCount: 0,
  targetTank: "tank1",
};

function harvestTankNursery() {
  const currentTank = game.activeAquarium || "tank1";
  const spawningFemales = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && s.readyToBirth && !s.dead,
  );

  if (spawningFemales.length === 0) {
    addLog("No females are currently ready to spawn in this tank.");
    return;
  }

  // Check clutch size for each female ready in the tank
  spawningFemales.forEach((female) => checkClutchAchievements(female)); // SHRIMP OVERHAUL

  NURSERY_CULL.active = true;
  NURSERY_CULL.babies = [];
  NURSERY_CULL.normalSoldValue = 0;
  NURSERY_CULL.normalSoldCount = 0;
  NURSERY_CULL.targetTank = currentTank;

  spawningFemales.forEach((female) => {
    const specialForThisMother = [];

    (female.pendingBabies || []).forEach((baby) => {
      const isNewSpecies = !game.discovered.includes(baby.species);
      const isNewAllele =
        !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) ||
        !game.discoveredAlleles.includes(baby.hiddenGenes.allele2);
      const visualId = getShrimpVisualIdentity(baby);
      const isTargetSpecies = (game.trackedSpecies || []).includes(visualId);
      const isTargetAllele =
        (game.trackedAlleles || []).includes(baby.hiddenGenes.allele1) ||
        (game.trackedAlleles || []).includes(baby.hiddenGenes.allele2);

      if (isNewSpecies || isNewAllele || isTargetSpecies || isTargetAllele) {
        // Keep for manual culling!
        specialForThisMother.push(baby);
        NURSERY_CULL.babies.push({
          baby,
          femaleId: female.id,
          femaleName: displayName(female),
          isNewSpecies,
          isNewAllele,
          isTargetSpecies,
          isTargetAllele,
        });
      } else {
        // Auto-sell duplicate baby immediately
        const data = SHRRIMP_SAFE(baby.species);
        NURSERY_CULL.normalSoldValue += RARITY[data.rarity].value;
        NURSERY_CULL.normalSoldCount++;
      }
    });

    female.pendingBabies = specialForThisMother;

    // If this female has no special babies left, she rests right away
    if (specialForThisMother.length === 0) {
      completeFemaleBirth(female);
    }
  });

  // Credit all cash from auto-sold duplicate babies
  if (NURSERY_CULL.normalSoldValue > 0) {
    game.money += NURSERY_CULL.normalSoldValue;
  }

  // CASE 1: All babies across the tank were regular duplicates
  if (NURSERY_CULL.babies.length === 0) {
    NURSERY_CULL.active = false;
    addLog(
      `⚡ Nursery Harvest: Sold ${NURSERY_CULL.normalSoldCount} offspring for +$${NURSERY_CULL.normalSoldValue} across ${spawningFemales.length} females (no new traits or targets found).`,
    );
    playBigSaleSound();
    saveGame();
    render();
    return;
  }

  // CASE 2: Special offspring found! Open the curated Culling Menu
  playPregnantSound();
  showNurseryCullModal();
}

function showNurseryCullModal() {
  const modal = document.getElementById("shrimpModal");
  const modalBox = modal.querySelector(".modal-box");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;

  if (modalBox) modalBox.classList.add("modal-box-fixed");

  content.innerHTML = "";

  // 1. Header
  const headerRow = document.createElement("div");
  headerRow.style.cssText =
    "display: flex; justify-content: space-between; align-items: baseline; margin-right: 25px; margin-bottom: 4px;";
  headerRow.innerHTML = `
        <h2 style="margin: 0; font-size: 20px;">⚡ Nursery Harvest: Special Offspring (${NURSERY_CULL.babies.length})</h2>
        <span class="small-text" style="font-size: 12px; color: var(--success); font-weight: bold;">Auto-sold ${NURSERY_CULL.normalSoldCount} duplicates (+$${NURSERY_CULL.normalSoldValue})</span>
    `;
  content.appendChild(headerRow);

  // Dynamic count of traits remaining to be unlocked
  const remainingNewSpecies = NURSERY_CULL.babies.filter(
    (item) => !game.discovered.includes(item.baby.species),
  ).length;
  const remainingNewAlleles = NURSERY_CULL.babies.filter(
    (item) =>
      !game.discoveredAlleles.includes(item.baby.hiddenGenes.allele1) ||
      !game.discoveredAlleles.includes(item.baby.hiddenGenes.allele2),
  ).length;

  // 2. Trait Notice
  const targetNotice = document.createElement("div");
  targetNotice.style.cssText =
    "margin: 4px 0 6px 0; padding: 6px 12px; border-radius: 7px; border: 1.5px solid #52a56c; background: rgba(82, 165, 108, 0.16); font-size: 12px; font-weight: bold; color: var(--text);";

  if (remainingNewSpecies > 0 || remainingNewAlleles > 0) {
    targetNotice.innerHTML = `<strong>New Lineage Detected:</strong> Keeping one will register it in your collection and update duplicate badges in real time.`;
  } else {
    targetNotice.innerHTML = `<strong>Target Offspring:</strong> All remaining babies match your active search filters or target goals.`;
  }
  content.appendChild(targetNotice);

  // 3. Bulk Action Bar & Destination Tank
  const bulkRow = document.createElement("div");
  bulkRow.className = "cull-bulk-actions";
  bulkRow.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.cssText = "display: flex; gap: 6px;";

  const keepAllBtn = document.createElement("button");
  keepAllBtn.className = "primary-button";
  keepAllBtn.style.cssText = "padding: 5px 10px; font-size: 12px;";
  keepAllBtn.textContent = "Keep All (←)";
  keepAllBtn.addEventListener("click", () => nurseryKeepAll());
  buttonsDiv.appendChild(keepAllBtn);

  const sellAllBtn = document.createElement("button");
  sellAllBtn.className = "danger-button";
  sellAllBtn.style.cssText = "padding: 5px 10px; font-size: 12px;";
  sellAllBtn.textContent = "Sell All (→)";
  sellAllBtn.addEventListener("click", () => nurserySellAll());
  buttonsDiv.appendChild(sellAllBtn);

  bulkRow.appendChild(buttonsDiv);

  // Destination Tank Selector
  const unlockedTanks = getUnlockedTanks();
  if (unlockedTanks.length > 1 || game.favoritesTankUnlocked) {
    const tankSelect = document.createElement("select");
    tankSelect.className = "secondary-button";
    tankSelect.style.cssText =
      "padding: 4px 8px; font-size: 12px; cursor: pointer; border-radius: 6px; border: 1.5px solid var(--border);";

    unlockedTanks.forEach((t) => {
      const count = game.shrimp.filter(
        (s) => (s.tank || "tank1") === t && !s.dead,
      ).length;
      const cap = getTankCapacity(t);
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = `Dest: ${formatTankName(t)} (${count}/${cap})`;
      if (NURSERY_CULL.targetTank === t) opt.selected = true;
      tankSelect.appendChild(opt);
    });

    if (game.favoritesTankUnlocked) {
      const favCount = game.shrimp.filter(
        (s) => s.tank === "favorites" && !s.dead,
      ).length;
      const favCap = getTankCapacity("favorites");
      const opt = document.createElement("option");
      opt.value = "favorites";
      opt.textContent = `Dest: ★ Favorites (${favCount}/${favCap})`;
      if (NURSERY_CULL.targetTank === "favorites") opt.selected = true;
      tankSelect.appendChild(opt);
    }

    tankSelect.addEventListener("change", () => {
      NURSERY_CULL.targetTank = tankSelect.value;
    });
    bulkRow.appendChild(tankSelect);
  }

  content.appendChild(bulkRow);

  // 4. Curated Offspring List (Evaluated dynamically)
  const listDiv = document.createElement("div");
  listDiv.className = "cull-list";

  NURSERY_CULL.babies.forEach((item, idx) => {
    const baby = item.baby;
    const babyImgPrefix = getShrimpImagePrefix(baby);
    const data = SHRRIMP_SAFE(baby.species);
    const rarity = data.rarity;
    const value = getShrimpSellValue(baby);

    // Dynamic checks against current collection state
    const isNewSpeciesNow = !game.discovered.includes(baby.species);
    const isNewAlleleNow =
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) ||
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele2);
    const visualId = getShrimpVisualIdentity(baby);
    const isTargetSpecies = (game.trackedSpecies || []).includes(visualId);
    const isTargetAllele =
      (game.trackedAlleles || []).includes(baby.hiddenGenes.allele1) ||
      (game.trackedAlleles || []).includes(baby.hiddenGenes.allele2);

    const row = document.createElement("div");
    row.className = "cull-row";

    // Buttons
    const btns = document.createElement("div");
    btns.className = "cull-buttons";

    const keepBtn = document.createElement("button");
    keepBtn.className = "primary-button keep-btn";
    keepBtn.textContent = "Keep";
    keepBtn.addEventListener("click", () => nurseryKeepOne(idx));
    btns.appendChild(keepBtn);

    const sellBtn = document.createElement("button");
    sellBtn.className = "danger-button sell-btn";
    sellBtn.textContent = `Sell ($${value})`;
    sellBtn.addEventListener("click", () => nurserySellOne(idx));
    btns.appendChild(sellBtn);

    row.appendChild(btns);

    // SHRIMP OVERHAUL
    // Thumbnail
    const media = document.createElement("div");
    media.className = "cull-media";
    const sexSuffix = baby.sex === "male" ? "M" : "F";
    media.innerHTML = `<img src="shrimp/${babyImgPrefix}${sexSuffix}2.png" class="cull-baby-img" onerror="cullImageError(this, '${data.color}')">`;
    row.appendChild(media);

    // Info (with formatAlleleDisplay dynamically coloring undiscovered alleles)
    const info = document.createElement("div");
    info.className = "cull-info";
    info.innerHTML = `
            <strong>${data.name}</strong>
            <span class="small-text">${capitalize(baby.sex)} • ${capitalize(baby.pattern)} Pattern • <span class="rarity-${rarity}">${capitalize(rarity)}</span></span>
            <span class="small-text" style="display:block; margin-top:2px; color:var(--muted);">
                ${icon("dna")} Alleles: ${formatAlleleDisplay(baby.hiddenGenes.allele1)} / ${formatAlleleDisplay(baby.hiddenGenes.allele2)} • <span style="font-size:10px;">Mother: ${item.femaleName}</span>
            </span>
        `;
    row.appendChild(info);

    // Dynamic Special Badges
    const badgeBox = document.createElement("div");
    badgeBox.style.cssText =
      "margin-left: auto; display: flex; gap: 6px; align-items: center;";

    if (isNewSpeciesNow) {
      badgeBox.innerHTML += `<span style="font-weight:bold; color:var(--success); font-size:12px;">${icon("shrimp")} NEW VARIANT</span>`;
    }
    if (isNewAlleleNow) {
      badgeBox.innerHTML += `<span style="font-weight:bold; color:var(--success); font-size:12px;">${icon("dna")} NEW ALLELE</span>`;
    }
    if (isTargetSpecies || isTargetAllele) {
      badgeBox.innerHTML += `<span style="font-weight:bold; color:#d47b32; font-size:12px;">${icon("target")} TARGET</span>`;
    }

    row.appendChild(badgeBox);
    listDiv.appendChild(row);
  });

  content.appendChild(listDiv);
  modal.classList.remove("hidden");
}

function nurseryKeepOne(idx) {
  const item = NURSERY_CULL.babies[idx];
  if (!item) return;

  const targetTank = NURSERY_CULL.targetTank || "tank1";
  const cap = getTankCapacity(targetTank);
  const count = game.shrimp.filter(
    (s) => (s.tank || "tank1") === targetTank && !s.dead,
  ).length;

  if (count >= cap) {
    showCapacityWarning();
    addLog(
      `Cannot keep: ${formatTankName(targetTank)} is full (${count}/${cap})!`,
    );
    return;
  }

  const baby = item.baby;
  const newShrimp = addShrimp(
    baby.species,
    baby.sex,
    false,
    [item.femaleId],
    baby.hiddenGenes,
    targetTank,
    baby.pattern,
  );
  if (newShrimp) {
    newShrimp.pattern = baby.pattern;
    discover(baby.species);
    discoverWildPattern(newShrimp);
  }
  discoverAllele(baby.hiddenGenes.allele1);
  discoverAllele(baby.hiddenGenes.allele2);

  lastRenderedMoney = null;
  lastRenderedShopState = "";
  lastCollectionState = "";

  playKeepSound();
  removeNurseryBaby(idx);
}

// SHRIMP OVERHAUL
function nurserySellOne(idx) {
  const item = NURSERY_CULL.babies[idx];
  if (!item) return;

  const data = SHRRIMP_SAFE(item.baby.species);
  const val = getShrimpSellValue(item.baby); // <-- Uses full scaled value

  game.money += val;
  addLog(`Sold special baby ${data.name} for $${val}.`);
  playSellSound();

  removeNurseryBaby(idx);
}

function removeNurseryBaby(idx) {
  const item = NURSERY_CULL.babies[idx];
  if (!item) return;

  const female = game.shrimp.find(
    (s) => Number(s.id) === Number(item.femaleId),
  );
  if (female && female.pendingBabies) {
    const pIdx = female.pendingBabies.indexOf(item.baby);
    if (pIdx > -1) female.pendingBabies.splice(pIdx, 1);
    if (female.pendingBabies.length === 0) completeFemaleBirth(female);
  }

  NURSERY_CULL.babies.splice(idx, 1);

  if (NURSERY_CULL.babies.length === 0) {
    finishNurseryCull();
  } else {
    showNurseryCullModal();
  }
}

function nurseryKeepAll() {
  const targetTank = NURSERY_CULL.targetTank || "tank1";
  const cap = getTankCapacity(targetTank);
  let kept = 0;
  let hitCapacity = false;

  while (NURSERY_CULL.babies.length > 0) {
    const count = game.shrimp.filter(
      (s) => (s.tank || "tank1") === targetTank && !s.dead,
    ).length;
    if (count >= cap) {
      hitCapacity = true;
      break;
    }

    const item = NURSERY_CULL.babies.shift();
    const baby = item.baby;
    const newShrimp = addShrimp(
      baby.species,
      baby.sex,
      false,
      [item.femaleId],
      baby.hiddenGenes,
      targetTank,
      baby.pattern,
    );
    if (newShrimp) {
      newShrimp.pattern = baby.pattern;
      discover(baby.species);
      discoverWildPattern(newShrimp);
    }
    discoverAllele(baby.hiddenGenes.allele1);
    discoverAllele(baby.hiddenGenes.allele2);

    // Remove only THIS specific baby from the female's pending list
    const female = game.shrimp.find(
      (s) => Number(s.id) === Number(item.femaleId),
    );
    if (female && female.pendingBabies) {
      const pIdx = female.pendingBabies.indexOf(baby);
      if (pIdx > -1) female.pendingBabies.splice(pIdx, 1);
      if (female.pendingBabies.length === 0) {
        completeFemaleBirth(female);
      }
    }

    kept++;
  }

  lastRenderedMoney = null;
  lastRenderedShopState = "";
  lastCollectionState = "";

  if (kept > 0) {
    addLog(`Kept ${kept} special offspring in ${formatTankName(targetTank)}.`);
    playKeepSound();
  }

  if (hitCapacity) {
    showCapacityWarning();
    addLog(
      `Stopped: ${formatTankName(targetTank)} reached capacity (${cap}/${cap})!`,
    );
  }

  if (NURSERY_CULL.babies.length === 0) {
    finishNurseryCull();
  } else {
    showNurseryCullModal();
  }
}

// SHRIMP OVERHAUL
function nurserySellAll() {
  let soldVal = 0;
  let soldCount = 0;

  NURSERY_CULL.babies.forEach((item) => {
    const data = SHRRIMP_SAFE(item.baby.species);
    soldVal += getShrimpSellValue(item.baby); // <-- Uses full scaled value
    soldCount++;

    const female = game.shrimp.find(
      (s) => Number(s.id) === Number(item.femaleId),
    );
    if (female && female.pendingBabies) {
      female.pendingBabies = [];
      completeFemaleBirth(female);
    }
  });

  game.money += soldVal;
  addLog(`Sold remaining ${soldCount} special offspring for $${soldVal}.`);
  playBigSaleSound();

  NURSERY_CULL.babies = [];
  finishNurseryCull();
}

function finishNurseryCull() {
  NURSERY_CULL.active = false;
  closeModal();

  // Invalidate cached renders so shop, collection, and dropdowns update immediately
  lastRenderedMoney = null;
  lastRenderedShopState = "";
  lastCollectionState = "";

  saveGame();
  render();
  renderCollection();
  renderShop();
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
  setTimeout(() => {
    msg.remove();
  }, 1500);
}

function selectShrimp(id) {
  const shrimp = game.shrimp.find((s) => Number(s.id) === Number(id));
  if (!shrimp) return;

  const cullModal = document.getElementById("shrimpModal");
  const isCullModalActive =
    cullModal &&
    !cullModal.classList.contains("hidden") &&
    cullModal.querySelector(".cull-list");
  if (isCullModalActive) return;

  if (game.sellModeActive && shrimp.readyToBirth) {
    showFloatingMessage("You cannot sell spawning females!", shrimp);
    return;
  }

  if (shrimp.readyToBirth) {
    game.selectedShrimpId = id;
    renderSelectedShrimp();
    if (!FOOD_PREP.cullFilters) {
      FOOD_PREP.cullFilters = {
        allele: "all",
        type: "all",
        gender: "all",
        targetTank: shrimp.tank || "tank1",
      };
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
  const shrimp = game.shrimp.find((s) => Number(s.id) === Number(shrimpId));
  if (!shrimp) return;

  const currentTank = shrimp.tank || "tank1";
  if (currentTank === targetTank) return;

  const targetCap = getTankCapacity(targetTank);
  const targetCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === targetTank && !s.dead,
  ).length;

  if (targetCount >= targetCap) {
    addLog(
      `Cannot transfer: ${formatTankName(targetTank)} is full (${targetCount}/${targetCap})!`,
    );
    playBtnSound();
    return;
  }

  shrimp.tank = targetTank;
  addLog(
    `Transferred ${displayName(shrimp)} to ${formatTankName(targetTank)}.`,
  );
  playKeepSound();

  // Deselect shrimp once moved to another tank
  game.selectedShrimpId = null;
  lastSelectedId = null;
  lastSidebarState = "";

  // If the moved shrimp was part of the Select Mode selection:
  const numId = Number(shrimp.id);
  if (
    game.selectedForSaleIds &&
    game.selectedForSaleIds.some((id) => Number(id) === numId)
  ) {
    game.selectedForSaleIds = game.selectedForSaleIds.filter(
      (id) => Number(id) !== numId,
    );

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
  const shrimp = game.shrimp.find((s) => Number(s.id) === Number(id));
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
    const progress =
      100 * (1 - shrimp.pregnancyRemaining / shrimp.pregnancyTotal);
    pregnancyHTML =
      `
            <div class="panel">
                <strong>` +
      icon("berried") +
      ` Berried</strong>
                <p>Time remaining: ${formatDuration(shrimp.pregnancyRemaining)}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${progress}%"></div>
                </div>
            </div>
        `;
  } else if (shrimp.resting) {
    pregnancyHTML =
      `
            <div class="panel">
                <strong>` +
      icon("sleep") +
      ` Resting</strong>
                <p>Resting for: ${formatDuration(shrimp.restRemaining)}</p>
            </div>
        `;
  } else if (shrimp.sex === "female" && isAdult(shrimp)) {
    pregnancyHTML =
      `
            <div class="panel">
                <strong>` +
      icon("egg") +
      ` Saddled</strong>
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

  // If Nursery Harvest was open with un-harvested babies, keep them intact inside each female
  if (NURSERY_CULL.active) {
    NURSERY_CULL.active = false;
    // Make sure any female who still has pendingBabies stays readyToBirth
    game.shrimp.forEach((s) => {
      if (s.pendingBabies && s.pendingBabies.length > 0) {
        s.readyToBirth = true;
        s.resting = false;
      }
    });
  }

  const modal = document.getElementById("shrimpModal");
  if (modal) modal.classList.add("hidden");

  const modalBox = modal ? modal.querySelector(".modal-box") : null;
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

  const matchAllele =
    alleleFilter === "all" ||
    baby.hiddenGenes.allele1 === alleleFilter ||
    baby.hiddenGenes.allele2 === alleleFilter;
  const matchType = typeFilter === "all" || baby.species === typeFilter;
  const matchGender = genderFilter === "all" || baby.sex === genderFilter;

  return matchAllele && matchType && matchGender;
}
// SHRIMP OVERHAUL
function checkClutchAchievements(female) {
  if (!game || !female) return;
  if (!game.achievements) game.achievements = [];

  const hasPathetic = game.achievements.includes("patheticClutch");
  const hasEggnant = game.achievements.includes("mostEggnant");

  // If both achievements are already unlocked, stop checking
  if (hasPathetic && hasEggnant) return;

  const rarity = SHRRIMP_SAFE(female.species).rarity;
  const settings = RARITY[rarity];
  if (!settings || settings.babiesMin === settings.babiesMax) return;

  const babyPlants =
    typeof countPlantEffects === "function"
      ? countPlantEffects("babyBoost")
      : 0;
  const minBabies = Math.round(settings.babiesMin * Math.pow(1.15, babyPlants));
  const maxBabies = Math.round(settings.babiesMax * Math.pow(1.15, babyPlants));

  const clutchSize =
    female.initialClutchSize ||
    (female.pendingBabies ? female.pendingBabies.length : 0);
  if (clutchSize <= 0) return;

  // Check minimum clutch size
  if (
    !hasPathetic &&
    (clutchSize <= minBabies || clutchSize <= settings.babiesMin)
  ) {
    game.hasPatheticClutch = true;
    if (!game.achievements.includes("patheticClutch")) {
      game.achievements.push("patheticClutch");
      addLog(`${icon("trophy")} Achievement Unlocked: Pathetic Clutch!`);
      if (typeof triggerAchievementPopup === "function") {
        triggerAchievementPopup(
          "patheticClutch",
          ACHIEVEMENTS.patheticClutch.title,
          ACHIEVEMENTS.patheticClutch.desc,
        );
      }
      saveGame();
      if (typeof renderAchievements === "function") renderAchievements();
    }
  }

  // Check maximum clutch size
  if (
    !hasEggnant &&
    (clutchSize >= maxBabies || clutchSize >= settings.babiesMax)
  ) {
    game.hasMostEggnant = true;
    if (!game.achievements.includes("mostEggnant")) {
      game.achievements.push("mostEggnant");
      addLog(
        `${icon("trophy")} Achievement Unlocked: The Most Eggnant Shrimp Ever!`,
      );
      if (typeof triggerAchievementPopup === "function") {
        triggerAchievementPopup(
          "mostEggnant",
          ACHIEVEMENTS.mostEggnant.title,
          ACHIEVEMENTS.mostEggnant.desc,
        );
      }
      saveGame();
      if (typeof renderAchievements === "function") renderAchievements();
    }
  }
}

function showCullModal(female) {
  activeCullFemaleId = female.id;
  checkClutchAchievements(female); // SHRIMP OVERHAUL

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

  const hasNewShrimp = female.pendingBabies.some(
    (baby) => !game.discovered.includes(baby.species),
  );

  const hasNewAllele = female.pendingBabies.some(
    (baby) =>
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) ||
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele2),
  );

  // Check for tracked target alleles & target shrimp in this clutch
  const trackedAllelesPresent = new Set();
  if (game.trackedAlleles && game.trackedAlleles.length > 0) {
    female.pendingBabies.forEach((b) => {
      if (game.trackedAlleles.includes(b.hiddenGenes.allele1))
        trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele1).name);
      if (game.trackedAlleles.includes(b.hiddenGenes.allele2))
        trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele2).name);
    });
  }

  const trackedShrimpPresent = new Set();
  if (game.trackedSpecies && game.trackedSpecies.length > 0) {
    female.pendingBabies.forEach((b) => {
      const visualId = getShrimpVisualIdentity(b);
      if (game.trackedSpecies.includes(visualId)) {
        const sName = (
          SHRIMP[visualId] ||
          WILD_PATTERNS[visualId] || { name: visualId }
        ).name;
        trackedShrimpPresent.add(sName);
      }
    });
  }

  const hasAnyTarget =
    trackedAllelesPresent.size > 0 || trackedShrimpPresent.size > 0;

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

  // New Variant / Allele Banner
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

    let noticeText = "" + icon("dna") + " ";
    if (hasNewShrimp && hasNewAllele) {
      noticeText +=
        "<strong>New Variant & Allele detected!</strong> Keep them to expand collection & genetics.";
    } else if (hasNewShrimp) {
      noticeText +=
        "<strong>New Variant detected!</strong> Keep them to unlock them in your collection.";
    } else if (hasNewAllele) {
      noticeText +=
        "<strong>New Genetic Allele detected!</strong> Keep them to sequence their lineage.";
    }
    noticeBox.innerHTML = noticeText;
    content.appendChild(noticeBox);
  }

  // Ensure cullFilters state exists
  if (!FOOD_PREP.cullFilters) {
    FOOD_PREP.cullFilters = {
      allele: "all",
      type: "all",
      gender: "all",
      targetTank: female.tank || "tank1",
    };
  }
  if (!FOOD_PREP.cullFilters.targetTank) {
    FOOD_PREP.cullFilters.targetTank = female.tank || "tank1";
  }

  // Collect from ALL remaining offspring so dropdowns never break or vanish
  const presentAlleles = new Set();
  const presentTypes = new Set();
  const presentGenders = new Set();
  female.pendingBabies.forEach((baby) => {
    if (baby.hiddenGenes) {
      if (baby.hiddenGenes.allele1)
        presentAlleles.add(baby.hiddenGenes.allele1);
      if (baby.hiddenGenes.allele2)
        presentAlleles.add(baby.hiddenGenes.allele2);
    }
    if (baby.species) presentTypes.add(baby.species);
    if (baby.sex) presentGenders.add(baby.sex);
  });

  // Auto-reset filters if the selected item was completely sold/removed
  if (
    FOOD_PREP.cullFilters.allele !== "all" &&
    !presentAlleles.has(FOOD_PREP.cullFilters.allele)
  ) {
    FOOD_PREP.cullFilters.allele = "all";
  }
  if (
    FOOD_PREP.cullFilters.type !== "all" &&
    !presentTypes.has(FOOD_PREP.cullFilters.type)
  ) {
    FOOD_PREP.cullFilters.type = "all";
  }
  if (
    FOOD_PREP.cullFilters.gender !== "all" &&
    !presentGenders.has(FOOD_PREP.cullFilters.gender)
  ) {
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

    unlockedTanks.forEach((t) => {
      const count = game.shrimp.filter(
        (s) => (s.tank || "tank1") === t && !s.dead,
      ).length;
      const cap = getTankCapacity(t);
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = `Dest: ${formatTankName(t)} (${count}/${cap})`;
      if (FOOD_PREP.cullFilters.targetTank === t) opt.selected = true;
      tankSelect.appendChild(opt);
    });

    if (game.favoritesTankUnlocked) {
      const favCount = game.shrimp.filter(
        (s) => s.tank === "favorites" && !s.dead,
      ).length;
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

  presentAlleles.forEach((alleleId) => {
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

  presentTypes.forEach((typeId) => {
    const opt = document.createElement("option");
    opt.value = typeId;
    opt.textContent = (
      SHRIMP[typeId] ||
      WILD_PATTERNS[typeId] || { name: typeId }
    ).name;
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

  presentGenders.forEach((genderId) => {
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
    const value = getShrimpSellValue(baby);

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
    const sexSuffix = baby.sex === "male" ? "M" : "F";
    img.src = `shrimp/${babyImgPrefix}${sexSuffix}2.png`;
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
    const isNewAllele =
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) ||
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele2);

    const visualId =
      typeof getShrimpVisualIdentity === "function"
        ? getShrimpVisualIdentity(baby)
        : baby.species;
    const isTargetSpecies =
      (game.trackedSpecies || []).includes(visualId) ||
      (game.trackedSpecies || []).includes(baby.species);
    const isTargetAllele =
      (game.trackedAlleles || []).includes(baby.hiddenGenes.allele1) ||
      (game.trackedAlleles || []).includes(baby.hiddenGenes.allele2);

    if (isNewShrimp || isNewAllele || isTargetSpecies || isTargetAllele) {
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
        shrimpBadge.innerHTML =
          '<img src="emoji/shrimp.png" alt="Shrimp" class="ui-emoji"> NEW';
        badgeContainer.appendChild(shrimpBadge);
      }

      if (isNewAllele) {
        const alleleBadge = document.createElement("span");
        alleleBadge.style.fontWeight = "bold";
        alleleBadge.style.color = "var(--success)";
        alleleBadge.style.fontSize = "13px";
        alleleBadge.innerHTML =
          '<img src="emoji/dna.png" alt="DNA" class="ui-emoji"> NEW';
        badgeContainer.appendChild(alleleBadge);
      }

      if (isTargetSpecies || isTargetAllele) {
        const targetBadge = document.createElement("span");
        targetBadge.style.fontWeight = "bold";
        targetBadge.style.color = "#d47b32";
        targetBadge.style.fontSize = "13px";
        targetBadge.innerHTML =
          '<img src="emoji/target.png" alt="Target" class="ui-emoji"> TARGET';
        badgeContainer.appendChild(targetBadge);
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
  const female = game.shrimp.find((s) => Number(s.id) === Number(femaleId));
  if (!female || !female.pendingBabies) return;

  let fitCount = 0;
  // Use selected destination tank from dropdown if available, else female's current tank
  const motherTank =
    FOOD_PREP.cullFilters && FOOD_PREP.cullFilters.targetTank
      ? FOOD_PREP.cullFilters.targetTank
      : female.tank || "tank1";
  const capacityLimit = getTankCapacity(motherTank);
  const matchingBabies = female.pendingBabies.filter((baby) =>
    matchesCullFilters(baby),
  );

  while (matchingBabies.length > 0) {
    const currentCount = game.shrimp.filter(
      (s) => (s.tank || "tank1") === motherTank && !s.dead,
    ).length;
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
      const newShrimp = addShrimp(
        baby.species,
        baby.sex,
        false,
        [female.id],
        baby.hiddenGenes,
        motherTank,
        baby.pattern,
      );
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
    addLog(
      `Kept ${fitCount} filtered babies in ${formatTankName(motherTank)}.`,
    );
  }
  playKeepSound();
  finishCullStep(female);
};

window.cullKeep = function (femaleId, idx) {
  const female = game.shrimp.find((s) => Number(s.id) === Number(femaleId));
  if (!female || !female.pendingBabies || !female.pendingBabies[idx]) return;

  const baby = female.pendingBabies[idx];
  const motherTank =
    FOOD_PREP.cullFilters && FOOD_PREP.cullFilters.targetTank
      ? FOOD_PREP.cullFilters.targetTank
      : female.tank || "tank1";
  const capacityLimit = getTankCapacity(motherTank);
  const currentCount = game.shrimp.filter(
    (s) => (s.tank || "tank1") === motherTank && !s.dead,
  ).length;

  if (currentCount >= capacityLimit) {
    game.pendingKeepBaby = baby;
    game.pendingKeepFemale = female;
    game.pendingKeepIndex = idx;
    showCapacityWarning();
    return;
  }

  const newShrimp = addShrimp(
    baby.species,
    baby.sex,
    false,
    [female.id],
    baby.hiddenGenes,
    motherTank,
    baby.pattern,
  );
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

// SHRIMP OVERHAUL
window.cullSellAll = function (femaleId) {
  const female = game.shrimp.find((s) => Number(s.id) === Number(femaleId));
  if (!female || !female.pendingBabies) return;

  const matchingBabies = female.pendingBabies.filter((baby) =>
    matchesCullFilters(baby),
  );

  // 1. Accurately check if ANY matching baby is a truly new variant
  const hasNewShrimp = matchingBabies.some(
    (baby) => !game.discovered.includes(baby.species),
  );

  // Accurately check if ANY matching baby carries an undiscovered allele
  const hasNewAllele = matchingBabies.some(
    (baby) =>
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele1) ||
      !game.discoveredAlleles.includes(baby.hiddenGenes.allele2),
  );

  // 3. Check for tracked target alleles
  const trackedAllelesPresent = new Set();
  if (game.trackedAlleles && game.trackedAlleles.length > 0) {
    matchingBabies.forEach((b) => {
      if (game.trackedAlleles.includes(b.hiddenGenes.allele1))
        trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele1).name);
      if (game.trackedAlleles.includes(b.hiddenGenes.allele2))
        trackedAllelesPresent.add(SHRRIMP_SAFE(b.hiddenGenes.allele2).name);
    });
  }

  // 4. Check for tracked target shrimp
  const trackedShrimpPresent = new Set();
  if (game.trackedSpecies && game.trackedSpecies.length > 0) {
    matchingBabies.forEach((b) => {
      const visualId =
        typeof getShrimpVisualIdentity === "function"
          ? getShrimpVisualIdentity(b)
          : b.species;
      if (
        game.trackedSpecies.includes(visualId) ||
        game.trackedSpecies.includes(b.species)
      ) {
        const sName = (
          SHRIMP[visualId] ||
          WILD_PATTERNS[visualId] ||
          SHRIMP[b.species] || { name: b.species }
        ).name;
        trackedShrimpPresent.add(sName);
      }
    });
  }

  const hasTarget =
    trackedAllelesPresent.size > 0 || trackedShrimpPresent.size > 0;

  // Show confirmation modal ONLY if there is an actual reason
  if (hasNewShrimp || hasNewAllele || hasTarget) {
    let warningMsg = "Are you sure you want to sell all matching offspring?";

    if (hasNewShrimp && hasNewAllele) {
      warningMsg +=
        "\n\nWarning: Some offspring contain a NEW VARIANT and a NEW GENETIC ALLELE not yet discovered!";
    } else if (hasNewShrimp) {
      warningMsg +=
        "\n\nWarning: Some offspring contain a NEW VARIANT not yet discovered!";
    } else if (hasNewAllele) {
      warningMsg +=
        "\n\nWarning: Some offspring contain a NEW GENETIC ALLELE not yet discovered!";
    }

    if (trackedShrimpPresent.size > 0) {
      warningMsg += `\n\nWarning: Offspring match your TARGET SHRIMP (${Array.from(trackedShrimpPresent).join(", ")})!`;
    }
    if (trackedAllelesPresent.size > 0) {
      warningMsg += `\n\nWarning: Offspring carry your TARGET ALLELE(S) (${Array.from(trackedAllelesPresent).join(", ")})!`;
    }

    const confirmed = confirm(warningMsg);
    if (!confirmed) return;
  }

  let totalValue = 0;
  let soldCount = 0;

  matchingBabies.forEach((baby) => {
    const originalIdx = female.pendingBabies.indexOf(baby);
    if (originalIdx > -1) {
      const data = SHRRIMP_SAFE(baby.species);
      totalValue += getShrimpSellValue(baby);
      female.pendingBabies.splice(originalIdx, 1);
      soldCount++;
    }
  });

  game.money += totalValue;
  addLog(`Sold ${soldCount} filtered babies for $${totalValue}.`);

  playBigSaleSound();
  finishCullStep(female);
};

// SHRIMP OVERHAUL
window.cullSell = function (femaleId, idx) {
  const female = game.shrimp.find((s) => Number(s.id) === Number(femaleId));
  if (!female || !female.pendingBabies || !female.pendingBabies[idx]) return;

  const baby = female.pendingBabies[idx];
  const data = SHRRIMP_SAFE(baby.species);
  const value = getShrimpSellValue(baby); // <-- Uses full scaled value

  game.money += value;
  addLog(`Sold baby ${data.name} for $${value}.`);

  playSellSound();

  female.pendingBabies.splice(idx, 1);
  finishCullStep(female);
};

/* =========================================================
   TANK-WIDE BULK CULL OFFSPRING
========================================================= */

function showTankBulkCullModal() {
  const currentTank = game.activeAquarium || "tank1";
  const spawningFemales = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && s.readyToBirth && !s.dead,
  );

  if (spawningFemales.length === 0) {
    addLog("No females are currently ready to spawn in this tank.");
    return;
  }

  const modal = document.getElementById("shrimpModal");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;

  let totalBabies = 0;
  let totalValue = 0;
  const protectedBabies = []; // New species or new alleles

  spawningFemales.forEach((f) => {
    (f.pendingBabies || []).forEach((b) => {
      totalBabies++;
      const data = SHRRIMP_SAFE(b.species);
      totalValue += RARITY[data.rarity].value;

      const isNewSpecies = !game.discovered.includes(b.species);
      const isNewAllele =
        !game.discoveredAlleles.includes(b.hiddenGenes.allele1) ||
        !game.discoveredAlleles.includes(b.hiddenGenes.allele2);
      const isTracked =
        (game.trackedSpecies || []).includes(b.species) ||
        (game.trackedAlleles || []).includes(b.hiddenGenes.allele1) ||
        (game.trackedAlleles || []).includes(b.hiddenGenes.allele2);

      if (isNewSpecies || isNewAllele || isTracked) {
        protectedBabies.push({
          female: f,
          baby: b,
          reason: isNewSpecies
            ? "New Species"
            : isNewAllele
              ? "New Allele"
              : "Target",
        });
      }
    });
  });

  let warningHTML = "";
  if (protectedBabies.length > 0) {
    warningHTML = `
            <div style="background: rgba(212, 123, 50, 0.15); border: 1.5px solid #d47b32; padding: 10px; border-radius: 8px; margin: 12px 0;">
                <strong style="color: #d47b32;">⚠️ Notice: ${protectedBabies.length} offspring carry NEW or TARGET traits!</strong>
                <p class="small-text" style="margin: 4px 0 0 0;">You can keep the special ones and sell the rest, or sell everything.</p>
            </div>
        `;
  }

  content.innerHTML = `
        <h2><img src="emoji/baby.png" alt="Baby" class="ui-emoji"> Tank Offspring Nursery</h2>
        <p style="margin: 10px 0;">
            <strong>${spawningFemales.length}</strong> spawning females found in ${formatTankName(currentTank)} with 
            <strong>${totalBabies}</strong> total offspring ready.
        </p>
        <p style="font-size: 16px; font-weight: bold; color: var(--success);">
            Total Sale Value: +$${totalValue}
        </p>
        ${warningHTML}
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; flex-wrap: wrap;">
            <button id="cancelTankCullBtn" class="secondary-button">Cancel</button>
            ${
              protectedBabies.length > 0
                ? `
                <button id="protectAndSellTankCullBtn" class="primary-button" style="background-color: #52a56c;">
                    🛡️ Keep ${protectedBabies.length} Special & Sell Rest
                </button>
            `
                : ""
            }
            <button id="confirmAllTankCullBtn" class="danger-button">
                💰 Sell All (${totalBabies})
            </button>
        </div>
    `;

  modal.classList.remove("hidden");

  content.querySelector("#cancelTankCullBtn").addEventListener("click", () => {
    playBtnSound();
    closeModal();
  });

  if (protectedBabies.length > 0) {
    content
      .querySelector("#protectAndSellTankCullBtn")
      .addEventListener("click", () => {
        executeTankBulkCull(true);
      });
  }

  content
    .querySelector("#confirmAllTankCullBtn")
    .addEventListener("click", () => {
      executeTankBulkCull(false);
    });
}

function executeTankBulkCull(protectSpecial = false) {
  const currentTank = game.activeAquarium || "tank1";
  const spawningFemales = game.shrimp.filter(
    (s) => (s.tank || "tank1") === currentTank && s.readyToBirth && !s.dead,
  );
  const capacityLimit = getTankCapacity(currentTank);

  let earnedMoney = 0;
  let keptCount = 0;
  let soldCount = 0;

  spawningFemales.forEach((f) => {
    const babies = [...(f.pendingBabies || [])];
    babies.forEach((b) => {
      const isSpecial =
        !game.discovered.includes(b.species) ||
        !game.discoveredAlleles.includes(b.hiddenGenes.allele1) ||
        !game.discoveredAlleles.includes(b.hiddenGenes.allele2) ||
        (game.trackedSpecies || []).includes(b.species) ||
        (game.trackedAlleles || []).includes(b.hiddenGenes.allele1) ||
        (game.trackedAlleles || []).includes(b.hiddenGenes.allele2);

      const currentCount = game.shrimp.filter(
        (s) => (s.tank || "tank1") === currentTank && !s.dead,
      ).length;

      if (protectSpecial && isSpecial && currentCount < capacityLimit) {
        // Keep baby
        const newShrimp = addShrimp(
          b.species,
          b.sex,
          false,
          [f.id],
          b.hiddenGenes,
          currentTank,
        );
        if (newShrimp) {
          newShrimp.pattern = b.pattern;
          discoverWildPattern(newShrimp);
        }
        discoverAllele(b.hiddenGenes.allele1);
        discoverAllele(b.hiddenGenes.allele2);
        keptCount++;
      } else {
        // Sell baby
        const data = SHRRIMP_SAFE(b.species);
        earnedMoney += RARITY[data.rarity].value;
        soldCount++;
      }
    });

    // Set female to resting
    completeFemaleBirth(f);
  });

  game.money += earnedMoney;
  addLog(
    `Nursery processed: Sold ${soldCount} babies (+$${earnedMoney})${keptCount > 0 ? `, kept ${keptCount} special offspring` : ""}.`,
  );

  playBigSaleSound();
  closeModal();
  saveGame();
  render();
}

function completeFemaleBirth(female) {
  const rarity = SHRRIMP_SAFE(female.species).rarity;
  female.readyToBirth = false;
  female.pendingBabies = [];
  female.resting = true;
  female.saddle = false;

  let rest = RARITY[rarity].rest;

  const motherTank = female.tank || "tank1";
  if (hasLiveShrimp("redNose", motherTank)) {
    rest *= 0.8;
  }

  const restPlants = countPlantEffects("restReduction", motherTank);
  rest *= Math.pow(0.85, restPlants);
  female.restRemaining = rest;

  addLog(`${displayName(female)} has finished culling and is now resting.`);

  if (game.selectedShrimpId === female.id) {
    lastSidebarState = "";
    renderSelectedShrimp();
  }
}
// SHRIMP OVERHAUL
function isCaridinaPageUnlocked() {
  if (!game || !game.discovered) return false;
  return (
    game.discovered.includes("galaxySulawesi") ||
    game.discovered.includes("wildSulawesi") ||
    game.discovered.includes("wildCaridinaCantonensis") ||
    hasLiveShrimp("galaxySulawesi")
  );
}

// SHRIMP OVERHAUL
function isMalawaUnlocked() {
  if (!game) return false;
  const tibeeIds = ["tibee1", "tibee2", "tibee3", "tibee4", "tibee5", "tibee6"];
  const hasTiBee =
    (game.discovered && tibeeIds.some((id) => game.discovered.includes(id))) ||
    (game.shrimp &&
      game.shrimp.some((s) => !s.dead && tibeeIds.includes(s.species)));
  return Boolean(
    hasTiBee ||
    (game.discovered && game.discovered.includes("malawaShrimp")) ||
    hasLiveShrimp("malawaShrimp"),
  );
}
// SHRIMP OVERHAUL
function isMetallicBoaUnlocked() {
  if (!game) return false;
  const tibeeIds = ["tibee1", "tibee2", "tibee3", "tibee4", "tibee5", "tibee6"];
  const allTibeesFound = tibeeIds.every(
    (id) =>
      (game.discovered && game.discovered.includes(id)) ||
      (game.shrimp && game.shrimp.some((s) => !s.dead && s.species === id)),
  );
  return Boolean(
    allTibeesFound ||
    (game.discovered && game.discovered.includes("metallicBoaBlack")) ||
    hasLiveShrimp("metallicBoaBlack"),
  );
}

function isBambooShrimpUnlocked() {
  if (!game) return false;
  const commonKeys = Object.keys(SHRIMP).filter(
    (key) => SHRIMP[key].rarity === "common",
  );
  return commonKeys.every((key) => game.discovered.includes(key));
}

function isAmanoUnlocked() {
  if (!game || !game.plants) return false;
  const required = Object.keys(SHOP_PLANTS);
  // Unlocks if player owns all plants in ANY of their tanks
  const allTanks = ALL_TANKS.concat(["favorites"]);
  return allTanks.some((t) => {
    const tankP = getTankPlants(t);
    return required.every((p) => tankP.includes(p));
  });
}

function isSulawesiUnlocked() {
  return !!game && game.tankUpgradeLevel >= 9; //SHRIMP OVERHAUL
}

//SHRIMP OVERHAUL
function isGlassLaceUnlocked() {
  if (!game) return false;
  const has10Tanks = (game.tankUpgradeLevel || 0) >= 9;
  const hasMaxFavorites = (game.favoritesTankLevel || 0) >= 9;
  return has10Tanks && hasMaxFavorites;
}

function isBambooUnlocked() {
  return isBambooShrimpUnlocked();
}

function isScudUnlocked() {
  return (
    !!game && !!game.unlockedSpeeds && game.unlockedSpeeds.includes("game2")
  );
}

function isRedCrawfishUnlocked() {
  return !!game && (game.favoritesTankLevel || 0) >= 9;
}

function isRedNoseUnlocked() {
  if (!game || !game.discoveredAlleles) return false;

  const palmataSpecies = Object.keys(SHRIMP).filter(
    (k) => SHRIMP[k].family === "palmata",
  );
  const redSpecies = Object.keys(SHRIMP).filter(
    (k) => SHRIMP[k].family === "red",
  );

  const palmataComplete =
    palmataSpecies.length > 0 &&
    palmataSpecies.every((k) => game.discoveredAlleles.includes(k));
  const redComplete =
    redSpecies.length > 0 &&
    redSpecies.every((k) => game.discoveredAlleles.includes(k));

  return palmataComplete && redComplete;
}

function isBabaultiUnlocked() {
  if (!game || !game.discoveredAlleles) return false;
  const redSpecies = Object.keys(SHRIMP).filter(
    (k) => SHRIMP[k].family === "red",
  );
  return (
    redSpecies.length > 0 &&
    redSpecies.every((k) => game.discoveredAlleles.includes(k))
  );
}

function isVampireUnlocked() {
  return !!game && (game.minigame1HighScore || 0) >= 500;
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

  const logMsg =
    nextFavLevel === 1
      ? "Purchased the Favorites Tank! Transfer shrimp to it from the tank dropdown or select card."
      : `Upgraded Favorites Tank to Lv. ${nextFavLevel} (Capacity: ${upgrade.capacity} shrimp).`;

  addLog(logMsg);

  lastRenderedMoney = null;
  if (typeof lastRenderedShopState !== "undefined") lastRenderedShopState = "";
  saveGame();
  render();

  // Check for "Fancy Shrimp Club" max upgrade achievement immediately
  if (typeof checkAchievements === "function") {
    checkAchievements();
  }
}

function buySpeedUpgrade(upgrade) {
  if (game.unlockedSpeeds.includes(upgrade.speed)) return;

  // Prerequisite tier check
  const SPEED_PREREQUISITES = {
    5: 2,
    20: 5,
    60: 20,
  };

  const prevRequired = SPEED_PREREQUISITES[upgrade.speed];
  if (prevRequired && !game.unlockedSpeeds.includes(prevRequired)) {
    addLog(`You must unlock ${prevRequired}x Time Acceleration first!`);
    return;
  }

  if (game.money < upgrade.price) {
    addLog("Not enough money.");
    return;
  }

  game.money -= upgrade.price;
  game.unlockedSpeeds.push(upgrade.speed);

  playSellSound();
  updateSpeedButtons();
  lastRenderedMoney = null;
  lastRenderedShopState = "";
  saveGame();
  renderShop();

  addLog(`Successfully unlocked the ${upgrade.speed}x speed acceleration!`);
}

function updateSpeedButtons() {
  const speeds = {
    speed1: 1,
    speed2: 2,
    speed5: 5,
    speed20: 20,
    speed60: 60,
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
    frame = frame === 1 ? 2 : 1;
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
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      playBtnSound();
      document
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((tab) => tab.classList.remove("active"));

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
    speed60: 60,
  };

  for (const [id, speed] of Object.entries(speeds)) {
    document.getElementById(id).addEventListener("click", () => {
      GAME.speed = speed;
      document
        .querySelectorAll(".speed-button")
        .forEach((b) => b.classList.remove("active"));
      document.getElementById(id).classList.add("active");
    });
  }
}

/* =========================================================
   SPECIALS
========================================================= */

function buyZombieMale() {
  const targetTank = getAvailableTankForPurchase();

  if (!targetTank) {
    showCapacityWarning();
    return;
  }

  const price = 250000;
  if (game.money < price) {
    addLog("Not enough money for the Zombie Male.");
    return;
  }

  game.money -= price;
  playSellSound();

  const shrimp = addShrimp(
    "zombieShrimp",
    "male",
    true,
    [],
    { allele1: "zombieShrimp", allele2: "zombieShrimp" },
    targetTank,
  );
  discover("zombieShrimp");

  addLog(
    `Purchased a Male Zombie Shrimp (placed in ${formatTankName(targetTank)})!`,
  );
  saveGame();
  render();
  renderSpecialsModal();
  if (typeof checkAchievements === "function") checkAchievements();
}

function renderSpecialsModal() {
  const collectionContainer = document.getElementById(
    "specialsCollectionContainer",
  );
  if (!collectionContainer) return;

  const specialsList = Object.keys(SHRIMP).filter(
    (k) => SHRIMP[k].rarity === "special",
  );
  collectionContainer.innerHTML = "";

  specialsList.forEach((id) => {
    const data = SHRIMP[id];
    const discovered = game.discovered.includes(id);
    const card = document.createElement("div");
    card.className = "collection-card " + (discovered ? "" : "locked");

    if (discovered) {
      card.innerHTML = `
                <strong>${data.name}</strong>
                <div class="collection-image-container" style="width: 70px; height: 50px; margin: 10px auto; position: relative;">
                    <img src="shrimp/${data.image}F2.png" alt="${data.name}" class="collection-shrimp-img" style="width: 100%; height: 100%; object-fit: contain; cursor: zoom-in;">
                </div>
                <small class="rarity-special">Special</small>
            `;
      const img = card.querySelector(".collection-shrimp-img");
      if (img) {
        img.addEventListener("click", (e) => {
          e.stopPropagation();
          zoomShrimpImage(img);
        });
      }
    } else {
      card.innerHTML = `
                <strong>???</strong>
                <div class="collection-image-container" style="width: 70px; height: 50px; margin: 10px auto; position: relative;">
                    <div class="collection-color" style="--shrimp-color:#888; width: 35px; height: 25px; border-radius: 50%; margin: 10px auto; background: var(--shrimp-color);"></div>
                </div>
                <small>Undiscovered Special</small>
            `;
    }
    collectionContainer.appendChild(card);
  });
}

/* =========================================================
   UTILITIES
========================================================= */

function randomSex() {
  return Math.random() < 0.5 ? "male" : "female";
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
  return String(hours).padStart(2, "0") + ":" + String(mins).padStart(2, "0");
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* =========================================================
   RESET
========================================================= */

function resetGame() {
  const confirmed = confirm(
    "Are you sure you want to erase your aquarium and start over?",
  );
  if (!confirmed) return;

  localStorage.removeItem(SAVE_KEY);
  game = createNewGame();

  // Reset speeds to 1x default
  GAME.speed = 1;
  document
    .querySelectorAll(".speed-button")
    .forEach((b) => b.classList.remove("active"));
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
  syncControls(
    menuBgmSlider,
    menuBgmLabel,
    menuBgmToggle,
    game.bgmVolume,
    game.bgmMuted,
  );
  syncControls(sfxSlider, sfxLabel, sfxToggle, game.sfxVolume, game.sfxMuted);
  syncControls(
    menuSfxSlider,
    menuSfxLabel,
    menuSfxToggle,
    game.sfxVolume,
    game.sfxMuted,
  );

  document.body.classList.remove("dark-theme");
  if (themeToggle) {
    themeToggle.textContent = "Dark";
    themeToggle.className = "secondary-button";
  }
  if (themeLabel) themeLabel.textContent = "Light Mode";
  if (menuThemeToggle) {
    menuThemeToggle.textContent = "Dark";
    menuThemeToggle.className = "secondary-button";
  }
  if (menuThemeLabel) menuThemeLabel.textContent = "Light Mode";

  updateAudioVolumes();

  // Reset render caches
  lastRenderedMoney = null;
  lastRenderedShopState = "";
  lastCollectionState = "";
  lastSelectedId = null;
  lastSidebarState = "";

  saveGame();
  addLog("New aquarium started!");

  render();
  renderCollection();
  renderShop();
}

// SHRIMP OVERHAUL
function hasDiscoveredOrOwnedGalaxySulawesi() {
  if (!game) return false;
  return (
    (game.discovered && game.discovered.includes("galaxySulawesi")) ||
    hasLiveShrimp("galaxySulawesi")
  );
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
  setupTankFilterAllelesDropdown();
  setupTankFilterShrimpDropdown();

  // Setup Tank Dropdown Switcher SHRIMP OVERHAUL
  const tankDropdown = document.getElementById("tankSelectDropdown");
  if (tankDropdown) {
    tankDropdown.addEventListener("change", (e) => {
      const newTank = e.target.value;
      if (!newTank) return;

      tankDropdown.dataset.currentTank = newTank;
      game.activeAquarium = newTank;
      game.selectedShrimpId = null;

      if (game.sellModeActive) {
        game.selectedForSaleIds = [];
        updateSellModeUI();
      }

      const listBody = document.querySelector(
        "#movableShrimpList .movable-body",
      );
      if (listBody) delete listBody.dataset.cache;

      lastSelectedId = null;
      lastSidebarState = "";

      playBtnSound();
      saveGame();
      render();
    });
  }

  // Decorating Studio Button Listeners
  const decorBtn = document.getElementById("decorateTankBtn");
  if (decorBtn) {
    decorBtn.addEventListener("click", () => {
      playBtnSound();
      DECOR_STUDIO.open();
    });
  }

  const decorSaveBtn = document.getElementById("decorStudioSaveBtn");
  if (decorSaveBtn) {
    decorSaveBtn.addEventListener("click", () => {
      DECOR_STUDIO.close(true);
    });
  }

  const decorCancelBtn = document.getElementById("decorStudioCancelBtn");
  if (decorCancelBtn) {
    decorCancelBtn.addEventListener("click", () => {
      playBtnSound();
      DECOR_STUDIO.close(false);
    });
  }

  const closeBmGoodsBtn = document.getElementById("closeBmGoodsModal");
  const bmGoodsModal = document.getElementById("bmGoodsModal");
  if (closeBmGoodsBtn && bmGoodsModal) {
    closeBmGoodsBtn.addEventListener("click", () => {
      playBtnSound();
      bmGoodsModal.classList.add("hidden");
    });
  }
  
  document.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable
    ) {
      return;
    }

    const shrimpModal = document.getElementById("shrimpModal");
    const isCullModalOpen =
      shrimpModal &&
      !shrimpModal.classList.contains("hidden") &&
      document.querySelector(".cull-list");

    if (isCullModalOpen) {
      // 1. Handle Nursery Harvest Keyboard Shortcuts (Arrow Left / Right)
      if (
        typeof NURSERY_CULL !== "undefined" &&
        NURSERY_CULL.active &&
        NURSERY_CULL.babies.length > 0
      ) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          nurseryKeepAll();
          return;
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nurserySellAll();
          return;
        }
      }

      // 2. Handle Single Female Culling Keyboard Shortcuts
      if (activeCullFemaleId !== null) {
        const activeFemale = game.shrimp.find(
          (s) => Number(s.id) === Number(activeCullFemaleId),
        );
        if (
          activeFemale &&
          activeFemale.readyToBirth &&
          activeFemale.pendingBabies &&
          activeFemale.pendingBabies.length > 0
        ) {
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

      const isValidKey = /^[A-Z0-9,\.]$/.test(inputKey);
      if (!isValidKey) return;

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
        const btn = document.querySelector(
          '.tab-button[data-tab="collection"]',
        );
        if (btn) btn.click();
      } else if (triggeredAction === "genetics") {
        const btn = document.querySelector('.tab-button[data-tab="genetics"]');
        if (btn) btn.click();
      } else if (triggeredAction === "log") {
        const btn = document.querySelector(
          '.tab-button[data-tab="achievements"]',
        );
        if (btn) btn.click();
      } else if (triggeredAction === "settings") {
        const btn = document.querySelector('.tab-button[data-tab="settings"]');
        if (btn) btn.click();
      } else if (triggeredAction === "sellMode") {
        toggleSellMode();
      } else if (triggeredAction === "favoriteTank") {
        if (
          game &&
          game.favoritesTankUnlocked &&
          game.activeAquarium !== "favorites"
        ) {
          game.activeAquarium = "favorites";
          game.selectedShrimpId = null;
          if (game.sellModeActive) {
            game.selectedForSaleIds = [];
            updateSellModeUI();
          }
          const listBody = document.querySelector(
            "#movableShrimpList .movable-body",
          );
          if (listBody) delete listBody.dataset.cache;
          lastSelectedId = null;
          lastSidebarState = "";
          playBtnSound();
          saveGame();
          render();
        }
      } else if (triggeredAction === "speedDown") {
        const speedLadder = [1, 2, 5, 20, 60];
        const availableSpeeds = speedLadder.filter((s) =>
          game.unlockedSpeeds.includes(s),
        );
        const currentIdx = availableSpeeds.indexOf(GAME.speed);
        if (currentIdx > 0) {
          const prevSpeed = availableSpeeds[currentIdx - 1];
          const btn = document.getElementById(`speed${prevSpeed}`);
          if (btn) btn.click();
        }
      } else if (triggeredAction === "speedUp") {
        const speedLadder = [1, 2, 5, 20, 60];
        const availableSpeeds = speedLadder.filter((s) =>
          game.unlockedSpeeds.includes(s),
        );
        const currentIdx = availableSpeeds.indexOf(GAME.speed);
        if (currentIdx !== -1 && currentIdx < availableSpeeds.length - 1) {
          const nextSpeed = availableSpeeds[currentIdx + 1];
          const btn = document.getElementById(`speed${nextSpeed}`);
          if (btn) btn.click();
        }
      } else if (triggeredAction.startsWith("tank")) {
        const targetTank = triggeredAction; // e.g. "tank1", "tank10"
        const unlockedTanks = getUnlockedTanks();
        if (
          unlockedTanks.includes(targetTank) &&
          game.activeAquarium !== targetTank
        ) {
          game.activeAquarium = targetTank;
          game.selectedShrimpId = null;
          if (game.sellModeActive) {
            game.selectedForSaleIds = [];
            updateSellModeUI();
          }
          const listBody = document.querySelector(
            "#movableShrimpList .movable-body",
          );
          if (listBody) delete listBody.dataset.cache;
          lastSelectedId = null;
          lastSidebarState = "";
          playBtnSound();
          saveGame();
          render();
        }
      }
    }
  });

  document.addEventListener("click", () => {
    if (rebindingAction !== null) {
      rebindingAction = null;
      renderShortcutsConfig();
    }
  });

  const openSpecialsBtn = document.getElementById("openSpecialsBtn");
  const specialsModal = document.getElementById("specialsModal");
  const closeSpecialsBtn = document.getElementById("closeSpecialsModal");

  if (openSpecialsBtn && specialsModal) {
    openSpecialsBtn.addEventListener("click", () => {
      playBtnSound();
      renderSpecialsModal();
      specialsModal.classList.remove("hidden");
    });
  }

  if (closeSpecialsBtn && specialsModal) {
    closeSpecialsBtn.addEventListener("click", () => {
      playBtnSound();
      specialsModal.classList.add("hidden");
    });
  }

  const openBmBtn = document.getElementById("openBlackMarketBtn");
  if (openBmBtn) {
    openBmBtn.addEventListener("click", () => {
      playBtnSound();
      currentInformantDialogue = null;
      document.getElementById("blackMarketOverlay").classList.remove("hidden");
      renderBlackMarket();
      BM_SWIM.start(); // Start background tank animations!
    });
  }

  const bmBackBtn = document.getElementById("blackMarketBackBtn");
  if (bmBackBtn) {
    bmBackBtn.addEventListener("click", () => {
      playBtnSound();
      currentInformantDialogue = null;
      document.getElementById("blackMarketOverlay").classList.add("hidden");
      BM_SWIM.stop(); // Stop animations when returning
      game.lastRealTime = Date.now();
      render();
    });
  }

  const openJournalBtn = document.getElementById("openJournalBtn");
  const journalModal = document.getElementById("journalModal");
  const closeJournalBtn = document.getElementById("closeJournalModal");

  if (openJournalBtn && journalModal) {
    openJournalBtn.addEventListener("click", () => {
      playBtnSound();
      renderJournalModal();
      journalModal.classList.remove("hidden");
    });
  }

  if (closeJournalBtn && journalModal) {
    closeJournalBtn.addEventListener("click", () => {
      playBtnSound();
      journalModal.classList.add("hidden");
    });
  }

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

  const resetShortcutsHelpBtn = document.getElementById(
    "resetShortcutsHelpBtn",
  );
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
    syncAudioControls(
      bgmSlider,
      bgmLabel,
      bgmToggle,
      game.bgmVolume,
      game.bgmMuted,
    );
    syncAudioControls(
      menuBgmSlider,
      menuBgmLabel,
      menuBgmToggle,
      game.bgmVolume,
      game.bgmMuted,
    );
    syncAudioControls(
      sfxSlider,
      sfxLabel,
      sfxToggle,
      game.sfxVolume,
      game.sfxMuted,
    );
    syncAudioControls(
      menuSfxSlider,
      menuSfxLabel,
      menuSfxToggle,
      game.sfxVolume,
      game.sfxMuted,
    );

    if (game.darkModeActive) {
      document.body.classList.add("dark-theme");
      if (themeToggle) {
        themeToggle.textContent = "Light";
        themeToggle.className = "primary-button";
      }
      if (themeLabel) themeLabel.textContent = "Dark Mode";
      if (menuThemeToggle) {
        menuThemeToggle.textContent = "Light";
        menuThemeToggle.className = "primary-button";
      }
      if (menuThemeLabel) menuThemeLabel.textContent = "Dark Mode";
    } else {
      document.body.classList.remove("dark-theme");
      if (themeToggle) {
        themeToggle.textContent = "Dark";
        themeToggle.className = "secondary-button";
      }
      if (themeLabel) themeLabel.textContent = "Light Mode";
      if (menuThemeToggle) {
        menuThemeToggle.textContent = "Dark";
        menuThemeToggle.className = "secondary-button";
      }
      if (menuThemeLabel) menuThemeLabel.textContent = "Light Mode";
    }

    updateAudioVolumes();
  }

  updateSettingsUI();

  function startBgmOnInteraction() {
    bgm
      .play()
      .then(() => {
        document.removeEventListener("click", startBgmOnInteraction);
      })
      .catch(() => {
        console.log(
          "Autoplay blocked. Awaiting user click to initialize music.",
        );
      });
  }
  document.addEventListener("click", startBgmOnInteraction);

  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      playBtnSound();
      game.activeAquarium =
        game.activeAquarium === "favorites" ? "tank1" : "favorites";
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
        alert(
          "Exit command received. You can now safely close this browser tab.",
        );
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
          listBtn.innerHTML = `<img src="emoji/clipboard.png" alt="Select Mode" class="ui-emoji"> List of Shrimp`;
        } else {
          listBtn.innerHTML = `<img src="emoji/clipboard.png" alt="Select Mode" class="ui-emoji"> Close Shrimp List`;
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
      Rarity: "Sort: Rarity",
    };

    const currentSort = game.shrimpListSort || "HighValue";
    sortBtn.textContent = sortLabels[currentSort] || "Sort: High Value";

    sortBtn.addEventListener("click", () => {
      const cycle = [
        "HighValue",
        "LowValue",
        "Name",
        "Gender",
        "Age",
        "Status",
        "Rarity",
      ];
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
      rebindingAction = rebindingAction === action ? null : action;
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
        const shrimp = game.shrimp.find(
          (s) => Number(s.id) === Number(game.selectedShrimpId),
        );
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
      gamePlaying = true;
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

      addLog(
        "Select Mode activated: Click shrimp in the tank to move them to another tank or sell them.",
      );
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

  const tankListSearch = document.getElementById("tankListSearchInput");
  if (tankListSearch) {
    tankListSearch.addEventListener("input", () => {
      const body = document.querySelector("#movableShrimpList .movable-body");
      if (body) delete body.dataset.cache;
      renderMovableShrimpList();
    });
  }

  const tankBulkCullBtn = document.getElementById("tankBulkCullBtn");
  if (tankBulkCullBtn) {
    tankBulkCullBtn.addEventListener("click", () => {
      playBtnSound();
      harvestTankNursery();
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
  saveGame();

  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(game, null, 2));
  const downloadAnchor = document.createElement("a");
  const timestampStr = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);

  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `shrimply_save_${timestampStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  addLog("💾 Save backup file exported to your downloads.");
}

function importSaveFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);

      // Basic validation check
      if (
        typeof importedData !== "object" ||
        importedData === null ||
        !Array.isArray(importedData.shrimp)
      ) {
        alert(
          "Invalid save file! Please make sure this is a valid Shrimply Genetics JSON save.",
        );
        return;
      }

      const confirmed = confirm(
        "Are you sure you want to load this save file? Your current aquarium will be replaced.",
      );
      if (!confirmed) return;

      localStorage.setItem(SAVE_KEY, JSON.stringify(importedData));
      loadGame();

      // Sync controls & cached elements
      updateSpeedButtons();
      updateHelpModalShortcuts();
      if (typeof renderShortcutsConfig === "function") renderShortcutsConfig();

      lastRenderedMoney = null;
      lastRenderedShopState = "";
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
      alert(
        "Failed to parse the save file. Please make sure it is a valid .json file.",
      );
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
