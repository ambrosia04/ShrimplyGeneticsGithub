/* =========================================================
   FULL-SCREEN MAIN MENU COMPONENT (mainMenu.js)
========================================================= */

(function renderMainMenuComponent() {
    const menuHTML = `
    <!-- FULL-SCREEN MAIN MENU -->
    <div id="mainMenu" class="main-menu-overlay">
        <div class="menu-box">
            <h1 class="menu-title">
                <img src="images/logo.png" alt="Shrimply Genetics" style="max-width: 100%; height: auto;">
            </h1>

            <div class="menu-buttons">
                <button id="menuPlayBtn" class="primary-button menu-btn">Play</button>
                <button id="menuSettingsBtn" class="secondary-button menu-btn">Settings</button>
                <button id="menuExitBtn" class="danger-button menu-btn">Exit</button>
            </div>

            <!-- Toggleable inline settings panel for quick adjustments -->
            <div id="menuSettingsPanel" class="hidden"
                style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 20px; text-align: left; width: 100%;">
                <h3 style="margin-top: 0; margin-bottom: 15px;">⚙️ Settings</h3>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 5px; font-size: 13px;">
                        <img src="emoji/music.png" alt="Music" class="ui-emoji"> Music
                    </label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button id="menuBgmToggleBtn" class="primary-button" style="width: 80px; font-size: 12px; padding: 4px;">Mute</button>
                        <input type="range" id="menuBgmVolumeSlider" min="0" max="1" step="0.05" value="0.5" style="flex-grow: 1; cursor: pointer;">
                        <span id="menuBgmVolumeLabel" style="font-weight: bold; font-size: 12px; width: 35px; text-align: right;">50%</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 5px; font-size: 13px;">
                        <img src="emoji/sound.png" alt="SFX" class="ui-emoji"> SFX
                    </label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button id="menuSfxToggleBtn" class="primary-button" style="width: 80px; font-size: 12px; padding: 4px;">Mute</button>
                        <input type="range" id="menuSfxVolumeSlider" min="0" max="1" step="0.05" value="0.5" style="flex-grow: 1; cursor: pointer;">
                        <span id="menuSfxVolumeLabel" style="font-weight: bold; font-size: 12px; width: 35px; text-align: right;">50%</span>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                    <button id="menuThemeToggleBtn" class="secondary-button" style="width: 80px; font-size: 12px; padding: 4px;">Dark</button>
                    <span id="menuThemeLabel" style="font-weight: bold; font-size: 12px;">Light Mode</span>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", menuHTML);
})();