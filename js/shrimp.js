/* =========================================================
   WILD PATTERN DATABASE
========================================================= */

const WILD_PATTERNS = {
    WildR1: {
        name: "Wild Red Pattern (Type 1)",
        rarity: "common",
        family: "red",
        color: "#a83c39",
        image: "WildR1"
    },
    WildR2: {
        name: "Wild Red Pattern (Type 2)",
        rarity: "common",
        family: "red",
        color: "#b84c49",
        image: "WildR2"
    },
    WildY1: {
        name: "Wild Yellow Pattern (Type 1)",
        rarity: "common",
        family: "yellow",
        color: "#e6d13a",
        image: "WildY1"
    },
    WildY2: {
        name: "Wild Yellow Pattern (Type 2)",
        rarity: "common",
        family: "yellow",
        color: "#d6c522",
        image: "WildY2"
    },
    WildS: {
        name: "Wild Shoko Pattern",
        rarity: "common",
        family: "shoko",
        color: "#65412f",
        image: "WildS"
    },
    WildB: {
        name: "Wild Deep Blue Pattern",
        rarity: "common",
        family: "deepblue",
        color: "#30323d",
        image: "WildB"
    }
};

/* =========================================================
   SHRIMP SHOP PRICING DATABASE
========================================================= */

const SHRIMP_PRICES = {
    redCherry: 25,
    yellow: 120,
    orange: 255,
    shoko: 400,
    wildPalmata: 800,
    babaultiWild: 1050,
    sakuraRedA: 1500,
    deepBlueNeo: 3000,
    bambooShrimp: 7000,
    legendaryScud: 8500,
    amanoShrimp: 9500,
    redCrawfish: 11000,
    redNose: 12500,
    galaxySulawesi: 13000,
    vampireShrimp: 15000
};

/* =========================================================
   SHRIMP DATABASE
========================================================= */

