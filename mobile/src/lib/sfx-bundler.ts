export interface SoundAssetMap {
  click?: string;
  correct?: string;
  incorrect?: string;
  success?: string;
}

export class SfxBundler {
  private assets: SoundAssetMap = {};

  public registerSound(name: keyof SoundAssetMap, path: string): void {
    this.assets[name] = path;
  }

  public getSoundPath(name: keyof SoundAssetMap): string | undefined {
    return this.assets[name];
  }

  public listRegisteredSounds(): string[] {
    return Object.keys(this.assets);
  }
}

export const sfxBundler = new SfxBundler();
