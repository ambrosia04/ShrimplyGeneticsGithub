/* =========================================================
   MINIGAMES OVERLAYS & MODALS COMPONENT (minigamesModals.js)
========================================================= */

(function renderMinigamesModals() {
    const modalsHTML = `
    <!-- MINIGAME 1: EVOLUTION ARCADE OVERLAY -->
    <div id="minigameOverlay" class="minigame-overlay hidden">
        <div class="minigame-header">
            <button id="minigameBackBtn" class="secondary-button">⬅ Go Back</button>
            <div id="minigameStrikes">Strikes: 0/3</div>
            <div id="minigameMoney">Earned: $0</div>
        </div>
        <div id="minigameCanvas" class="minigame-canvas">
            <div class="finish-line"></div>

            <!-- Game Over Modal -->
            <div id="minigameOverModal" class="game-modal hidden">
                <h2 style="color: var(--danger); font-size: 24px; margin-top: 0;">THEY HAVE EVOLVED</h2>
                <img id="minigameOverImg" src="shrimp/game/gameoverEvolved.png" alt="Evolved Shrimp"
                    onerror="this.src='shrimp/fireredpainted1.png';">
                <p id="minigameResultText" style="font-size: 16px; margin: 15px 0;"></p>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                    <button id="minigameRetryBtn" class="primary-button">
                        <img src="emoji/repeat.png" alt="Retry" class="ui-emoji"> Retry
                    </button>
                    <button id="minigameReturnBtn" class="secondary-button">
                        <img src="emoji/herb.png" alt="Return" class="ui-emoji"> Return to Tank
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MINIGAME: FOOD PREPARATION OVERLAY -->
    <div id="foodPrepOverlay" class="minigame-overlay hidden">
        <!-- Intro Screen -->
        <div id="foodPrepIntro" class="minigame-selection-screen">
            <h2 style="font-size: 32px; color: #52a56c; margin-top: 0; margin-bottom: 15px;">
                <img src="emoji/food.png" alt="Food" class="ui-emoji"> Food Preparation
            </h2>
            <p style="font-size: 16px; line-height: 1.6; max-width: 500px; margin: 0 auto 25px auto; color: var(--muted);">
                Prepare organic blanched cucumber treats for your shrimp! Chop them with precision and blanch them
                perfectly to soften the skin. Earn up to $30 per session—ideal for starting breeders who need extra
                pocket cash!
            </p>
            <button type="button" id="startFoodPrepBtn" class="primary-button"
                style="font-size: 16px; padding: 12px 24px; background-color: #52a56c;">Start Preparing</button>
            <button type="button" id="foodPrepCancelBtn" class="secondary-button"
                style="margin-top: 25px; padding: 10px 20px;">Return to Tank</button>
        </div>

        <!-- Active Food Prep Game Container -->
        <div id="foodPrepGame" class="hidden"
            style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">

            <!-- Floating Quit Button -->
            <button type="button" id="foodPrepBackBtn" class="secondary-button"
                style="position: absolute; top: 15px; left: 15px; z-index: 100;">
                🏁 Quit & Go Back
            </button>

            <!-- Step Title & Instructions -->
            <div style="text-align: center; margin-bottom: 20px; z-index: 10;">
                <h2 id="foodPrepStepTitle" style="color: #52a56c; font-size: 28px; margin: 0 0 5px 0;">Step 1: Chop the Cucumber</h2>
                <p id="foodPrepInstructions" style="color: var(--muted); margin: 0; font-size: 14px;">Press Space or click CHOP when the indicator matches the green zone!</p>
            </div>

            <!-- STAGE 1 UI: SLICING BOARD -->
            <div id="foodPrepSlicingUI" class="prep-stage-container">
                <div class="cutting-board">
                    <div class="cucumber" id="cucumberSprite">
                        <div class="cucumber-slice-mark" style="left: 25%;"></div>
                        <div class="cucumber-slice-mark" style="left: 50%;"></div>
                        <div class="cucumber-slice-mark" style="left: 75%;"></div>
                    </div>
                    <div class="chef-knife" id="chefKnife"><img src="emoji/knife.png" alt="Chef Knife" class="ui-emoji"></div>
                </div>
                <!-- Timing Bar -->
                <div class="timing-bar-container">
                    <div class="timing-bar-target"></div>
                    <div class="timing-bar-indicator" id="timingIndicator"></div>
                </div>
                <button type="button" id="chopBtn" class="primary-button"
                    style="font-size: 16px; padding: 10px 25px; margin-top: 15px; background-color: #d95c5c;">CHOP! (Space)</button>
            </div>

            <!-- STAGE 2 UI: BLANCHING POT -->
            <div id="foodPrepBlanchingUI" class="prep-stage-container hidden">
                <div class="blanching-pot">
                    <div class="water-boiling"></div>
                    <div class="cooking-cucumber-slice" id="cookingCucumber"><img src="emoji/cucumber.png" alt="Cucumber" class="ui-emoji"></div>
                    <!-- Concentric Timing Circles -->
                    <div class="timing-circle-outer" id="timingCircleOuter"></div>
                    <div class="timing-circle-inner"></div>
                </div>
                <button type="button" id="blanchBtn" class="primary-button"
                    style="font-size: 16px; padding: 10px 25px; margin-top: 15px; background-color: #4a9fba;">BLANCH! (Space)</button>
            </div>

            <!-- BRINE SHRIMP STAGE 1: CLICK CUBES -->
            <div id="foodPrepBrineCubesUI" class="prep-stage-container hidden">
                <div id="brineCubesContainer" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0;"></div>
                <div id="brineCubesTargetText" style="font-weight: bold; margin-bottom: 10px; font-size: 15px; color: #5cb6d3;">Click cubes in order: 1 → 2 → 3 → 4</div>
            </div>

            <!-- BRINE SHRIMP STAGE 2: STIR TO MELT -->
            <div id="foodPrepBrineStirUI" class="prep-stage-container hidden">
                <div class="stir-bowl-outer" id="stirBowl">
                    <div id="stirMeltingBrine" class="brine-cube-melting"><img src="emoji/shrimp.png" alt="Shrimp" class="ui-emoji"></div>
                    <div class="stir-indicator-dot" id="stirDot1" style="top: 15%; left: 50%;"></div>
                    <div class="stir-indicator-dot" id="stirDot2" style="top: 50%; right: 15%;"></div>
                    <div class="stir-indicator-dot" id="stirDot3" style="bottom: 15%; left: 50%;"></div>
                    <div class="stir-indicator-dot" id="stirDot4" style="top: 50%; left: 15%;"></div>
                </div>
                <p id="stirProgressText" style="margin-top: 10px; font-weight: bold; color: var(--text);">Stirring: 0%</p>
            </div>

            <!-- PELLET MEASURING: DRAG TO SPOON -->
            <div id="foodPrepPelletsUI" class="prep-stage-container hidden" style="width: min(450px, 95vw); position: relative;">
                <div id="pelletsSandbox" class="pellets-sandbox"
                    style="width: 100%; height: 260px; background: #1a2a2e; border-radius: 8px; position: relative; overflow: hidden; border: 2.5px solid var(--border);">
                    <div id="pelletSpoon" class="pellet-spoon">
                        <span><img src="emoji/spoon.png" alt="Spoon" class="ui-emoji"> Spoon</span>
                    </div>
                </div>
                <button type="button" id="submitPelletsBtn" class="primary-button"
                    style="margin-top: 15px; font-size: 16px; padding: 10px 25px; background-color: #52a56c;" disabled>Done (0/0)</button>
            </div>

            <!-- Performance Feedback -->
            <div id="prepFeedback" style="font-size: 24px; font-weight: bold; margin-top: 15px; height: 30px; color: #52a56c;"></div>

            <!-- Completion Modal -->
            <div id="foodPrepOverModal" class="game-modal hidden">
                <h2 id="foodPrepOverTitle" style="color: var(--success); font-size: 24px; margin-top: 0;">PREP COMPLETE!</h2>
                <div style="display: flex; justify-content: center; gap: 8px; margin: 15px 0;">
                    <img src="emoji/cucumber.png" alt="Cucumber" style="width: 42px; height: 42px; object-fit: contain;">
                    <img src="emoji/food.png" alt="Food" style="width: 42px; height: 42px; object-fit: contain;">
                </div>
                <p id="foodPrepResultText" style="font-size: 15px; line-height: 1.6; margin: 15px 0;"></p>
                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
                    <button type="button" id="foodPrepRetryBtn" class="primary-button"
                        style="background-color: #52a56c; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 18px;">
                        <img src="emoji/repeat.png" alt="Retry" class="ui-emoji">
                        <span>Prepare More</span>
                    </button>
                    <button type="button" id="foodPrepReturnBtn" class="secondary-button"
                        style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 18px;">
                        <img src="emoji/herb.png" alt="Return" class="ui-emoji">
                        <span>Return to Tank</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MINIGAME 2: PARASITE SCANNER OVERLAY -->
    <div id="minigame2Overlay" class="minigame-overlay hidden">
        <!-- Mode Selection Screen -->
        <div id="minigame2Selection" class="minigame-selection-screen">
            <h2 style="font-size: 32px; color: #5cb6d3; margin-top: 0; margin-bottom: 15px;">
                <img src="emoji/microscope.png" alt="Scanner" class="ui-emoji"> Parasite Scanner
            </h2>
            <p style="font-size: 16px; line-height: 1.6; max-width: 500px; margin: 0 auto 25px auto; color: var(--muted);">
                Identify and cull the infected breeding stock. Healthy shrimp carry clean spherical eggs, while infected
                shrimp carry triangular green Clado growths under their carapace.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                <button type="button" id="minigame2EasyBtn" class="primary-button" style="font-size: 16px; padding: 12px 24px;">Easy Mode</button>
                <button type="button" id="minigame2HardBtn" class="danger-button" style="font-size: 16px; padding: 12px 24px;">Hard Mode</button>
            </div>
            <button type="button" id="minigame2CancelBtn" class="secondary-button" style="margin-top: 25px; padding: 10px 20px;">Return to Tank</button>
        </div>

        <!-- Active Game Screen -->
        <div id="minigame2Game" class="hidden" style="width: 100%; height: 100%; position: relative;">
            <div id="minigame2Canvas" class="minigame-canvas" style="width: 100%; height: 100%;">
                <!-- Floating Back Button -->
                <button type="button" id="minigame2BackBtn" class="secondary-button" style="position: absolute; top: 15px; left: 15px; z-index: 100;">
                    <img src="emoji/finish.png" alt="Finish" class="ui-emoji"> Finish Game & Go Back
                </button>

                <!-- Floating Stats Display -->
                <div style="position: absolute; top: 15px; right: 15px; z-index: 100; display: flex; gap: 10px;">
                    <div id="minigame2Strikes"
                        style="background: rgba(21, 36, 41, 0.85); padding: 8px 12px; border-radius: 8px; border: 1.5px solid var(--border); font-weight: bold; color: #e6f2f4; font-size: 14px; font-family: 'Courier New', Courier, monospace;">
                        Strikes: 0/3
                    </div>
                    <div id="minigame2Money"
                        style="background: rgba(21, 36, 41, 0.85); padding: 8px 12px; border-radius: 8px; border: 1.5px solid var(--border); font-weight: bold; color: #5cb6d3; font-size: 14px; font-family: 'Courier New', Courier, monospace;">
                        Earned: $0
                    </div>
                </div>

                <!-- Game Over Modal -->
                <div id="minigame2OverModal" class="game-modal hidden">
                    <h2 id="minigame2OverTitle" style="color: var(--danger); font-size: 24px; margin-top: 0;">GAME OVER</h2>
                    <img id="minigame2OverImg" src="shrimp/game/sickest.png" alt="Parasite" onerror="this.src='shrimp/redcherry1.png';">
                    <p id="minigame2ResultText" style="font-size: 16px; margin: 15px 0;"></p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button type="button" id="minigame2RetryBtn" class="primary-button">
                            <img src="emoji/repeat.png" alt="Retry" class="ui-emoji"> Retry
                        </button>
                        <button type="button" id="minigame2ReturnBtn" class="secondary-button">
                            <img src="emoji/herb.png" alt="Return" class="ui-emoji"> Return to Tank
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalsHTML);
})();