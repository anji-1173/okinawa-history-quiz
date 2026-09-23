type FeedbackKind = "correct" | "wrong";

type AudioContextConstructor = new () => AudioContext;
const feedbackUrls = new Map<FeedbackKind, string>();

function audioContextConstructor(): AudioContextConstructor | undefined {
  const browserWindow = window as Window & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? browserWindow.webkitAudioContext;
}

function audioElementUrl(kind: FeedbackKind) {
  const cached = feedbackUrls.get(kind);
  if (cached) return cached;

  const sampleRate = 8_000;
  const noteDuration = kind === "correct" ? 0.17 : 0.16;
  const spacing = kind === "correct" ? 0.12 : 0.14;
  const totalSamples = Math.ceil(sampleRate * 0.42);
  const bytes = new Uint8Array(44 + totalSamples);
  const view = new DataView(bytes.buffer);
  const writeText = (offset: number, value: string) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  writeText(0, "RIFF");
  view.setUint32(4, 36 + totalSamples, true);
  writeText(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeText(36, "data");
  view.setUint32(40, totalSamples, true);

  const notes = kind === "correct" ? [880, 1175] : [165, 125];
  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / sampleRate;
    let sample = 0;
    notes.forEach((frequency, noteIndex) => {
      const relativeTime = time - noteIndex * spacing;
      if (relativeTime < 0 || relativeTime > noteDuration) return;
      const envelope = Math.sin((Math.PI * relativeTime) / noteDuration) * (kind === "correct" ? 0.58 : 0.38);
      const wave = Math.sin(2 * Math.PI * frequency * relativeTime);
      sample += kind === "correct" ? wave * envelope : Math.sign(wave || 1) * envelope;
    });
    bytes[44 + index] = Math.max(0, Math.min(255, Math.round(128 + sample * 127)));
  }

  let binary = "";
  for (let start = 0; start < bytes.length; start += 8_000) binary += String.fromCharCode(...bytes.subarray(start, start + 8_000));
  const url = `data:audio/wav;base64,${btoa(binary)}`;
  feedbackUrls.set(kind, url);
  return url;
}

function playWithAudioElement(kind: FeedbackKind) {
  if (typeof Audio === "undefined") return;
  const audio = new Audio(audioElementUrl(kind));
  audio.volume = 0.45;
  void audio.play().catch(() => undefined);
}

/** Play a short, generated cue after an answer. No audio file is downloaded. */
export function playFeedbackSound(kind: FeedbackKind) {
  try {
    const AudioContextClass = audioContextConstructor();
    if (!AudioContextClass) {
      playWithAudioElement(kind);
      return;
    }

    const context = new AudioContextClass();
    void context.resume().catch(() => undefined);
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

