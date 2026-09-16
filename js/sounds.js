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
    
};

// Timestamps to handle debouncing per sound key
const soundTimestamps = {};

/**
 * Universal sound player
 * @param {string} key - Key matching an entry in SOUND_EFFECTS
 * @param {number} [debounceMs=0] - Optional cooldown in milliseconds between plays
 */
function playSound(key, debounceMs = 0) {
    if (typeof game !== "undefined" && game && game.sfxMuted) return;

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
        const clone = audio.cloneNode();
        clone.volume = (typeof game !== "undefined" && game) ? game.sfxVolume : 0.5;
        clone.play().catch(e => console.log(`SFX [${key}] playback blocked:`, e));
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

// Convenient shortcut wrappers (keeps full backwards compatibility with your existing code)
function playBtnSound()         { playSound("btn"); }
function playBerriedSound()     { playSound("berried", 500); }
function playPregnantSound()    { playSound("pregnant", 500); }
function playBigSaleSound()     { playSound("bigSale"); }
function playSellSound()        { playSound("sell"); }
function playKeepSound()        { playSound("keep"); }
function playAchievementSound() { playSound("achievement"); }