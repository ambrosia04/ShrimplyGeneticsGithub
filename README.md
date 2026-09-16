# 🦐 Shrimply Genetics

A cozy, browser-based aquarium management and genetics simulation game where you breed, selective-cull, and discover rare Neocaridina shrimp color morphs.

---

## 🚀 How to Run the Game

### Method 1: Direct in Browser (Simplest)
1. Double-click `index.html` or drag-and-drop it into any modern web browser (Chrome, Firefox, Edge, Safari, Opera).

### Method 2: Local Web Server
Running via a local web server prevents browser security restrictions on local asset loading. In return you have to keep the environment opened:
- **VS Code**: Install the *Live Server* extension, right-click `index.html`, and click **"Open with Live Server"**.
- **Python**: Run `python -m http.server 8000` in the game folder and open `http://localhost:8000`.
- **Node.js**: Run `npx serve` in the project folder.

---

## 💾 Save System & Important Warnings

- **How Saving Works**: The game saves your progress to your browser's `localStorage` when you make a purchase, complete a breeding/cull check, or click the **Save** / **Save & Exit** buttons in the top header.
- ⚠️ **Always Save Before Closing**: Closing your browser window or tab directly will **NOT** automatically save real-time progress made between checkpoints. Always click **Save** or **Save & Exit** before leaving!
- ⚠️ **Do Not Clear Browser Data / Cache**: Because save files are stored locally in your browser, clearing your browser's cookies, site data, or cache will **permanently erase your aquarium and progress**.
- ⚠️ **Private / Incognito Mode**: Playing in Private or Incognito mode will delete your save as soon as the window is closed.
---

## 🎮 Features

- **Mendelian-Inspired Genetics**: Diploid allele simulation (Allele 1 & Allele 2) with hidden recessive genes, lineage dominance, mutations, and ancestral wild throwbacks.
- **Selective Breeding & Culling**: Inspect offspring batches from berried females, filter by allele/gender/pattern, and choose which morphs to keep or sell.
- **Offline Progression**: Your aquarium continues to age and breed while you are away (up to 7 days of offline time).
- **Interactive Minigames**:
  - **Food Preparation**: Chop cucumbers, blanch slices, defrost brine shrimp, and measure food pellets to earn starter cash.
  - **Evolution Arcade ("Push 'em back")**: Defend the surface against jumping shrimp.
  - **Clado Scanner**: Identify and quarantine parasitic infections under the microscope.
- **Dual Aquarium Management**: Unlock and upgrade a separate **Favorites Tank** to isolate prized breeding pairs.
- **Aquarium Customization**: Buy aquatic plants (Java Moss, Frogbit, Hornwort, Christmas Moss, Marimo Balls) that provide passive breeding and growth boosts.
- **Full Keyboard Shortcuts**: Rebindable hotkeys for tabs, speed toggles, and culling actions.
- **Dark Mode & BGM/SFX Volume Controls**: Built-in audio manager and theme toggles.
