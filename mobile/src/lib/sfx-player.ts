export class SfxPlayer {
  private static instance: SfxPlayer;
  private soundEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): SfxPlayer {
    if (!SfxPlayer.instance) {
      SfxPlayer.instance = new SfxPlayer();
    }
    return SfxPlayer.instance;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public playSound(soundName: 'click' | 'correct' | 'incorrect' | 'success'): void {
    if (!this.soundEnabled) return;
    // Log sound playback trigger
    console.log(`[SFX] Playing sound: ${soundName}`);
  }
}

export const sfxPlayer = SfxPlayer.getInstance();