const SHRIMP = {

    /* -------------------------
       WILD
    ------------------------- */

    wildDavidi: {
        name: "Neocaridina davidi WT",
        shortName: "Wild N. davidi",
        rarity: "wild",
        family: "davidi",
        color: "#7b6952",
        image: "wilddavidi",
        parents: [],
        children: [
            "redCherry",
            "yellow",
            "shoko",
            "deepBlueNeo",
            "transparent"
        ]
    },

    wildPalmata: {
        name: "Neocaridina palmata WT",
        shortName: "Wild N. palmata",
        rarity: "wild",
        family: "palmata",
        color: "#887762",
        image: "wildpalmata",
        parents: [],
        children: [
            "whitePearl", "bluePearl"
        ]
    },


    /* -------------------------
       TRANSPARENT
    ------------------------- */

    transparent: {
        name: "Transparent",
        rarity: "common",
        family: "transparent",
        color: "#ffffff",
        image: "transparent",
        parents: ["wildDavidi"],
        children: []
    },


    /* -------------------------
       RED CHERRY LINE
    ------------------------- */

    redCherry: {
        name: "Red Cherry",
        rarity: "common",
        family: "red",
        color: "#e63d3d",
        image: "redcherry",
        parents: ["wildDavidi"],
        children: [
            "sakuraRedA",
            "redRili",
            "orange",
            "redRiliBlue",
            "orangeNeon",
            "orangeLight"
        ]
    },

    sakuraRedA: {
        name: "Sakura Red Grade A",
        rarity: "common",
        family: "red",
        color: "#d93636",
        image: "sakuraredgradea",
        parents: ["redCherry"],
        children: [
            "sakuraRedS",
            "sakuraChamp",
            "sakuraSingapore",
            "fireRedTaiwan",
            "purple"
        ]
    },

    purple: {
        name: "Purple",
        rarity: "epic",
        family: "red",
        color: "#6b2e6b",
        image: "purple",
        parents: ["sakuraRedA"],
        children: []
    },

    sakuraRedS: {
        name: "Sakura Red Grade S",
        rarity: "uncommon",
        family: "red",
        color: "#c92e2e",
        image: "sakuraredgrades",
        parents: ["sakuraRedA"],
        children: [
            "fireRedLowGrade",
            "fireRed"
        ]
    },

    fireRedLowGrade: {
        name: "Fire Red Low Grade",
        rarity: "rare",
        family: "red",
        color: "#bd2525",
        image: "fireredlowgrade",
        parents: ["sakuraRedS"],
        children: [
            "fireRed"
        ]
    },

    fireRed: {
        name: "Fire Red",
        rarity: "rare",
        family: "red",
        color: "#df2929",
        image: "firered",
        parents: ["sakuraRedS"],
        children: [
            "fireRedPainted",
            "kanoko"
        ]
    },

    fireRedPainted: {
        name: "Fire Red Painted Grade SS",
        rarity: "epic",
        family: "red",
        color: "#d52828",
        image: "fireredpainted",
        parents: ["fireRed"],
        children: []
    },

    darkBlueCherry: {
        name: "Dark Blue Cherry",
        rarity: "epic",
        family: "red",
        color: "#18386b",
        image: "darkbluecherry",
        parents: ["fireRedPainted"],
        children: ["greenNessie"]
    },

    greenNessie: {
        name: "Green Nessie",
        rarity: "epic",
        family: "red",
        color: "#1e824c",
        image: "greennessie",
        parents: ["darkBlueCherry"],
        children: []
    },

    fireRedTaiwan: {
        name: "Fire Red Taiwan",
        rarity: "rare",
        family: "red",
        color: "#dc302b",
        image: "fireredtaiwan",
        parents: ["sakuraRedA"],
        children: ["koiSunburst"]
    },

    koiSunburst: {
        name: "Koi Sunburst",
        rarity: "epic",
        family: "red",
        color: "#f5a31d",
        image: "koisunburst",
        parents: ["fireRedTaiwan"],
        children: []
    },

    sakuraChamp: {
        name: "Sakura",
        rarity: "rare",
        family: "red",
        color: "#bd3131",
        image: "sakurachamp",
        parents: ["sakuraRedA"],
        children: []
    },

    sakuraSingapore: {
        name: "Sakura Singapore",
        rarity: "rare",
        family: "red",
        color: "#e04435",
        image: "sakurasingapore",
        parents: ["sakuraRedA"],
        children: []
    },

    redRili: {
        name: "Red Rili",
        rarity: "uncommon",
        family: "red",
        color: "#d94646",
        image: "redrili",
        parents: ["redCherry"],
        children: [
            "redRiliBlue",
            "redRiliKohaku"
        ]
    },

    redRiliBlue: {
        name: "Red Rili Blue",
        rarity: "uncommon",
        family: "red",
        color: "#6c8fb3",
        image: "redriliblue",
        parents: ["redRili"],
        children: [
            "blueRili"
        ]
    },

    redRiliKohaku: {
        name: "Red Rili Kohaku",
        rarity: "rare",
        family: "red",
        color: "#a83c39",
        image: "redrilikohaku",
        parents: ["redRili"],
        children: []
    },


    /* -------------------------
       ORANGE LINE
    ------------------------- */

    orange: {
        name: "Orange",
        rarity: "common",
        family: "red",
        color: "#f28c28",
        image: "orange",
        parents: ["redCherry"],
        children: [
            "orangeRili",
            "orangeSakura",
            "green"
        ]
    },

    orangeRili: {
        name: "Orange Rili",
        rarity: "uncommon",
        family: "red",
        color: "#ed8a30",
        image: "orangerili",
        parents: ["orange"],
        children: []
    },

    orangeNeon: {
        name: "Orange Neon",
        rarity: "uncommon",
        family: "red",
        color: "#ff9d00",
        image: "orangeneon",
        parents: ["redCherry"],
        children: ["orangeSakura"]
    },

    orangeSakura: {
        name: "Orange Sakura",
        rarity: "uncommon",
        family: "red",
        color: "#f5a31d",
        image: "orangesakura",
        parents: ["orangeNeon"],
        children: ["lightGreen"]
    },

    orangeLight: {
        name: "Orange Light",
        rarity: "rare",
        family: "red",
        color: "#f1bd61",
        image: "orangelight",
        parents: ["redCherry"],
        children: []
    },


    /* -------------------------
       BLUE RILI LINE
    ------------------------- */

    blueRili: {
        name: "Blue Rili",
        rarity: "uncommon",
        family: "red",
        color: "#5597c5",
        image: "bluerili",
        parents: ["redRiliBlue"],
        children: [
            "blueJelly", "blueVelvet", "royalBlueRili"
        ]
    },

    royalBlueRili: {
        name: "Royal Rili",
        rarity: "rare",
        family: "red",
        color: "#158ee6",
        image: "royalrili",
        parents: ["blueRili"],
        children: ["spiderman"]
    },

    spiderman: {
        name: "Spiderman",
        rarity: "epic",
        family: "red",
        color: "#0c558a",
        image: "spiderman",
        parents: ["royalBlueRili"],
        children: []
    },

    blueJelly: {
        name: "Blue Jelly / Full Blue Rili",
        rarity: "uncommon",
        family: "red",
        color: "#65b3d5",
        image: "bluejelly",
        parents: ["blueRili"],
        children: []
    },


    /* -------------------------
       YELLOW LINE
    ------------------------- */

    yellow: {
        name: "Yellow",
        rarity: "common",
        family: "yellow",
        color: "#f2df19",
        image: "yellow",
        parents: ["wildDavidi"],
        children: [
            "yellowNeon",
            "green",
            "yellowRili"
        ]
    },

    yellowNeon: {
        name: "Yellow Neon",
        rarity: "uncommon",
        family: "yellow",
        color: "#ffe52c",
        image: "yellowneon",
        parents: ["yellow"],
        children: [
            "yellowSakura", "goldenBackNeon", "brightGreen"
        ]
    },

    goldenBackNeon: {
        name: "Golden Back Neon",
        rarity: "rare",
        family: "yellow",
        color: "#ffe52c",
        image: "goldenbackneon",
        parents: ["yellowNeon"],
        children: []
    },

    yellowRili: {
        name: "Yellow Rili",
        rarity: "rare",
        family: "yellow",
        color: "#e6d13a",
        image: "yellowrili",
        parents: ["yellow"],
        children: ["yellowSnowball"]
    },

    yellowSnowball: {
        name: "Snowball",
        rarity: "rare",
        family: "yellow",
        color: "#f4e34b",
        image: "yellowsnowball",
        parents: ["yellowRili"],
        children: []
    },

    yellowSakura: {
        name: "Yellow Sakura",
        rarity: "rare",
        family: "yellow",
        color: "#f4e34b",
        image: "yellowsakura",
        parents: ["yellowNeon"],
        children: []
    },


    /* -------------------------
       GREEN
    ------------------------- */

    green: {
        name: "Green / Varr. Green",
        rarity: "uncommon",
        family: "green",
        color: "#4fba43",
        image: "green",
        parents: ["yellow", "orange"],
        children: [
            "greenJade", "greenRili"
        ]
    },

    greenJade: {
        name: "Green Jade",
        rarity: "rare",
        family: "green",
        color: "#287a39",
        image: "greenjade",
        parents: ["green"],
        children: ["goldenBackJade", "emeraldGreen", "greenJelly"]
    },

    greenJelly: {
        name: "Green Jelly",
        rarity: "rare",
        family: "green",
        color: "#408339",
        image: "greenjelly",
        parents: ["greenJade"],
        children: []
    },

    greenRili: {
        name: "Green Rili",
        rarity: "rare",
        family: "green",
        color: "#408339",
        image: "greenrili",
        parents: ["green"],
        children: []
    },

    goldenBackJade: {
        name: "Golden Back Jade",
        rarity: "epic",
        family: "green",
        color: "#287a39",
        image: "goldenbackjade",
        parents: ["greenJade"],
        children: []
    },

    emeraldGreen: {
        name: "Emerald",
        rarity: "epic",
        family: "green",
        color: "#287a39",
        image: "emerald",
        parents: ["greenJade"],
        children: ["greenVenom"]
    },

    greenVenom: {
        name: "Green Venom",
        rarity: "epic",
        family: "green",
        color: "#062e0e",
        image: "greenvenom",
        parents: ["emeraldGreen"],
        children: []
    },

    lightGreen: {
        name: "Light Green",
        rarity: "rare",
        family: "green",
        color: "#81dd94",
        image: "lightgreen",
        parents: ["orangeSakura"],
        children: ["greenCantaloupe"]
    },

    greenCantaloupe: {
        name: "Green Cantaloupe",
        rarity: "rare",
        family: "green",
        color: "#4fba43",
        image: "greenCantaloupe",
        parents: ["lightGreen"],
        children: ["hulkOrange"]
    },

    hulkOrange: {
        name: "Hulk Orange",
        rarity: "rare",
        family: "green",
        color: "#4fba43",
        image: "hulkorange",
        parents: ["greenCantaloupe"],
        children: []
    },

    brightGreen: {
        name: "Bright Green",
        rarity: "rare",
        family: "green",
        color: "#54ec72",
        image: "brightgreen",
        parents: ["yellowNeon"],
        children: []
    },


    /* -------------------------
       SHOKO LINE
    ------------------------- */

    shoko: {
        name: "Shoko",
        rarity: "common",
        family: "shoko",
        color: "#895330",
        image: "shoko",
        parents: ["wildDavidi"],
        children: [
            "chocolate",
            "bloodyMaryA"
        ]
    },

    chocolate: {
        name: "Chocolate",
        rarity: "uncommon",
        family: "shoko",
        color: "#65412f",
        image: "chocolate",
        parents: ["shoko"],
        children: [
            "blueDiamond", "blackDiamond"
        ]
    },

    blackDiamond: {
        name: "Black Diamond",
        rarity: "rare",
        family: "shoko",
        color: "#191919",
        image: "blackdiamond",
        parents: ["chocolate"],
        children: []
    },

    bloodyMaryA: {
        name: "Bloody Mary Grade A",
        rarity: "rare",
        family: "shoko",
        color: "#9e382e",
        image: "bloodymarya",
        parents: ["shoko"],
        children: [
            "bloodyMaryS"
        ]
    },

    bloodySnowball: {
        name: "Bloody Snowball",
        rarity: "rare",
        family: "shoko",
        color: "#a52d27",
        image: "bloodysnowball",
        parents: ["bloodyMaryA", "redRili"],
        children: []
    },

    bloodyMaryS: {
        name: "Bloody Mary Grade S",
        rarity: "rare",
        family: "shoko",
        color: "#a52d27",
        image: "bloodymarys",
        parents: ["bloodyMaryA"],
        children: []
    },

    blueDiamond: {
        name: "Blue Diamond",
        rarity: "rare",
        family: "shoko",
        color: "#303d91",
        image: "bluediamond",
        parents: ["chocolate"],
        children: ["topaz"]
    },

    topaz: {
        name: " Topaz",
        rarity: "rare",
        family: "shoko",
        color: "#273a9d",
        image: "topaz",
        parents: ["blueDiamond"],
        children: []
    },


    /* -------------------------
       DEEP BLUE LINE
    ------------------------- */

    deepBlueNeo: {
        name: "Deep Blue Neo",
        rarity: "rare",
        family: "deepblue",
        color: "#24314c",
        image: "deepblueneo",
        parents: ["wildDavidi"],
        children: [
            "blackRose",
            "carbonRili"
        ]
    },

    blackRose: {
        name: "Black Rose Sakura",
        rarity: "rare",
        family: "deepblue",
        color: "#191919",
        image: "blackrose",
        parents: ["deepBlueNeo"],
        children: []
    },

    carbonRili: {
        name: "Carbon Rili",
        rarity: "rare",
        family: "deepblue",
        color: "#30323d",
        image: "carbonrili",
        parents: ["deepBlueNeo"],
        children: [
            "carbonRiliA"
        ]
    },

    carbonRiliA: {
        name: "Blue Carbon Rili Grade A",
        rarity: "rare",
        family: "deepblue",
        color: "#344e6d",
        image: "bluecarbonrilia",
        parents: ["carbonRili"],
        children: [
            "carbonRiliS",
            "carbonRiliGoldBack"
        ]
    },

    carbonRiliS: {
        name: "Blue Carbon Rili Grade S",
        rarity: "rare",
        family: "deepblue",
        color: "#536d91",
        image: "bluecarbonrilis",
        parents: ["carbonRiliA"],
        children: [
            "blueDream"
        ]
    },

    carbonRiliGoldBack: {
        name: "Carbon Rili Gold Back",
        rarity: "rare",
        family: "deepblue",
        color: "#4a4a4f",
        image: "carbonriligoldback",
        parents: ["carbonRiliA"],
        children: []
    },

    blueVelvet: {
        name: "Blue Velvet",
        rarity: "uncommon",
        family: "deepblue",
        color: "#2374a8",
        image: "bluevelvet",
        parents: ["deepBlueNeo", "carbonRiliS"],
        children: ["skyBlueVelvet", "blueSapphire"]
    },

    blueSapphire: {
        name: "Blue Sapphire",
        rarity: "uncommon",
        family: "deepblue",
        color: "#2374a8",
        image: "bluesapphire",
        parents: ["blueVelvet"],
        children: []
    },

    skyBlueVelvet: {
        name: "Sky Blue Velvet",
        rarity: "uncommon",
        family: "deepblue",
        color: "#87ceeb",
        image: "skybluevelvet",
        parents: ["blueVelvet", "carbonRiliS"],
        children: []
    },

    blueDream: {
        name: "Blue Dream",
        rarity: "uncommon",
        family: "deepblue",
        color: "#87ceeb",
        image: "bluedream",
        parents: ["carbonRiliS"],
        children: []
    },

    /* -------------------------
       CARIDINA BABAULTI LINE
    ------------------------- */

    babaultiWild: {
        name: "Caridina babaulti Wild",
        shortName: "Babaulti Wild",
        rarity: "common",
        family: "babaulti",
        color: "#6e473b",
        image: "babaultiwild",
        parents: [],
        children: [
            "babaultiBrown"
        ]
    },
    babaultiBrown: {
        name: "Caridina babaulti Brown",
        shortName: "Babaulti Brown",
        rarity: "uncommon",
        family: "babaulti",
        color: "#6e473b",
        image: "babaultibrown",
        parents: ["babaultiWild"],
        children: [
            "babaultiGreen",
            "babaultiMalaya",
            "babaultiStripes"
        ]
    },

    babaultiGreen: {
        name: "Caridina babaulti Green",
        shortName: "Babaulti Green",
        rarity: "uncommon",
        family: "babaulti",
        color: "#387c44",
        image: "babaultigreen",
        parents: ["babaultiBrown"],
        children: []
    },

    babaultiMalaya: {
        name: "Caridina babaulti Malaya",
        shortName: "Babaulti Malaya",
        rarity: "rare",
        family: "babaulti",
        color: "#a06d4e",
        image: "babaultimalaya",
        parents: ["babaultiBrown"],
        children: []
    },

    babaultiStripes: {
        name: "Caridina babaulti Stripes",
        shortName: "Babaulti Stripes",
        rarity: "rare",
        family: "babaulti",
        color: "#4a3c31",
        image: "babaultistripes",
        parents: ["babaultiBrown"],
        children: []
    },

    /* -------------------------
       PALMATA LINE
    ------------------------- */

    whitePearl: {
        name: "White Pearl / Snowball",
        rarity: "uncommon",
        family: "palmata",
        color: "#e5dfc8",
        image: "whitepearl",
        parents: ["wildPalmata"],
        children: []
    },

    bluePearl: {
        name: "Blue Pearl",
        rarity: "rare",
        family: "palmata",
        color: "#73b9d0",
        image: "bluepearl",
        parents: ["wildPalmata"],
        children: [
            "amberPearl"
        ]
    },

    amberPearl: {
        name: "Amber Pearl",
        rarity: "epic",
        family: "palmata",
        color: "#c7a75a",
        image: "amberpearl",
        parents: ["bluePearl"],
        children: []
    },


    /* -------------------------
       EPIC 
    ------------------------- */

    kanoko: {
        name: "Kanoko",
        rarity: "epic",
        family: "red",
        color: "#a73729",
        image: "kanoko",
        parents: ["sakuraRedA", "fireRed"],
        children: []
    },

    amanoShrimp: {
        name: "Amano Shrimp",
        rarity: "epic",
        family: "amano",
        color: "#b0c4de",
        image: "amano",
        parents: [],
        children: []
    },

    crystalRed: {
        name: "Crystal Red Shrimp",
        rarity: "epic",
        family: "red",
        color: "#e63d3d",
        image: "crystalred",
        parents: ["kanoko", "redRili"],
        children: []
    },


    /* -------------------------
      LEGENDARY
   ------------------------- */

    bambooShrimp: {
        name: "Bamboo Shrimp",
        rarity: "legendary",
        family: "bamboo",
        color: "#c08a55",
        image: "bamboo",
        parents: [],
        children: []
    },

    galaxySulawesi: {
        name: "Galaxy Sulawesi",
        rarity: "legendary",
        family: "sulawesi",
        color: "#0f52ba",
        image: "galaxysulawesi",
        parents: [],
        children: []
    },
    legendaryScud: {
        name: "Legendary Scud",
        rarity: "legendary",
        family: "scud",
        color: "#8fa382",
        image: "scud",
        parents: [],
        children: []
    },

    redCrawfish: {
        name: "Red Crawfish",
        rarity: "legendary",
        family: "crawfish",
        color: "#c0392b",
        image: "redcrawfish",
        parents: [],
        children: ["blueCrawfish"]
    },

    blueCrawfish: {
        name: "Blue Crawfish",
        rarity: "legendary",
        family: "crawfish",
        color: "#2980b9",
        image: "bluecrawfish",
        parents: ["redCrawfish"],
        children: []
    },
    redNose: {
        name: "Rudolph Red Nose Shrimp",
        shortName: "Red Nose Shrimp",
        rarity: "legendary",
        family: "rednose",
        color: "#d63031",
        image: "rednose",
        parents: [],
        children: []
    },
    vampireShrimp: {
        name: "Vampire Shrimp",
        rarity: "legendary",
        family: "vampire",
        color: "#4a6984",
        image: "vampireshrimp",
        parents: [],
        children: []
    }
};

