/* ==========================================================================
   MEMORY MASTER — MAIN SCRIPT
   Vanilla JS (ES6+) | Modular | LocalStorage Persistence
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. CONSTANTS & CONFIG
   ========================================================================== */

const STORAGE_KEYS = {
  SETTINGS: 'memoryMaster_settings',
  STATS: 'memoryMaster_stats',
  ACHIEVEMENTS: 'memoryMaster_achievements',
  BEST_SCORES: 'memoryMaster_bestScores',
};

// গ্রিড সাইজ ও বেস টাইম/স্কোর কনফিগারেশন প্রতি Difficulty অনুযায়ী
const DIFFICULTY_CONFIG = {
  easy: { size: 2, pairs: 2, timeLimit: 60, baseScore: 100, label: 'Easy' },
  normal: { size: 4, pairs: 8, timeLimit: 120, baseScore: 100, label: 'Normal' },
  hard: { size: 6, pairs: 18, timeLimit: 240, baseScore: 100, label: 'Hard' },
  expert: { size: 8, pairs: 32, timeLimit: 420, baseScore: 100, label: 'Expert' },
};

// প্রতিটি থিমের আইকন/ইমোজি সেট (সর্বোচ্চ ৩২ পেয়ার লাগবে Expert এর জন্য)
const CARD_THEMES = {
  emoji: ['😀', '😎', '🤩', '🥳', '😍', '🤔', '😴', '🤯', '🥶', '😇', '🤠', '🥸', '😜', '🤪', '🙃', '😏', '🫠', '🥹', '😈', '👻', '🤖', '👽', '🎃', '💀', '🤡', '👾', '🦄', '🐉', '🧠', '👁️', '🫥', '🤓'],
  animals: ['🐶', '🐱', '🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐰', '🐸', '🐵', '🐷', '🐮', '🐔', '🦉', '🐺', '🦝', '🦓', '🦒', '🐘', '🦏', '🐪', '🦘', '🐢', '🦥', '🦦', '🦔', '🐿️', '🦌', '🐴', '🦬', '🐗'],
  fruits: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍍', '🥝', '🍑', '🍒', '🍋', '🍐', '🥭', '🍈', '🫐', '🍏', '🥥', '🍅', '🥑', '🍊', '🍆', '🌶️', '🌽', '🥕', '🫑', '🥒', '🧄', '🧅', '🥦', '🍄', '🥔', '🍠', '🫘'],
  space: ['🚀', '🛰️', '🌍', '🌕', '⭐', '🌟', '☀️', '🪐', '👨‍🚀', '👽', '🛸', '☄️', '🌌', '🌑', '🌠', '🔭', '🌒', '🌓', '🌔', '🌖', '🌗', '🌘', '🪐', '✨', '🌙', '🌞', '🌛', '🌜', '🌝', '🌚', '💫', '🛤️'],
  ocean: ['🐠', '🐟', '🐡', '🦈', '🐬', '🐳', '🐙', '🦑', '🦀', '🦞', '🦐', '🐚', '🪸', '🌊', '⚓', '🧜‍♀️', '🐢', '🦭', '🐋', '🪼', '🎣', '🚤', '⛵', '🏖️', '🌴', '🐡', '🦦', '🦩', '🐊', '🦅', '🛟', '🪝'],
  flowers: ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '💐', '🪷', '🏵️', '🌾', '🍀', '🌿', '🪻', '🥀', '🌵', '🪴', '🍂', '🍁', '🍃', '🌱', '🌳', '🌲', '🪹', '🪺', '🌴', '🍄', '🌰', '🪨', '🌐', '💮', '🪨', '🌬️'],
};

// অ্যাচিভমেন্ট সংজ্ঞা
const ACHIEVEMENT_DEFS = [
  { id: 'firstWin', name: 'First Win', desc: 'তোমার প্রথম গেম জয় করো', icon: 'fa-flag-checkered' },
  { id: 'speedMaster', name: 'Speed Master', desc: '৩০ সেকেন্ডের কম সময়ে জয় করো', icon: 'fa-bolt' },
  { id: 'memoryKing', name: 'Memory King', desc: 'কোনো ভুল চাল ছাড়া Expert মোডে জয় করো', icon: 'fa-crown' },
  { id: 'comboMaster', name: 'Combo Master', desc: '৫x কম্বো অর্জন করো', icon: 'fa-fire' },
  { id: 'perfectGame', name: 'Perfect Game', desc: 'সর্বনিম্ন সম্ভাব্য চালে জয় করো', icon: 'fa-gem' },
  { id: 'hundredWins', name: '100 Wins', desc: '১০০ বার গেম জয় করো', icon: 'fa-medal' },
];

// ডিফল্ট স্ট্যাটিসটিক্স স্ট্রাকচার
const DEFAULT_STATS = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  bestTime: null, // সেকেন্ডে
  highestScore: 0,
  totalMoves: 0,
  totalTimePlayed: 0, // average time হিসাবের জন্য
  longestStreak: 0,
  currentStreak: 0,
};

/* ==========================================================================
   2. STORAGE MANAGER — সব LocalStorage অপারেশন এখানে কেন্দ্রীভূত
   ========================================================================== */

