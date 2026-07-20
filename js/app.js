// Zengo Japanese Language Learning Suite - Central App Controller
import { lessons, kanaData, dictionary, kanjiData, conjugateVerb, kanaStrokes } from './data.js';
import { soundSynth } from './sound.js';
import { TracingCanvas } from './canvas.js';

class AppController {
  constructor() {
    // 1. Initial State Definition
    this.state = {
      activeView: "dashboard",
      studyMode: "zen", // "zen" or "cyber"
      cyberTheme: "dark", // "dark" or "light"
      userRole: "external", // "external", "woxsen-student", or "teacher"
      activeStudentName: "Sneha Reddy", // For Woxsen Student portal view
      solvedLessons: [1], // IDs of lessons that have been marked completed
      activeLessonId: 1, // Currently selected lesson in Zen timeline
      masteredKana: [], // IDs of mastered kana (e.g. "h-a", "k-ki")
      starredVocab: [], // List of bookmarked vocabulary words (strings)
      practicedKanji: [], // List of kanji characters practiced
      streakCount: 3, // Daily study streak count
      
      // Attendance database (Initial Mock Data)
      attendanceDb: {
        "2026-07-10": { "Sneha Reddy": "present", "Rohan Sharma": "present", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" },
        "2026-07-12": { "Sneha Reddy": "present", "Rohan Sharma": "absent", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" },
        "2026-07-13": { "Sneha Reddy": "present", "Rohan Sharma": "present", "Arjun Verma": "absent", "Pooja Patel": "present", "Vince Carter": "present" },
        "2026-07-14": { "Sneha Reddy": "absent", "Rohan Sharma": "present", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" },
        "2026-07-15": { "Sneha Reddy": "present", "Rohan Sharma": "present", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" }
      },
      
      // Teacher uploaded files (Initial Mock Data)
      uploadedFiles: [
        { name: "Minna-No-Nihongo-I-Grammar-Notes.pdf", size: "1.4 MB", date: "2026-07-14" },
        { name: "Basic-Kanji-Book-Chapter1-Exercises.pdf", size: "850 KB", date: "2026-07-17" }
      ],

      quizState: {
        deck: "hiragana",
        length: 10,
        currentQuestionIndex: 0,
        score: 0,
        questions: []
      }
    };

    this.canvasController = null;
    this.selectedKanji = null;
    this.activeModalKana = null;
    this.timelineObserver = null;
    
    // Active dictionary category chip filter
    this.activeDictCategory = "all";

    // Load from LocalStorage if available
    this.loadState();
  }

  // Initialize all DOM bindings
  init() {
    this.applyTheme();
    this.setupNavigation();
    this.setupThemeToggles();
    this.setupLazySoundBanner();
    this.setupLessonDetails();
    this.setupKanaTrainer();
    this.setupDictionaryAndConjugator();
    this.setupKanjiBoard();
    this.setupQuiz();
    this.setupMobileMenu();
    
    // Role portals setup
    this.setupRoleManagement();
    this.setupTeacherPortal();
    this.setupSpeechSynthesis();

    // Initial renders
    this.render();

    // 2. Setup ResizeObserver on the Pebbles Container
    // This resolves the zero-height or truncated timeline connecting line bugs automatically when resizing/switching tabs!
    const pebblesContainer = document.getElementById("pebbles-container");
    if (pebblesContainer && 'ResizeObserver' in window) {
      this.timelineObserver = new ResizeObserver(() => {
        if (this.state.activeView === "dashboard" && this.state.studyMode === "zen" && this.state.userRole === "external") {
          this.drawPebbleLines();
        }
      });
      this.timelineObserver.observe(pebblesContainer);
    }
  }

  // ==========================================
  // STATE & STORAGE METHODS
  // ==========================================
  loadState() {
    const saved = localStorage.getItem("zengo_app_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.error("Error parsing saved state:", e);
      }
    }
  }

  saveState() {
    localStorage.setItem("zengo_app_state", JSON.stringify(this.state));
    this.updateStatsDisplay();
  }

  // ==========================================
  // SPEECH SYNTHESIS ENGINE (TEXT TO SPEECH)
  // ==========================================
  setupSpeechSynthesis() {
    // Pre-warm voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
      }
    }

    // Attach delegated click listener to vocabulary speak buttons inside dictionary search
    const vocabContainer = document.getElementById("dictionary-words-container");
    if (vocabContainer) {
      vocabContainer.addEventListener("click", (e) => {
        const speakBtn = e.target.closest(".speak-btn");
        if (speakBtn) {
          e.stopPropagation();
          const text = speakBtn.dataset.text;
          this.speakJapanese(text);
        }
      });
    }

    // Modal vocab speak button
    const modalVocabSpeak = document.getElementById("btn-speak-vocab");
    if (modalVocabSpeak) {
      modalVocabSpeak.addEventListener("click", () => {
        if (this.activeModalKana && this.activeModalKana.kana.vocab) {
          // Extract the Japanese characters from "朝 (あさ)" format
          const raw = this.activeModalKana.kana.vocab.split(" ")[0];
          this.speakJapanese(raw);
        }
      });
    }

    // Modal main character speak button
    const modalKanaSpeak = document.getElementById("btn-speak-kana");
    if (modalKanaSpeak) {
      modalKanaSpeak.addEventListener("click", () => {
        if (this.activeModalKana) {
          this.speakJapanese(this.activeModalKana.kana.char);
        }
      });
    }

    // Kanji detail block speak button
    const kanjiSpeakBtn = document.getElementById("btn-speak-kanji");
    if (kanjiSpeakBtn) {
      kanjiSpeakBtn.addEventListener("click", () => {
        if (this.selectedKanji) {
          this.speakJapanese(this.selectedKanji.char);
        }
      });
    }
  }

  speakJapanese(text) {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis is not supported in this browser.");
      return;
    }

    // Cancel any active utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    
    // Find Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang.includes('jp'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    
    // Set deliberate slow rate for learning pronunciation
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }

  // ==========================================
  // DESIGN SYSTEM & PORTALS MANAGEMENT
  // ==========================================
  setupRoleManagement() {
    const roleSelect = document.getElementById("user-role-select");
    
    // Sync initial select value from state
    roleSelect.value = this.state.userRole;

    roleSelect.addEventListener("change", (e) => {
      soundSynth.playSuccess();
      this.state.userRole = e.target.value;
      
      // Auto routing based on active portal view constraints
      this.state.activeView = "dashboard"; 
      
      this.applyRoleNavigationVisibility();
      this.saveState();
      this.render();
    });

    this.applyRoleNavigationVisibility();
  }

