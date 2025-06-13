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
