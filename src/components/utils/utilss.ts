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
  newData: Partial<T>
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
  newData: T
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
