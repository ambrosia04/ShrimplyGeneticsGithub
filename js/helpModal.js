/* =========================================================
   HELP & SHORTCUTS MODAL COMPONENT (helpModal.js)
========================================================= */

(function renderHelpModalComponent() {
    const modalHTML = `
    <div id="helpModal" class="modal hidden">
        <div class="modal-box">
            <button id="closeHelpModal" class="close-button">x</button>
            <h2 style="margin-top: 0;"><img src="emoji/info.png" alt="Info" class="ui-emoji"> Game Help & Controls</h2>
            <div class="help-content" style="line-height: 1.6; font-size: 14px;">
                <p>Welcome to <strong>Shrimply Genetics</strong>! Breed Neocaridina shrimp to discover unique mutations,
                    manage tank capacities, and sequence lineage pathways.</p>
                <p>Up to <strong>7 days of offline time</strong>! You can leave and your shrimp will keep growing.</p>

                <h3 style="margin-top: 20px; border-bottom: 1.5px solid var(--border); padding-bottom: 5px;">⌨️ Keyboard Shortcuts</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px;">
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0; width: 90px;">
                            <button id="help-key-tank" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="tank">T</button>
                        </td>
                        <td style="padding: 8px 0;">Switch to Tank Tab</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-shop" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="shop">S</button>
                        </td>
                        <td style="padding: 8px 0;">Switch to Shop Tab</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-collection" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="collection">C</button>
                        </td>
                        <td style="padding: 8px 0;">Switch to Collection Tab</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-genetics" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="genetics">G</button>
                        </td>
                        <td style="padding: 8px 0;">Switch to Genetics Tab</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-log" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="log">A</button>
                        </td>
                        <td style="padding: 8px 0;">Switch to Achievements Tab</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-settings" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="settings">J</button>
                        </td>
                        <td style="padding: 8px 0;">Switch to Settings Tab</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-sellMode" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="sellMode">E</button>
                        </td>
                        <td style="padding: 8px 0;">Toggle Sell Mode</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-favoriteTank" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="favoriteTank">F</button>
                        </td>
                        <td style="padding: 8px 0;">Toggle Favorite Tank <span style="font-size: 11px; color: var(--muted);">(Once unlocked)</span></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-speed1" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="speed1">1</button>
                        </td>
                        <td style="padding: 8px 0;">Set Speed to 1x</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-speed2" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="speed2">2</button>
                        </td>
                        <td style="padding: 8px 0;">Set Speed to 2x <span style="font-size: 11px; color: var(--muted);">(Once unlocked)</span></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-speed5" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="speed5">3</button>
                        </td>
                        <td style="padding: 8px 0;">Set Speed to 5x <span style="font-size: 11px; color: var(--muted);">(Once unlocked)</span></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-speed20" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="speed20">4</button>
                        </td>
                        <td style="padding: 8px 0;">Set Speed to 20x <span style="font-size: 11px; color: var(--muted);">(Once unlocked)</span></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 8px 0;">
                            <button id="help-key-speed60" class="secondary-button help-rebind-btn" style="min-width: 70px; padding: 4px 8px; font-size: 11px;" data-action="speed60">5</button>
                        </td>
                        <td style="padding: 8px 0;">Set Speed to 60x <span style="font-size: 11px; color: var(--muted);">(Once unlocked)</span></td>
                    </tr>
                </table>

                <div style="margin-top: -15px; margin-bottom: 20px; text-align: right;">
                    <button id="resetShortcutsHelpBtn" class="secondary-button" style="font-size: 12px; padding: 6px 12px;">Reset to Defaults</button>
                </div>

                <!-- Real-life Care Disclaimer & Resources -->
                <div style="margin-top: 25px; padding: 15px; background: rgba(74, 159, 186, 0.08); border: 1px solid var(--border); border-radius: 10px; font-size: 13px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px; color: var(--text);">
                        <img src="emoji/warning.png" alt="Disclaimer" class="ui-emoji"> Disclaimer
                    </h3>
                    <p style="margin: 0 0 10px 0;">
                        The shrimp and their care shown in this game are fictional and should not be considered a representation of real-life shrimp keeping. In reality, shrimp are living animals that require specific care, suitable conditions, and a responsible commitment.
                    </p>
                    <p style="margin: 0 0 10px 0;">
                        If you are considering buying shrimp or any other living animal, please do your own research beforehand and make sure you fully understand their needs and are prepared to provide them with proper care.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div>
                            <strong><a href="https://www.theshrimpfarm.com/posts/neocaridina-shrimp-care-breeding/" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: bold; text-decoration: underline; word-break: break-all;">
                                Neocaridina Care Guide
                            </a></strong>
                        </div>
                        <div>
                            :
                            <strong><a href="https://shrimpybusiness.com/blogs/shrimpy-business-blog/guide-to-freshwater-shrimp-care?srsltid=AU7gw4Uvhvoow-twIc9hcCner7jhi7eE8DnZa4ixDfH57Bjc0CcDXO-k" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: bold; text-decoration: underline; word-break: break-all;">
                                Other Types Care Guide
                            </a></strong> 
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1.5px solid var(--border); font-size: 13px; color: var(--muted);">
                    If you encounter any bug, please complete <a href="https://forms.gle/Btyvygo7EUvUDa1c9" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: bold; text-decoration: underline;">this form</a> or email me at <a href="mailto:okamidevelop@gmail.com" style="color: var(--primary); font-weight: bold; text-decoration: underline;">okamidevelop@gmail.com</a>.
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
})();