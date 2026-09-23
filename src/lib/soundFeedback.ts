type FeedbackKind = "correct" | "wrong";

const feedbackUrls = new Map<FeedbackKind, string>();

function audioElementUrl(kind: FeedbackKind) {
  const cached = feedbackUrls.get(kind);
  if (cached) return cached;

  const sampleRate = 22_050;
  const totalSamples = Math.ceil(sampleRate * (kind === "correct" ? 0.72 : 0.48));
  const bytes = new Uint8Array(44 + totalSamples * 2);
  const view = new DataView(bytes.buffer);
  const writeText = (offset: number, value: string) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  writeText(0, "RIFF");
  view.setUint32(4, 36 + totalSamples * 2, true);
  writeText(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, totalSamples * 2, true);

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / sampleRate;
    let sample = 0;
    if (kind === "correct") {
      // A bright two-note bell: C6 followed by E6, with a natural decay.
      [{ start: 0, frequency: 1047 }, { start: 0.18, frequency: 1319 }].forEach(({ start, frequency }) => {
        const relativeTime = time - start;
        if (relativeTime < 0 || relativeTime > 0.5) return;
        const attack = Math.min(relativeTime / 0.012, 1);
        const envelope = attack * Math.exp(-relativeTime * 6);
        const wave = Math.sin(2 * Math.PI * frequency * relativeTime)
          + 0.32 * Math.sin(4 * Math.PI * frequency * relativeTime)
          + 0.12 * Math.sin(6 * Math.PI * frequency * relativeTime);
        sample += wave * envelope * 0.48;
      });
    } else {
      // A clear low two-part buzzer: the second tone falls slightly lower.
      [{ start: 0, frequency: 156 }, { start: 0.19, frequency: 116 }].forEach(({ start, frequency }) => {
        const relativeTime = time - start;
        if (relativeTime < 0 || relativeTime > 0.19) return;
        const attack = Math.min(relativeTime / 0.008, 1);
        const release = Math.max(0, 1 - relativeTime / 0.19);
        const base = Math.sin(2 * Math.PI * frequency * relativeTime);
        const buzzer = 0.82 * Math.sign(base || 1) + 0.18 * Math.sin(4 * Math.PI * frequency * relativeTime);
        sample += buzzer * attack * release * 0.42;
      });
    }
    view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
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
  audio.volume = 0.7;
  void audio.play().catch(() => undefined);
}

/** Play a short, generated cue after an answer. No audio file is downloaded. */
export function playFeedbackSound(kind: FeedbackKind) {
  try {
    // An HTML audio element is supported in more browsers than Web Audio,
    // including browsers that suspend AudioContext until after a gesture.
    playWithAudioElement(kind);
  } catch {
    // Sound is optional: quizzes remain usable on browsers that block Web Audio.
  }
}

