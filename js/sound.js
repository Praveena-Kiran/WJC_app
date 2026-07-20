// Retro Web Audio Synthesizer for Zengo Language Suite

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  // Initialize the audio context (lazily after user gesture)
  init() {
    if (this.ctx) return Promise.resolve(true);

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.enabled = true;
      console.log("AudioContext initialized successfully.");
      
      // Warmup empty buffer to get around iOS silent modes
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const node = this.ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(this.ctx.destination);
      node.start(0);
      
      return Promise.resolve(true);
    } catch (e) {
      console.error("Web Audio API is not supported in this browser:", e);
      return Promise.resolve(false);
    }
  }

  // Helper to create oscillators and decay gain
  createTone(frequency, type, duration, gainStart = 0.15) {
    if (!this.enabled || !this.ctx) return;
    
    // Resume context if suspended
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // 1. Click: Short, light high-frequency beep
  playClick() {
    this.createTone(800, "sine", 0.08, 0.1);
  }

  // 2. Correct: Double-tone ascending chord
  playCorrect() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    
    // First tone (523Hz - C5)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second tone (659Hz - E5) starting slightly later
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659, now + 0.08);
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.08 + 0.25);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.08 + 0.25);
  }

  // 3. Incorrect: Low-pitch buzz tone
  playIncorrect() {
    this.createTone(180, "sawtooth", 0.35, 0.12);
  }

  // 4. Success/Level Completed: Ascending arpeggio sequence
  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const tempo = 0.10; // spacing between notes

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * tempo);
      
      gainNode.gain.setValueAtTime(0.12, now + idx * tempo);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * tempo + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now + idx * tempo);
      osc.stop(now + idx * tempo + 0.3);
    });
  }
}

export const soundSynth = new SoundSynthesizer();
export default soundSynth;
