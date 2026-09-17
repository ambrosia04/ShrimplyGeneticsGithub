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

    start() {
        if (this.active) return;
        this.active = true;
        this.strikes = 0;
        this.moneyCollected = 0;
        this.shrimps = [];
        this.nextId = 1;
        this.timeElapsed = 0;

        // Keep tank running.

        // Display screen overlay
        const overlay = document.getElementById("minigameOverlay");
        if (overlay) overlay.classList.remove("hidden");

        const modal = document.getElementById("minigameOverModal");
        if (modal) modal.classList.add("hidden");

        // Clear previous canvas objects
        const canvas = document.getElementById("minigameCanvas");
        if (canvas) {
            canvas.querySelectorAll(".minigame-shrimp").forEach(el => el.remove());
        }

        this.updateHeaderUI();

        // Spawn loop
        this.scheduleSpawn();

        // Physics tick loop
        this.tick();
    },

    stop() {
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

        // Resume main game simulation timeline
        game.lastRealTime = Date.now();
        render();
    },

    scheduleSpawn() {
        if (!this.active) return;

        // Spawn every 1.2s to 2.2s
        const delay = 1200 + Math.random() * 1000;
        this.spawnTimer = setTimeout(() => {
            this.spawnShrimp();
            this.scheduleSpawn();
        }, delay);
    },

    spawnShrimp() {
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
        const left = Math.random() * Math.max(100, canvasWidth - 100);

        // Calculate speed with a slow progressive ramp (+15% speed increase per 60 seconds elapsed)
        const baseSpeed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);
        const speedMultiplier = 1 + (this.timeElapsed / 60) * 0.15; // Change this to 0.1 for a slower ramp and 0.2 for a faster ramp
        const speed = baseSpeed * speedMultiplier;

        // Create DOM element
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

        // Event listener for click directly on the element
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clickShrimp(shrimpObj);
        });

        this.shrimps.push(shrimpObj);
    },

    clickShrimp(s) {
        if (s.falling || !this.active) return;

        s.hp--;

        // Play hit animation
        s.element.classList.remove("hit-flash");
        void s.element.offsetWidth; // trigger reflow
        s.element.classList.add("hit-flash");

        if (s.hp <= 0) {
            // Initiate Fall sequence
            s.falling = true;
            s.element.classList.add("falling");

            // Swap sprite to Fall image
            s.img.src = `${s.prefix}Fall.png`;
            s.img.onerror = () => {
                s.img.style.display = "none";
                const fb = s.element.querySelector(".css-shrimp");
                if (fb) {
                    fb.style.transform = "scale(1.3) rotate(180deg)"; // flips CSS fallback upside down
                }
            };

            playKeepSound(); // Replaces the money sound to play only the keep (bubble) sound on defeat

            this.moneyCollected += s.reward;
            this.updateHeaderUI();
        } else {
            // Feedback sound for bulky taps
            playKeepSound(); // Plays only the keep (bubble) sound on non-lethal taps
        }
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

    finishGame() {
        if (!this.active) return;

        this.active = false; // release the active state lock

        // Halt spawning and physics loops
        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        // Credit earned money to wallet balance
        game.money += this.moneyCollected;


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

    gameOver() {
        this.active = false; // release the active state lock

        if (this.spawnTimer) clearTimeout(this.spawnTimer);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        // Credit money directly to wallet balance
        game.money += this.moneyCollected;


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