/* =========================================================
   RETRO MINIGAME MODULE
========================================================= */

const MINIGAME = {
    active: false,
    strikes: 0,
    moneyCollected: 0,
    shrimps: [],
    spawnTimer: null,
    animFrameId: null,
    nextId: 1,
    timeElapsed: 0,
    currentSpeedTier: 0, // SHRIMP OVERHAUL

    shrimpTypes: {
        basic: {
            hp: 1,
            speedMin: 1.3,
            speedMax: 2.1,
            reward: 2,
            class: "basic",
            imagePrefix: "shrimp/game/basic",
            color: "#e63d3d"
        },
        bulky: {
            hp: 2,
            speedMin: 0.7,
            speedMax: 1.2,
            reward: 6,
            class: "bulky",
            imagePrefix: "shrimp/game/bulky",
            color: "#d47b32"
        },
        nimble: {
            hp: 1,
            speedMin: 2.6,
            speedMax: 3.8,
            reward: 10,
            class: "nimble",
            imagePrefix: "shrimp/game/nimble",
            color: "#5cb6d3"
        }
    },

    start() { // SHRIMP OVERHAUL
        if (this.active) return;
        this.active = true;
        this.strikes = 0;
        this.moneyCollected = 0;
        this.shrimps = [];
        this.nextId = 1;
        this.timeElapsed = 0;
        this.currentSpeedTier = 0; // <-- ADDED: Reset milestone tracking

        // Display screen overlay
        const overlay = document.getElementById("minigameOverlay");
        if (overlay) overlay.classList.remove("hidden");

        const modal = document.getElementById("minigameOverModal");
        if (modal) modal.classList.add("hidden");

        // Clear previous canvas objects & banners
        const canvas = document.getElementById("minigameCanvas");
        if (canvas) {
            canvas.querySelectorAll(".minigame-shrimp, .minigame-speed-warning").forEach(el => el.remove());
        }

        this.updateHeaderUI();
        this.scheduleSpawn();
        this.tick();
    },

    stop() {
        this.saveHighScore();
        this.active = false;
        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        // Clear canvas
        const canvas = document.getElementById("minigameCanvas");
        if (canvas) {
            canvas.querySelectorAll(".minigame-shrimp").forEach(el => el.remove());
        }

        // Hide screen overlay
        const overlay = document.getElementById("minigameOverlay");
        if (overlay) overlay.classList.add("hidden");

        game.lastRealTime = Date.now();
        render();
    },

    scheduleSpawn() { // SHRIMP OVERHAUL
        if (!this.active) return;

        // Generous spawn intervals so waves never feel like a wall
        let baseDelay = 1500;
        if (this.moneyCollected >= 500) {
            baseDelay = 800;
        } else if (this.moneyCollected >= 350) {
            baseDelay = 1050;
        } else if (this.moneyCollected >= 200) {
            baseDelay = 1200;
        } else if (this.moneyCollected >= 100) {
            baseDelay = 1350;
        }

        const delay = baseDelay + Math.random() * 350;
        this.spawnTimer = setTimeout(() => {
            this.spawnWave();
            this.scheduleSpawn();
        }, delay);
    },

    spawnWave() { // SHRIMP OVERHAUL
        if (!this.active) return;

        const maxCap = 8; // Screen cap to avoid overwhelming clusters
        const activeCount = this.shrimps.filter(s => !s.falling).length;
        const availableSlots = maxCap - activeCount;
        if (availableSlots <= 0) return;

        let burstCount = 1;
        const score = this.moneyCollected;
        const roll = Math.random();

        // 500+: Chaos mode (up to 4-5)
        if (score >= 500) {
            if (roll < 0.25) burstCount = 4;
            else if (roll < 0.65) burstCount = 3;
            else burstCount = 2;
        }
        // 250 - 499: Maximum 3 shrimp (very manageable)
        else if (score >= 250) {
            if (roll < 0.35) burstCount = 3;
            else if (roll < 0.75) burstCount = 2;
            else burstCount = 1;
        }
        // 100 - 249: Maximum 2 shrimp
        else if (score >= 100) {
            burstCount = roll < 0.50 ? 2 : 1;
        }
        // 0 - 99: Strictly 1 shrimp
        else {
            burstCount = 1;
        }

        const countToSpawn = Math.min(burstCount, availableSlots);

        for (let i = 0; i < countToSpawn; i++) {
            // Slower staggered release so you have ample time to react to each target
            setTimeout(() => {
                if (this.active) this.spawnShrimp();
            }, i * 220);
        }
    },


    spawnShrimp() { // SHRIMP OVERHAUL
        const canvas = document.getElementById("minigameCanvas");
        if (!canvas) return;

        const roll = Math.random();
        let typeKey = "basic";
        if (roll < 0.15) {
            typeKey = "nimble";
        } else if (roll < 0.40) {
            typeKey = "bulky";
        }

        const config = this.shrimpTypes[typeKey];
        const canvasWidth = canvas.clientWidth || window.innerWidth;
        const canvasHeight = canvas.clientHeight || window.innerHeight;

        const id = this.nextId++;
        const left = Math.random() * Math.max(100, canvasWidth - 120);

        // Very gentle, linear speed progression:
        // $0   = 1.0x
        // $250 = ~1.17x (completely playable)
        // $500 = ~1.35x
        // >$500 = begins exponential ramp
        let multiplier = 1.0 + (this.moneyCollected * 0.0007);
        if (this.moneyCollected > 500) {
            multiplier *= Math.pow(1.003, this.moneyCollected - 500);
        }

        const baseSpeed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);
        const speed = baseSpeed * multiplier;

        const element = document.createElement("div");
        element.className = `minigame-shrimp ${config.class}`;
        element.id = `minishrimp-${id}`;
        element.style.left = `${left}px`;
        element.style.top = `${canvasHeight}px`;

        const img = document.createElement("img");
        img.src = `${config.imagePrefix}1.png`;
        img.alt = typeKey;
        img.onerror = () => {
            img.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "css-shrimp";
            fallback.style.setProperty("--shrimp-color", config.color);
            element.appendChild(fallback);
        };
        element.appendChild(img);

        canvas.appendChild(element);

        const shrimpObj = {
            id,
            type: typeKey,
            hp: config.hp,
            speed,
            top: canvasHeight,
            left,
            element,
            img,
            falling: false,
            frame: 1,
            animTimer: 0,
            reward: config.reward,
            prefix: config.imagePrefix,
            color: config.color
        };

        element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clickShrimp(shrimpObj);
        });

        this.shrimps.push(shrimpObj);
    },


    clickShrimp(s) {
        if (s.falling || !this.active) return;

        s.hp--;
        s.element.classList.remove("hit-flash");
        void s.element.offsetWidth;
        s.element.classList.add("hit-flash");

        if (s.hp <= 0) {
            s.falling = true;
            s.element.classList.add("falling");

            s.img.src = `${s.prefix}Fall.png`;
            s.img.onerror = () => {
                s.img.style.display = "none";
                const fb = s.element.querySelector(".css-shrimp");
                if (fb) fb.style.transform = "scale(1.3) rotate(180deg)";
            };

            playKeepSound();

            this.moneyCollected += s.reward;
            this.checkSpeedMilestones(); // <-- Checks for 20 / 50 / 70 thresholds
            this.updateHeaderUI();
        } else {
            playKeepSound();
        }
    },

    saveHighScore() { // SHRIMP OVERHAUL
        if (!game) return;
        if (this.moneyCollected > (game.minigame1HighScore || 0)) {
            game.minigame1HighScore = this.moneyCollected;
        }
        saveGame(); // Commit to localStorage immediately
    },

    checkSpeedMilestones() { // SHRIMP OVERHAUL
        if (this.moneyCollected >= 500 && this.currentSpeedTier < 500) {
            this.currentSpeedTier = 500;
            this.showSpeedBanner();
        } else if (this.moneyCollected >= 350 && this.currentSpeedTier < 350) {
            this.currentSpeedTier = 350;
            this.showSpeedBanner();
        } else if (this.moneyCollected >= 200 && this.currentSpeedTier < 200) {
            this.currentSpeedTier = 200;
            this.showSpeedBanner();
        } else if (this.moneyCollected >= 100 && this.currentSpeedTier < 100) {
            this.currentSpeedTier = 100;
            this.showSpeedBanner();
        }
    },

    showSpeedBanner() { // SHRIMP OVERHAUL
        const canvas = document.getElementById("minigameCanvas");
        if (!canvas) return;

        const existing = canvas.querySelector(".minigame-speed-warning");
        if (existing) existing.remove();

        const banner = document.createElement("div");
        banner.className = "minigame-speed-warning";
        banner.innerHTML = `<img src="emoji/lightning.png" alt="Speed Warning" class="ui-emoji"> THEY ARE ESCAPING FASTER!`;
        canvas.appendChild(banner);

        setTimeout(() => banner.remove(), 2500);
    },


    tick() {
        if (!this.active) return;

        // Advance time elapsed by the duration of one frame (~16.67ms)
        this.timeElapsed += 16.67 / 1000;

        const canvas = document.getElementById("minigameCanvas");
        const canvasHeight = canvas ? canvas.clientHeight : window.innerHeight;


        for (let i = this.shrimps.length - 1; i >= 0; i--) {
            const s = this.shrimps[i];

            if (s.falling) {
                // Descend out of screen
                s.top += 8;
                s.element.style.top = `${s.top}px`;

                if (s.top >= canvasHeight + 100) {
                    s.element.remove();
                    this.shrimps.splice(i, 1);
                }
            } else {
                // Floating upwards
                s.top -= s.speed;
                s.element.style.top = `${s.top}px`;

                // Swim animation swaps frames periodically
                s.animTimer += 16.67;
                if (s.animTimer >= 300) {
                    s.animTimer = 0;
                    s.frame = s.frame === 1 ? 2 : 1;
                    s.img.src = `${s.prefix}${s.frame}.png`;
                }

                // Check finish line crossing (line is at 40px)
                if (s.top <= 40) {
                    this.strikes++;
                    this.updateHeaderUI();

                    s.element.remove();
                    this.shrimps.splice(i, 1);

                    playBtnSound();

                    if (this.strikes >= 3) {
                        this.gameOver();
                        return;
                    }
                }
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.tick());
    },

    updateHeaderUI() {
        const strikesEl = document.getElementById("minigameStrikes");
        const moneyEl = document.getElementById("minigameMoney");

        if (strikesEl) strikesEl.textContent = `Strikes: ${this.strikes}/3`;
        if (moneyEl) moneyEl.textContent = `Earned: $${this.moneyCollected}`;
    },

    finishGame() { // SHRIMP OVERHAUL
        if (!this.active) return;

        this.active = false; // release the active state lock

        // Halt spawning and physics loops
        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        // Credit earned money to wallet balance
        game.money += this.moneyCollected;
        this.saveHighScore();

        const modal = document.getElementById("minigameOverModal");
        const title = document.getElementById("minigameOverTitle");
        const text = document.getElementById("minigameResultText");

        if (title) {
            title.textContent = "MINIGAME FINISHED";
            title.style.color = "var(--success)";
        }
        if (text) {
            text.innerHTML = `You decided to end the run and return to your tank.<br><br><strong>Cash collected: +$${this.moneyCollected}</strong>`;
        }

        if (modal) modal.classList.remove("hidden");

        playSellSound();
    },

    gameOver() { // SHRIMP OVERHAUL
        this.active = false; // release the active state lock

        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        // Credit money directly to wallet balance
        game.money += this.moneyCollected;
        this.saveHighScore();

        const modal = document.getElementById("minigameOverModal");
        const title = document.getElementById("minigameOverTitle");
        const text = document.getElementById("minigameResultText");

        if (title) {
            title.textContent = "THEY HAVE EVOLVED";
            title.style.color = "var(--danger)";
        }
        if (text) {
            text.innerHTML = `All 3 shrimp escaped!<br>They successfully breached the surface and mutated into a higher species.<br><br><strong>Cash collected: +$${this.moneyCollected}</strong>`;
        }

        if (modal) modal.classList.remove("hidden");

        playPregnantSound(); // Play evolution cue sound effect on finish
    }
};