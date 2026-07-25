# 🌸 Woxsen Japanese Club (WJC) App

> **Premium Japanese Learning Suite** for students and instructors at Woxsen University. Features interactive pitch accent shadowing, stroke-order drawing, AI roleplay, and cloud-backed study resource management.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.0+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![AWS S3](https://img.shields.io/badge/AWS%20S3-Cloud%20Storage-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)

---

## ✨ Features Overview

### 🎙️ 1. Pitch Accent & Visual Shadowing Coach
- **SVG Pitch Step Contours**: Syllable-by-syllable High (高) vs Low (低) pitch accent line graphs.
- **Pitch Drop Markers (🔴 アクセント核)**: Clear visual indicators highlighting pitch falls (*Heiban*, *Atamadaka*, *Nakadaka*, *Odaka*).
- **Real-Time Web Audio Waveform**: Oscilloscope spectrum canvas using `AudioContext` & `AnalyserNode` to visualize live voice input.
- **Multi-Speed Audio Shadowing**: Play native Japanese audio at `0.75x Slow` or `1.0x Normal` speeds.

### ☁️ 2. AWS S3 Cloud Storage & Resource Manager
- **Upload API Endpoint**: `/api/upload` supporting direct file uploads and presigned S3 URLs.
- **Automatic Local Fallback**: Operates in Local Storage Mode if S3 keys are not present in `.env.local`.
- **Faculty Dashboard**: Instructors can upload study guides, PDFs, and vocabulary decks with live storage status badges.

### 📊 3. Adaptive Multi-Role Dashboards
- **Zen Study Mode**: Minimalist, peaceful study workspace.
- **Cyber-Zen Mode**: Futuristic interface with dark/light themes, streak counters, and JLPT countdowns.
- **Woxsen Student Dashboard**: Course progress, schedule notifications, and shared files.
- **Faculty Admin Dashboard**: Class roster management and daily student attendance tracking.

### 🔤 4. Kana Trainer & Kanji Writing Board
- **Kana Grid**: Complete Hiragana and Katakana tables with native audio.
- **Stroke Drawing Canvas**: Interactive handwriting board with stroke order guides.
- **Kanji Radical Explorer**: Visual decomposition of complex Kanji into foundational radicals.

### 💬 5. Kaiwa AI Conversation Simulator
- **Interactive Roleplay**: AI-assisted Japanese chat scenarios (ordering ramen, Shinjuku train station, hotel check-in).
- **Text-to-Speech**: Speech synthesis audio reader for all conversational outputs.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with curated HSL color tokens (Zen & Cyber-Zen themes)
- **Audio & Media**: Web Audio API, SpeechSynthesis API, Web Speech API
- **Cloud Services**: AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Praveena-Kiran/WJC_app.git

# Navigate into the directory
cd WJC_app

# Install dependencies
npm install
```

### 3. Environment Setup (Optional for AWS S3)
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Add your AWS S3 bucket credentials:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
```
*(Note: If left blank, the app will run in Local Storage Fallback Mode).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