const StorageManager = {
  /** নিরাপদভাবে localStorage থেকে JSON পড়া */
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn(`StorageManager.get ব্যর্থ হয়েছে কী এর জন্য: ${key}`, err);
      return fallback;
    }
  },

  /** নিরাপদভাবে localStorage-এ JSON লেখা */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`StorageManager.set ব্যর্থ হয়েছে কী এর জন্য: ${key}`, err);
      return false;
    }
  },

  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      darkMode: true,
      soundOn: true,
      musicOn: false,
      animationsOn: true,
    });
  },

  setSettings(settings) {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  },

  getStats() {
    return this.get(STORAGE_KEYS.STATS, { ...DEFAULT_STATS });
  },

  setStats(stats) {
    this.set(STORAGE_KEYS.STATS, stats);
  },

  getAchievements() {
    return this.get(STORAGE_KEYS.ACHIEVEMENTS, {});
  },

  setAchievements(data) {
    this.set(STORAGE_KEYS.ACHIEVEMENTS, data);
  },

  getBestScores() {
    return this.get(STORAGE_KEYS.BEST_SCORES, {
      easy: 0, normal: 0, hard: 0, expert: 0,
    });
  },

  setBestScores(data) {
    this.set(STORAGE_KEYS.BEST_SCORES, data);
  },
};

/* ==========================================================================
   3. SOUND MANAGER — Web Audio দিয়ে তৈরি সিম্পল সাউন্ড ইফেক্ট
   (বাহ্যিক সাউন্ড ফাইলের উপর নির্ভর না করে, যাতে অফলাইনেও কাজ করে)
   ========================================================================== */

const SoundManager = {
  ctx: null,
  musicNode: null,
  musicInterval: null,

  /** AudioContext লেজি-ইনিশিয়ালাইজ করা (ব্রাউজার অটোপ্লে পলিসির জন্য) */
  _ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },

  /** একটি সিম্পল টোন বাজানো */
  _playTone(freq, duration, type = 'sine', volume = 0.15) {
    if (!AppState.settings.soundOn) return;
    try {
      const ctx = this._ensureContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      // Audio ব্যর্থ হলে গেম থামবে না
    }
  },

  flip() { this._playTone(420, 0.12, 'triangle', 0.12); },
  match() {
    this._playTone(523.25, 0.15, 'sine', 0.18);
    setTimeout(() => this._playTone(659.25, 0.18, 'sine', 0.18), 100);
  },
  wrong() { this._playTone(160, 0.25, 'sawtooth', 0.14); },
  click() { this._playTone(300, 0.08, 'square', 0.08); },
  victory() {
    [523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => this._playTone(f, 0.25, 'triangle', 0.16), i * 130);
    });
  },

  /** ব্যাকগ্রাউন্ড মিউজিক — সিম্পল লুপিং অ্যাম্বিয়েন্ট টোন */
  startMusic() {
    if (!AppState.settings.musicOn || this.musicInterval) return;
    const notes = [261.63, 329.63, 392.0, 329.63];
    let i = 0;
    this.musicInterval = setInterval(() => {
      if (AppState.settings.musicOn) {
        this._playTone(notes[i % notes.length], 0.8, 'sine', 0.04);
        i++;
      }
    }, 900);
  },

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  },
};

/* ==========================================================================
   4. APP STATE — গেমের সব রানটাইম স্টেট এক জায়গায়
   ========================================================================== */

const AppState = {
  settings: StorageManager.getSettings(),
  stats: StorageManager.getStats(),
  achievements: StorageManager.getAchievements(),
  bestScores: StorageManager.getBestScores(),

  // নির্বাচন
  selectedDifficulty: 'easy',
  selectedTheme: 'emoji',

  // রানটাইম গেম স্টেট
  game: {
    cards: [],          // {id, symbol, isFlipped, isMatched}
    flippedCards: [],   // বর্তমানে ফ্লিপড (আনম্যাচড) কার্ডের ইনডেক্স
    matchedCount: 0,
    totalPairs: 0,
    moves: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    seconds: 0,
    timerId: null,
    isPaused: false,
    isLocked: false,    // অ্যানিমেশনের সময় ইনপুট লক করতে
    hintsLeft: 3,
    shufflesLeft: 1,
    wrongMoves: 0,
  },
};

/* ==========================================================================
   5. DOM REFERENCES
   ========================================================================== */

const DOM = {
  loader: document.getElementById('loader'),
  body: document.body,

  // Topbar
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),

  // Screens
  homeScreen: document.getElementById('homeScreen'),
  gameScreen: document.getElementById('gameScreen'),

  // Home
  bestScoreValue: document.getElementById('bestScoreValue'),
  difficultyGrid: document.getElementById('difficultyGrid'),
  themeGrid: document.getElementById('themeGrid'),
  startGameBtn: document.getElementById('startGameBtn'),
  statsBtn: document.getElementById('statsBtn'),
  achievementsBtn: document.getElementById('achievementsBtn'),
  settingsBtn: document.getElementById('settingsBtn'),

  // Game HUD
  backHomeBtn: document.getElementById('backHomeBtn'),
  timerValue: document.getElementById('timerValue'),
  movesValue: document.getElementById('movesValue'),
  scoreValue: document.getElementById('scoreValue'),
  comboPill: document.getElementById('comboPill'),
  comboValue: document.getElementById('comboValue'),
  pauseBtn: document.getElementById('pauseBtn'),
  gameBoard: document.getElementById('gameBoard'),
  hintBtn: document.getElementById('hintBtn'),
  hintCount: document.getElementById('hintCount'),
  shuffleBtn: document.getElementById('shuffleBtn'),
  shuffleCount: document.getElementById('shuffleCount'),
  restartBtn: document.getElementById('restartBtn'),

  // Pause overlay
  pauseOverlay: document.getElementById('pauseOverlay'),
  resumeBtn: document.getElementById('resumeBtn'),
  pauseRestartBtn: document.getElementById('pauseRestartBtn'),
  pauseHomeBtn: document.getElementById('pauseHomeBtn'),

  // Result overlay
  resultOverlay: document.getElementById('resultOverlay'),
  starsDisplay: document.getElementById('starsDisplay'),
  resultScore: document.getElementById('resultScore'),
  resultTime: document.getElementById('resultTime'),
  resultMoves: document.getElementById('resultMoves'),
  resultBest: document.getElementById('resultBest'),
  newRecordBadge: document.getElementById('newRecordBadge'),
  retryBtn: document.getElementById('retryBtn'),
  nextGameBtn: document.getElementById('nextGameBtn'),
  resultHomeBtn: document.getElementById('resultHomeBtn'),
  confettiCanvas: document.getElementById('confettiCanvas'),

  // Stats modal
  statsModal: document.getElementById('statsModal'),
  statsGrid: document.getElementById('statsGrid'),
  closeStatsBtn: document.getElementById('closeStatsBtn'),
  resetStatsBtn: document.getElementById('resetStatsBtn'),

  // Achievements modal
  achievementsModal: document.getElementById('achievementsModal'),
  achievementsList: document.getElementById('achievementsList'),
  closeAchievementsBtn: document.getElementById('closeAchievementsBtn'),

  // Settings modal
  settingsModal: document.getElementById('settingsModal'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  darkModeToggle: document.getElementById('darkModeToggle'),
  soundToggle: document.getElementById('soundToggle'),
  musicToggle: document.getElementById('musicToggle'),
  animationToggle: document.getElementById('animationToggle'),

  toastContainer: document.getElementById('toastContainer'),
};

