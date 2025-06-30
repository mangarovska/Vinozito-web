import { Howl } from "howler";

const calmMusic = "/audio/calm.mp3";
const happyMusic = "/audio/veselo.mp3";
const noiseMusic = "/audio/whitenoise.mp3";

export const sounds = {
  calm: new Howl({ src: [calmMusic], loop: true, volume: 0.3, preload: true }),
  happy: new Howl({ src: [happyMusic], loop: true, volume: 0.3, preload: true }),
  noise: new Howl({ src: [noiseMusic], loop: true, volume: 0.3, preload: true }),
};

// Start loading immediately
// Object.values(sounds).forEach((sound) => sound.load());