  applyRoleNavigationVisibility() {
    const navTrainer = document.getElementById("nav-kana-trainer");
    const navQuiz = document.getElementById("nav-kana-quiz");
    const navKanji = document.getElementById("nav-kanji-board");

    // Hide learning game tabs and Kanji Board from teachers to keep portal focused
    if (this.state.userRole === "teacher") {
      if (navTrainer) navTrainer.style.display = "none";
      if (navQuiz) navQuiz.style.display = "none";
      if (navKanji) navKanji.style.display = "none";
    } else {
      if (navTrainer) navTrainer.style.display = "flex";
      if (navQuiz) navQuiz.style.display = "flex";
      if (navKanji) navKanji.style.display = "flex";
    }
  }

  applyTheme() {
    const body = document.body;
    body.classList.remove("theme-zen", "theme-cyber-dark", "theme-cyber-light");

    if (this.state.studyMode === "zen") {
      body.classList.add("theme-zen");
      document.getElementById("cyber-theme-row").style.display = "none";
    } else {
      document.getElementById("cyber-theme-row").style.display = "block";
      if (this.state.cyberTheme === "dark") {
        body.classList.add("theme-cyber-dark");
      } else {
        body.classList.add("theme-cyber-light");
      }
    }

    // Refresh canvas colors if canvas initialized
    if (this.canvasController) {
      this.populateCanvasPalette();
    }
  }

