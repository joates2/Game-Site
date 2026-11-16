/**
 * Shared Global Settings Manager
 * Include <script src="settings.js"></script> before </body> on index.html and every game page.
 * Ensure your navbar has a button with id="openSettingsBtn".
 */

 (function () {
  const STORAGE_KEY = 'gameHubSettings';

  const DEFAULT_SETTINGS = {
    sound: true,
    uiScale: 1,
    felt: 'emerald',
    deck: 'red',
    cardFace: 'standard',
    highContrast: false,
    animSpeed: 'normal'
  };

  const FELT_THEMES = {
    emerald: { light: '#047857', mid: '#064e3b', dark: '#052e16' },
    royal:   { light: '#1d4ed8', mid: '#1e3a8a', dark: '#0f172a' },
    crimson: { light: '#9f1239', mid: '#881337', dark: '#4c0519' },
    slate:   { light: '#334155', mid: '#1e293b', dark: '#090d16' }
  };

  const MODAL_HTML = `
    <div id="settingsModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 modal-backdrop" style="background: rgba(2, 12, 7, 0.82); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
      <div class="glass-panel w-full max-w-md rounded-3xl p-6 border border-amber-400/30 shadow-2xl relative flex flex-col max-h-[90vh]" style="background: rgba(4, 28, 16, 0.85); backdrop-filter: blur(16px);">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-white/15 pb-3 mb-4 shrink-0">
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-sliders text-amber-400 text-lg"></i>
            <h3 class="text-lg font-extrabold text-amber-300 uppercase tracking-wider" style="font-family: 'Cinzel', serif;">Global Settings</h3>
          </div>
          <button id="closeSettingsBtn" type="button" class="text-emerald-200/70 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Scrollable Settings Options -->
        <div class="flex flex-col gap-5 text-sm overflow-y-auto pr-1 text-white">
          
          <!-- 1. Sound Effects -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-white">Sound Effects</p>
              <p class="text-xs text-emerald-200/70">Card flips, shuffles &amp; chimes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="settingSound" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <!-- 2. UI Scale -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div>
                <p class="font-semibold text-white">UI Scale</p>
                <p class="text-xs text-emerald-200/70">Adjust overall interface &amp; table size</p>
              </div>
              <span id="uiScaleBadge" class="text-xs font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-md">100%</span>
            </div>
            <div class="grid grid-cols-4 gap-2" id="uiScaleGroup">
              <button type="button" data-scale="0.85" class="scale-btn py-1.5 px-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white cursor-pointer transition-colors">85%</button>
              <button type="button" data-scale="1" class="scale-btn py-1.5 px-2 rounded-xl border border-amber-400 bg-white/15 text-xs font-semibold text-white cursor-pointer transition-colors">100%</button>
              <button type="button" data-scale="1.15" class="scale-btn py-1.5 px-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white cursor-pointer transition-colors">115%</button>
              <button type="button" data-scale="1.3" class="scale-btn py-1.5 px-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white cursor-pointer transition-colors">130%</button>
            </div>
          </div>

          <!-- 3. Table Felt Color -->
          <div>
            <p class="font-semibold text-white mb-2">Table Felt Color</p>
            <div class="grid grid-cols-4 gap-2" id="feltColorGroup">
              <button type="button" data-felt="emerald" class="felt-btn py-2 px-2 rounded-xl border border-amber-400 bg-emerald-900/80 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-full bg-emerald-600 border border-white/40"></span>
                <span>Emerald</span>
              </button>
              <button type="button" data-felt="royal" class="felt-btn py-2 px-2 rounded-xl border border-white/15 bg-blue-950/80 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-full bg-blue-600 border border-white/40"></span>
                <span>Royal</span>
              </button>
              <button type="button" data-felt="crimson" class="felt-btn py-2 px-2 rounded-xl border border-white/15 bg-rose-950/80 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-full bg-rose-700 border border-white/40"></span>
                <span>Crimson</span>
              </button>
              <button type="button" data-felt="slate" class="felt-btn py-2 px-2 rounded-xl border border-white/15 bg-slate-900/80 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-full bg-slate-700 border border-white/40"></span>
                <span>Midnight</span>
              </button>
            </div>
          </div>

          <!-- 4. Card Back Design -->
          <div>
            <p class="font-semibold text-white mb-2">Deck Back Color</p>
            <div class="grid grid-cols-4 gap-2" id="deckColorGroup">
              <button type="button" data-deck="red" class="deck-btn py-2 px-2 rounded-xl border border-amber-400 bg-white/10 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-sm bg-red-600 border border-white/50"></span>
                <span>Classic Red</span>
              </button>
              <button type="button" data-deck="blue" class="deck-btn py-2 px-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-sm bg-blue-600 border border-white/50"></span>
                <span>Navy Blue</span>
              </button>
              <button type="button" data-deck="gold" class="deck-btn py-2 px-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-sm bg-amber-500 border border-white/50"></span>
                <span>Gold</span>
              </button>
              <button type="button" data-deck="green" class="deck-btn py-2 px-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white flex flex-col items-center gap-1 cursor-pointer">
                <span class="w-4 h-4 rounded-sm bg-emerald-600 border border-white/50"></span>
                <span>Forest</span>
              </button>
            </div>
          </div>

          <!-- 5. Card Face Style -->
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-semibold text-white">Card Face Style</p>
              <p class="text-xs text-emerald-200/70">Standard, Large Print, or 4-Color</p>
            </div>
            <select id="settingCardFace" class="bg-slate-900/90 border border-white/20 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400">
              <option value="standard">Standard</option>
              <option value="large">Large Print</option>
              <option value="fourcolor">4-Color Deck</option>
            </select>
          </div>

          <!-- 6. High Contrast / Dark Pips -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-white">High Contrast / Dark Pips</p>
              <p class="text-xs text-emerald-200/70">Dark card faces &amp; bold, glare-free pips</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="settingHighContrast" class="sr-only peer">
              <div class="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <!-- 7. Animation Speed -->
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-semibold text-white">Animation Speed</p>
              <p class="text-xs text-emerald-200/70">Deal &amp; card movement pace</p>
            </div>
            <select id="settingAnimSpeed" class="bg-slate-900/90 border border-white/20 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400">
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
              <option value="instant">Instant</option>
            </select>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="mt-5 pt-4 border-t border-white/15 flex items-center justify-between shrink-0">
          <button id="resetSettingsBtn" type="button" class="text-xs text-emerald-200/70 hover:text-amber-300 transition-colors cursor-pointer">
            Reset to Default
          </button>
          <button id="saveSettingsBtn" type="button" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl shadow-md transition-all cursor-pointer">
            Done
          </button>
        </div>
      </div>
    </div>
  `;

  function getSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...DEFAULT_SETTINGS, ...saved };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function applySettings(settings) {
    // 1. Felt colors
    const theme = FELT_THEMES[settings.felt] || FELT_THEMES.emerald;
    document.documentElement.style.setProperty('--felt-light', theme.light);
    document.documentElement.style.setProperty('--felt-mid', theme.mid);
    document.documentElement.style.setProperty('--felt-dark', theme.dark);

    // 2. UI Scale
    const scale = Number(settings.uiScale) || 1;
    document.documentElement.style.setProperty('--ui-scale', scale);
    document.documentElement.style.fontSize = `${scale * 100}%`;

    // 3. Root data attributes & classes for game CSS hooks
    document.documentElement.classList.toggle('high-contrast-cards', Boolean(settings.highContrast));
    document.documentElement.dataset.cardFace = settings.cardFace;
    document.documentElement.dataset.deckColor = settings.deck;
    document.documentElement.dataset.animSpeed = settings.animSpeed;

    // 4. Sync modal controls if present
    const soundEl = document.getElementById('settingSound');
    if (soundEl) soundEl.checked = settings.sound;

    const hcEl = document.getElementById('settingHighContrast');
    if (hcEl) hcEl.checked = Boolean(settings.highContrast);

    const faceEl = document.getElementById('settingCardFace');
    if (faceEl) faceEl.value = settings.cardFace;

    const speedEl = document.getElementById('settingAnimSpeed');
    if (speedEl) speedEl.value = settings.animSpeed;

    const badgeEl = document.getElementById('uiScaleBadge');
    if (badgeEl) badgeEl.textContent = `${Math.round(scale * 100)}%`;

    document.querySelectorAll('.scale-btn').forEach(btn => {
      const isSelected = Number(btn.dataset.scale) === scale;
      btn.classList.toggle('border-amber-400', isSelected);
      btn.classList.toggle('bg-white/15', isSelected);
      btn.classList.toggle('border-white/15', !isSelected);
      btn.classList.toggle('bg-white/5', !isSelected);
    });

    document.querySelectorAll('.felt-btn').forEach(btn => {
      const isSelected = btn.dataset.felt === settings.felt;
      btn.classList.toggle('border-amber-400', isSelected);
      btn.classList.toggle('border-white/15', !isSelected);
    });

    document.querySelectorAll('.deck-btn').forEach(btn => {
      const isSelected = btn.dataset.deck === settings.deck;
      btn.classList.toggle('border-amber-400', isSelected);
      btn.classList.toggle('bg-white/15', isSelected);
      btn.classList.toggle('border-white/15', !isSelected);
    });

    // 5. Notify any active game page in real time
    window.dispatchEvent(new CustomEvent('gameSettingsChanged', { detail: settings }));
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettings(settings);
  }

  function initSettings() {
    // Inject modal HTML if not already on the page
    if (!document.getElementById('settingsModal')) {
      document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
    }

    let currentSettings = getSettings();
    applySettings(currentSettings);

    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('openSettingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const resetBtn = document.getElementById('resetSettingsBtn');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        currentSettings = getSettings();
        applySettings(currentSettings);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });
    }

    const closeModal = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (saveBtn) saveBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.getElementById('settingSound')?.addEventListener('change', (e) => {
      currentSettings.sound = e.target.checked;
      saveSettings(currentSettings);
    });

    document.getElementById('settingHighContrast')?.addEventListener('change', (e) => {
      currentSettings.highContrast = e.target.checked;
      saveSettings(currentSettings);
    });

    document.getElementById('settingCardFace')?.addEventListener('change', (e) => {
      currentSettings.cardFace = e.target.value;
      saveSettings(currentSettings);
    });

    document.getElementById('settingAnimSpeed')?.addEventListener('change', (e) => {
      currentSettings.animSpeed = e.target.value;
      saveSettings(currentSettings);
    });

    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSettings.uiScale = Number(btn.dataset.scale);
        saveSettings(currentSettings);
      });
    });

    document.querySelectorAll('.felt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSettings.felt = btn.dataset.felt;
        saveSettings(currentSettings);
      });
    });

    document.querySelectorAll('.deck-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSettings.deck = btn.dataset.deck;
        saveSettings(currentSettings);
      });
    });

    resetBtn?.addEventListener('click', () => {
      currentSettings = { ...DEFAULT_SETTINGS };
      saveSettings(currentSettings);
    });

    // Sync if settings change in another open tab
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        currentSettings = getSettings();
        applySettings(currentSettings);
      }
    });
  }

  // Expose helper globally so any game script can read settings anytime
  window.GameHubSettings = {
    get: getSettings,
    save: saveSettings,
    apply: applySettings
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
  } else {
    initSettings();
  }
})();
