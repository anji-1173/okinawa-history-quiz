type FeedbackKind = "correct" | "wrong";

type AudioContextConstructor = new () => AudioContext;

function audioContextConstructor(): AudioContextConstructor | undefined {
  const browserWindow = window as Window & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? browserWindow.webkitAudioContext;
}

/** Play a short, generated cue after an answer. No audio file is downloaded. */
export function playFeedbackSound(kind: FeedbackKind) {
  try {
    const AudioContextClass = audioContextConstructor();
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const now = context.currentTime;
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.0001, now);

    const notes = kind === "correct" ? [880, 1175] : [165, 125];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const start = now + index * (kind === "correct" ? 0.12 : 0.14);
      const duration = kind === "correct" ? 0.18 : 0.16;
      oscillator.type = kind === "correct" ? "sine" : "square";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.connect(gain);
      gain.gain.setValueAtTime(kind === "correct" ? 0.15 : 0.09, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.start(start);
      oscillator.stop(start + duration);
    });

    window.setTimeout(() => void context.close(), 500);
  } catch {
    // Sound is optional: quizzes remain usable on browsers that block Web Audio.
  }
}