/* ==========================================================================
   6. UTILITY FUNCTIONS
   ========================================================================== */

const Utils = {
  /** Fisher-Yates শাফল অ্যালগরিদম — সত্যিকারের র‍্যান্ডম শাফল */
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /** সেকেন্ডকে MM:SS ফরম্যাটে রূপান্তর */
  formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  /** স্ক্রিন পরিবর্তন (Home <-> Game) */
  showScreen(screenEl) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active-screen'));
    screenEl.classList.add('active-screen');
  },

  /** একটি মোডাল/ওভারলে দেখানো */
  openOverlay(el) {
    el.hidden = false;
  },

  closeOverlay(el) {
    el.hidden = true;
  },

  /** টোস্ট নোটিফিকেশন দেখানো */
  showToast(message, type = 'info', icon = 'fa-circle-info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  },
};

/* ==========================================================================
   7. SETTINGS CONTROLLER
   ========================================================================== */

const SettingsController = {
  init() {
    this.applySettingsToUI();
    this.applyTheme();
    this.bindEvents();
  },

  applySettingsToUI() {
    const s = AppState.settings;
    DOM.darkModeToggle.checked = s.darkMode;
    DOM.soundToggle.checked = s.soundOn;
    DOM.musicToggle.checked = s.musicOn;
    DOM.animationToggle.checked = s.animationsOn;
    this.updateSoundIcon();
    this.updateThemeIcon();
    DOM.body.classList.toggle('no-animations', !s.animationsOn);
  },

  applyTheme() {
    DOM.body.setAttribute('data-theme', AppState.settings.darkMode ? 'dark' : 'light');
  },

  updateThemeIcon() {
    const icon = DOM.themeToggleBtn.querySelector('i');
    icon.className = AppState.settings.darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  },

  updateSoundIcon() {
    const icon = DOM.soundToggleBtn.querySelector('i');
    icon.className = AppState.settings.soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  },

  save() {
    StorageManager.setSettings(AppState.settings);
  },

  bindEvents() {
    DOM.themeToggleBtn.addEventListener('click', () => {
      AppState.settings.darkMode = !AppState.settings.darkMode;
      this.applyTheme();
      this.updateThemeIcon();
      DOM.darkModeToggle.checked = AppState.settings.darkMode;
      this.save();
      SoundManager.click();
    });

    DOM.soundToggleBtn.addEventListener('click', () => {
      AppState.settings.soundOn = !AppState.settings.soundOn;
      this.updateSoundIcon();
      DOM.soundToggle.checked = AppState.settings.soundOn;
      this.save();
    });

    DOM.darkModeToggle.addEventListener('change', (e) => {
      AppState.settings.darkMode = e.target.checked;
      this.applyTheme();
      this.updateThemeIcon();
      this.save();
    });

    DOM.soundToggle.addEventListener('change', (e) => {
      AppState.settings.soundOn = e.target.checked;
      this.updateSoundIcon();
      this.save();
    });

    DOM.musicToggle.addEventListener('change', (e) => {
      AppState.settings.musicOn = e.target.checked;
      this.save();
      if (e.target.checked) SoundManager.startMusic();
      else SoundManager.stopMusic();
    });

    DOM.animationToggle.addEventListener('change', (e) => {
      AppState.settings.animationsOn = e.target.checked;
      DOM.body.classList.toggle('no-animations', !e.target.checked);
      this.save();
    });
  },
};

/* ==========================================================================
   8. STATISTICS CONTROLLER
   ========================================================================== */

