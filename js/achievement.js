/* =========================================================
   ACHIEVEMENTS SYSTEM (achievement.js)
========================================================= */

const ACHIEVEMENTS = {
    firstShrimp: {
        title: "Welcome to the Shrimp Side",
        desc: "Obtain your very first shrimp.",
        check: (game) => game.shrimp.length > 0
    },
    firstBerried: {
        title: "Berries & Cream",
        desc: "Have a female shrimp become berried/pregnant.",
        check: (game) => game.shrimp.some(s => s.pregnant)
    },
    firstBirth: {
        title: "New Generation",
        desc: "Successfully cull and keep a newborn baby in your tank.",
        check: (game) => game.shrimp.some(s => s.ageMinutes > 0 && s.parentIds && s.parentIds.length > 0)
    },
    favoritesUnlocked: {
        title: "Fancy Shrimp Club",
        desc: "Unlock the Favorites Tank and transfer a shrimp into it.",
        check: (game) => game.favoritesTankUnlocked && game.shrimp.some(s => s.tank === "favorites")
    },
    unlockedAmano: {
        title: "Amano-nopoly",
        desc: "Unlock the secret Amano Shrimp line.",
        check: (game) => isAmanoUnlocked()
    },
    unlockedSulawesi: {
        title: "Out of This World",
        desc: "Unlock the secret Sulawesi Shrimp line. (+5% mutation rate for all shrimp in the tank, doesn't stack)",
        check: (game) => isSulawesiUnlocked()
    },
    unlockedBamboo: {
        title: "Bamboo-zled",
        desc: "Unlock the secret Bamboo Shrimp line. (+2 gold per minute for each live adult in your aquarium)",
        check: (game) => isBambooUnlocked()
    },
    discoveredRare: {
        title: "Rarely Seen",
        desc: "Discover a shrimp of 'Rare' rarity.",
        check: (game) => game.discovered.some(id => (SHRIMP[id] || {}).rarity === "rare")
    },
    discoveredEpic: {
        title: "Epic Shrimp Energy",
        desc: "Discover a shrimp of 'Epic' rarity.",
        check: (game) => game.discovered.some(id => (SHRIMP[id] || {}).rarity === "epic")
    },
    discoveredLegendary: {
        title: "Shrimply Legendary",
        desc: "Discover a legendary shrimp.",
        check: (game) => game.shrimp.some(s => SHRRIMP_SAFE(s.species).rarity === "legendary")
    },
    discoveredSpiderman: {
        title: "A shrimp or a spider?",
        desc: "Discover a Spiderman shrimp in your tank.",
        check: (game) => game.shrimp.some(s => s.species === "spiderman")
    },
    discoveredScud: {
        title: "Scud Overlord",
        desc: "Discover a Legendary Scud in your tank. (Reduces maturation time by 10% for all shrimp in the tank, doesn't stack).",
        check: (game) => game.shrimp.some(s => s.species === "legendaryScud")
    },
    discoveredRedCrawfish: {
        title: "Cray-zy Claws",
        desc: "Unlock and purchase a feisty Red Crawfish. (Boosts sale value of other shrimp in the same tank by +10%, doesn't stack).",
        check: (game) => game.shrimp.some(s => s.species === "redCrawfish")
    },
    discoveredBlueCrawfish: {
        title: "Shiny!",
        desc: "Mutate an incredibly rare Blue Crawfish from Red Crawfish parents. (Reduces pregnancy time of females in the same tank by 15%, doesn't stack).",
        check: (game) => game.shrimp.some(s => s.species === "blueCrawfish")
    },
    discoveredDarkBlueCherry: {
        title: "Genetic Lottery",
        desc: "Mutate an extremely rare Dark Blue Cherry from Fire Red Painted parents.",
        check: (game) => game.discovered.includes("darkBlueCherry") || game.shrimp.some(s => s.species === "darkBlueCherry")
    },
    discoveredGreenNessie: {
        title: "Phenome-nal",
        desc: "Breed a dominant phenotype Green Nessie from Dark Blue Cherry lineage.",
        check: (game) => game.discovered.includes("greenNessie") || game.shrimp.some(s => s.species === "greenNessie")
    },
    discoveredRedNose: {
        title: "A reindeer?!?",
        desc: "Unlock and obtain the legendary Rudolph Red Nose Shrimp. (Reduces rest time of females in the same tank by 20%, doesn't stack).",
        check: (game) => (game.discovered && game.discovered.includes("redNose")) || game.shrimp.some(s => s.species === "redNose")
    },
    discoveredVampire: {
        title: "Creature of the Night",
        desc: "Unlock and obtain a legendary Vampire Shrimp. (Increases the capacity of the tank it resides in by +5 capacity).",
        check: (game) => (game.discovered && game.discovered.includes("vampireShrimp")) || game.shrimp.some(s => s.species === "vampireShrimp")
    }
};

