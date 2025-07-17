export type SubtitleCue = {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
};

export function parseSRT(srtContent: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  blocks.forEach((block) => {
    const lines = block.trim().split("\n");
    if (lines.length >= 3) {
      const id = Number.parseInt(lines[0]);
      const timeMatch = lines[1].match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/,
      );

      if (timeMatch) {
        const startTime = parseTime(
          timeMatch[1],
          timeMatch[2],
          timeMatch[3],
          timeMatch[4],
        );
        const endTime = parseTime(
          timeMatch[5],
          timeMatch[6],
          timeMatch[7],
          timeMatch[8],
        );
        const text = lines.slice(2).join("\n");

        cues.push({
          id,
          startTime,
          endTime,
          text: text.replace(/<[^>]*>/g, ""), // Remove HTML tags
        });
      }
    }
  });

  return cues;
}

export function parseVTT(vttContent: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const blocks = vttContent.trim().split(/\n\s*\n/);

  let idCounter = 0;

  blocks.forEach((block) => {
    const lines = block.trim().split("\n").filter(Boolean);

    if (lines.length >= 2) {
      let id: number;
      let timeLineIndex = 0;

      // If first line is numeric and second contains time --> treat as ID
      if (/^\d+$/.test(lines[0]) && lines[1].includes("-->")) {
        id = Number.parseInt(lines[0]);
        timeLineIndex = 1;
      } else {
        id = idCounter++;
      }

      const timeMatch = lines[timeLineIndex].match(
        /(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s-->\s(\d{2}):(\d{2}):(\d{2})\.(\d{3})/,
      );

      if (timeMatch) {
        const startTime = parseTime(
          timeMatch[1],
          timeMatch[2],
          timeMatch[3],
          timeMatch[4],
        );
        const endTime = parseTime(
          timeMatch[5],
          timeMatch[6],
          timeMatch[7],
          timeMatch[8],
        );
        const text = lines.slice(timeLineIndex + 1).join(" ");

        cues.push({
          id,
          startTime,
          endTime,
          text: text.replace(/<[^>]*>/g, ""), // strip styling tags like <c>, <b>
        });
      }
    }
  });

  return cues;
}

function parseTime(
  hours: string,
  minutes: string,
  seconds: string,
  milliseconds: string,
): number {
  return (
    Number.parseInt(hours) * 3600 +
    Number.parseInt(minutes) * 60 +
    Number.parseInt(seconds) +
    Number.parseInt(milliseconds) / 1000
  );
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}
