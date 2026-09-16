/* =========================================================
   PARASITE SCANNER MINIGAME (MINIGAME 2)
========================================================= */

const MINIGAME2 = {
    active: false,
    mode: "easy", // "easy" or "hard"
    strikes: 0,
    moneyCollected: 0,
    shrimps: [],
    spawnTimer: null,
    animFrameId: null,
    nextId: 1,
    timeElapsed: 0,

    start(mode) {
        this.active = true;
        this.mode = mode;
        this.strikes = 0;
        this.moneyCollected = 0;
        this.shrimps = [];
        this.nextId = 1;
        this.timeElapsed = 0;

        // Transition screens
        document.getElementById("minigame2Selection").classList.add("hidden");
        document.getElementById("minigame2Game").classList.remove("hidden");
        document.getElementById("minigame2OverModal").classList.add("hidden");

        const canvas = document.getElementById("minigame2Canvas");
        if (canvas) {
            canvas.querySelectorAll(".minigame-shrimp").forEach(el => el.remove());
        }

        this.updateHeaderUI();
        this.scheduleSpawn();
        this.tick();
    },

    stop() {
        this.active = false;
        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        const canvas = document.getElementById("minigame2Canvas");
        if (canvas) {
            canvas.querySelectorAll(".minigame-shrimp").forEach(el => el.remove());
        }

        document.getElementById("minigame2Overlay").classList.add("hidden");
        document.getElementById("minigame2Selection").classList.remove("hidden");
        document.getElementById("minigame2Game").classList.add("hidden");

        // Resume standard time loops
        gamePlaying = true;
        game.lastRealTime = Date.now();
        render();
    },

    finishGame() {
        if (!this.active) return;

        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        game.money += this.moneyCollected;

        const modal = document.getElementById("minigame2OverModal");
        const title = document.getElementById("minigame2OverTitle");
        const text = document.getElementById("minigame2ResultText");

        if (title) {
            title.textContent = "SCANNER COMPLETED";
            title.style.color = "var(--success)";
        }
        if (text) {
            text.innerHTML = `You decided to end the scan and return to your tank.<br><br><strong>Cash collected: +$${this.moneyCollected}</strong>`;
        }

        if (modal) modal.classList.remove("hidden");
        playSellSound();
    },

    scheduleSpawn() {
        if (!this.active) return;

        const delay = 1500 + Math.random() * 1500;
        this.spawnTimer = setTimeout(() => {
            this.spawnShrimp();
            this.scheduleSpawn();
        }, delay);
    },

    spawnShrimp() {
        const canvas = document.getElementById("minigame2Canvas");
        if (!canvas) return;

        const limit = this.mode === "easy" ? 3 : 5;
        const activeCount = this.shrimps.filter(s => !s.clicked).length;
        if (activeCount >= limit) return;

        // Setup species pools based on mode
        let pool = [];
        if (this.mode === "easy") {
            pool = ["redCherry", "yellow", "orange", "shoko", "sakuraRedA"];
        } else {
            pool = [
                "sakuraRedS", "redRili", "redRiliBlue", "orangeRili", "orangeNeon",
                "chocolate", "blueVelvet", "skyBlueVelvet", "whitePearl", "fireRed", "yellowRili",
                "green", "greenJade", "bloodyMaryA", "blueDream", "bluePearl"
            ];
        }

        const species = pool[Math.floor(Math.random() * pool.length)];
        const data = SHRRIMP_SAFE(species);

        const direction = Math.random() < 0.5 ? 1 : -1; // 1 = Left to Right, -1 = Right to Left
        const canvasWidth = canvas.clientWidth || window.innerWidth;
        const canvasHeight = canvas.clientHeight || window.innerHeight;

        const startLeft = direction === 1 ? -150 : canvasWidth + 150;
        const targetHeight = Math.random() * (canvasHeight - 160) + 60;

        // Progressive speed scales up with running session duration
        const speedMultiplier = 1 + (this.timeElapsed / 60) * 0.5;
        const baseSpeed = this.mode === "easy" ? (1.0 + Math.random() * 1.5) : (2.2 + Math.random() * 2.2);
        const finalSpeed = baseSpeed * speedMultiplier;

        let attachment = "yellow_circles";
        let isParasite = false;

        if (this.mode === "easy") {
            if (Math.random() < 0.5) {
                attachment = "green_triangles";
                isParasite = true;
            } else {
                attachment = "yellow_circles";
                isParasite = false;
            }
        } else {
            const roll = Math.random();
            if (roll < 0.33) {
                attachment = "green_circles";
                isParasite = false;
            } else if (roll < 0.66) {
                attachment = "green_triangles";
                isParasite = true;
            } else {
                attachment = "yellow_eyes";
                isParasite = true;
            }
        }

        const id = this.nextId++;

        // Create DOM element
        const element = document.createElement("div");
        element.className = "minigame-shrimp walking";
        element.id = `scan-shrimp-${id}`;
        element.style.left = `${startLeft}px`;
        element.style.top = `${targetHeight}px`;
        element.dataset.frame = "1"; // Initialize frame attribute

        // Apply scaling classes (Basic is 1.5x larger, uncommon/rare in Hard remains at 1x)
        if (this.mode === "easy") {
            element.classList.add("basic");
        } else {
            element.classList.add("nimble");
        }

        const bodyWrapper = document.createElement("div");
        bodyWrapper.className = "shrimp-body-wrapper";

        // Face forward in the direction of movement (and apply the 1.5x size scale in Easy mode)
        const scaleFactor = (this.mode === "easy") ? 1.5 : 1.0;
        const finalXScale = direction * scaleFactor;
        bodyWrapper.style.transform = `scaleX(${finalXScale}) scaleY(${scaleFactor})`;

        element.appendChild(bodyWrapper);

        const img = document.createElement("img");
        img.src = `shrimp/${data.image}1.png`;
        img.onerror = () => {
            img.style.display = "none";
            const fb = document.createElement("div");
            fb.className = "css-shrimp";
            fb.style.setProperty("--shrimp-color", data.color);
            bodyWrapper.appendChild(fb);
        };
        bodyWrapper.appendChild(img);

        // Generate the identical nested structures inside the body wrapper so they flip & layer properly
        if (attachment === "yellow_circles") {
            const attachDiv = document.createElement("div");
            attachDiv.className = "egg-cluster yellow-eggs";
            for (let i = 0; i < 4; i++) {
                const egg = document.createElement("span");
                egg.className = "egg";
                attachDiv.appendChild(egg);
            }
            bodyWrapper.appendChild(attachDiv);
        } else if (attachment === "green_circles") {
            const attachDiv = document.createElement("div");
            attachDiv.className = "egg-cluster green-eggs";
            for (let i = 0; i < 4; i++) {
                const egg = document.createElement("span");
                egg.className = "egg";
                attachDiv.appendChild(egg);
            }
            bodyWrapper.appendChild(attachDiv);
        } else if (attachment === "green_triangles") {
            const attachDiv = document.createElement("div");
            attachDiv.className = "clado-cluster";
            for (let i = 0; i < 4; i++) {
                const tri = document.createElement("span");
                tri.className = "clado-triangle";
                attachDiv.appendChild(tri);
            }
            bodyWrapper.appendChild(attachDiv);
        }

        canvas.appendChild(element);

        const shrimpObj = {
            id,
            species,
            isParasite,
            direction,
            speed: finalSpeed,
            left: startLeft,
            top: targetHeight,
            element,
            img,
            prefix: `shrimp/${data.image}`,
            frame: 1,
            animTimer: 0,
            clicked: false,
            reward: this.mode === "easy" ? 2 : 4
        };

        element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clickShrimp(shrimpObj);
        });

        this.shrimps.push(shrimpObj);
    },

    clickShrimp(s) {
        if (s.clicked || !this.active) return;
        s.clicked = true;

        // Lock animation on frame 1
        s.frame = 1;
        s.img.src = `${s.prefix}1.png`;

        s.element.classList.remove("walking");
        s.element.classList.add("falling"); // CSS halts click event bubbling

        playKeepSound(); // Diagnostic bubble tap feedback sound
    },

    tick() {
        if (!this.active) return;

        this.timeElapsed += 16.67 / 1000;
        const canvas = document.getElementById("minigame2Canvas");
        const canvasWidth = canvas ? canvas.clientWidth : window.innerWidth;

        for (let i = this.shrimps.length - 1; i >= 0; i--) {
            const s = this.shrimps[i];

            if (s.clicked) {
                // Rise upwards out of screen
                s.top -= 6;
                s.element.style.top = `${s.top}px`;

                if (s.top <= -120) {
                    s.element.remove();
                    this.shrimps.splice(i, 1);

                    if (s.isParasite) {
                        this.moneyCollected += s.reward;
                        this.updateHeaderUI();
                        addLog(`🔬 Cull Success! Removed infected ${SHRIMP[s.species].name}.`);
                    } else {
                        this.strikes++;
                        this.updateHeaderUI();
                        addLog(`⚠️ Cull Error! Removed a healthy egg-bearing ${SHRIMP[s.species].name}.`);

                        if (this.strikes >= 3) {
                            this.gameOver();
                            return;
                        }
                    }
                }
            } else {
                // Walk horizontally across screen
                s.left += s.speed * s.direction;
                s.element.style.left = `${s.left}px`;

                // Leg swap animation
                s.animTimer += 16.67;
                if (s.animTimer >= 250) {
                    s.animTimer = 0;
                    s.frame = s.frame === 1 ? 2 : 1;
                    s.img.src = `${s.prefix}${s.frame}.png`;
                    s.element.dataset.frame = s.frame; // Keeps walking frames synchronized with the attachments
                }

                // Check bounds exit
                const leftBoundary = -150;
                const rightBoundary = canvasWidth + 150;

                if ((s.direction === 1 && s.left >= rightBoundary) || (s.direction === -1 && s.left <= leftBoundary)) {
                    s.element.remove();
                    this.shrimps.splice(i, 1);
                }
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.tick());
    },

    updateHeaderUI() {
        const strikesEl = document.getElementById("minigame2Strikes");
        const moneyEl = document.getElementById("minigame2Money");

        if (strikesEl) strikesEl.textContent = `Strikes: ${this.strikes}/3`;
        if (moneyEl) moneyEl.textContent = `Earned: $${this.moneyCollected}`;
    },

    gameOver() {
        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        game.money += this.moneyCollected;

        const modal = document.getElementById("minigame2OverModal");
        const title = document.getElementById("minigame2OverTitle");
        const text = document.getElementById("minigame2ResultText");

        if (title) {
            title.textContent = "GAME OVER, STUDY MORE ABOUT CLADO";
            title.style.color = "var(--danger)";
        }
        if (text) {
            text.innerHTML = `Game over! You failed to accurately diagnose and cull the infections.<br>Study your cladocera and pathogen structures more closely.<br><br><strong>Cash collected: +$${this.moneyCollected}</strong>`;
        }

        if (modal) modal.classList.remove("hidden");
        playPregnantSound();
    }
};