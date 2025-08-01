export default function getInitials(name: string): string {
  if (!name || name.trim() === "") {
    return "";
  }

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word: return first letter
    return words[0].charAt(0).toUpperCase();
  } else {
    // Multiple words: return first letter of first two words
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
}

export function isSelectedNav(path: string, link: string): string {
  const segments = path.split("/").filter(Boolean); // removes empty strings
  return (segments[0] || null) === link ? "bg-accent" : "";
}

export function isSelected(path: string, link: string): boolean {
  const segments = path.split("/").filter(Boolean); // removes empty strings
  return (segments[0] || null) === link;
}

export function updateElement<T extends { id: number }>(
  array: T[][] | undefined,
  id: number,
  newData: Partial<T>,
): T[][] | undefined {
  if (!array) return array;

  const newArray = array.map((page) => [...page]);
  newArray.some((page, pageIdx) => {
    const itemIdx = page.findIndex((item) => item.id === id);
    if (itemIdx !== -1) {
      newArray[pageIdx][itemIdx] = {
        ...page[itemIdx],
        ...newData,
      };
      return true;
    }
    return false;
  });

  return newArray;
}

export function insertElement<T extends { id: number }>(
  array: T[][] | undefined,
  newData: T,
): T[][] | undefined {
  if (!array) return array;

  const groupSize = array && array.length > 0 ? array[0].length : 1;

  if (!array || array.length === 0) {
    return [[newData]];
  }

  const lastGroup = array[array.length - 1];

  if (lastGroup.length < groupSize) {
    lastGroup.push(newData);
  } else {
    array.push([newData]);
  }

  return array;
}

export const calcPercentage = (number: number, total: number): number => {
  if (total === 0) return 0;
  return (number / total) * 100;
};

// Simple utility functions for quick speech synthesis
// For more advanced features like tracking state, use the useSpeechSynthesis hook
export const speakUS = (text: string) => {
  if (!text || !("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.rate = 0.8; // Set speech rate (1 is normal speed)

  const voice = speechSynthesis
    .getVoices()
    .find((v) => v.name === "Google US English");

  utterance.voice = voice || speechSynthesis.getVoices()[0]; // Fallback to first available voice
  speechSynthesis.speak(utterance);
};

export const speakUK = (text: string) => {
  if (!text || !("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.rate = 0.8; // Set speech rate (1 is normal speed)

  const voice = speechSynthesis
    .getVoices()
    .find((v) => v.name === "Google UK English Female");

  utterance.voice = voice || speechSynthesis.getVoices()[0]; // Fallback to first available voice
  speechSynthesis.speak(utterance);
};

export function playSound(url: string) {
  const audio = new Audio(url);
  audio.play();
}

function makeid(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateFileName(originalName: string): string {
  const extension = originalName.includes(".")
    ? "." + originalName.split(".").pop()
    : "";

  const baseName = originalName.replace(/\.[^/.]+$/, "");

  const safeBase = baseName
    .toLowerCase()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\-]+/g, "-") // replace unsafe chars with "-"
    .replace(/-+/g, "-") // remove repeated dashes
    .replace(/^-|-$/g, ""); // trim dashes

  const randomstring = require("randomstring");

  const random = randomstring.generate(7);

  return `${random}-${safeBase}${extension}`;
}