const StatsController = {
  /** একটি গেম শেষ হওয়ার পর স্ট্যাটিসটিক্স আপডেট করা */
  recordGame({ won, time, moves, score }) {
    const s = AppState.stats;
    s.totalGames += 1;
    s.totalMoves += moves;
    s.totalTimePlayed += time;

    if (won) {
      s.wins += 1;
      s.currentStreak += 1;
      s.longestStreak = Math.max(s.longestStreak, s.currentStreak);
      if (s.bestTime === null || time < s.bestTime) s.bestTime = time;
      if (score > s.highestScore) s.highestScore = score;
    } else {
      s.losses += 1;
      s.currentStreak = 0;
    }

    StorageManager.setStats(s);
  },

  getWinRate() {
    const s = AppState.stats;
    if (s.totalGames === 0) return 0;
    return Math.round((s.wins / s.totalGames) * 100);
  },

  getAverageTime() {
    const s = AppState.stats;
    if (s.totalGames === 0) return 0;
    return Math.round(s.totalTimePlayed / s.totalGames);
  },

  /** Statistics মোডাল রেন্ডার করা */
  render() {
    const s = AppState.stats;
    const items = [
      { label: 'Total Games', value: s.totalGames, icon: 'fa-gamepad' },
      { label: 'Wins', value: s.wins, icon: 'fa-trophy' },
      { label: 'Losses', value: s.losses, icon: 'fa-heart-crack' },
      { label: 'Win Rate', value: `${this.getWinRate()}%`, icon: 'fa-percent' },
      { label: 'Best Time', value: s.bestTime !== null ? Utils.formatTime(s.bestTime) : '--:--', icon: 'fa-stopwatch' },
      { label: 'Highest Score', value: s.highestScore, icon: 'fa-star' },
      { label: 'Average Time', value: Utils.formatTime(this.getAverageTime()), icon: 'fa-clock' },
      { label: 'Total Moves', value: s.totalMoves, icon: 'fa-shuffle' },
      { label: 'Longest Streak', value: s.longestStreak, icon: 'fa-fire' },
    ];

    DOM.statsGrid.innerHTML = items.map((item) => `
      <div class="stat-item">
        <span class="stat-label"><i class="fa-solid ${item.icon}" aria-hidden="true"></i> ${item.label}</span>
        <span class="stat-value">${item.value}</span>
      </div>
    `).join('');
  },

  reset() {
    AppState.stats = { ...DEFAULT_STATS };
    StorageManager.setStats(AppState.stats);
    this.render();
    Utils.showToast('সব স্ট্যাটিসটিক্স রিসেট হয়েছে', 'success', 'fa-trash');
  },
};

/* ==========================================================================
   9. ACHIEVEMENTS CONTROLLER
   ========================================================================== */

const AchievementsController = {
  /** নির্দিষ্ট অ্যাচিভমেন্ট আনলক করা (যদি আগে আনলক না হয়ে থাকে) */
  unlock(id) {
    if (AppState.achievements[id]) return; // আগেই আনলক করা আছে
    AppState.achievements[id] = { unlockedAt: Date.now() };
    StorageManager.setAchievements(AppState.achievements);
    const def = ACHIEVEMENT_DEFS.find((a) => a.id === id);
    if (def) {
      Utils.showToast(`🏆 অ্যাচিভমেন্ট আনলক: ${def.name}`, 'achievement', 'fa-medal');
    }
  },

  /** একটি গেম শেষ হওয়ার পর প্রযোজ্য অ্যাচিভমেন্ট চেক করা */
  checkAfterGame({ won, time, moves, difficulty, comboMax, wrongMoves, totalPairs }) {
    if (!won) return;

    this.unlock('firstWin');

    if (time < 30) this.unlock('speedMaster');

    if (difficulty === 'expert' && wrongMoves === 0) this.unlock('memoryKing');

    if (comboMax >= 5) this.unlock('comboMaster');

    if (moves === totalPairs) this.unlock('perfectGame'); // সর্বনিম্ন সম্ভাব্য চাল = পেয়ার সংখ্যা

    if (AppState.stats.wins >= 100) this.unlock('hundredWins');
  },

  render() {
    DOM.achievementsList.innerHTML = ACHIEVEMENT_DEFS.map((def) => {
      const unlocked = !!AppState.achievements[def.id];
      return `
        <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
          <div class="achievement-icon"><i class="fa-solid ${def.icon}" aria-hidden="true"></i></div>
          <div class="achievement-info">
            <strong>${def.name} ${unlocked ? '✅' : '🔒'}</strong>
            <span>${def.desc}</span>
          </div>
        </div>
      `;
    }).join('');
  },
};

/* ==========================================================================
   10. CONFETTI ENGINE — হালকা Canvas-ভিত্তিক কনফেটি অ্যানিমেশন
   ========================================================================== */

const Confetti = {
  particles: [],
  animationId: null,
  ctx: null,

  burst() {
    if (!AppState.settings.animationsOn) return;
    const canvas = DOM.confettiCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');

    const colors = ['#6c5ce7', '#00cec9', '#ffd166', '#ff6fb1', '#2ecc71', '#ff9f43'];
    this.particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 4,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: -6 + Math.random() * 12,
      life: 0,
    }));

    this._animate();
  },

  _animate() {
    const canvas = DOM.confettiCanvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let stillAlive = false;
    this.particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      p.life += 1;

      if (p.y < canvas.height + 20) stillAlive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (stillAlive && this.particles.some((p) => p.life < 220)) {
      this.animationId = requestAnimationFrame(() => this._animate());
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles = [];
    }
  },

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.ctx) this.ctx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);
  },
};

/* ==========================================================================
   11. GAME ENGINE — মূল গেমপ্লে লজিক
   ========================================================================== */