/* =========================================================
   RARITY SETTINGS
========================================================= */

const RARITY = {

    common: {
        pregnancy: 20,
        rest: 10,
        wildChance: .60,
        babiesMin: 15,
        babiesMax: 25,
        value: 2
    },

    uncommon: {
        pregnancy: 60,
        rest: 40,
        wildChance: .60,
        babiesMin: 14,
        babiesMax: 24,
        value: 5
    },

    rare: {
        pregnancy: 180,
        rest: 100,
        wildChance: .30,
        babiesMin: 12,
        babiesMax: 22,
        value: 10
    },

    epic: {
        pregnancy: 300,
        rest: 180,
        wildChance: .30,
        babiesMin: 10,
        babiesMax: 20,
        value: 150
    },

    wild: {
        pregnancy: 20,
        rest: 10,
        wildChance: .85,
        babiesMin: 12,
        babiesMax: 22,
        value: 1
    },

    legendary: {
        pregnancy: 1000,
        rest: 440,
        wildChance: 0.0,
        babiesMin: 1,
        babiesMax: 1,
        value: 2500
    }
};

/*
 * Safe lookup helper for species metadata
 */
function SHRRIMP_SAFE(id) {
    return SHRIMP[id] || SHRIMP.redCherry;
}

/*
 * Universal fallback CSS element generator for missing sprites
 */
function createCssShrimpFallback(color, scale = 1) {
    const fallback = document.createElement("div");
    fallback.className = "css-shrimp";
    fallback.style.setProperty("--shrimp-color", color);
    fallback.style.position = "relative";
    fallback.style.left = "0";
    fallback.style.top = "0";
    if (scale !== 1) {
        fallback.style.transform = `scale(${scale})`;
    }
    return fallback;
}

/* =========================================================
   ALLELE COLLECTION DISPLAY HELPER
========================================================= */

function formatAlleleDisplay(alleleId) {
    const data = SHRRIMP_SAFE(alleleId);
    const name = data.name;
    const isDiscovered = Boolean(game && game.discovered && game.discovered.includes(alleleId));

    if (!isDiscovered) {
        // Red and bold when NOT yet discovered in the collection
        return `<strong style="color: var(--danger); font-weight: bold;">${name}</strong>`;
    }
    // Normal text once discovered
    return `<span style="color: var(--text); font-weight: normal;">${name}</span>`;
}