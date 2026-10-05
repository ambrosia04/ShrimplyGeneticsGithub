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
    // === TIER 1: Standard Neocaridina Mutation Line ===
    redCherry: 25,
    yellow: 120,
    orange: 260,
    shoko: 550,
    wildPalmata: 1100,
    sakuraRedA: 1850,
    deepBlueNeo: 2500,

    // === TIER 2: Early Milestones & Mid-Game ===
    babaultiWild: 2800,    // Reward: 100% Red family alleles
    legendaryScud: 7500,   // Reward: Clado Scanner Console ($10k unlock)
    galaxySulawesi: 90000, // SHRIMP OVERHAUL TANK LEVEL 10 (250000)

    // === TIER 3: Late-Game Specialized Breeders ===
    bambooShrimp: 12000,   // Reward: All common shrimp discovered
    redCrawfish: 18000,    // Reward: Favorites Tank (Slow breeding, high unit payout)
    redNose: 28000,        // Reward: 100% Alleles for BOTH Palmata + Red

    // === TIER 4: Grandmaster / Endgame Trophies ===
    amanoShrimp: 50000,    // Reward: Own ALL shop plants
    vampireShrimp: 85000,   // Reward: 100% Alleles across 4 entire families

    // === TIER 5: Exotic & Advanced Caridina Strains === SHRIMP OVERHAUL
    wildSulawesi: 115000,            // Reward: High-tier wild line unlock
    wildCaridinaCantonensis: 155000, // Reward: Unlocks Bee / Crystal / Tiger lineage
    malawaShrimp: 195000,            // Reward: Advanced multi-tank mastery
    glassLaceShrimp: 250000,         // Reward: 10 tank
    raccoonShrimp: 325000,            // Reward: Apex Master Breeder trophy
    metallicBoaBlack: 400000
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
        hint_text: "See right through Wild Davidi stock with this crystal-clear anomaly.",
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
        hint_text: "Give your basic Cherries some time to blossom into A better Grade.",
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
        hint_text: "A royal stroke of luck when breeding Sakura Grade A shrimp!",
        rarity: "epic",
        family: "red",
        color: "#6b2e6b",
        image: "purple",
        parents: ["sakuraRedA"],
        children: []
    },

    sakuraRedS: {
        name: "Sakura Red Grade S",
        hint_text: "Filter your graded stock until the red blossoms and gets seriously saturated.",
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
        hint_text: "Stoke the flames of your Sakura Grade S line to turn up the heat.",
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
        hint_text: "Keep fanning the embers of your S Red line until the color burns pure and solid",
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
        hint_text: "Take Fire Reds to the extreme for a shell coated so thick it looks freshly painted",
        rarity: "epic",
        family: "red",
        color: "#d52828",
        image: "fireredpainted",
        parents: ["fireRed"],
        children: []
    },

    fireRedTaiwan: {
        name: "Fire Red Taiwan",
        hint_text: "A fiery international variant waiting to hatch from your Grade A Sakura Cherries.",
        rarity: "rare",
        family: "red",
        color: "#dc302b",
        image: "fireredtaiwan",
        parents: ["sakuraRedA"],
        children: ["koiSunburst"]
    },

    darkBlueCherry: {
        name: "Dark Blue Cherry",
        hint_text: "A shockingly cool mutation hidden deep within pure Fire Red Painted lines.",
        rarity: "epic",
        family: "red",
        color: "#18386b",
        image: "darkbluecherry",
        parents: ["fireRedPainted"],
        children: ["greenNessie"]
    },

    greenNessie: {
        name: "Green Nessie",
        hint_text: "You won't need a submarine to spot this mythical monster swimming out from Dark Blue Cherry lines.",
        rarity: "epic",
        family: "red",
        color: "#1e824c",
        image: "greennessie",
        parents: ["darkBlueCherry"],
        children: []
    },

    koiSunburst: {
        name: "Koi Sunburst",
        hint_text: "Let Fire Red Taiwan shine bright enough to dawn this vibrant, speckled beauty.",
        rarity: "epic",
        family: "red",
        color: "#f5a31d",
        image: "koisunburst",
        parents: ["fireRedTaiwan"],
        children: []
    },

    sakuraChamp: {
        name: "Sakura",
        hint_text: "Only the true champions among your Sakura Grade A Cherries will claim this title.",
        rarity: "rare",
        family: "red",
        color: "#bd3131",
        image: "sakurachamp",
        parents: ["sakuraRedA"],
        children: []
    },

    sakuraSingapore: {
        name: "Sakura Singapore",
        hint_text: "A worldly red traveler waiting to branch out from your Sakura Grade A stock.",
        rarity: "rare",
        family: "red",
        color: "#e04435",
        image: "sakurasingapore",
        parents: ["sakuraRedA"],
        children: []
    },

    redRili: {
        name: "Red Rili",
        hint_text: "Strip away the middle of a Red Cherry to see right through the competition.",
        rarity: "uncommon",
        family: "red",
        color: "#d94646",
        image: "redrili",
        parents: ["redCherry"],
        children: [
            "redRiliBlue",
            "redRiliKohaku", 
            "bloodySnowball"
        ]
    },

    redRiliBlue: {
        name: "Red Rili Blue",
        hint_text: "When breeding Red Rilis, look for the clear segments that carry an icy blue tint.",
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
        hint_text: "Polish your Red Rilis until they sport the classic, prize-winning Japanese pond pattern.",
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
        hint_text: "Pick this citrusy sweet mutation fresh from a Red Cherry branch.",
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
        hint_text: "Give your standard Orange shrimp a see-through glass belly.",
        rarity: "uncommon",
        family: "red",
        color: "#ed8a30",
        image: "orangerili",
        parents: ["orange"],
        children: []
    },

    orangeNeon: {
        name: "Orange Neon",
        hint_text: "A zesty Red Cherry descendant that looks like it swallowed a glowstick.",
        rarity: "uncommon",
        family: "red",
        color: "#ff9d00",
        image: "orangeneon",
        parents: ["redCherry"],
        children: ["orangeSakura"]
    },

    orangeSakura: {
        name: "Orange Sakura",
        hint_text: "Breed your Orange Neons until their shells look richly glazed in marmalade.",
        rarity: "uncommon",
        family: "red",
        color: "#f5a31d",
        image: "orangesakura",
        parents: ["orangeNeon"],
        children: ["lightGreen"]
    },

    orangeLight: {
        name: "Orange Light",
        hint_text: "A softer, pastel glow waiting to emerge from your Red Cherry tank.",
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
        hint_text: "Cool down your Red Rili Blues until the red pigment vanishes completely.",
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
        hint_text: "Crown your Blue Rilis with a deeper, majestic hue.",
        rarity: "rare",
        family: "red",
        color: "#158ee6",
        image: "royalrili",
        parents: ["blueRili"],
        children: ["spiderman"]
    },

    spiderman: {
        name: "Spiderman",
        hint_text: "With great Royal Rilis comes great responsibility!",
        rarity: "epic",
        family: "red",
        color: "#0c558a",
        image: "spiderman",
        parents: ["royalBlueRili"],
        children: []
    },

    blueJelly: {
        name: "Blue Jelly / Full Blue Rili",
        hint_text: "Soft, translucent, and sweet! Select Blue Rilis with a shell like gelatin.",
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
        hint_text: "Pump high voltage through standard Yellows to ignite a glowing body.",
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
        hint_text: "Polish your Yellow Neons until their backs shine with solid gold bullion.",
        rarity: "rare",
        family: "yellow",
        color: "#ffe52c",
        image: "goldenbackneon",
        parents: ["yellowNeon"],
        children: []
    },

    yellowRili: {
        name: "Yellow Rili",
        hint_text: "Give your bright Yellows a crystal-clear break in their pattern.",
        rarity: "rare",
        family: "yellow",
        color: "#e6d13a",
        image: "yellowrili",
        parents: ["yellow"],
        children: ["yellowSnowball"]
    },

    yellowSnowball: {
        name: "Snowball",
        hint_text: "Chill your Yellow Rilis until they freeze into pure white flakes.",
        rarity: "rare",
        family: "yellow",
        color: "#f4e34b",
        image: "yellowsnowball",
        parents: ["yellowRili"],
        children: []
    },

    yellowSakura: {
        name: "Yellow Sakura",
        hint_text: "Breed Yellow Neons until their yellow shell is as thick as lemon peel.",
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
        hint_text: "Orange you glad you mixed Yellow and Orange together to grow this sprout?",
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
        hint_text: "Carve away the rough edges of common Greens to unearth a prized gemstone.",
        rarity: "rare",
        family: "green",
        color: "#287a39",
        image: "greenjade",
        parents: ["green"],
        children: ["goldenBackJade", "emeraldGreen", "greenJelly"]
    },

    greenJelly: {
        name: "Green Jelly",
        hint_text: "Breed Green Jades for a squishy, translucent jade-candy shell.",
        rarity: "rare",
        family: "green",
        color: "#408339",
        image: "greenjelly",
        parents: ["greenJade"],
        children: []
    },

    greenRili: {
        name: "Green Rili",
        hint_text: "A splash of foliage with a clear window right in the middle of standard Greens.",
        rarity: "rare",
        family: "green",
        color: "#408339",
        image: "greenrili",
        parents: ["green"],
        children: []
    },

    goldenBackJade: {
        name: "Golden Back Jade",
        hint_text: "Trace a gilded neon stripe down the spine of your Green Jades.",
        rarity: "epic",
        family: "green",
        color: "#287a39",
        image: "goldenbackjade",
        parents: ["greenJade"],
        children: []
    },

    emeraldGreen: {
        name: "Emerald",
        hint_text: "High-society Green Jades that shimmer like precious jewels.",
        rarity: "epic",
        family: "green",
        color: "#287a39",
        image: "emerald",
        parents: ["greenJade"],
        children: ["greenVenom"]
    },

    greenVenom: {
        name: "Green Venom",
        hint_text: "Let your Emerald lines brew until they reach peak, dark, toxic potency.",
        rarity: "epic",
        family: "green",
        color: "#062e0e",
        image: "greenvenom",
        parents: ["emeraldGreen"],
        children: []
    },

    lightGreen: {
        name: "Light Green",
        hint_text: "A gentle, minty mutation blossoming straight out of Orange Sakuras.",
        rarity: "rare",
        family: "green",
        color: "#81dd94",
        image: "lightgreen",
        parents: ["orangeSakura"],
        children: ["greenCantaloupe"]
    },

    greenCantaloupe: {
        name: "Green Cantaloupe",
        hint_text: "A sweet, melon-colored delicacy hiding inside your Light Green lineage.",
        rarity: "rare",
        family: "green",
        color: "#4fba43",
        image: "greenCantaloupe",
        parents: ["lightGreen"],
        children: ["hulkOrange"]
    },

    hulkOrange: {
        name: "Hulk Orange",
        hint_text: "Smash Green Cantaloupes until they burst with monstrous citrus power!",
        rarity: "epic",
        family: "green",
        color: "#4fba43",
        image: "hulkorange",
        parents: ["greenCantaloupe"],
        children: []
    },

    brightGreen: {
        name: "Bright Green",
        hint_text: "Electrify your Yellow Neons until they fluoresce like lime soda.",
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
        hint_text: "Rich, dark, and decadent… Melt down your Shokos to breed this confection.",
        rarity: "uncommon",
        family: "shoko",
        color: "#65412f",
        image: "chocolate",
        parents: ["shoko"],
        children: [
            "blueDiamond", "blackDiamond", "chocolateFire"
        ]
    },

    chocolateFire: {
        name: "Chocolate",
        hint_text: "Keep melting the chocolate down until it tempers.",
        rarity: "rare",
        family: "shoko",
        color: "#4d3022",
        image: "chocolatefire",
        parents: ["chocolate"],
        children: []
    },

    blackDiamond: {
        name: "Black Diamond",
        hint_text: "Apply extreme pressure to Chocolates to forge a pitch-black gem.",
        rarity: "rare",
        family: "shoko",
        color: "#191919",
        image: "blackdiamond",
        parents: ["chocolate"],
        children: []
    },

    bloodyMaryA: {
        name: "Bloody Mary Grade A",
        hint_text: "Let Shoko lines run red with blood-tinted tissue rather than just shell color.",
        rarity: "rare",
        family: "shoko",
        color: "#9e382e",
        image: "bloodymarya",
        parents: ["shoko"],
        children: [
            "bloodyMaryS", "bloodySnowball"
        ]
    },

    bloodySnowball: {
        name: "Bloody Snowball",
        hint_text: "What happens when you throw a crystal-clear, banded shrimp straight into A vampire's favorite spicy cocktail?",
        rarity: "rare",
        family: "shoko",
        color: "#a52d27",
        image: "bloodysnowball",
        parents: ["bloodyMaryA", "redRili"],
        children: []
    },

    bloodyMaryS: {
        name: "Bloody Mary Grade S",
        hint_text: "Deepen your Bloody Mary lines to achieve a bloody brilliant vampire hue.",
        rarity: "rare",
        family: "shoko",
        color: "#a52d27",
        image: "bloodymarys",
        parents: ["bloodyMaryA"],
        children: []
    },

    blueDiamond: {
        name: "Blue Diamond",
        hint_text: "A cool sapphire glimmer hiding within warm Chocolate genetics.",
        rarity: "rare",
        family: "shoko",
        color: "#303d91",
        image: "bluediamond",
        parents: ["chocolate"],
        children: ["topaz"]
    },

    topaz: {
        name: " Topaz",
        hint_text: "Polish your Blue Diamonds until they exhibit pure, rare gemstone brilliance.",
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
        rarity: "uncommon",
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
        hint_text: "Nurture Deep Blue Neos until their petals turn velvety, pitch black.",
        rarity: "rare",
        family: "deepblue",
        color: "#191919",
        image: "blackrose",
        parents: ["deepBlueNeo"],
        children: []
    },

    carbonRili: {
        name: "Carbon Rili",
        hint_text: "A sleek, smokey segmented pattern born from Deep Blue roots.",
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
        hint_text: "Blue glass trapped between the obsidian caps of Carbon Rilis.",
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
        hint_text: "Refine Grade A Blue Carbons to perfection for a starker, midnight contrast.",
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
        hint_text: "Stamp a gold bar across the spine of your Blue Carbon Grade A line.",
        rarity: "rare",
        family: "deepblue",
        color: "#4a4a4f",
        image: "carbonriligoldback",
        parents: ["carbonRiliA"],
        children: []
    },

    blueVelvet: {
        name: "Blue Velvet",
        hint_text: "A plush, royal-blue coat woven from Deep Blue and Carbon Rili Grade S genetics.",
        rarity: "uncommon",
        family: "deepblue",
        color: "#2374a8",
        image: "bluevelvet",
        parents: ["deepBlueNeo", "carbonRiliS"],
        children: ["skyBlueVelvet", "blueSapphire"]
    },

    blueSapphire: {
        name: "Blue Sapphire",
        hint_text: "Polish Blue Velvets into sparkling blue jewels.",
        rarity: "uncommon",
        family: "deepblue",
        color: "#2374a8",
        image: "bluesapphire",
        parents: ["blueVelvet"],
        children: []
    },

    skyBlueVelvet: {
        name: "Sky Blue Velvet",
        hint_text: "Brighten your Blue Velvets with great Carbon until they look like an open summer sky.",
        rarity: "uncommon",
        family: "deepblue",
        color: "#87ceeb",
        image: "skybluevelvet",
        parents: ["blueVelvet", "carbonRiliS"],
        children: []
    },

    blueDream: {
        name: "Blue Dream",
        hint_text: "Make your deepest aquatic fantasies come true from Carbon Rili Grade S ancestors.",
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
        hint_text: "Complete your entire Red family collection to unlock this wild Indian species in the shop!",
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
        hint_text: "Let your wild Babaultis settle into earthy, muddy tones.",
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
        hint_text: "A lush, camouflage-colored leaf sprouting from Babaulti soils.",
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
        hint_text: "A rare exotic traveler with distinct highlights bred from Babaulti Browns.",
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
        hint_text: "Paint bold tiger stripes down the body of your Babaulti Browns.",
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
        hint_text: "String together wild Palmata genes to create lustrous, milky-white pearls.",
        rarity: "uncommon",
        family: "palmata",
        color: "#e5dfc8",
        image: "whitepearl",
        parents: ["wildPalmata"],
        children: []
    },

    bluePearl: {
        name: "Blue Pearl",
        hint_text: "Dip your wild Palmata into a pool of icy blue water.",
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
        hint_text: "Fossilize your Blue Pearls into rich, golden tree-sap treasures.",
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
        hint_text: "When your sakura catch blazing red fire, expect a spotted crimson masterpiece to bloom.",
        rarity: "epic",
        family: "red",
        color: "#a73729",
        image: "kanoko",
        parents: ["sakuraRedA", "fireRed"],
        children: []
    },

    amanoShrimp: {
        name: "Amano Shrimp",
        hint_text: "Turn your tank into a lush jungle by buying every shop plant to invite this master algae-eater.",
        rarity: "epic",
        family: "amano",
        color: "#b0c4de",
        image: "amano",
        parents: [],
        children: []
    },

    crystalRed: {
        name: "Crystal Red Shrimp",
        hint_text: "A miraculous, epic crossbreed born from the romance of a Kanoko and a Red Rili!",
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
        hint_text: "Discover every common shrimp variety in the game and get this fan for your efforts!",
        rarity: "legendary",
        family: "bamboo",
        color: "#c08a55",
        image: "bamboo",
        parents: [],
        children: []
    },

    galaxySulawesi: {
        name: "Galaxy Sulawesi",
        hint_text: "Expand your aquatic real estate to the max to import this precious galaxy!",
        rarity: "legendary",
        family: "sulawesi",
        color: "#0f52ba",
        image: "galaxysulawesi",
        parents: ["harlequinSulawesi"],
        children: []
    },
    legendaryScud: {
        name: "Legendary Scud",
        hint_text: "Buy the Clado Scanner Console to net this prehistoric little monster.",
        rarity: "legendary",
        family: "scud",
        color: "#8fa382",
        image: "scud",
        parents: [],
        children: []
    },

    redCrawfish: {
        name: "Red Crawfish",
        hint_text: "Purchase the biggest tank possible for your favorites to welcome this pinchy bully.",
        rarity: "legendary",
        family: "crawfish",
        color: "#c0392b",
        image: "redcrawfish",
        parents: [],
        children: ["blueCrawfish"]
    },

    blueCrawfish: {
        name: "Blue Crawfish",
        hint_text: "A mind-bogglingly rare mutation that occurs when two Red Crawfish fall in love!",
        rarity: "legendary",
        family: "crawfish",
        color: "#2980b9",
        image: "bluecrawfish",
        parents: ["redCrawfish"],
        children: []
    },
    redNose: {
        name: "Rudolph Red Nose Shrimp",
        hint_text: "Be nosy and sequence 100% of both Red and Palmata lineages.",
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
        hint_text: "It went to feed on 500 escapees, get its price and it'll reward your shrimp with vigority.",
        rarity: "legendary",
        family: "vampire",
        color: "#4a6984",
        image: "vampireshrimp",
        parents: [],
        children: []
    },

    /* -------------------------
       CARIDINA & TIGER & BEE LINES (v2)
    ------------------------- */

    wildCaridinaCantonensis: {
        name: "Caridina Cantonensis",
        hint_text: "Catch this wild mountain stream jumper to lay the ancestral foundation for every crystal and tiger line by catching the galaxy.",
        shortName: "C. Cantonensis",
        rarity: "wild",
        family: "cantonensis",
        color: "#7b6952",
        image: "wildcantones",
        parents: [],
        children: ["wildRedTiger", "wildSuperTiger", "wildTiger",
            "wildOrangeBee", "wildCrystalBlack"
        ]
    },
    wildRedTiger: {
        name: "Red Tiger",
        hint_text: "Warm up standard wilds until their dark hunting bands blush with rust-red pigment.",
        shortName: "Red Tiger",
        rarity: "common",
        family: "tiger",
        color: "#b03a2e",
        image: "redtiger",
        parents: ["wildCaridinaCantonensis"],
        children: []
    },
    wildSuperTiger: {
        name: "Super Tiger",
        hint_text: "Selectively breed wilds to get tigers with the thickest, boldest armor to roar past standard stock.",
        shortName: "Super Tiger",
        rarity: "common",
        family: "tiger",
        color: "#784212",
        image: "supertiger",
        parents: ["wildCaridinaCantonensis"],
        children: []
    },
    wildTiger: {
        name: "Tiger",
        hint_text: "Sift through wild cantonesis stock until bold, predatory dark stripes emerge along the body.",
        shortName: "Tiger",
        rarity: "common",
        family: "tiger",
        color: "#a04000",
        image: "tiger",
        parents: ["wildCaridinaCantonensis"],
        children: []
    },
    blackTiger: {
        name: "Black Tiger",
        hint_text: "Darken standard tiger stripes generation after generation until the feline is swallowed in pitch-black shadow.",
        shortName: "Black Tiger",
        rarity: "uncommon",
        family: "tiger",
        color: "#1c2833",
        image: "blacktiger",
        parents: ["wildTiger"],
        children: []
    },
    blondeBlueTiger: {
        name: "Blonde Blue Tiger OE",
        hint_text: "Bleach a black tiger's coat golden-blonde while dipping its claws in cool blue waters.",
        shortName: "Blonde B. Tiger OE",
        rarity: "uncommon",
        family: "tiger",
        color: "#5dade2",
        image: "blondebluetiger",
        parents: ["wildTiger"],
        children: ["raccoonShrimp", "redStripesBlueTiger"]
    },
    redStripesBlueTiger: {
        name: "Red Stripes Blue Tiger OE",
        hint_text: "Paint blazing crimson racing stripes right across an ocean-blue predator.",
        shortName: "Red Stripes B. Tiger OE",
        rarity: "uncommon",
        family: "tiger",
        color: "#5499c7",
        image: "redstripesbluetiger",
        parents: ["blondeBlueTiger"],
        children: ["raccoonShrimp", "skyBlueTiger"]
    },
    skyBlueTiger: {
        name: "Sky Blue Tiger OE",
        hint_text: "Elevate your striped blue felines into the light, sun-drenched upper atmosphere.",
        shortName: "Sky B. Tiger OE",
        rarity: "rare",
        family: "tiger",
        color: "#85c1e9",
        image: "skybluetiger",
        parents: ["redStripesBlueTiger"],
        children: ["deepBlueTiger"]
    },
    deepBlueTiger: {
        name: "Deep Blue Tiger OE",
        hint_text: "Submerge your sky tigers into the abyss until they drink in the midnight ocean.",
        shortName: "Deep B. Tiger OE",
        rarity: "rare",
        family: "tiger",
        color: "#2471a3",
        image: "deepbluetiger",
        parents: ["skyBlueTiger"],
        children: ["rustyRedBlueTiger"]
    },
    rustyRedBlueTiger: {
        name: "Rusty Red Blue Tiger OE",
        hint_text: "Leave your dark blue tigers out in the rain until they develop a gorgeous, weathered red patina.",
        shortName: "Rusty Red B. Tiger OE",
        rarity: "epic",
        family: "tiger",
        color: "#943126",
        image: "rustyredbluetiger",
        parents: ["deepBlueTiger"],
        children: ["orangeEyeTiger"]
    },
    wildOrangeBee: {
        name: "Orange Bee",
        hint_text: "Isolate the sweetest citrus-tinted anomalies that buzz out of raw wild cantonesis stock.",
        shortName: "Orange Bee",
        rarity: "common",
        family: "bee",
        color: "#e67e22",
        image: "orangebee",
        parents: ["wildCaridinaCantonensis"],
        children: ["goldenBee"]
    },
    wildCrystalBlack: {
        name: "Crystal Black",
        hint_text: "Sift through wild cantonesis until black and white bands strike a sharp, crystalline balance.",
        shortName: "Crystal Black",
        rarity: "common",
        family: "bee",
        color: "#2c3e50",
        image: "crystalblack",
        parents: ["wildCaridinaCantonensis"],
        children: ["wildCrystalSuperBlack", "wildCrystalSuperRed", "crystalWhite"]
    },
    wildCrystalSuperBlack: {
        name: "Crystal Super Black",
        hint_text: "Select crystal blacks with shrinking white bands until solid onyx dominates the shell.",
        shortName: "Crystal S. Black",
        rarity: "common",
        family: "bee",
        color: "#17202a",
        image: "crystalsuperblack",
        parents: ["wildCrystalBlack"],
        children: ["extremeBlack", "crystalSuperBlackA"]
    },
    extremeBlack: {
        name: "Extreme Black Taiwan Bee",
        hint_text: "Push recessive super black crystal genetics to the absolute brink to hatch this ultra-saturated island titan.",
        shortName: "Extreme Black T. Bee",
        rarity: "uncommon",
        family: "bee",
        color: "#1b2631",
        image: "extremeblacktaiwanbee",
        parents: ["wildCrystalSuperBlack"],
        children: ["blackKingKongOne", "blackKingKongTwo"]
    },
    blackKingKongOne: {
        name: "Black King Kong One Stripe",
        hint_text: "When black Taiwan bees shed their white bands down to a single waistband, this jungle monarch ascends.",
        shortName: "Black King Kong 1",
        rarity: "rare",
        family: "bee",
        color: "#212f3d",
        image: "blackkingkongone",
        parents: ["extremeBlack"],
        children: ["pandaA", "shadowPandaA"]
    },
    blackKingKongTwo: {
        name: "Black King Kong Two Stripe",
        hint_text: "Double down on the white waistbands of your black Taiwan bee stock to crown this duo-striped ruler.",
        shortName: "Black King Kong 2",
        rarity: "rare",
        family: "bee",
        color: "#283747",
        image: "blackkingkongtwo",
        parents: ["extremeBlack"],
        children: ["pandaA", "shadowPandaA"]
    },
    pandaA: {
        name: "Panda Grade A",
        hint_text: "Look for bold, alternating black-and-white partitions emerging from your black gorilla clutches.",
        shortName: "Panda A",
        rarity: "rare",
        family: "bee",
        color: "#34495e",
        image: "pandaa",
        parents: ["blackKingKongOne", "blackKingKongTwo"],
        children: ["pandaSSS"]
    },
    pandaSSS: {
        name: "Panda Grade SSS",
        hint_text: "Breed your pandas until the white head cap vanishes, leaving spotless monochrome symmetry.",
        shortName: "Panda SSS",
        rarity: "epic",
        family: "bee",
        color: "#2c3e50",
        image: "pandasss",
        parents: ["pandaA"],
        children: ["whiteKingKong"]
    },
    shadowPandaA: {
        name: "Shadow Panda Grade A",
        hint_text: "Look for bold, alternating black-and-white partitions with shadows emerging from your gorilla clutches.",
        shortName: "Shadow Panda A",
        rarity: "rare",
        family: "bee",
        color: "#2e4053",
        image: "shadowpandaa",
        parents: ["blackKingKongOne", "blackKingKongTwo"],
        children: ["shadowPandaSSS"]
    },
    shadowPandaSSS: {
        name: "Shadow Panda Grade SSS",
        hint_text: "Refine shadow pandas until the ethereal cyan glow takes over nearly the entire phantom body.",
        shortName: "Shadow Panda SSS",
        rarity: "epic",
        family: "bee",
        color: "#1b2631",
        image: "shadowpandasss",
        parents: ["shadowPandaA"],
        children: ["whiteKingKong"]
    },
    crystalSuperBlackA: {
        name: "Crystal Super Black Grade A",
        hint_text: "Refine your super black crystal lines until only a clean, stark white tail-tip remains.",
        shortName: "Crystal S. Black A",
        rarity: "uncommon",
        family: "bee",
        color: "#212f3d",
        image: "crystalsuperblacka",
        parents: ["wildCrystalSuperBlack"],
        children: ["crystalSuperBlackSSS"]
    },
    crystalSuperBlackSSS: {
        name: "Crystal Super Black Grade SSS",
        hint_text: "Cull your dark crystal lines to perfection until not a single flake of white breaks the obsidian lacquer.",
        shortName: "Crystal S. Black SSS",
        rarity: "rare",
        family: "bee",
        color: "#17202a",
        image: "crystalsuperblacksss",
        parents: ["crystalSuperBlackA"],
        children: ["whiteBeeLow"]
    },
    wildCrystalSuperRed: {
        name: "Crystal Super Red",
        hint_text: "A mutation that makes even wild crystal black shrimp blush.",
        shortName: "Crystal S. Red",
        rarity: "common",
        family: "bee",
        color: "#c0392b",
        image: "crystalsuperred",
        parents: ["wildCrystalBlack"],
        children: ["extremeRed", "crystalSuperRedA"]
    },
    extremeRed: {
        name: "Extreme Red Taiwan Bee",
        hint_text: "Stoke the recessive embers inside pure red crystal lines until an unbreakably solid scarlet bee ignites.",
        shortName: "Extreme Red T. Bee",
        rarity: "uncommon",
        family: "bee",
        color: "#922b21",
        image: "extremeredtaiwanbee",
        parents: ["wildCrystalSuperRed"],
        children: ["rubyRedOne", "rubyRedTwo"]
    },
    rubyRedOne: {
        name: "Ruby Red One Stripe",
        hint_text: "Carve your red Taiwan bees down until only a single white ribbon accents their deep ruby gemstone.",
        shortName: "Ruby Red 1",
        rarity: "rare",
        family: "bee",
        color: "#a93226",
        image: "rubyredone",
        parents: ["extremeRed"],
        children: ["wineRedA"]
    },
    rubyRedTwo: {
        name: "Ruby Red Two Stripe",
        hint_text: "Select red Taiwan bees that wear two clean white waistbands over their rich crimson armor.",
        shortName: "Ruby Red 2",
        rarity: "rare",
        family: "bee",
        color: "#b03a2e",
        image: "rubyredtwo",
        parents: ["extremeRed"],
        children: ["wineRedA"]
    },
    wineRedA: {
        name: "Wine Red Grade A",
        hint_text: "Look for crisp white stripes slicing through the deep burgundy shells of your rubies.",
        shortName: "Wine Red A",
        rarity: "rare",
        family: "bee",
        color: "#78281f",
        image: "redwinea",
        parents: ["rubyRedOne", "rubyRedTwo"],
        children: ["wineRedSSS"]
    },
    wineRedSSS: {
        name: "Wine Red Grade SSS",
        hint_text: "Age your red wine stock until all white vanishes completely into a bottle of pure, solid merlot.",
        shortName: "Wine Red SSS",
        rarity: "epic",
        family: "bee",
        color: "#641e16",
        image: "redwinesss",
        parents: ["wineRedA"],
        children: ["whiteKingKong"]
    },
    whiteKingKong:{
        name: "White King Kong",
        hint_text: "A rare albino gorilla that only comes from the best of the best wines and pandas.",
        shortName: "White King Kong",
        rarity: "legendary",
        family: "bee",
        color: "#ece8e7",
        image: "whitekingkong",
        parents: ["wineRedSSS", "shadowPandaSSS", "pandaSSS"],
        children: []
    },
    crystalSuperRedA: {
        name: "Crystal Super Red Grade A",
        hint_text: "Pick super red crystals with just a whisper of white remaining on their tails to reach Grade A luster.",
        shortName: "Crystal S. Red A",
        rarity: "uncommon",
        family: "bee",
        color: "#943126",
        image: "crystalsuperreda",
        parents: ["wildCrystalSuperRed"],
        children: ["crystalSuperRedSSS"]
    },
    crystalSuperRedSSS: {
        name: "Crystal Super Red Grade SSS",
        hint_text: "Eliminate every trace of white from your red crystal line until pure scarlet enamel remains.",
        shortName: "Crystal S. Red SSS",
        rarity: "rare",
        family: "bee",
        color: "#78281f",
        image: "crystalsuperredsss",
        parents: ["crystalSuperRedA"],
        children: ["whiteBeeLow"]
    },
    crystalWhite: {
        name: "Crystal White",
        hint_text: "White crystals obtained by a gentle dusting of frost of the wild black crystals.",
        shortName: "Crystal White",
        rarity: "uncommon",
        family: "bee",
        color: "#fdfefe",
        image: "crystalwhite",
        parents: ["wildCrystalBlack"],
        children: ["whiteBeeHigh"]
    },
    whiteBeeLow: {
        name: "White Bee Low Grade",
        hint_text: "Bleach all red and black pigments from both crystal bees until only clear, frosted quartz remains.",
        shortName: "White Bee Low",
        rarity: "rare",
        family: "bee",
        color: "#eaeded",
        image: "whitecrystallow",
        parents: ["crystalSuperBlackSSS", "crystalSuperRedSSS"],
        children: ["whiteBeeHigh"]
    },
    whiteBeeHigh: {
        name: "White Bee High Grade",
        hint_text: "Layering lower white bees with white crystals makes prettier bees.",
        shortName: "White Bee High",
        rarity: "rare",
        family: "bee",
        color: "#fbfcfc",
        image: "whitecrystalhigh",
        parents: ["whiteBeeLow", "crystalWhite"],
        children: ["goldenBee"]
    },
    goldenBee: {
        name: "Golden Bee",
        hint_text: "The citrusy aroma of this honey with a high white crystal make even gold look cheap.",
        shortName: "Golden Bee",
        rarity: "epic",
        family: "bee",
        color: "#f9e79f",
        image: "goldenbee",
        parents: ["whiteBeeHigh", "wildOrangeBee"],
        children: ["blueBolt", "redBolt"]
    },
    blueBolt: {
        name: "Blue Bolt Bee",
        hint_text: "Freezing gold makes it a pretty shade of blue.",
        shortName: "Blue Bolt Bee",
        rarity: "epic",
        family: "bee",
        color: "#5dade2",
        image: "bluebolt",
        parents: ["goldenBee"],
        children: []
    },
    redBolt: {
        name: "Red Bolt Bee",
        hint_text: "Heating gold makes it a pretty shade of red.",
        shortName: "Red Bolt Bee",
        rarity: "epic",
        family: "bee",
        color: "#e74c3c",
        image: "redbolt",
        parents: ["goldenBee"],
        children: []
    },

    /* -------------------------
       TIBEE MUTATIONS
    ------------------------- */

    tibee1: {
        name: "Red Tibee",
        hint_text: "A taiwan a bee hybrid with shiny red heart.",
        shortName: "Red Tibee",
        rarity: "rare",
        family: "tibee",
        color: "#c0392b",
        image: "tibee1",
        parents: [],
        children: []
    },
    tibee2: {
        name: "Frozen Back Tibee",
        hint_text: "A taiwan a bee hybrid. Don't let it give you the cold-shoulder… or back?",
        shortName: "Frozen Back Tibee",
        rarity: "rare",
        family: "tibee",
        color: "#2980b9",
        image: "tibee2",
        parents: [],
        children: []
    },
    tibee3: {
        name: "Red Spotted Tibee",
        hint_text: "A taiwan a bee hybrid. Specks of fire all over it.",
        shortName: "Red Spotted Tibee",
        rarity: "rare",
        family: "tibee",
        color: "#ae2727",
        image: "tibee3",
        parents: [],
        children: []
    },
    tibee4: {
        name: "Cloud Tibee",
        hint_text: "A taiwan a bee hybrid with a cloudy personality.",
        shortName: "Cloud Tibee",
        rarity: "rare",
        family: "tibee",
        color: "#12f3e8",
        image: "tibee4",
        parents: [],
        children: []
    },
    tibee5: {
        name: "Red Zebra Pinto Tibee",
        hint_text: "A taiwan a bee hybrid. A wounded scratch.",
        shortName: "Red Pinto Tibee",
        rarity: "epic",
        family: "tibee",
        color: "#8b2d2d",
        image: "tibee5",
        parents: [],
        children: []
    },
    tibee6: {
        name: "Fishbone Pinto Black Tibee",
        hint_text: "A taiwan a bee hybrid. You won't need a rod to fish these bones.",
        shortName: "Fishbone P. Black Tibee",
        rarity: "epic",
        family: "tibee",
        color: "#2c3e50",
        image: "tibee6",
        parents: [],
        children: []
    },

    /* -------------------------
       ADDITIONAL SULAWESI & UNIQUE SPECIES
    ------------------------- */

    wildSulawesi: {
        name: "Wild Sulawesi",
        hint_text: "Bring this wild Indonesian lake dweller home to ignite the entire volcanic family line by reaching the galaxy.",
        shortName: "Wild Sulawesi",
        rarity: "wild",
        family: "sulawesi",
        color: "#922b21",
        image: "wildsulawesi",
        parents: [],
        children: ["snowSulawesi", "pinkBoxerSulawesi", "harlequinSulawesi"]
    },

    snowSulawesi: {
        name: "Snow Sulawesi",
        hint_text: "Isolate wild Sulawesi lake dwellers displaying crisp white snowfall speckles across their dark bodies.",
        rarity: "rare",
        family: "sulawesi",
        color: "#eaf2f8",
        image: "snowsulawesi",
        parents: ["wildSulawesi"],
        children: ["harlequinSulawesi"]
    },
    pinkBoxerSulawesi: {
        name: "Pink Boxer Sulawesi",
        hint_text: "Scout wild lake varieties for brawlers sporting bright pink gloves on their busy feeding claws.",
        rarity: "rare",
        family: "sulawesi",
        color: "#f1948a",
        image: "pinkboxersulawesi",
        parents: ["wildSulawesi"],
        children: ["harlequinSulawesi"]
    },
    harlequinSulawesi: {
        name: "Harlequin Sulawesi",
        hint_text: "Line-breed snowy and boxing lake dwellers together until they put on a dazzling, tri-colored carnival mask.",
        rarity: "epic",
        family: "sulawesi",
        color: "#922b21",
        image: "harlequinsulawesi",
        parents: ["snowSulawesi", "pinkBoxerSulawesi"],
        children: ["galaxySulawesi"]
    },
    malawaShrimp: {
        name: "Malawa Shrimp",
        hint_text: "A peaceful wild Sulawesi grazer unlocked by establishing a hybrid worthy environment.",
        rarity: "legendary",
        family: "malawa",
        color: "#85929e",
        image: "malawashrimp",
        parents: [],
        children: []
    },
    raccoonShrimp: {
        name: "Raccoon Shrimp",
        hint_text: "A blonde tiger and a striped one make a… raccoon?",
        rarity: "legendary",
        family: "raccoon",
        color: "#7f8c8d",
        image: "raccoonshrimp",
        parents: ["blondeBlueTiger", "redStripesBlueTiger"],
        children: []
    },
    orangeEyeTiger: {
        name: "Orange Eye Tiger",
        hint_text: "Hunt for glowing pumpkin-lantern eyes hidden within your rusty blue tiger bloodlines.",
        rarity: "legendary",
        family: "tiger",
        color: "#d35400",
        image: "orangeeyetiger",
        parents: ["rustyRedBlueTiger"],
        children: []
    },
    glassLaceShrimp: {
        name: "Green Lace Shrimp",
        hint_text: "Once you get all the space in the world this lace will come to you.",
        rarity: "legendary",
        family: "lace",
        color: "#d5dbdb",
        image: "glasslaceshrimp",
        parents: [],
        children: []
    },
    purpleZebra: {
        name: "Purple Zebra Shrimp",
        hint_text: "Purple on purple is purple.",
        rarity: "epic",
        family: "red",
        color: "#5b2c6f",
        image: "purplezebra",
        parents: ["purple"],
        children: []
    },

    /* -------------------------
       METALLIC BOAS
    ------------------------- */

    metallicBoaBlack: {
        name: "Metallic Boa (Black)",
        hint_text: "Only the most hybrid worthy can get this metallic rainbow-prone snake.",
        rarity: "epic",
        family: "boa",
        color: "#1c2833",
        image: "metallicboablack",
        parents: [],
        children: ["metallicBoaRed", "metallicBoaYellow", "metallicBoaOrange", "metallicBoaGreen", "metallicBoaBlue", "metallicBoaPurple"]
    },
    metallicBoaRed: {
        name: "Metallic Boa (Red)",
        hint_text: "The red shade of metal snakes.",
        rarity: "epic",
        family: "boa",
        color: "#b03a2e",
        image: "metallicboared",
        parents: ["metallicBoaBlack"],
        children: []
    },
    metallicBoaYellow: {
        name: "Metallic Boa (Yellow)",
        hint_text: "The yellow shade of metal snakes.",
        rarity: "epic",
        family: "boa",
        color: "#f4d03f",
        image: "metallicboayellow",
        parents: ["metallicBoaBlack"],
        children: []
    },
    metallicBoaOrange: {
        name: "Metallic Boa (Orange)",
        hint_text: "The orange shade of metal snakes.",
        rarity: "epic",
        family: "boa",
        color: "#e67e22",
        image: "metallicboaorange",
        parents: ["metallicBoaBlack"],
        children: []
    },
    metallicBoaGreen: {
        name: "Metallic Boa (Green)",
        hint_text: "The green shade of metal snakes.",
        rarity: "epic",
        family: "boa",
        color: "#27ae60",
        image: "metallicboagreen",
        parents: ["metallicBoaBlack"],
        children: []
    },
    metallicBoaBlue: {
        name: "Metallic Boa (Blue)",
        hint_text: "The blue shade of metal snakes.",
        rarity: "epic",
        family: "boa",
        color: "#2980b9",
        image: "metallicboablue",
        parents: ["metallicBoaBlack"],
        children: []
    },
    metallicBoaPurple: {
        name: "Metallic Boa (Purple)",
        hint_text: "The purple shade of metal snakes.",
        rarity: "epic",
        family: "boa",
        color: "#8e44ad",
        image: "metallicboapurple",
        parents: ["metallicBoaBlack"],
        children: ["metallicBoaRainbow"]
    },
    metallicBoaRainbow: {
        name: "Metallic Boa (Rainbow)",
        hint_text: "The rainbow shade of metal snakes comes from the end of the rainbow.",
        rarity: "epic",
        family: "boa",
        color: "#8e44ad",
        image: "metallicboarainbow",
        parents: ["metallicBoaPurple"],
        children: []
    },
    zombieShrimp: {
    name: "Zombie Shrimp",
    hint_text: "A reanimated specimen from the Black Market. Only males can breed, and only with Green Nessies!",
    rarity: "special",
    family: "special",
    color: "#4d7c4f",
    image: "zombie",
    parents: [],
    children: []
},
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
        wildChance: .50,
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
        wildChance: .20,
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
    },

    special: {
    pregnancy: 1360,
    rest: 580,
    wildChance: 0.0,
    babiesMin: 1,
    babiesMax: 3,
    value: 10000
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
    if (alleleId === "zombieShrimp" || alleleId === "infected") {
        return `<strong style="color: #2ecc71; font-weight: bold;">Infected</strong>`;
    }
    const data = SHRRIMP_SAFE(alleleId);
    const name = data.name;

    // Discovered if sequenced in discoveredAlleles OR unlocked in collection
    const isDiscovered = Boolean(
        game && (
            (game.discoveredAlleles && game.discoveredAlleles.includes(alleleId)) ||
            (game.discovered && game.discovered.includes(alleleId))
        )
    );

    if (!isDiscovered) {
        return `<strong style="color: var(--danger); font-weight: bold;">${name}</strong>`;
    }
    return `<span style="color: var(--text); font-weight: normal;">${name}</span>`;
}