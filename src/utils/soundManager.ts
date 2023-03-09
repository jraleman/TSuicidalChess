class SoundManager {
  private static instance: SoundManager;
  private captureSound: HTMLAudioElement;
  private isMuted: boolean = false;
  private lastPlayTime: number = 0;
  private readonly MIN_INTERVAL = 100; // Minimum time between sounds in ms

  private constructor() {
    // Create audio element with multiple source formats
    this.captureSound = new Audio();
    const source = document.createElement('source');
    source.src = '/sounds/capture.mp3';
    source.type = 'audio/mpeg';
    this.captureSound.appendChild(source);

    // Add fallback source
    const fallbackSource = document.createElement('source');
    fallbackSource.src = '/sounds/capture.wav';
    fallbackSource.type = 'audio/wav';
    this.captureSound.appendChild(fallbackSource);

    this.captureSound.volume = 0.3;
    this.captureSound.preload = 'auto';

    // Add error handling
    this.captureSound.addEventListener('error', (e) => {
      console.error('Error loading capture sound:', e);
      // Try to load a simple beep sound as fallback
      this.captureSound.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
        'tvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
        'tvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
        'tvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU';
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playCaptureSound(): void {
    if (this.isMuted) return;

    // Prevent rapid-fire sounds
    const now = Date.now();
    if (now - this.lastPlayTime < this.MIN_INTERVAL) return;
    this.lastPlayTime = now;

    // Clone the audio element to allow multiple simultaneous plays
    const sound = this.captureSound.cloneNode() as HTMLAudioElement;
    sound.volume = this.captureSound.volume;

    // Add slight randomization to pitch for more natural feel
    const randomPitch = 0.95 + Math.random() * 0.1; // Random pitch between 0.95 and 1.05
    sound.playbackRate = randomPitch;

    // Add error handling for playback
    sound.addEventListener('error', (e) => {
      console.warn('Failed to play capture sound:', e);
      // Try to play a simple beep as fallback
      const beep = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
        'tvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
        'tvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' +
        'tvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      beep.volume = this.captureSound.volume;
      beep.play().catch(console.error);
    });

    sound.play().catch(error => {
      console.warn('Failed to play capture sound:', error);
    });

    // Clean up the cloned audio element after it finishes playing
    sound.addEventListener('ended', () => {
      sound.remove();
    });
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.captureSound.volume = clampedVolume;
  }
}

export const soundManager = SoundManager.getInstance(); 