const GameEngine = {

  /** নতুন গেম শুরু করা (নির্বাচিত difficulty ও theme দিয়ে) */
  startNewGame() {
    const config = DIFFICULTY_CONFIG[AppState.selectedDifficulty];
    const g = AppState.game;

    // স্টেট রিসেট
    g.cards = this._generateCardSet(config.pairs, AppState.selectedTheme);
    g.flippedCards = [];
    g.matchedCount = 0;
    g.totalPairs = config.pairs;
    g.moves = 0;
    g.score = 0;
    g.combo = 0;
    g.maxCombo = 0;
    g.seconds = 0;
    g.isPaused = false;
    g.isLocked = true; // প্রিভিউ চলাকালীন ইনপুট লক থাকবে
    g.hintsLeft = 3;
    g.shufflesLeft = 1;
    g.wrongMoves = 0;

    this._clearTimer();
    this._renderBoard(config.size);
    this._updateHUD();
    DOM.hintCount.textContent = g.hintsLeft;
    DOM.shuffleCount.textContent = g.shufflesLeft;
    DOM.hintBtn.disabled = true;
    DOM.shuffleBtn.disabled = true;
    DOM.comboPill.hidden = true;

    Utils.showScreen(DOM.gameScreen);
    SoundManager.startMusic();
    DOM.pauseBtn.disabled = true; // প্রিভিউ চলাকালীন পজ করা যাবে না

    // কার্ড দেখার সুযোগ দেওয়ার পর গেম আসলে শুরু হবে
    this._showPreviewThenStart(config);
  },

  /**
   * গেম শুরুর আগে সব কার্ড কিছুক্ষণের জন্য উল্টে দেখানো (Memorize Phase),
   * যাতে খেলোয়াড় প্রতিটি কার্ডের পজিশন মনে রাখার সুযোগ পায়।
   * Difficulty যত কঠিন, প্রিভিউ সময় তত বেশি (বেশি কার্ড মনে রাখতে হয়)।
   */
  _showPreviewThenStart(config) {
    const g = AppState.game;

    // প্রিভিউ সময় (সেকেন্ডে) — Difficulty অনুযায়ী পরিবর্তনশীল
    const previewSeconds = { easy: 2, normal: 3, hard: 4, expert: 5 }[AppState.selectedDifficulty] || 3;

    // সব কার্ড উল্টে দেখানো
    const cardEls = DOM.gameBoard.querySelectorAll('.memory-card');
    cardEls.forEach((el) => el.classList.add('flipped', 'preview'));

    // স্ক্রিনে কাউন্টডাউন ওভারলে দেখানো
    this._renderPreviewBadge(previewSeconds);

    let remaining = previewSeconds;
    const countdownId = setInterval(() => {
      remaining -= 1;
      this._updatePreviewBadge(remaining);
      if (remaining <= 0) {
        clearInterval(countdownId);
      }
    }, 1000);

    setTimeout(() => {
      // সব কার্ড আবার বন্ধ করা
      cardEls.forEach((el) => el.classList.remove('flipped', 'preview'));
      this._removePreviewBadge();

      // এখন আসল গেম শুরু — ইনপুট আনলক ও টাইমার চালু
      g.isLocked = false;
      DOM.hintBtn.disabled = false;
      DOM.shuffleBtn.disabled = false;
      DOM.pauseBtn.disabled = false;
      this._startTimer();
    }, previewSeconds * 1000);
  },

  /** প্রিভিউ কাউন্টডাউন ব্যাজ তৈরি করা */
  _renderPreviewBadge(seconds) {
    const badge = document.createElement('div');
    badge.id = 'previewBadge';
    badge.className = 'preview-badge';
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-live', 'polite');
    badge.innerHTML = `<i class="fa-solid fa-eye" aria-hidden="true"></i> মনে রাখো... <span id="previewCountdown">${seconds}</span>`;
    DOM.gameBoard.parentElement.insertBefore(badge, DOM.gameBoard);
  },

  _updatePreviewBadge(seconds) {
    const el = document.getElementById('previewCountdown');
    if (el) el.textContent = Math.max(seconds, 0);
  },

  _removePreviewBadge() {
    const badge = document.getElementById('previewBadge');
    if (badge) badge.remove();
  },

  /** কার্ড সিম্বল জোড়া বানানো এবং শাফল করা */
  _generateCardSet(pairCount, themeKey) {
    const symbols = CARD_THEMES[themeKey] || CARD_THEMES.emoji;
    const chosen = symbols.slice(0, pairCount);
    const doubled = [...chosen, ...chosen];
    const shuffled = Utils.shuffleArray(doubled);
    return shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
  },

  /** বোর্ড DOM-এ রেন্ডার করা */
  _renderBoard(gridSize) {
    DOM.gameBoard.setAttribute('data-grid', gridSize);
    DOM.gameBoard.innerHTML = '';

    AppState.game.cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.setAttribute('role', 'gridcell');
      cardEl.setAttribute('tabindex', '0');
      cardEl.setAttribute('aria-label', 'মেমোরি কার্ড, লুকানো');
      cardEl.dataset.index = index;

      cardEl.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-back"><i class="fa-solid fa-question" aria-hidden="true"></i></div>
          <div class="card-face card-front">${card.symbol}</div>
        </div>
      `;

      cardEl.addEventListener('click', () => this.handleCardClick(index));
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(index);
        }
      });

      DOM.gameBoard.appendChild(cardEl);
    });
  },

  /** ব্যবহারকারী একটি কার্ডে ক্লিক করলে */
  handleCardClick(index) {
    const g = AppState.game;
    if (g.isPaused || g.isLocked) return;

    const card = g.cards[index];
    if (card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    g.flippedCards.push(index);
    this._renderCardFlip(index, true);
    SoundManager.flip();

    if (g.flippedCards.length === 2) {
      g.moves += 1;
      DOM.movesValue.textContent = g.moves;
      g.isLocked = true;
      setTimeout(() => this._evaluateMatch(), 550);
    }
  },

  /** কার্ড ফ্লিপ DOM-এ প্রতিফলিত করা */
  _renderCardFlip(index, flipped) {
    const el = DOM.gameBoard.querySelector(`[data-index="${index}"]`);
    if (!el) return;
    el.classList.toggle('flipped', flipped);
    el.setAttribute('aria-label', flipped ? `কার্ড দেখানো হচ্ছে` : 'মেমোরি কার্ড, লুকানো');
  },

  /** দুটি ফ্লিপড কার্ড মিলছে কিনা যাচাই করা */
  _evaluateMatch() {
    const g = AppState.game;
    const [i1, i2] = g.flippedCards;
    const card1 = g.cards[i1];
    const card2 = g.cards[i2];

    if (card1.symbol === card2.symbol) {
      // ম্যাচ সফল
      card1.isMatched = true;
      card2.isMatched = true;
      g.matchedCount += 1;
      g.combo += 1;
      g.maxCombo = Math.max(g.maxCombo, g.combo);

      this._markMatched(i1);
      this._markMatched(i2);
      SoundManager.match();

      const points = this._calculatePoints(g.combo);
      g.score += points;
      this._showFloatingScore(i2, `+${points}`);
      this._updateComboUI();
      this._updateHUD();

      if (g.matchedCount === g.totalPairs) {
        this._handleWin();
      }
    } else {
      // ম্যাচ ব্যর্থ
      g.combo = 0;
      g.wrongMoves += 1;
      this._updateComboUI();
      this._shakeCards(i1, i2);
      SoundManager.wrong();
      card1.isFlipped = false;
      card2.isFlipped = false;
      this._renderCardFlip(i1, false);
      this._renderCardFlip(i2, false);
    }

    g.flippedCards = [];
    g.isLocked = false;
  },

  /** কম্বো ও পারফেক্ট ম্যাচ বোনাসসহ পয়েন্ট হিসাব */
  _calculatePoints(combo) {
    const base = 10;
    const comboBonus = (combo - 1) * 5; // প্রতি কম্বো লেভেলে অতিরিক্ত বোনাস
    return base + comboBonus;
  },

  _markMatched(index) {
    const el = DOM.gameBoard.querySelector(`[data-index="${index}"]`);
    if (el) {
      el.classList.add('matched');
      el.setAttribute('aria-label', 'কার্ড মিলেছে');
    }
  },

  _shakeCards(i1, i2) {
    [i1, i2].forEach((idx) => {
      const el = DOM.gameBoard.querySelector(`[data-index="${idx}"]`);
      if (el) {
        el.classList.add('wrong');
        setTimeout(() => el.classList.remove('wrong'), 500);
      }
    });
  },

  _showFloatingScore(index, text) {
    const el = DOM.gameBoard.querySelector(`[data-index="${index}"]`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-score';
    floatEl.textContent = text;
    floatEl.style.left = `${rect.left + rect.width / 2}px`;
    floatEl.style.top = `${rect.top}px`;
    document.body.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1000);
  },

  _updateComboUI() {
    const g = AppState.game;
    if (g.combo > 1) {
      DOM.comboPill.hidden = false;
      DOM.comboValue.textContent = `x${g.combo}`;
    } else {
      DOM.comboPill.hidden = true;
    }
  },

  _updateHUD() {
    const g = AppState.game;
    DOM.scoreValue.textContent = g.score;
    DOM.movesValue.textContent = g.moves;
    DOM.timerValue.textContent = Utils.formatTime(g.seconds);
  },

  /* ---------------- টাইমার ---------------- */

  _startTimer() {
    const g = AppState.game;
    g.timerId = setInterval(() => {
      if (!g.isPaused) {
        g.seconds += 1;
        DOM.timerValue.textContent = Utils.formatTime(g.seconds);
      }
    }, 1000);
  },

  _clearTimer() {
    if (AppState.game.timerId) {
      clearInterval(AppState.game.timerId);
      AppState.game.timerId = null;
    }
  },

  /* ---------------- পজ / রিজিউম ---------------- */

  pauseGame() {
    AppState.game.isPaused = true;
    Utils.openOverlay(DOM.pauseOverlay);
    SoundManager.click();
  },

  resumeGame() {
    AppState.game.isPaused = false;
    Utils.closeOverlay(DOM.pauseOverlay);
    SoundManager.click();
  },

  /* ---------------- হিন্ট ---------------- */

  useHint() {
    const g = AppState.game;
    if (g.hintsLeft <= 0 || g.isLocked || g.isPaused) return;

    // এখনো ম্যাচ হয়নি এমন কার্ডগুলো খুঁজে একটি জোড়া বেছে নেওয়া
    const unmatched = g.cards.filter((c) => !c.isMatched);
    if (unmatched.length < 2) return;

    const symbolMap = {};
    unmatched.forEach((c) => {
      if (!symbolMap[c.symbol]) symbolMap[c.symbol] = [];
      symbolMap[c.symbol].push(c.id);
    });
    const pairEntry = Object.values(symbolMap).find((ids) => ids.length === 2);
    if (!pairEntry) return;

    g.hintsLeft -= 1;
    DOM.hintCount.textContent = g.hintsLeft;
    if (g.hintsLeft === 0) DOM.hintBtn.disabled = true;

    pairEntry.forEach((idx) => {
      const el = DOM.gameBoard.querySelector(`[data-index="${idx}"]`);
      if (el) {
        el.classList.add('hint', 'flipped');
        setTimeout(() => el.classList.remove('hint', 'flipped'), 1200);
      }
    });

    Utils.showToast('হিন্ট দেখানো হয়েছে!', 'info', 'fa-lightbulb');
    SoundManager.click();
  },

  /* ---------------- শাফল ---------------- */

  useShuffle() {
    const g = AppState.game;
    if (g.shufflesLeft <= 0 || g.isLocked || g.isPaused) return;

    g.shufflesLeft -= 1;
    DOM.shuffleCount.textContent = g.shufflesLeft;
    if (g.shufflesLeft === 0) DOM.shuffleBtn.disabled = true;

    // শুধু আনম্যাচড কার্ডগুলোর পজিশন শাফল করা
    const unmatchedIndices = g.cards
      .map((c, idx) => (!c.isMatched ? idx : null))
      .filter((idx) => idx !== null);

    const unmatchedCards = unmatchedIndices.map((idx) => g.cards[idx]);
    const shuffled = Utils.shuffleArray(unmatchedCards);

    unmatchedIndices.forEach((idx, i) => {
      g.cards[idx] = { ...shuffled[i], isFlipped: false };
    });

    g.flippedCards = [];
    const config = DIFFICULTY_CONFIG[AppState.selectedDifficulty];
    this._renderBoard(config.size);

    Utils.showToast('বোর্ড শাফল করা হয়েছে!', 'info', 'fa-arrows-spin');
    SoundManager.click();
  },

  /* ---------------- রিস্টার্ট ---------------- */

  restartGame() {
    this._clearTimer();
    Utils.closeOverlay(DOM.pauseOverlay);
    this.startNewGame();
  },

  /* ---------------- জয় হ্যান্ডলিং ---------------- */

  _handleWin() {
    const g = AppState.game;
    this._clearTimer();
    SoundManager.stopMusic();
    SoundManager.victory();

    // টাইম বোনাস: যত কম সময়ে শেষ হবে তত বেশি বোনাস
    const config = DIFFICULTY_CONFIG[AppState.selectedDifficulty];
    const timeBonus = Math.max(0, (config.timeLimit - g.seconds)) * 2;
    g.score += timeBonus;

    // পারফেক্ট গেম বোনাস (নিখুঁত চাল হলে)
    if (g.moves === g.totalPairs) {
      g.score += 200;
    }

    const difficulty = AppState.selectedDifficulty;

    // বেস্ট স্কোর আপডেট
    const prevBest = AppState.bestScores[difficulty] || 0;
    const isNewRecord = g.score > prevBest;
    if (isNewRecord) {
      AppState.bestScores[difficulty] = g.score;
      StorageManager.setBestScores(AppState.bestScores);
    }

    // স্ট্যাটিসটিক্স ও অ্যাচিভমেন্ট আপডেট
    StatsController.recordGame({ won: true, time: g.seconds, moves: g.moves, score: g.score });
    AchievementsController.checkAfterGame({
      won: true,
      time: g.seconds,
      moves: g.moves,
      difficulty,
      comboMax: g.maxCombo,
      wrongMoves: g.wrongMoves,
      totalPairs: g.totalPairs,
    });

    setTimeout(() => this._showResultScreen(isNewRecord), 600);
  },

  _calculateStars() {
    const g = AppState.game;
    const efficiency = g.totalPairs / g.moves; // ১.০ = পারফেক্ট
    if (efficiency >= 0.9) return 3;
    if (efficiency >= 0.6) return 2;
    return 1;
  },

  _showResultScreen(isNewRecord) {
    const g = AppState.game;
    const stars = this._calculateStars();

    DOM.resultScore.textContent = g.score;
    DOM.resultTime.textContent = Utils.formatTime(g.seconds);
    DOM.resultMoves.textContent = g.moves;
    DOM.resultBest.textContent = AppState.bestScores[AppState.selectedDifficulty] || 0;
    DOM.newRecordBadge.hidden = !isNewRecord;

    // স্টার অ্যানিমেশন
    const starEls = DOM.starsDisplay.querySelectorAll('.star');
    starEls.forEach((el) => el.classList.remove('earned'));
    starEls.forEach((el, i) => {
      if (i < stars) {
        setTimeout(() => el.classList.add('earned'), i * 250);
      }
    });

    Utils.openOverlay(DOM.resultOverlay);
    Confetti.burst();
  },
};

/* ==========================================================================
   12. NAVIGATION / EVENT BINDING
   ========================================================================== */

const Navigation = {
  init() {
    this._bindHomeScreen();
    this._bindGameScreen();
    this._bindPauseOverlay();
    this._bindResultOverlay();
    this._bindModals();
    this._bindKeyboardShortcuts();
  },

  _bindHomeScreen() {
    // Difficulty নির্বাচন
    DOM.difficultyGrid.querySelectorAll('.option-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        DOM.difficultyGrid.querySelectorAll('.option-chip').forEach((c) => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        AppState.selectedDifficulty = chip.dataset.difficulty;
        this._updateBestScoreDisplay();
        SoundManager.click();
      });
    });

    // থিম নির্বাচন
    DOM.themeGrid.querySelectorAll('.option-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        DOM.themeGrid.querySelectorAll('.option-chip').forEach((c) => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        AppState.selectedTheme = chip.dataset.themeSet;
        SoundManager.click();
      });
    });

    DOM.startGameBtn.addEventListener('click', () => {
      SoundManager.click();
      GameEngine.startNewGame();
    });

    DOM.statsBtn.addEventListener('click', () => {
      StatsController.render();
      Utils.openOverlay(DOM.statsModal);
      SoundManager.click();
    });

    DOM.achievementsBtn.addEventListener('click', () => {
      AchievementsController.render();
      Utils.openOverlay(DOM.achievementsModal);
      SoundManager.click();
    });

    DOM.settingsBtn.addEventListener('click', () => {
      Utils.openOverlay(DOM.settingsModal);
      SoundManager.click();
    });

    this._updateBestScoreDisplay();
  },

  _updateBestScoreDisplay() {
    const best = AppState.bestScores[AppState.selectedDifficulty] || 0;
    DOM.bestScoreValue.textContent = best;
  },

  _bindGameScreen() {
    DOM.backHomeBtn.addEventListener('click', () => this._goHome());
    DOM.pauseBtn.addEventListener('click', () => GameEngine.pauseGame());
    DOM.hintBtn.addEventListener('click', () => GameEngine.useHint());
    DOM.shuffleBtn.addEventListener('click', () => GameEngine.useShuffle());
    DOM.restartBtn.addEventListener('click', () => {
      if (confirm('তুমি কি নিশ্চিত গেম রিস্টার্ট করতে চাও?')) {
        GameEngine.restartGame();
      }
    });
  },

  _goHome() {
    GameEngine._clearTimer();
    SoundManager.stopMusic();
    Utils.closeOverlay(DOM.pauseOverlay);
    Utils.closeOverlay(DOM.resultOverlay);
    Confetti.stop();
    this._updateBestScoreDisplay();
    Utils.showScreen(DOM.homeScreen);
    SoundManager.click();
  },

  _bindPauseOverlay() {
    DOM.resumeBtn.addEventListener('click', () => GameEngine.resumeGame());
    DOM.pauseRestartBtn.addEventListener('click', () => GameEngine.restartGame());
    DOM.pauseHomeBtn.addEventListener('click', () => this._goHome());
  },

  _bindResultOverlay() {
    DOM.retryBtn.addEventListener('click', () => {
      Utils.closeOverlay(DOM.resultOverlay);
      Confetti.stop();
      GameEngine.startNewGame();
      SoundManager.click();
    });

    DOM.nextGameBtn.addEventListener('click', () => {
      this._advanceDifficulty();
      Utils.closeOverlay(DOM.resultOverlay);
      Confetti.stop();
      GameEngine.startNewGame();
      SoundManager.click();
    });

    DOM.resultHomeBtn.addEventListener('click', () => {
      Utils.closeOverlay(DOM.resultOverlay);
      Confetti.stop();
      this._goHome();
    });
  },

  /** Next Level বাটনে ক্লিক করলে পরবর্তী কঠিন difficulty-তে যাওয়া */
  _advanceDifficulty() {
    const order = ['easy', 'normal', 'hard', 'expert'];
    const currentIndex = order.indexOf(AppState.selectedDifficulty);
    const nextIndex = Math.min(currentIndex + 1, order.length - 1);
    AppState.selectedDifficulty = order[nextIndex];

    // হোম স্ক্রিনের UI সিলেকশনও সিঙ্ক করা
    DOM.difficultyGrid.querySelectorAll('.option-chip').forEach((chip) => {
      const isActive = chip.dataset.difficulty === AppState.selectedDifficulty;
      chip.classList.toggle('active', isActive);
      chip.setAttribute('aria-checked', String(isActive));
    });
  },

  _bindModals() {
    // প্রতিটি ক্লোজ বাটনের জন্য robust হ্যান্ডলার — stopPropagation দিয়ে
    // নিশ্চিত করা হচ্ছে যে ক্লিক ইভেন্ট ব্যাকড্রপ হ্যান্ডলারের সাথে কনফ্লিক্ট করবে না,
    // এবং মোবাইল/টাচ ডিভাইসেও নির্ভরযোগ্যভাবে কাজ করবে।
    const bindCloseButton = (btn, modal) => {
      const close = (e) => {
        e.preventDefault();
        e.stopPropagation();
        Utils.closeOverlay(modal);
      };
      btn.addEventListener('click', close);
      btn.addEventListener('touchend', close);
    };

    bindCloseButton(DOM.closeStatsBtn, DOM.statsModal);
    bindCloseButton(DOM.closeAchievementsBtn, DOM.achievementsModal);
    bindCloseButton(DOM.closeSettingsBtn, DOM.settingsModal);

    DOM.resetStatsBtn.addEventListener('click', () => {
      if (confirm('তুমি কি নিশ্চিত সব স্ট্যাটিসটিক্স রিসেট করতে চাও? এটি আর ফিরিয়ে আনা যাবে না।')) {
        StatsController.reset();
      }
    });

    // ব্যাকড্রপে ক্লিক করলে মোডাল বন্ধ হবে (ওভারলে-কার্ডের বাইরে ক্লিক করলে)
    [DOM.statsModal, DOM.achievementsModal, DOM.settingsModal].forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) Utils.closeOverlay(modal);
      });
    });
  },

  _bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC চাপলে খোলা মোডাল/ওভারলে বন্ধ হবে
      if (e.key === 'Escape') {
        [DOM.statsModal, DOM.achievementsModal, DOM.settingsModal].forEach((modal) => {
          if (!modal.hidden) Utils.closeOverlay(modal);
        });
        if (!DOM.pauseOverlay.hidden) GameEngine.resumeGame();
      }

      // Space চাপলে পজ/রিজিউম টগল হবে (গেম স্ক্রিনে থাকলে)
      if (e.code === 'Space' && DOM.gameScreen.classList.contains('active-screen')) {
        const activeTag = document.activeElement.tagName;
        if (activeTag !== 'BUTTON' && activeTag !== 'INPUT') {
          e.preventDefault();
          if (AppState.game.isPaused) GameEngine.resumeGame();
          else GameEngine.pauseGame();
        }
      }
    });
  },
};

/* ==========================================================================
   13. APP INITIALIZATION
   ========================================================================== */

function initApp() {
  SettingsController.init();
  Navigation.init();

  // লোডার লুকানো
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
  }, 600);

  console.log('%cMemory Master শুরু হয়েছে! 🧠', 'color:#6c5ce7; font-weight:bold; font-size:14px;');
}

// DOM প্রস্তুত হলে অ্যাপ চালু করা
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
