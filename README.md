# 🧠 Memory Master

একটি আধুনিক, সুন্দর এবং সম্পূর্ণ Responsive **Memory Card Matching Game** — তৈরি করা হয়েছে শুধুমাত্র **HTML5, CSS3 এবং Vanilla JavaScript (ES6+)** দিয়ে, কোনো External Framework ছাড়াই।

![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Game Overview

**Memory Master** একটি ক্লাসিক কার্ড-ম্যাচিং (Concentration) গেম, যেখানে খেলোয়াড়কে একই রকম জোড়া কার্ড খুঁজে বের করতে হয়। গেমটিতে রয়েছে আধুনিক **Glassmorphism UI**, **Dark/Light Mode**, একাধিক **Difficulty Level**, ৬টি ভিন্ন **থিম**, পূর্ণাঙ্গ **Statistics & Achievement System** এবং মসৃণ **অ্যানিমেশন** — সব মিলিয়ে এটি একটি প্রোডাকশন-রেডি, GitHub-এ আপলোডযোগ্য প্রজেক্ট।

🔗 **Live Demo:** `তোমার GitHub Pages লিংক এখানে যুক্ত করো`

---

## ✨ Features

### 🎨 UI / UX
- আধুনিক **Glassmorphism Design**
- **Dark Mode** ও **Light Mode** (টগলযোগ্য)
- সুন্দর Animated **Gradient Background**
- 3D **Card Flip Animation**
- **Hover Effects** ও Smooth Transitions
- সম্পূর্ণ **Responsive** — Mobile, Tablet ও Desktop friendly

### 🎮 Gameplay
- র‍্যান্ডম কার্ড শাফল (Fisher-Yates Algorithm)
- রিয়েল-টাইম **Timer** ও **Move Counter**
- ডায়নামিক **Score System** (Combo Bonus + Time Bonus + Perfect Game Bonus)
- **Pause / Resume / Restart** সুবিধা
- **Hint বাটন** (৩ বার ব্যবহারযোগ্য)
- **Shuffle বাটন** (১ বার ব্যবহারযোগ্য)
- ভুল ম্যাচে **Shake Animation**, সঠিক ম্যাচে **Glow Effect**

### 🎯 Difficulty Levels
| Level | Grid Size | Pairs |
|-------|-----------|-------|
| Easy | 2×2 | 2 |
| Normal | 4×4 | 8 |
| Hard | 6×6 | 18 |
| Expert | 8×8 | 32 |

### 🎭 Themes
Emoji • Animals • Fruits • Space • Ocean • Flowers

### 🔊 Sound System
- Card Flip, Match, Wrong Match, Victory ও Button Click সাউন্ড (Web Audio API দিয়ে জেনারেট, কোনো এক্সটার্নাল ফাইলের প্রয়োজন নেই)
- ব্যাকগ্রাউন্ড মিউজিক (On/Off টগল)

### ⚙️ Settings
- Dark / Light Mode
- Sound Effects On/Off
- Background Music On/Off
- Animations On/Off

সব সেটিংস স্বয়ংক্রিয়ভাবে **LocalStorage**-এ সংরক্ষিত হয়।

### 📊 Statistics (LocalStorage ভিত্তিক)
Total Games • Wins • Losses • Win Rate • Best Time • Highest Score • Average Time • Total Moves • Longest Streak

### 🏆 Achievement System
- 🏁 First Win
- ⚡ Speed Master (৩০ সেকেন্ডের মধ্যে জয়)
- 👑 Memory King (Expert মোডে কোনো ভুল ছাড়াই জয়)
- 🔥 Combo Master (৫x কম্বো)
- 💎 Perfect Game (সর্বনিম্ন চালে জয়)
- 🎖️ 100 Wins

### 🏁 Result Screen
Final Score • Star Rating (১–৩) • Time • Moves • Best Score তুলনা • Retry / Home / Next Level বাটন

### 🎉 Animations
Confetti (জয়ের সময়), Glow Effect, Shake Effect, Floating Score Popup, Smooth Screen Transition

### ♿ Accessibility
- সম্পূর্ণ **ARIA Labels** ও **Roles** যুক্ত
- **Keyboard Navigation** সাপোর্ট (Tab, Enter, Space, Esc)
- `prefers-reduced-motion` সাপোর্ট

---

## 🚀 Installation

এই প্রজেক্টে কোনো বিল্ড টুল বা প্যাকেজ ম্যানেজার প্রয়োজন নেই।

```bash
# রিপোজিটরি ক্লোন করো
git clone https://github.com/your-username/memory-game.git

# ফোল্ডারে প্রবেশ করো
cd memory-game

# index.html ফাইলটি ব্রাউজারে ওপেন করো
```

> 💡 চাইলে VS Code-এর **Live Server** Extension ব্যবহার করেও চালাতে পারো, যাতে লোকাল সার্ভারে রিয়েল-টাইম রিলোড পাও।

---

## 🕹️ How to Play

1. **Start Game**-এ ক্লিক করার আগে পছন্দের **Difficulty** ও **Theme** নির্বাচন করো।
2. বোর্ডের কার্ডগুলোতে ক্লিক/ট্যাপ করে একে একে দুটি কার্ড ফ্লিপ করো।
3. দুটি কার্ড একই হলে তারা ম্যাচড হয়ে যাবে এবং তুমি পয়েন্ট পাবে।
4. ভুল হলে কার্ডগুলো আবার লুকিয়ে যাবে — মনে রাখো কোথায় কী ছিল!
5. ধারাবাহিক সঠিক ম্যাচে **Combo Bonus** পাবে।
6. সব কার্ড ম্যাচ করলে গেম জিতে যাবে এবং **Result Screen**-এ স্কোর, স্টার ও সময় দেখতে পাবে।
7. প্রয়োজনে **Hint** বা **Shuffle** ব্যবহার করো (সীমিত সংখ্যক বার)।

**কীবোর্ড শর্টকাট:** `Tab` দিয়ে কার্ড সিলেক্ট, `Enter`/`Space` দিয়ে ফ্লিপ, গেমের মধ্যে `Space` দিয়ে Pause/Resume, `Esc` দিয়ে মোডাল বন্ধ।

---

## 🛠️ Technologies Used

- **HTML5** — সিমান্টিক, Accessible মার্কআপ
- **CSS3** — Glassmorphism, Flexbox, Grid, Custom Properties (Variables), Keyframe Animations
- **Vanilla JavaScript (ES6+)** — Modules Pattern, LocalStorage API, Web Audio API, Canvas API (Confetti)
- **Font Awesome** — আইকনের জন্য
- **Google Fonts** (Poppins, Baloo Da 2) — টাইপোগ্রাফির জন্য

> ❌ কোনো Framework বা Library (React, Vue, jQuery ইত্যাদি) ব্যবহার করা হয়নি।

---

## 📁 Folder Structure

```
memory-game/
│
├── index.html          # মূল HTML — সব স্ক্রিন ও মোডাল
├── style.css           # সম্পূর্ণ স্টাইলিং (থিম, অ্যানিমেশন, রেস্পন্সিভ)
├── script.js           # গেম লজিক (মডিউলার, কমেন্টসহ)
├── README.md           # প্রজেক্ট ডকুমেন্টেশন
│
└── assets/
    ├── sounds/         # (ঐচ্ছিক) কাস্টম সাউন্ড ফাইল রাখার স্থান
    ├── images/         # (ঐচ্ছিক) OG ব্যানার / স্ক্রিনশট
    └── icons/          # ফেভিকন ও অন্যান্য আইকন
```

---

## 🔮 Future Improvements

- 🌐 Multiplayer Mode (একই ডিভাইসে বা অনলাইনে দুই খেলোয়াড়)
- ☁️ Cloud Sync (Account ভিত্তিক Leaderboard)
- 🖼️ কাস্টম ছবি আপলোড করে নিজের থিম বানানোর সুবিধা
- 📱 PWA (Progressive Web App) সাপোর্ট — অফলাইন ইন্সটলযোগ্য
- 🌍 Multi-language Support (English/Bangla টগল)
- 🎵 Custom Background Music ফাইল আপলোড সাপোর্ট
- 🏅 গ্লোবাল লিডারবোর্ড (Backend ইন্টিগ্রেশনের মাধ্যমে)

---

## 📜 License

এই প্রজেক্টটি **MIT License**-এর অধীনে লাইসেন্সকৃত। তুমি স্বাধীনভাবে এটি ব্যবহার, পরিবর্তন এবং বিতরণ করতে পারো।

```
MIT License

Copyright (c) 2026 Memory Master

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<p align="center">তোমার স্মৃতিশক্তি যাচাই করো — খেলো, শেখো, জিতো! 🧠✨</p>
