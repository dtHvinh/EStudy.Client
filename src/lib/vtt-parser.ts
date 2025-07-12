export async function convertSRTBlobToVTT(srtBlob: Blob): Promise<Blob> {
  const srtText = await srtBlob.text();

  // Convert SRT to VTT format
  const vttLines = srtText
    .replace(/\r\n|\r|\n/g, "\n") // Normalize newlines
    .replace(
      /(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
      (_, index, start, startMs, end, endMs) =>
        `${index}\n${start}.${startMs} --> ${end}.${endMs}`,
    );

  const vttContent = `WEBVTT\n\n${vttLines}`;

  return new Blob([vttContent], { type: "text/vtt" });
}

export function convertSRTTextToVTT(srtText: string): Blob {
  const vttLines = srtText
    .replace(/\r\n|\r|\n/g, "\n") // Normalize newlines
    .replace(
      /(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
      (_, index, start, startMs, end, endMs) =>
        `${index}\n${start}.${startMs} --> ${end}.${endMs}`,
    );

  const vttContent = `WEBVTT\n\n${vttLines}`;
  return new Blob([vttContent], { type: "text/vtt" });
}