function triggerAchievementPopup(id, title, desc) {
    const popup = document.getElementById("achievementPopup");
    if (!popup) return;

    if (popup.dataset.timeoutId) {
        clearTimeout(parseInt(popup.dataset.timeoutId));
    }

    popup.innerHTML = `
        <div class="achievement-img-wrapper" style="border-color: #f1c40f; background: rgba(241, 196, 15, 0.1); width: 48px; height: 48px;">
            <img src="achievements/${id}.png" class="achievement-img" alt="${title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span style="font-size: 20px; display: none;"><img src="emoji/trophy.png" alt="Trophy" class="ui-emoji"></span>
        </div>
        <div class="achievement-info" style="color: #e6f2f4; text-align: left;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #f1c40f; font-weight: bold; display: block;">Achievement Unlocked!</span>
            <h3 class="achievement-title" style="color: #ffffff; font-size: 14px; margin: 1px 0 0 0; line-height: 1.2;">${title}</h3>
            <p class="achievement-desc" style="color: #8fa0a5; font-size: 11px; margin: 1px 0 0 0; line-height: 1.2;">${desc}</p>
        </div>
    `;

    playAchievementSound();

    popup.classList.remove("hidden");
    void popup.offsetHeight;
    popup.classList.add("active");

    const tId = setTimeout(() => {
        popup.classList.remove("active");
        setTimeout(() => {
            if (!popup.classList.contains("active")) {
                popup.classList.add("hidden");
            }
        }, 400);
    }, 2500);

    popup.dataset.timeoutId = tId;
}

function checkAchievements() {
    if (!game) return;
    if (!game.achievements) game.achievements = [];

    let unlockedAny = false;
    for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
        if (game.achievements.includes(id)) continue;

        if (ach.check && ach.check(game)) {
            // Only trigger popup & audio if player is actively playing
            if (typeof gamePlaying !== "undefined" && !gamePlaying) {
                continue;
            }

            game.achievements.push(id);
            addLog(`${icon('trophy')} Achievement Unlocked: ${ach.title}!`);
            unlockedAny = true;
            triggerAchievementPopup(id, ach.title, ach.desc);
        }
    }

    if (unlockedAny) {
        saveGame();
        renderAchievements();
    }
}

function renderAchievements() {
    const container = document.getElementById("achievementsList");
    if (!container) return;

    container.innerHTML = "";

    if (!game.achievements) game.achievements = [];

    checkAchievements();

    for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
        const unlocked = game.achievements.includes(id);

        const card = document.createElement("div");
        card.className = "achievement-card " + (unlocked ? "" : "locked");

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "achievement-img-wrapper";

        const img = document.createElement("img");
        img.src = `achievements/${id}.png`;
        img.className = "achievement-img";
        img.alt = unlocked ? ach.title : "Locked";

        img.onerror = () => {
            img.style.display = "none";
            const fallbackImg = document.createElement("img");
            fallbackImg.src = unlocked ? "emoji/trophy.png" : "emoji/lock.png";
            fallbackImg.alt = unlocked ? "Unlocked" : "Locked";
            fallbackImg.style.width = "28px";
            fallbackImg.style.height = "28px";
            fallbackImg.style.objectFit = "contain";
            imgWrapper.appendChild(fallbackImg);
        };

        imgWrapper.appendChild(img);
        card.appendChild(imgWrapper);

        const info = document.createElement("div");
        info.className = "achievement-info";

        const title = document.createElement("h3");
        title.className = "achievement-title";
        title.textContent = unlocked ? ach.title : "???";
        info.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "achievement-desc";
        desc.textContent = unlocked ? ach.desc : "???";
        info.appendChild(desc);

        card.appendChild(info);
        container.appendChild(card);
    }
}