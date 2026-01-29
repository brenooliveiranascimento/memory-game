export type TimerCallback = (elapsed: number) => void;

export class TimerService {
  private intervalId: number | null = null;
  private startTime: number = 0;
  private elapsed: number = 0;
  private isRunning: boolean = false;

  constructor(private callback: TimerCallback) {}

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = Date.now() - this.elapsed;

    this.intervalId = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;
      this.callback(Math.floor(this.elapsed / 1000));
    }, 1000) as unknown as number;
  }

  pause(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume(): void {
    this.start();
  }

  stop(): void {
    this.pause();
    this.elapsed = 0;
  }

  reset(): void {
    this.stop();
    this.elapsed = 0;
  }

  getElapsed(): number {
    return Math.floor(this.elapsed / 1000);
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  destroy(): void {
    this.stop();
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeHuman(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs}s`;
  }

  if (secs === 0) {
    return `${mins}min`;
  }

  return `${mins}min ${secs}s`;
}
