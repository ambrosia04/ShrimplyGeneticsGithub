/* =========================================================
   AUDIO & SOUND MANAGER (sounds.js)
========================================================= */

// Background Music
const bgm = new Audio("sounds/Modified LoFi Relax Music by Tony Vodnik from Pixabay.mp3");
bgm.loop = true;

// Sound Effects Registry
const SOUND_EFFECTS = {
    btn: new Audio("sounds/buttonsound.mp3"),
    berried: new Audio("sounds/berried.mp3"),
    pregnant: new Audio("sounds/pregnant.mp3"),
    bigSale: new Audio("sounds/bigSale.mp3"),
    sell: new Audio("sounds/sell.mp3"),
    keep: new Audio("sounds/keep.mp3"),
    achievement: new Audio("sounds/achievement.mp3"),
    pageFlip: new Audio("sounds/pageFlip.mp3") //By Alex Pixabay
};

// Timestamps to handle debouncing per sound key
const soundTimestamps = {};

/**
 * Universal sound player
 * @param {string} key - Key matching an entry in SOUND_EFFECTS
 * @param {number} [debounceMs=0] - Optional cooldown in milliseconds between plays
 * @param {string|null} [tank=null] - Optional tank identifier to filter sound to current active tank only
 */
function playSound(key, debounceMs = 0, tank = null) {
    if (typeof game !== "undefined" && game && game.sfxMuted) return;

    // If a tank was passed, only play if the player is currently viewing this tank
    if (tank && typeof game !== "undefined" && game) {
        const currentActiveTank = game.activeAquarium || "tank1";
        if (tank !== currentActiveTank) {
            return;
        }
    }

    const audio = SOUND_EFFECTS[key];
    if (!audio) {
        console.warn(`Sound effect "${key}" not found.`);
        return;
    }

    const now = Date.now();
    if (debounceMs > 0) {
        const lastTime = soundTimestamps[key] || 0;
        if (now - lastTime < debounceMs) return;
        soundTimestamps[key] = now;
    }

    try {
        audio.currentTime = 0;
        audio.volume = (typeof game !== "undefined" && game) ? (game.sfxVolume ?? 0.5) : 0.5;
        audio.play().catch(e => console.warn(`SFX [${key}] playback blocked:`, e));
    } catch (err) {
        console.warn(`Error playing sound [${key}]:`, err);
    }
}

/**
 * Updates the physical volume & mute status of BGM and active audio settings
 */
function updateAudioVolumes() {
    if (typeof game === "undefined" || !game) return;
    bgm.volume = game.bgmMuted ? 0 : game.bgmVolume;
}

// Convenient shortcut wrappers
function playBtnSound()                 { playSound("btn"); }
function playBerriedSound(tank = null)  { playSound("berried", 500, tank); }
function playPregnantSound(tank = null) { playSound("pregnant", 500, tank); }
function playBigSaleSound(tank = null)  { playSound("bigSale", 0, tank); }
function playSellSound(tank = null)     { playSound("sell", 0, tank); }
function playKeepSound(tank = null)     { playSound("keep", 0, tank); }
function playAchievementSound()         { playSound("achievement"); }
function playPageFlipSound()            { playSound("pageFlip"); }