  setupThemeToggles() {
    const studyToggle = document.getElementById("study-mode-toggle");
    studyToggle.addEventListener("click", (e) => {
      const modeBtn = e.target.closest(".toggle-opt");
      if (!modeBtn) return;

      soundSynth.playClick();
      studyToggle.querySelectorAll(".toggle-opt").forEach(btn => btn.classList.remove("active"));
      modeBtn.classList.add("active");

      this.state.studyMode = modeBtn.dataset.mode;
      this.applyTheme();
      this.saveState();
      this.render();
    });

    const cyberToggle = document.getElementById("cyber-theme-toggle");
    cyberToggle.addEventListener("click", (e) => {
      const themeBtn = e.target.closest(".toggle-opt");
      if (!themeBtn) return;

      soundSynth.playClick();
      cyberToggle.querySelectorAll(".toggle-opt").forEach(btn => btn.classList.remove("active"));
      themeBtn.classList.add("active");

      this.state.cyberTheme = themeBtn.dataset.theme;
      this.applyTheme();
      this.saveState();
    });

    // Set initial toggle button states based on loaded state
    studyToggle.querySelectorAll(".toggle-opt").forEach(btn => {
      if (btn.dataset.mode === this.state.studyMode) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    cyberToggle.querySelectorAll(".toggle-opt").forEach(btn => {
      if (btn.dataset.theme === this.state.cyberTheme) btn.classList.add("active");
      else btn.classList.remove("active");
    });
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const viewName = item.dataset.view;
        this.switchView(viewName);
        
        // On mobile, close sidebar automatically on item click
        document.getElementById("sidebar").classList.remove("open");
      });
    });

    // Handle Quick Action shortcuts inside Cyber Dashboard
    document.querySelectorAll("[data-go-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchView(btn.dataset.goView);
      });
    });
  }

  setupMobileMenu() {
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    const sidebar = document.getElementById("sidebar");

    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      soundSynth.playClick();
      sidebar.classList.toggle("open");
    });

    // Close sidebar on document clicks
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== mobileToggle) {
        sidebar.classList.remove("open");
      }
    });
  }

  switchView(viewName) {
    if (viewName === this.state.activeView) return;

    soundSynth.playClick();
    this.state.activeView = viewName;
    this.saveState();

    // Update active nav button
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    this.render();
  }

  setupLazySoundBanner() {
    const banner = document.getElementById("sound-permission-banner");
    banner.addEventListener("click", () => {
      soundSynth.init().then(success => {
        if (success) {
          banner.classList.add("hidden");
          document.body.classList.remove("has-banner");
          soundSynth.playSuccess();
        }
      });
    });
  }

  // ==========================================
  // VIEW RENDER ROUTING
  // ==========================================
  render() {
    // Hide all view panels
    document.querySelectorAll(".view-section").forEach(view => {
      view.classList.remove("active");
    });

    // Specific rendering handlers based on view and user role portals
    if (this.state.activeView === "dashboard") {
      // 1. TEACHER INSTRUCTOR ROLE
      if (this.state.userRole === "teacher") {
        document.getElementById("teacher-dashboard-view").classList.add("active");
        this.renderTeacherDashboard();
      }
      // 2. WOXSEN CENTRE STUDENT ROLE
      else if (this.state.userRole === "woxsen-student") {
        document.getElementById("woxsen-student-dashboard-view").classList.add("active");
        this.renderWoxsenStudentDashboard();
      }
      // 3. EXTERNAL STUDENT ROLE (CORE ZENGO)
      else {
        if (this.state.studyMode === "zen") {
          document.getElementById("zen-dashboard-view").classList.add("active");
          this.renderZenDashboard();
        } else {
          document.getElementById("cyber-zen-dashboard-view").classList.add("active");
          this.renderCyberDashboard();
        }
      }
    } else if (this.state.activeView === "kana-trainer") {
      document.getElementById("kana-trainer-view").classList.add("active");
      this.renderKanaTrainer();
    } else if (this.state.activeView === "dictionary") {
      document.getElementById("dictionary-view").classList.add("active");
      this.renderDictionary();
    } else if (this.state.activeView === "kanji-board") {
      document.getElementById("kanji-board-view").classList.add("active");
      this.renderKanjiBoard();
    } else if (this.state.activeView === "quiz") {
      document.getElementById("quiz-view").classList.add("active");
      this.resetQuizLobby();
    }
  }

  // ==========================================
  // MODULE A: ZEN MODE DASHBOARD (EXTERNAL)
  // ==========================================
  renderZenDashboard() {
    const container = document.getElementById("pebbles-container");
    container.innerHTML = "";

    lessons.forEach((lesson) => {
      const pebble = document.createElement("button");
      pebble.className = "pebble-node";
      pebble.dataset.id = lesson.id;
      pebble.innerText = lesson.id;

      // Determine state
      const isSolved = this.state.solvedLessons.includes(lesson.id);
      const isUnlocked = lesson.id === 1 || this.state.solvedLessons.includes(lesson.id - 1);

      if (isSolved) {
        pebble.classList.add("solved");
        // Add checkmark badge
        pebble.innerHTML = `${lesson.id}<div class="solved-checkmark"><i class="fa-solid fa-check"></i></div>`;
      } else if (isUnlocked) {
        pebble.classList.add("unlocked");
      } else {
        pebble.classList.add("locked");
      }

      if (this.state.activeLessonId === lesson.id) {
        pebble.classList.add("active");
      }

      pebble.addEventListener("click", () => {
        if (isUnlocked || isSolved) {
          soundSynth.playClick();
          this.state.activeLessonId = lesson.id;
          this.renderZenDashboard(); // update selection border
          this.updateLessonDetailsCard(lesson);
        } else {
          soundSynth.playIncorrect();
        }
      });

      container.appendChild(pebble);
    });

    // Draw lines after elements exist in DOM
    setTimeout(() => this.drawPebbleLines(), 50);

    // Render Bonsai Garden
    this.renderBonsaiTree();
    this.updateStatsDisplay();
  }

  drawPebbleLines() {
    const container = document.getElementById("pebbles-container");
    const wrapper = document.querySelector(".pebble-timeline-wrapper");
    const svg = document.getElementById("pebble-timeline-svg");
    if (!container || !wrapper || !svg) return;

    svg.innerHTML = "";

    const pebbles = container.querySelectorAll(".pebble-node");
    if (pebbles.length < 2) return;

    // Get actual dimensions of the SVG element on screen to set 1:1 scale bounds
    const svgRect = svg.getBoundingClientRect();
    svg.setAttribute("width", svgRect.width);
    svg.setAttribute("height", svgRect.height);

    let pathData = "";
    const points = [];

    pebbles.forEach((pebble) => {
      const pebbleRect = pebble.getBoundingClientRect();
      const x = pebbleRect.left - svgRect.left + pebbleRect.width / 2;
      const y = pebbleRect.top - svgRect.top + pebbleRect.height / 2;
      points.push({ x, y });
    });

    // Generate smooth curvy path
    pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x;
      const cpY1 = p0.y + (p1.y - p0.y) / 2;
      const cpX2 = p1.x;
      const cpY2 = p0.y + (p1.y - p0.y) / 2;
      pathData += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--accent-secondary)");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-dasharray", "8, 8");
    svg.appendChild(path);
  }

  setupLessonDetails() {
    const startBtn = document.getElementById("active-lesson-start-btn");
    startBtn.addEventListener("click", () => {
      const id = this.state.activeLessonId;
      const lesson = lessons.find(l => l.id === id);
      if (!lesson) return;

      soundSynth.playSuccess();
      
      // Complete lesson - push to solved lessons if not exists
      if (!this.state.solvedLessons.includes(id)) {
        this.state.solvedLessons.push(id);
        
        // Auto unlock next lesson if exists
        const nextId = id + 1;
        if (lessons.some(l => l.id === nextId)) {
          this.state.activeLessonId = nextId;
        }
        
        // Increment streak count on lesson completion
        this.state.streakCount += 1;
      }

      this.saveState();
      this.renderZenDashboard();
      this.updateLessonDetailsCard(lessons.find(l => l.id === this.state.activeLessonId) || lesson);
    });

    // Populate with first lesson details initially
    this.updateLessonDetailsCard(lessons[0]);
  }

  updateLessonDetailsCard(lesson) {
    document.getElementById("active-lesson-title").innerText = `L${lesson.id}: ${lesson.japaneseTitle}`;
    document.getElementById("active-lesson-desc").innerText = lesson.description;

    const syllabusList = document.getElementById("active-lesson-syllabus");
    syllabusList.innerHTML = "";
    lesson.syllabus.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      syllabusList.appendChild(li);
    });

    const startBtn = document.getElementById("active-lesson-start-btn");
    startBtn.style.display = "block";

    // Update start button text depending on completion
    if (this.state.solvedLessons.includes(lesson.id)) {
      startBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Lesson Completed`;
      startBtn.style.backgroundColor = "var(--accent-secondary)";
    } else {
      startBtn.innerHTML = `Complete Lesson & Grow Bonsai`;
      startBtn.style.backgroundColor = "var(--accent)";
    }
  }

  renderBonsaiTree() {
    const solvedCount = this.state.solvedLessons.length;
    const bonsaiParts = [
      // Twigs & Leaves corresponding to completed lessons count
      { d: "M90,140 Q60,110 50,115", type: "branch", w: 5, cx: 50, cy: 115, r: 8 },
      { d: "M108,125 Q135,100 148,105", type: "branch", w: 5, cx: 148, cy: 105, r: 8 },
      { d: "M92,100 Q65,80 52,85", type: "branch", w: 4, cx: 52, cy: 85, r: 9 },
      { d: "M105,95 Q125,70 138,72", type: "branch", w: 4, cx: 138, cy: 72, r: 9 },
      { d: "M96,75 Q78,55 72,58", type: "branch", w: 3, cx: 72, cy: 58, r: 10 },
      { d: "M103,68 Q125,48 130,50", type: "branch", w: 3, cx: 130, cy: 50, r: 10 },
      { d: "M99,50 Q85,30 80,32", type: "branch", w: 2, cx: 80, cy: 32, r: 11 },
      { d: "M102,40 Q118,25 120,28", type: "branch", w: 2, cx: 120, cy: 28, r: 11 },
      // Blossoms / Golden flowers for final levels
      { type: "blossom", cx: 100, cy: 40, r: 7 },
      { type: "blossom", cx: 72, cy: 58, r: 6 }
    ];

    const group = document.getElementById("bonsai-dynamic-grow");
    group.innerHTML = "";

    // Draw tree assets sequentially based on completed lessons count
    for (let i = 0; i < Math.min(solvedCount, bonsaiParts.length); i++) {
      const part = bonsaiParts[i];
      if (part.type === "branch") {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", part.d);
        path.setAttribute("stroke", "var(--bonsai-trunk)");
        path.setAttribute("stroke-width", part.w);
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("fill", "none");
        group.appendChild(path);

        const leaf = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        leaf.setAttribute("cx", part.cx);
        leaf.setAttribute("cy", part.cy);
        leaf.setAttribute("r", part.r);
        leaf.setAttribute("fill", "var(--bonsai-leaf)");
        group.appendChild(leaf);
      } else if (part.type === "blossom") {
        const blossom = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        blossom.setAttribute("cx", part.cx);
        blossom.setAttribute("cy", part.cy);
        blossom.setAttribute("r", part.r);
        blossom.setAttribute("fill", "var(--accent-secondary)");
        group.appendChild(blossom);
      }
    }

    // Set text labels
    const pct = Math.round((solvedCount / lessons.length) * 100);
    document.getElementById("bonsai-label").innerText = `Gardening Level: ${solvedCount}/10`;
    document.getElementById("bonsai-sub").innerText = `Your Bonsai tree is ${pct}% mature. Complete lessons to nourish it.`;
  }

  // ==========================================
  // MODULE A: CYBER-ZEN DASHBOARD (EXTERNAL)
  // ==========================================
  renderCyberDashboard() {
    this.updateStatsDisplay();
    this.renderStarredVocabularyGrid();
  }

  updateStatsDisplay() {
    // Kana Mastery calculation
    const masteryPct = Math.round((this.state.masteredKana.length / 92) * 100);
    const kanaVal = document.getElementById("stats-kana-mastery");
    if (kanaVal) kanaVal.innerText = `${masteryPct}%`;

    // Kanji ratio
    const kanjiRead = document.getElementById("stats-kanji-read");
    if (kanjiRead) kanjiRead.innerText = `${this.state.practicedKanji.length}/${kanjiData.length}`;

    // Bookmark count
    const starCount = document.getElementById("stats-bookmarks");
    if (starCount) starCount.innerText = this.state.starredVocab.length;

    // Streak flame count
    const streakText = document.getElementById("streak-count-display");
    if (streakText) streakText.innerText = `${this.state.streakCount} Days Streak`;
  }

  renderStarredVocabularyGrid() {
    const grid = document.getElementById("starred-vocab-grid");
    const noMsg = document.getElementById("no-starred-vocab-msg");
    if (!grid) return;

    grid.innerHTML = "";

    if (this.state.starredVocab.length === 0) {
      noMsg.style.display = "block";
      return;
    }

    noMsg.style.display = "none";

    const starredItems = dictionary.filter(item => this.state.starredVocab.includes(item.word));

    starredItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "vocab-item";
      card.innerHTML = `
        <div class="vocab-details">
          <div class="vocab-jp-row">
            <span class="vocab-kanji">${item.word}</span>
            <span class="vocab-reading">(${item.reading})</span>
            <i class="fa-solid fa-volume-high speak-btn" data-text="${item.word}" style="margin-left: 8px; font-size: 0.95rem;"></i>
          </div>
          <div class="vocab-english">${item.english}</div>
        </div>
        <div class="vocab-meta">
          <span class="vocab-tag">${item.tag}</span>
          <i class="fa-solid fa-star bookmark-star starred" data-word="${item.word}"></i>
        </div>
      `;

      card.querySelector(".bookmark-star").addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleStar(item.word);
        this.renderStarredVocabularyGrid();
      });

      grid.appendChild(card);
    });
  }

  toggleStar(word) {
    soundSynth.playClick();
    const index = this.state.starredVocab.indexOf(word);
    if (index > -1) {
      this.state.starredVocab.splice(index, 1);
    } else {
      this.state.starredVocab.push(word);
    }
    this.saveState();
  }

  // ==========================================
  // PORTAL: WOXSEN STUDENT INTERFACE
  // ==========================================
  renderWoxsenStudentDashboard() {
    const student = this.state.activeStudentName;
    
    // 1. Calculate Attendance Percentage
    const dates = Object.keys(this.state.attendanceDb);
    let attended = 0;
    let classesMarked = 0;

    dates.forEach(d => {
      const dayRecord = this.state.attendanceDb[d];
      if (dayRecord && dayRecord[student]) {
        classesMarked += 1;
        if (dayRecord[student] === "present") {
          attended += 1;
        }
      }
    });

    const attendancePct = classesMarked > 0 ? Math.round((attended / classesMarked) * 100) : 100;
    document.getElementById("woxsen-attendance-pct").innerText = `${attendancePct}%`;
    document.getElementById("woxsen-attendance-ratio").innerText = `${attended}/${classesMarked}`;
    document.getElementById("woxsen-documents-count").innerText = this.state.uploadedFiles.length;

    // 2. Render Visual Attendance Calendar
    const calendar = document.getElementById("woxsen-attendance-calendar");
    calendar.innerHTML = "";

    // Load dates or generate last 10 days calendar grid
    dates.sort().slice(-10).forEach(d => {
      const status = this.state.attendanceDb[d][student];
      const card = document.createElement("div");
      card.className = `calendar-day-card ${status === "present" ? 'present' : 'absent'}`;
      
      const dayLabel = d.split("-")[2]; // date day
      const monthLabel = new Date(d).toLocaleString('en-US', { month: 'short' });

      card.innerHTML = `
        <span>${dayLabel}</span>
        <span class="calendar-day-month">${monthLabel}</span>
      `;
      calendar.appendChild(card);
    });

    // Append some future mock calendar cells
    for (let i = 1; i <= 3; i++) {
      const card = document.createElement("div");
      card.className = "calendar-day-card future";
      card.innerHTML = `
        <span>+${i}</span>
        <span class="calendar-day-month">Class</span>
      `;
      calendar.appendChild(card);
    }

    // 3. Render Classroom Files downloads
    const filesContainer = document.getElementById("woxsen-student-files-container");
    const noFilesMsg = document.getElementById("no-woxsen-files-msg");
    filesContainer.innerHTML = "";

    if (this.state.uploadedFiles.length === 0) {
      noFilesMsg.style.display = "block";
      return;
    }

    noFilesMsg.style.display = "none";

    this.state.uploadedFiles.forEach(file => {
      const card = document.createElement("div");
      card.className = "file-item-card";
      card.innerHTML = `
        <div class="file-meta-info">
          <span class="file-name-text">${file.name}</span>
          <span class="file-size-text">Size: ${file.size} | Uploaded: ${file.date}</span>
        </div>
        <button class="btn-utility" style="padding: 8px 14px; font-size: 0.85rem;" data-action="download">
          <i class="fa-solid fa-circle-down"></i> Download
        </button>
      `;

      card.querySelector("[data-action='download']").addEventListener("click", () => {
        soundSynth.playSuccess();
        alert(`Successfully downloading Woxsen classroom resource: ${file.name}`);
      });

      filesContainer.appendChild(card);
    });
  }

  // ==========================================
  // PORTAL: WOXSEN TEACHER/INSTRUCTOR INTERFACE
  // ==========================================
  setupTeacherPortal() {
    // 1. Set current date default inside attendance marker
    const dateInput = document.getElementById("teacher-attendance-date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;

    // Load roster checklist when changing date
    dateInput.addEventListener("change", () => {
      this.renderTeacherRosterChecklist();
    });

    // Save Attendance click
    document.getElementById("btn-save-attendance").addEventListener("click", () => {
      this.saveTeacherAttendanceRecord();
    });

    // Setup Mock File Upload drag & drop
    const dragZone = document.getElementById("teacher-drag-zone");
    const fileInput = document.getElementById("teacher-file-input");

    dragZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) this.handleMockFileUpload(file);
    });

    // Drag-over styling cues
    dragZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dragZone.style.borderColor = "var(--accent)";
      dragZone.style.backgroundColor = "var(--panel-active)";
    });

    dragZone.addEventListener("dragleave", () => {
      dragZone.style.borderColor = "var(--card-border)";
      dragZone.style.backgroundColor = "transparent";
    });

    dragZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dragZone.style.borderColor = "var(--card-border)";
      const file = e.dataTransfer.files[0];
      if (file) this.handleMockFileUpload(file);
    });
  }

  renderTeacherDashboard() {
    // Average Attendance Calculation across all class entries
    const dates = Object.keys(this.state.attendanceDb);
    let totalRosterSize = 5;
    let presentTicks = 0;
    let markedTicks = 0;

    dates.forEach(d => {
      const records = this.state.attendanceDb[d];
      Object.keys(records).forEach(student => {
        markedTicks += 1;
        if (records[student] === "present") {
          presentTicks += 1;
        }
      });
    });

    const avgAttendance = markedTicks > 0 ? Math.round((presentTicks / markedTicks) * 100) : 100;
    document.getElementById("teacher-avg-attendance").innerText = `${avgAttendance}%`;
    document.getElementById("teacher-files-count").innerText = this.state.uploadedFiles.length;

    // Render components
    this.renderTeacherRosterChecklist();
    this.renderTeacherFilesList();
  }

  renderTeacherRosterChecklist() {
    const container = document.getElementById("teacher-roster-container");
    container.innerHTML = "";

    const selectedDate = document.getElementById("teacher-attendance-date").value;
    const roster = ["Sneha Reddy", "Rohan Sharma", "Arjun Verma", "Pooja Patel", "Vince Carter"];

    // Find existing date records or default to present
    const dailyRecord = this.state.attendanceDb[selectedDate] || {};

    roster.forEach(student => {
      const currentStatus = dailyRecord[student] || "present";
      const item = document.createElement("div");
      item.className = "roster-checklist-item";

      item.innerHTML = `
        <span class="roster-student-name">${student}</span>
        <div class="attendance-toggle" data-student="${student}">
          <button class="attendance-toggle-btn present ${currentStatus === 'present' ? 'active' : ''}" data-status="present">Present</button>
          <button class="attendance-toggle-btn absent ${currentStatus === 'absent' ? 'active' : ''}" data-status="absent">Absent</button>
        </div>
      `;

      // Toggle state buttons
      const toggle = item.querySelector(".attendance-toggle");
      toggle.addEventListener("click", (e) => {
        const btn = e.target.closest(".attendance-toggle-btn");
        if (!btn) return;
        soundSynth.playClick();
        
        toggle.querySelectorAll(".attendance-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });

      container.appendChild(item);
    });
  }

  saveTeacherAttendanceRecord() {
    const date = document.getElementById("teacher-attendance-date").value;
    if (!date) {
      alert("Please select a valid date.");
      return;
    }

    const records = {};
    const toggles = document.querySelectorAll("#teacher-roster-container .attendance-toggle");
    
    toggles.forEach(toggle => {
      const student = toggle.dataset.student;
      const activeBtn = toggle.querySelector(".attendance-toggle-btn.active");
      records[student] = activeBtn ? activeBtn.dataset.status : "present";
    });

    this.state.attendanceDb[date] = records;
    soundSynth.playSuccess();
    
    this.saveState();
    this.renderTeacherDashboard();
    
    alert(`Attendance successfully marked and saved for ${date}`);
  }

  handleMockFileUpload(file) {
    soundSynth.playSuccess();
    
    const today = new Date().toISOString().split("T")[0];
    
    // Add file metadata
    const sizeKB = Math.round(file.size / 1024);
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    const newFile = {
      name: file.name,
      size: sizeStr,
      date: today
    };

    this.state.uploadedFiles.push(newFile);
    this.saveState();
    this.renderTeacherDashboard();

    alert(`Faculty upload successful: ${file.name} is now shared with WJC students.`);
  }

  renderTeacherFilesList() {
    const container = document.getElementById("teacher-files-list-container");
    container.innerHTML = "";

    this.state.uploadedFiles.forEach((file, idx) => {
      const card = document.createElement("div");
      card.className = "file-item-card";
      card.innerHTML = `
        <div class="file-meta-info">
          <span class="file-name-text">${file.name}</span>
          <span class="file-size-text">Size: ${file.size} | Uploaded: ${file.date}</span>
        </div>
        <button class="btn-utility" style="padding: 8px; color: var(--accent-secondary); border-color: rgba(255, 117, 151, 0.25);" data-action="delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      card.querySelector("[data-action='delete']").addEventListener("click", () => {
        soundSynth.playIncorrect();
        this.state.uploadedFiles.splice(idx, 1);
        this.saveState();
        this.renderTeacherDashboard();
      });

      container.appendChild(card);
    });
  }

  // ==========================================
  // MODULE B: KANA TRAINER
  // ==========================================
  setupKanaTrainer() {
    const typeSelect = document.getElementById("kana-type-select");
    typeSelect.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-tab");
      if (!btn) return;

      soundSynth.playClick();
      typeSelect.querySelectorAll(".btn-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      this.renderKanaTrainer();
    });

    const romajiToggle = document.getElementById("toggle-romaji");
    romajiToggle.addEventListener("change", () => {
      soundSynth.playClick();
      const romajiLabels = document.querySelectorAll(".kana-romaji");
      romajiLabels.forEach(label => {
        if (romajiToggle.checked) {
          label.classList.remove("hidden");
        } else {
          label.classList.add("hidden");
        }
      });
    });

    // Close Modal event
    document.getElementById("btn-close-modal").addEventListener("click", () => {
      soundSynth.playClick();
      document.getElementById("kana-detail-modal").classList.remove("active");
    });

    // Modal navigation
    document.getElementById("btn-modal-prev").addEventListener("click", () => this.navigateModal(-1));
    document.getElementById("btn-modal-next").addEventListener("click", () => this.navigateModal(1));

    // Modal Animate Stroke Path
    document.getElementById("btn-modal-animate").addEventListener("click", () => {
      this.animateKanaStrokes();
    });

    // Modal Mastery Toggle
    const masteryCheckbox = document.getElementById("modal-mastery-checkbox");
    masteryCheckbox.addEventListener("change", () => {
      if (!this.activeModalKana) return;

      soundSynth.playCorrect();
      const id = this.activeModalKana.id;
      const index = this.state.masteredKana.indexOf(id);

      if (masteryCheckbox.checked) {
        if (index === -1) this.state.masteredKana.push(id);
      } else {
        if (index > -1) this.state.masteredKana.splice(index, 1);
      }

      this.saveState();
      this.renderKanaTrainer();
    });
  }

  renderKanaTrainer() {
    const container = document.getElementById("kanas-grid-container");
    if (!container) return;

    container.innerHTML = "";

    // Find active type selection
    const activeTab = document.querySelector("#kana-type-select .btn-tab.active");
    const selectedType = activeTab ? activeTab.dataset.type : "hiragana";
    const filteredKanas = kanaData.filter(item => item.type === selectedType);
    const showRomaji = document.getElementById("toggle-romaji").checked;

    filteredKanas.forEach((kana, idx) => {
      const card = document.createElement("div");
      card.className = "kana-card";
      if (this.state.masteredKana.includes(kana.id)) {
        card.classList.add("mastered");
      }

      card.innerHTML = `
        <span class="kana-char">${kana.char}</span>
        <span class="kana-romaji ${showRomaji ? '' : 'hidden'}">${kana.romaji}</span>
        <div class="kana-badge-mastered"></div>
      `;

      card.addEventListener("click", () => {
        soundSynth.playClick();
        this.openKanaDetailModal(kana, filteredKanas, idx);
      });

      container.appendChild(card);
    });
  }

  openKanaDetailModal(kana, list, index) {
    this.activeModalKana = { id: kana.id, kana, list, index };
    const modal = document.getElementById("kana-detail-modal");

    document.getElementById("modal-char-display").innerText = kana.char;
    document.getElementById("modal-romaji-display").innerText = `Romaji: ${kana.romaji}`;
    
    // Set type label
    const typeLabel = document.getElementById("modal-kana-type");
    typeLabel.innerText = kana.type === "hiragana" ? "Hiragana" : "Katakana";
    typeLabel.style.backgroundColor = kana.type === "hiragana" ? "var(--accent)" : "var(--accent-secondary)";
    
    // Pronunciation notes
    const desc = document.getElementById("modal-desc-pronunciation");
    desc.innerText = kana.notes || `The standard Japanese phoneme sound '${kana.romaji}'. Part of the primary phonetic syllabus mapping.`;

    // Practical vocab example
    document.getElementById("modal-vocab-japanese").innerText = kana.vocab || "-";
    document.getElementById("modal-vocab-english").innerText = kana.translation || "";

    // Mastery checkbox
    const masteryCheckbox = document.getElementById("modal-mastery-checkbox");
    masteryCheckbox.checked = this.state.masteredKana.includes(kana.id);

    // Initial strokes setup
    this.setupKanaStrokesGuide(kana.char);

    modal.classList.add("active");
  }

  setupKanaStrokesGuide(char) {
    const svg = document.getElementById("modal-kana-guide-svg");
    if (!svg) return;

    svg.innerHTML = "";
    svg.classList.remove("animating");

    const paths = kanaStrokes[char];
    const charDisplay = document.getElementById("modal-char-display");

    if (paths) {
      if (charDisplay) charDisplay.style.display = "none";
      paths.forEach(d => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.appendChild(path);
      });
    } else {
      if (charDisplay) charDisplay.style.display = "block";
      // Clear SVG text fallback drawing to avoid visual duplication
    }
  }

  animateKanaStrokes() {
    const svg = document.getElementById("modal-kana-guide-svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path");
    if (paths.length === 0) return;

    soundSynth.playClick();
    svg.classList.add("animating");

    let delay = 0;
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.getBoundingClientRect(); // trigger layout reflow

      setTimeout(() => {
        path.style.transition = "stroke-dashoffset 0.6s ease-in-out";
        path.style.strokeDashoffset = "0";
      }, delay);

      delay += 650;
    });

    setTimeout(() => {
      svg.classList.remove("animating");
    }, delay);
  }

  navigateModal(direction) {
    if (!this.activeModalKana) return;

    soundSynth.playClick();
    const { list, index } = this.activeModalKana;
    let nextIdx = index + direction;

    if (nextIdx < 0) nextIdx = list.length - 1;
    if (nextIdx >= list.length) nextIdx = 0;

    const nextKana = list[nextIdx];
    this.openKanaDetailModal(nextKana, list, nextIdx);
  }

  // ==========================================
  // MODULE C: DICTIONARY & CONJUGATOR
  // ==========================================
  setupDictionaryAndConjugator() {
    // Search input typing
    const searchInput = document.getElementById("dictionary-search-input");
    searchInput.addEventListener("input", () => {
      this.renderDictionaryList();
    });

    // Category chips click
    const chipsGroup = document.getElementById("dictionary-category-chips");
    chipsGroup.addEventListener("click", (e) => {
      const chip = e.target.closest(".btn-tab");
      if (!chip) return;

      soundSynth.playClick();
      chipsGroup.querySelectorAll(".btn-tab").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      this.activeDictCategory = chip.dataset.category;
      this.renderDictionaryList();
    });

    // Conjugator Verb select
    const verbSelect = document.getElementById("conjugator-verb-selector");
    verbSelect.addEventListener("change", () => {
      this.conjugateSelectedVerb();
    });

    // Populate verb selector options once
    verbSelect.innerHTML = "";
    const verbs = dictionary.filter(item => item.tag === "Verb");
    verbs.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.word;
      opt.innerText = `${v.word} (${v.reading}) - ${v.english}`;
      verbSelect.appendChild(opt);
    });

    if (verbs.length > 0) {
      this.conjugateSelectedVerb();
    }
  }

  renderDictionary() {
    this.renderDictionaryList();
    this.conjugateSelectedVerb();
  }

  renderDictionaryList() {
    const container = document.getElementById("dictionary-words-container");
    if (!container) return;

    container.innerHTML = "";
    const query = document.getElementById("dictionary-search-input").value.toLowerCase().trim();
    const category = this.activeDictCategory;

    // Filter registry based on query and category chip
    const filtered = dictionary.filter(item => {
      const matchesSearch = (
        item.word.includes(query) ||
        item.reading.includes(query) ||
        item.romaji.includes(query) ||
        item.english.toLowerCase().includes(query)
      );
      
      const matchesCategory = (category === "all" || item.tag === category);

      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p style="padding:20px; text-align:center; color:var(--text-muted);">No vocabulary match found.</p>`;
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement("div");
      row.className = "vocab-item";
      
      const isStarred = this.state.starredVocab.includes(item.word);

      row.innerHTML = `
        <div class="vocab-details">
          <div class="vocab-jp-row">
            <span class="vocab-kanji">${item.word}</span>
            <span class="vocab-reading">(${item.reading})</span>
            <i class="fa-solid fa-volume-high speak-btn" data-text="${item.word}" style="margin-left: 8px; font-size: 0.95rem;"></i>
          </div>
          <div class="vocab-english">${item.english}</div>
        </div>
        <div class="vocab-meta">
          <span class="vocab-tag">${item.tag}</span>
          <i class="fa-solid fa-star bookmark-star ${isStarred ? 'starred' : ''}"></i>
        </div>
      `;

      // star clicking bookmark
      row.querySelector(".bookmark-star").addEventListener("click", () => {
        this.toggleStar(item.word);
        this.renderDictionaryList();
      });

      container.appendChild(row);
    });
  }

  conjugateSelectedVerb() {
    const verbSelect = document.getElementById("conjugator-verb-selector");
    if (!verbSelect) return;

    const val = verbSelect.value;
    const verbObj = dictionary.find(item => item.word === val && item.tag === "Verb");
    if (!verbObj) return;

    const conj = conjugateVerb(verbObj);

    document.getElementById("conj-polite").innerText = conj.polite;
    document.getElementById("conj-negative").innerText = conj.negative;
    document.getElementById("conj-past").innerText = conj.past;
    document.getElementById("conj-te").innerText = conj.te;
  }

  // ==========================================
  // MODULE D: KANJI PRACTICE BOARD
  // ==========================================
  setupKanjiBoard() {
    const levelSelect = document.getElementById("kanji-level-select");
    levelSelect.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-tab");
      if (!btn) return;

      soundSynth.playClick();
      levelSelect.querySelectorAll(".btn-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      this.renderKanjiGrid();
    });

    // Set drawing controls
    const brushSlider = document.getElementById("brush-size-slider");
    const clearBtn = document.getElementById("btn-clear-canvas");
    const colorPalette = document.getElementById("canvas-color-palette");
    const drawCanvas = document.getElementById("kanji-draw-canvas");

    this.canvasController = new TracingCanvas(drawCanvas, brushSlider, clearBtn, colorPalette);
    this.populateCanvasPalette();

    document.getElementById("btn-animate-kanji").addEventListener("click", () => {
      this.animateKanjiStrokes();
    });
  }

  populateCanvasPalette() {
    const palette = document.getElementById("canvas-color-palette");
    if (!palette) return;

    palette.innerHTML = "";
    
    // Choose beautiful colors based on theme
    let colors = [];
    if (this.state.studyMode === "zen") {
      colors = ["#22664c", "#c29547", "#2c2a29", "#8d7052"];
    } else {
      colors = ["#ff7597", "#5c60f5", "#10b981", this.state.cyberTheme === "dark" ? "#ffffff" : "#0f172a"];
    }

    colors.forEach((col, idx) => {
      const dot = document.createElement("button");
      dot.className = `color-dot ${idx === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = col;
      dot.dataset.color = col;
      palette.appendChild(dot);
    });

    this.canvasController.setColor(colors[0]);
  }

  renderKanjiBoard() {
    this.renderKanjiGrid();
    
    const activeLevel = document.querySelector("#kanji-level-select .btn-tab.active").dataset.level;
    const filterKanji = kanjiData.filter(k => k.level === activeLevel);
    if (filterKanji.length > 0) {
      this.selectKanjiCharacter(filterKanji[0]);
    }
  }

  renderKanjiGrid() {
    const container = document.getElementById("kanji-select-grid");
    if (!container) return;

    container.innerHTML = "";
    const activeLevel = document.querySelector("#kanji-level-select .btn-tab.active").dataset.level;
    const filterKanji = kanjiData.filter(k => k.level === activeLevel);

    filterKanji.forEach(kanji => {
      const card = document.createElement("button");
      card.className = "kanji-char-card";
      if (this.selectedKanji && this.selectedKanji.char === kanji.char) {
        card.classList.add("active");
      }
      card.innerText = kanji.char;

      card.addEventListener("click", () => {
        soundSynth.playClick();
        this.selectKanjiCharacter(kanji);
        container.querySelectorAll(".kanji-char-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      });

      container.appendChild(card);
    });
  }

  selectKanjiCharacter(kanji) {
    this.selectedKanji = kanji;
    
    // Register Kanji as practiced/read
    if (!this.state.practicedKanji.includes(kanji.char)) {
      this.state.practicedKanji.push(kanji.char);
      this.saveState();
    }

    // Set visual details
    document.getElementById("kanji-info-char").innerText = kanji.char;
    document.getElementById("kanji-info-meaning").innerText = kanji.meaning;
    document.getElementById("kanji-info-kunyomi").innerText = kanji.kunyomi;
    document.getElementById("kanji-info-onyomi").innerText = kanji.onyomi;

    // Reset Guide SVG strokes
    const guideSvg = document.getElementById("kanji-guide-svg");
    guideSvg.innerHTML = "";
    guideSvg.classList.remove("animating");

    kanji.strokes.forEach(d => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      guideSvg.appendChild(path);
    });

    if (this.canvasController) {
      this.canvasController.resizeCanvas();
    }
  }

  animateKanjiStrokes() {
    const svg = document.getElementById("kanji-guide-svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path");
    if (paths.length === 0) return;

    soundSynth.playClick();
    svg.classList.add("animating");

    let delay = 0;
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.getBoundingClientRect(); // trigger layout reflow

      setTimeout(() => {
        path.style.transition = "stroke-dashoffset 0.8s ease-in-out";
        path.style.strokeDashoffset = "0";
      }, delay);

      delay += 850;
    });

    setTimeout(() => {
      svg.classList.remove("animating");
    }, delay);
  }

  // ==========================================
  // MODULE E: MULTIPLE CHOICE KANA QUIZ
  // ==========================================
  setupQuiz() {
    document.getElementById("btn-start-quiz").addEventListener("click", () => {
      this.startQuizGame();
    });

    document.getElementById("btn-quiz-retry").addEventListener("click", () => {
      this.resetQuizLobby();
    });
  }

  resetQuizLobby() {
    document.getElementById("quiz-lobby-card").style.display = "block";
    document.getElementById("quiz-game-panel").style.display = "none";
    document.getElementById("quiz-summary-card").style.display = "none";

    const deckGroup = document.getElementById("quiz-deck-toggle");
    deckGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle-opt");
      if (!btn) return;
      soundSynth.playClick();
      deckGroup.querySelectorAll(".toggle-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.state.quizState.deck = btn.dataset.deck;
    });

    const lenGroup = document.getElementById("quiz-length-toggle");
    lenGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle-opt");
      if (!btn) return;
      soundSynth.playClick();
      lenGroup.querySelectorAll(".toggle-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.state.quizState.length = parseInt(btn.dataset.length, 10);
    });
  }

  startQuizGame() {
    soundSynth.playSuccess();
    const config = this.state.quizState;
    
    let pool = [];
    if (config.deck === "hiragana") {
      pool = kanaData.filter(k => k.type === "hiragana");
    } else if (config.deck === "katakana") {
      pool = kanaData.filter(k => k.type === "katakana");
    } else {
      pool = [...kanaData];
    }

    const shuffled = pool.sort(() => 0.5 - Math.random());
    config.questions = shuffled.slice(0, Math.min(config.length, pool.length));
    config.currentQuestionIndex = 0;
    config.score = 0;

    document.getElementById("quiz-lobby-card").style.display = "none";
    document.getElementById("quiz-game-panel").style.display = "block";

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const config = this.state.quizState;
    const question = config.questions[config.currentQuestionIndex];
    if (!question) return;

    const total = config.questions.length;
    const current = config.currentQuestionIndex + 1;
    document.getElementById("quiz-progress-text").innerText = `Question ${current} of ${total}`;
    document.getElementById("quiz-score-live").innerText = `Score: ${config.score}`;
    
    const fillPercent = (config.currentQuestionIndex / total) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${fillPercent}%`;

    document.getElementById("quiz-target-char").innerText = question.char;

    const pool = kanaData.filter(k => k.romaji !== question.romaji);
    const shuffledPool = pool.sort(() => 0.5 - Math.random());
    const distractors = shuffledPool.slice(0, 3).map(k => k.romaji);

    const choices = [question.romaji, ...distractors].sort(() => 0.5 - Math.random());

    const container = document.getElementById("quiz-options-container");
    container.innerHTML = "";

    choices.forEach(romaji => {
      const btn = document.createElement("button");
      btn.className = "choice-button";
      btn.innerText = romaji;

      btn.addEventListener("click", () => {
        this.submitQuizAnswer(btn, romaji, question.romaji);
      });

      container.appendChild(btn);
    });
  }

  submitQuizAnswer(clickedButton, selectedVal, correctVal) {
    const config = this.state.quizState;
    const buttons = document.querySelectorAll("#quiz-options-container .choice-button");
    
    buttons.forEach(btn => btn.style.pointerEvents = "none");

    const isCorrect = selectedVal === correctVal;

    if (isCorrect) {
      soundSynth.playCorrect();
      clickedButton.classList.add("correct");
      config.score += 1;
      document.getElementById("quiz-score-live").innerText = `Score: ${config.score}`;
    } else {
      soundSynth.playIncorrect();
      clickedButton.classList.add("incorrect");
      buttons.forEach(btn => {
        if (btn.innerText === correctVal) btn.classList.add("correct");
      });
    }

    setTimeout(() => {
      config.currentQuestionIndex += 1;
      if (config.currentQuestionIndex < config.questions.length) {
        this.renderQuizQuestion();
      } else {
        this.completeQuizGame();
      }
    }, 1500);
  }

  completeQuizGame() {
    soundSynth.playSuccess();
    const config = this.state.quizState;
    
    document.getElementById("quiz-progress-fill").style.width = "100%";

    document.getElementById("quiz-game-panel").style.display = "none";
    document.getElementById("quiz-summary-card").style.display = "block";

    const finalScore = document.getElementById("quiz-final-score");
    finalScore.innerText = `${config.score} / ${config.questions.length}`;

    this.state.streakCount += 1;
    this.saveState();

    const msg = document.getElementById("quiz-feedback-msg");
    const ratio = config.score / config.questions.length;
    if (ratio === 1) {
      msg.innerText = "🌸 Perfect Score! You have attained true Zen mastery.";
      msg.style.color = "var(--accent-secondary)";
    } else if (ratio >= 0.7) {
      msg.innerText = "🌾 Well done! Your Japanese path is strong.";
      msg.style.color = "var(--accent)";
    } else {
      msg.innerText = "🍂 Keep practicing. Patience and time grow all seeds.";
      msg.style.color = "var(--text-muted)";
    }
  }
}

// Instantiate and initialize when DOM content finishes loading
window.addEventListener("DOMContentLoaded", () => {
  const app = new AppController();
  app.init();
});
export default AppController;
