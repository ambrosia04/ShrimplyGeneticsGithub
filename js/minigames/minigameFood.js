/* =========================================================
   FOOD PREPARATION MINIGAME (RECOVERY PREP)
========================================================= */

const FOOD_PREP = {
    active: false,
    gameType: "cucumber", // "cucumber", "brine", "measuring"
    stage: 1,

    // CUCUMBER VARIABLES
    sliceCount: 0,
    requiredSlices: 3,
    perfectSlices: 0,
    goodSlices: 0,
    blanchCount: 0,
    requiredBlanches: 3,
    perfectBlanches: 0,
    goodBlanches: 0,
    indicatorPos: 0,
    indicatorDir: 1,
    sliceSpeed: 3,
    outerCircleScale: 2.5,
    circleShrinkSpeed: 0.018,
    cutLines: [
        { pct: 25, cut: false },
        { pct: 50, cut: false },
        { pct: 75, cut: false }
    ],
    isDraggingKnife: false,

    // BRINE SHRIMP VARIABLES
    cubeClickedCount: 0,
    stirProgress: 0,
    lastStirCheckpoint: 1,
    rotationsCompleted: 0,

    // MEASURING PELLETS VARIABLES
    targetPellets: 7,
    spoonedPelletsCount: 0,
    incorrectSpoonedCount: 0,

    moneyEarned: 0,
    animFrameId: null,

    start() {
        this.active = true;
        this.moneyEarned = 0;

        // Choose randomly between cucumber (1/3), brine (1/3), measuring (1/3)
        const roll = Math.random();
        if (roll < 0.33) {
            this.gameType = "cucumber";
            this.stage = 1;
            this.sliceCount = 0;
            this.perfectSlices = 0;
            this.goodSlices = 0;
            this.blanchCount = 0;
            this.perfectBlanches = 0;
            this.goodBlanches = 0;
            this.cutLines = [
                { pct: 25, cut: false },
                { pct: 50, cut: false },
                { pct: 75, cut: false }
            ];
        } else if (roll < 0.66) {
            this.gameType = "brine";
            this.stage = 1;
            this.cubeClickedCount = 0;
            this.stirProgress = 0;
            this.lastStirCheckpoint = 1;
            this.rotationsCompleted = 0;
        } else {
            this.gameType = "measuring";
            this.stage = 1;
            this.targetPellets = randomInt(5, 10);
            this.spoonedPelletsCount = 0;
            this.incorrectSpoonedCount = 0;
        }

        gamePlaying = false; // Pause main background calculations

        document.getElementById("foodPrepOverlay").classList.remove("hidden");
        document.getElementById("foodPrepIntro").classList.add("hidden");
        document.getElementById("foodPrepGame").classList.remove("hidden");
        document.getElementById("foodPrepOverModal").classList.add("hidden");

        this.setupStage();
        this.tick();
    },

    setupStage() {
        const stepTitle = document.getElementById("foodPrepStepTitle");
        const instructions = document.getElementById("foodPrepInstructions");

        // Hide all stage containers by default
        document.getElementById("foodPrepSlicingUI").classList.add("hidden");
        document.getElementById("foodPrepBlanchingUI").classList.add("hidden");
        document.getElementById("foodPrepBrineCubesUI").classList.add("hidden");
        document.getElementById("foodPrepBrineStirUI").classList.add("hidden");
        document.getElementById("foodPrepPelletsUI").classList.add("hidden");

        if (this.gameType === "cucumber") {
            if (this.stage === 1) {
                stepTitle.textContent = "Step 1: Slice the Cucumber";
                instructions.innerHTML = "<strong>Drag the knife down</strong> across each dashed line, or press <strong>Space / CHOP</strong> instantly!";
                document.getElementById("foodPrepSlicingUI").classList.remove("hidden");
                this.indicatorPos = 0;
                this.indicatorDir = 1;
                this.setupDragKnifeSlicing();
            } else if (this.stage === 2) {
                stepTitle.textContent = "Step 2: Blanch the Slices";
                instructions.innerHTML = "Press <strong>Space</strong> or tap <strong>BLANCH</strong> when the shrinking ring overlaps the green circle!";
                document.getElementById("foodPrepBlanchingUI").classList.remove("hidden");
                this.resetBlanchRing();
                this.setupBlanchPotInteractions();
            }
        } else if (this.gameType === "brine") {
            if (this.stage === 1) {
                stepTitle.textContent = "Defrosting Brine Shrimp - Stage 1";
                instructions.textContent = "Defrost the shrimp! Tap the frozen cubes in sequence (1 → 2 → 3 → 4).";
                document.getElementById("foodPrepBrineCubesUI").classList.remove("hidden");
                this.generateBrineCubes();
            } else if (this.stage === 2) {
                stepTitle.textContent = "Defrosting Brine Shrimp - Stage 2";
                instructions.textContent = "Melt the block! Stir with your mouse in clockwise circles inside the bowl.";
                document.getElementById("foodPrepBrineStirUI").classList.remove("hidden");
                this.setupStirbowl();
            }
        } else if (this.gameType === "measuring") {
            stepTitle.textContent = `Measuring Food - Target: ${this.targetPellets} Pellets`;
            instructions.innerHTML = `Drag exactly ${this.targetPellets} food pellets (${icon('pellet')}) into the spoon. Do NOT scoop up debris (${icon('cherries')}, ${icon('leaf')}, ${icon('hankey')}, ${icon('battery')})!`;
            document.getElementById("foodPrepPelletsUI").classList.remove("hidden");
            this.generatePelletsSandbox();
        }
    },

    setupDragKnifeSlicing() {
        const board = document.querySelector(".cutting-board");
        const knife = document.getElementById("chefKnife");
        const cucumber = document.getElementById("cucumberSprite");
        if (!board || !knife || !cucumber) return;

        cucumber.querySelectorAll(".cucumber-slice-mark").forEach((mark) => {
            mark.classList.remove("cut-complete");
            mark.style.opacity = "1";
        });

        knife.style.transform = "";
        knife.style.left = "";
        knife.style.top = "";

        let dragging = false;
        let startY = 0;

        const onStart = (clientX, clientY) => {
            if (this.stage !== 1 || this.gameType !== "cucumber") return;
            dragging = true;
            this.isDraggingKnife = true;
            startY = clientY;
            updateKnifePos(clientX, clientY);
        };

        const updateKnifePos = (clientX, clientY) => {
            const rect = board.getBoundingClientRect();
            const relX = clientX - rect.left;
            const relY = clientY - rect.top;

            knife.style.left = `${Math.max(10, Math.min(rect.width - 40, relX - 25))}px`;
            knife.style.top = `${Math.max(-20, Math.min(rect.height - 30, relY - 40))}px`;

            if (dragging) {
                const cRect = cucumber.getBoundingClientRect();
                const cucumberRelX = clientX - cRect.left;
                const cucumberWidth = cRect.width;

                if (clientY - startY > 20 && clientY >= cRect.top - 10 && clientY <= cRect.bottom + 40) {
                    this.cutLines.forEach((line, idx) => {
                        if (!line.cut) {
                            const targetPixelX = (line.pct / 100) * cucumberWidth;
                            const dist = Math.abs(cucumberRelX - targetPixelX);

                            // Generous drag-cutting window (within 40px)
                            if (dist < 40) {
                                line.cut = true;
                                startY = clientY;
                                this.performDragCut(idx, dist);
                            }
                        }
                    });
                }
            }
        };

        const onEnd = () => {
            dragging = false;
            this.isDraggingKnife = false;
            knife.style.transform = "";
        };

        board.onpointerdown = (e) => {
            e.preventDefault();
            onStart(e.clientX, e.clientY);
        };

        window.onpointermove = (e) => {
            if (dragging) {
                updateKnifePos(e.clientX, e.clientY);
            }
        };

        window.onpointerup = onEnd;
        window.onpointercancel = onEnd;
    },

    performDragCut(lineIndex, distance) {
        const marks = document.querySelectorAll(".cucumber-slice-mark");
        if (marks[lineIndex]) {
            marks[lineIndex].classList.add("cut-complete");
        }

        // Expanded forgiving thresholds
        if (distance <= 18) {
            this.perfectSlices++;
            this.showFeedback("Perfect Cut!", "#52a56c");
        } else if (distance <= 35) {
            this.goodSlices++;
            this.showFeedback("Good Cut", "#4a9fba");
        } else {
            this.showFeedback("Rough Cut", "#d47b32");
        }

        playKeepSound();
        this.sliceCount++;

        if (this.sliceCount >= this.requiredSlices) {
            this.stage = 0; // Lock stage while transitioning
            setTimeout(() => {
                this.stage = 2;
                this.setupStage();
            }, 600);
        }
    },

    setupBlanchPotInteractions() {
        const pot = document.querySelector(".blanching-pot");
        if (pot) {
            pot.onpointerdown = (e) => {
                e.preventDefault();
                this.blanchClick();
            };
        }
    },

    resetBlanchRing() {
        this.outerCircleScale = 2.5;
    },

    generateBrineCubes() {
        const container = document.getElementById("brineCubesContainer");
        if (!container) return;
        container.innerHTML = "";

        const nums = [1, 2, 3, 4];
        nums.sort(() => Math.random() - 0.5);

        nums.forEach(num => {
            const cube = document.createElement("div");
            cube.className = "brine-frozen-cube";
            cube.textContent = num;
            cube.dataset.num = num;

            cube.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                if (this.stage !== 1 || this.gameType !== "brine" || cube.classList.contains("cube-clicked")) return;

                const expected = this.cubeClickedCount + 1;
                if (parseInt(cube.dataset.num) === expected) {
                    cube.classList.add("cube-clicked");
                    this.cubeClickedCount++;
                    this.showFeedback(`Melted ${expected}/4!`, "#52a56c");
                    playKeepSound();

                    if (this.cubeClickedCount >= 4) {
                        setTimeout(() => {
                            this.stage = 2;
                            this.setupStage();
                        }, 500);
                    }
                } else {
                    this.showFeedback(`Wrong sequence! Tap ${expected} next`, "#d95c5c");
                    playBtnSound();
                }
            });

            container.appendChild(cube);
        });
    },

    setupStirbowl() {
        this.stirProgress = 0;
        this.lastStirCheckpoint = 1;
        this.rotationsCompleted = 0;
        this.updateStirringWaypoints();

        const txt = document.getElementById("stirProgressText");
        if (txt) txt.textContent = `Stirring: 0%`;

        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`stirDot${i}`);
            if (dot) {
                const newDot = dot.cloneNode(true);
                dot.parentNode.replaceChild(newDot, dot);

                newDot.addEventListener("pointerenter", () => {
                    this.triggerCheckpoint(i);
                });
                newDot.addEventListener("pointerdown", (e) => {
                    e.preventDefault();
                    this.triggerCheckpoint(i);
                });
            }
        }
    },

    triggerCheckpoint(index) {
        if (this.gameType !== "brine" || this.stage !== 2) return;

        if (index === this.lastStirCheckpoint) {
            this.lastStirCheckpoint = (index % 4) + 1;

            if (index === 4) {
                this.rotationsCompleted++;
                this.stirProgress = Math.min(100, this.rotationsCompleted * 20);

                const txt = document.getElementById("stirProgressText");
                if (txt) txt.textContent = `Stirring: ${this.stirProgress}%`;

                const meltIcon = document.getElementById("stirMeltingBrine");
                if (meltIcon) {
                    meltIcon.style.transform = `rotate(${this.rotationsCompleted * 72}deg) scale(${1 - (this.stirProgress / 220)})`;
                }

                playKeepSound();

                if (this.stirProgress >= 100) {
                    this.stage = 0;
                    this.showFeedback("Shrimp Liquid Defrosted!", "#52a56c");
                    setTimeout(() => {
                        this.finishGame();
                    }, 600);
                } else {
                    this.showFeedback(`Rotation ${this.rotationsCompleted}/5`, "#5cb6d3");
                }
            }
            this.updateStirringWaypoints();
        }
    },

    updateStirringWaypoints() {
        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`stirDot${i}`);
            if (dot) {
                dot.classList.remove("dot-target", "dot-active");
                if (i === this.lastStirCheckpoint) {
                    dot.classList.add("dot-target");
                } else {
                    const prev = this.lastStirCheckpoint === 1 ? 4 : this.lastStirCheckpoint - 1;
                    if (i === prev) {
                        dot.classList.add("dot-active");
                    }
                }
            }
        }
    },

    generatePelletsSandbox() {
        const sandbox = document.getElementById("pelletsSandbox");
        const submitBtn = document.getElementById("submitPelletsBtn");
        if (!sandbox || !submitBtn) return;

        const spoon = document.getElementById("pelletSpoon");
        sandbox.innerHTML = "";
        sandbox.appendChild(spoon);

        this.spoonedPelletsCount = 0;
        this.incorrectSpoonedCount = 0;

        submitBtn.textContent = `Done (0/${this.targetPellets})`;
        submitBtn.disabled = true;

        const sandboxWidth = sandbox.clientWidth || 400;
        const sandboxHeight = sandbox.clientHeight || 260;

        const pelletCountToSpawn = this.targetPellets + randomInt(2, 4);
        for (let i = 0; i < pelletCountToSpawn; i++) {
            this.spawnDraggableItem("pellet", "pellet", sandbox, sandboxWidth, sandboxHeight);
        }

        const distractors = ["cherries", "hankey", "leaf", "battery"];
        const distractionCount = randomInt(6, 10);
        for (let i = 0; i < distractionCount; i++) {
            const imageName = distractors[Math.floor(Math.random() * distractors.length)];
            this.spawnDraggableItem("distraction", imageName, sandbox, sandboxWidth, sandboxHeight);
        }
    },

    spawnDraggableItem(type, imageName, sandbox, width, height) {
        const item = document.createElement("div");
        item.className = `draggable-food ${type === "pellet" ? "pellet-item" : "distraction-item"}`;
        item.dataset.type = type;

        item.innerHTML = `<img src="emoji/${imageName}.png" alt="${imageName}" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none;">`;

        const startX = randomInt(15, width - 45);
        const startY = randomInt(15, height - 120);

        item.style.left = `${startX}px`;
        item.style.top = `${startY}px`;

        let active = false;
        let startXOffset = 0;
        let startYOffset = 0;

        const onDragStart = (clientX, clientY) => {
            active = true;
            startXOffset = clientX - item.offsetLeft;
            startYOffset = clientY - item.offsetTop;
            item.style.zIndex = "1000";
        };

        const onDragMove = (clientX, clientY) => {
            if (!active) return;
            let currentX = clientX - startXOffset;
            let currentY = clientY - startYOffset;

            currentX = clamp(currentX, 0, width - 32);
            currentY = clamp(currentY, 0, height - 32);

            item.style.left = `${currentX}px`;
            item.style.top = `${currentY}px`;
        };

        const onDragEnd = () => {
            if (!active) return;
            active = false;
            item.style.zIndex = "10";

            const spoon = document.getElementById("pelletSpoon");
            if (spoon) {
                const spoonLeft = spoon.offsetLeft;
                const spoonTop = spoon.offsetTop;
                const spoonWidth = spoon.offsetWidth;
                const spoonHeight = spoon.offsetHeight;

                const centerX = item.offsetLeft + 16;
                const centerY = item.offsetTop + 16;

                const insideSpoon = (
                    centerX >= spoonLeft &&
                    centerX <= spoonLeft + spoonWidth &&
                    centerY >= spoonTop &&
                    centerY <= spoonTop + spoonHeight
                );

                const previouslyInSpoon = item.dataset.inSpoon === "true";

                if (insideSpoon && !previouslyInSpoon) {
                    item.dataset.inSpoon = "true";
                    if (type === "pellet") {
                        this.spoonedPelletsCount++;
                        playKeepSound();
                    } else {
                        this.incorrectSpoonedCount++;
                        playBtnSound();
                        this.showFeedback("Watch out, that is debris!", "#d95c5c");
                    }
                } else if (!insideSpoon && previouslyInSpoon) {
                    item.dataset.inSpoon = "false";
                    if (type === "pellet") {
                        this.spoonedPelletsCount = Math.max(0, this.spoonedPelletsCount - 1);
                    } else {
                        this.incorrectSpoonedCount = Math.max(0, this.incorrectSpoonedCount - 1);
                    }
                }

                this.updateMeasuringStats();
            }
        };

        item.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            onDragStart(e.clientX, e.clientY);
        });

        window.addEventListener("pointermove", (e) => {
            if (active) onDragMove(e.clientX, e.clientY);
        });

        window.addEventListener("pointerup", onDragEnd);
        window.addEventListener("pointercancel", onDragEnd);

        sandbox.appendChild(item);
    },

    updateMeasuringStats() {
        const submitBtn = document.getElementById("submitPelletsBtn");
        if (!submitBtn) return;

        submitBtn.textContent = `Done (${this.spoonedPelletsCount}/${this.targetPellets})`;

        if (this.spoonedPelletsCount === this.targetPellets && this.incorrectSpoonedCount === 0) {
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "#52a56c";
        } else {
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = "";
        }
    },

    tick() {
        if (!this.active) return;

        if (this.gameType === "cucumber" && this.stage === 1) {
            this.indicatorPos += this.sliceSpeed * this.indicatorDir;
            if (this.indicatorPos >= 100) {
                this.indicatorPos = 100;
                this.indicatorDir = -1;
            } else if (this.indicatorPos <= 0) {
                this.indicatorPos = 0;
                this.indicatorDir = 1;
            }
            const indicatorEl = document.getElementById("timingIndicator");
            if (indicatorEl) {
                indicatorEl.style.left = `${this.indicatorPos}%`;
            }
        } else if (this.gameType === "cucumber" && this.stage === 2) {
            this.outerCircleScale -= this.circleShrinkSpeed;
            if (this.outerCircleScale <= 0.3) {
                this.showFeedback("Missed!", "#d95c5c");
                this.blanchAttempt(0);
            } else {
                const ring = document.getElementById("timingCircleOuter");
                if (ring) {
                    const diameter = 70 * this.outerCircleScale;
                    ring.style.width = `${diameter}px`;
                    ring.style.height = `${diameter}px`;
                }
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.tick());
    },

    chop() {
        if (!this.active || this.gameType !== "cucumber" || this.stage !== 1) return;

        const pos = this.indicatorPos;
        const dist = Math.abs(pos - 50);

        // More forgiving timing thresholds for the chop button
        let rating = 0;
        if (dist <= 15) {
            rating = 2;
            this.perfectSlices++;
            this.showFeedback("Perfect!", "#52a56c");
            playKeepSound();
        } else if (dist <= 28) {
            rating = 1;
            this.goodSlices++;
            this.showFeedback("Good", "#4a9fba");
            playKeepSound();
        } else {
            rating = 0;
            this.showFeedback("Sloppy...", "#d95c5c");
            playBtnSound();
        }

        const knife = document.getElementById("chefKnife");
        if (knife) {
            knife.style.transform = "translateY(28px) rotate(-12deg)";
            setTimeout(() => { knife.style.transform = ""; }, 120);
        }

        const uncut = this.cutLines.find(l => !l.cut);
        if (uncut) {
            uncut.cut = true;
            const marks = document.querySelectorAll(".cucumber-slice-mark");
            const idx = this.cutLines.indexOf(uncut);
            if (marks[idx]) marks[idx].classList.add("cut-complete");
        }

        this.sliceCount++;
        if (this.sliceCount >= this.requiredSlices) {
            this.stage = 0; // Lock stage while transitioning
            setTimeout(() => {
                this.stage = 2;
                this.setupStage();
            }, 600);
        }
    },

    blanchClick() {
        if (!this.active || this.gameType !== "cucumber" || this.stage !== 2) return;

        const scale = this.outerCircleScale;
        const dist = Math.abs(scale - 1.0);

        // Expanded forgiving blanching thresholds
        if (dist <= 0.28) {
            this.perfectBlanches++;
            this.showFeedback("Perfect Temp!", "#52a56c");
            this.blanchAttempt(2);
        } else if (dist <= 0.52) {
            this.goodBlanches++;
            this.showFeedback("Nicely Blanched", "#4a9fba");
            this.blanchAttempt(1);
        } else {
            this.showFeedback("Undercooked/Soggy...", "#d95c5c");
            this.blanchAttempt(0);
        }
    },

    blanchAttempt(rating) {
        if (!this.active || this.stage !== 2) return;

        if (rating > 0) {
            playKeepSound();
        } else {
            playBtnSound();
        }

        const cookSlice = document.getElementById("cookingCucumber");
        if (cookSlice) {
            cookSlice.style.transform = "scale(1.3)";
            setTimeout(() => { cookSlice.style.transform = ""; }, 120);
        }

        this.blanchCount++;

        // Stop immediately on reaching the required blanch count to prevent unwanted extra ticks/misses
        if (this.blanchCount >= this.requiredBlanches) {
            this.stage = 0; // Lock stage immediately
            setTimeout(() => {
                this.finishGame();
            }, 600);
        } else {
            this.resetBlanchRing();
        }
    },

    showFeedback(text, color) {
        const el = document.getElementById("prepFeedback");
        if (el) {
            el.textContent = text;
            el.style.color = color;
            el.style.opacity = "1";
            setTimeout(() => { el.style.opacity = "0"; }, 500);
        }
    },

    finishGame() {
        if (!this.active) return;
        this.active = false;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        let finalRatingText = "";

        if (this.gameType === "cucumber") {
            let total = 10;
            total += (this.perfectSlices * 4) + (this.goodSlices * 2);
            total += (this.perfectBlanches * 4) + (this.goodBlanches * 2);
            total = Math.min(30, total);
            this.moneyEarned = total;
            finalRatingText = `
                Slicing Accuracy: <strong>${this.perfectSlices}/${this.requiredSlices} perfect</strong><br>
                Blanching Accuracy: <strong>${this.perfectBlanches}/${this.requiredBlanches} perfect</strong>
            `;
        } else if (this.gameType === "brine") {
            const reward = 28;
            this.moneyEarned = reward;
            finalRatingText = `
                Defrost Sequence: <strong>Completed successfully</strong><br>
                Circular Stir Loops: <strong>5/5 rotations melted</strong>
            `;
        } else if (this.gameType === "measuring") {
            const reward = 30;
            this.moneyEarned = reward;
            finalRatingText = `
                Food Pellets Count: <strong>${this.spoonedPelletsCount}/${this.targetPellets} scooped</strong><br>
                Debris/Contaminants: <strong>0 pieces scooped</strong>
            `;
        }

        game.money += this.moneyEarned;

        const modal = document.getElementById("foodPrepOverModal");
        const text = document.getElementById("foodPrepResultText");

        if (text) {
            text.innerHTML = `
                You've successfully prepared an excellent batch of food for your shrimp!<br>
                ${finalRatingText}<br><br>
                <strong>Cash Earned: +$${this.moneyEarned}</strong>
            `;
        }

        if (modal) modal.classList.remove("hidden");
        playPregnantSound();
    },

    stop() {
        this.active = false;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        document.getElementById("foodPrepOverlay").classList.add("hidden");
        document.getElementById("foodPrepIntro").classList.remove("hidden");
        document.getElementById("foodPrepGame").classList.add("hidden");

        gamePlaying = true;
        game.lastRealTime = Date.now();
        render();
    }
};