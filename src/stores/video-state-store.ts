import { SubtitleCue } from "@/lib/srt-parser";
import { create } from "zustand";

export type VideoState = {
  isPlaying: boolean;
  playedSeconds: number;
  duration: number;
  volume: number;
  subtitleCues?: SubtitleCue[];

  updateState: (state: Partial<VideoState>) => void;
  resetState: () => void;
  setSubtitleCues: (cues: SubtitleCue[]) => void;
};

export const useVideoStateStore = create<VideoState>((set) => ({
  isPlaying: false,
  playedSeconds: 0,
  duration: 0,
  volume: 1,
  subtitleCues: [],

  updateState: (state) =>
    set((prev) => ({
      ...prev,
      ...state,
    })),

  setSubtitleCues: (cues) => set(() => ({ subtitleCues: cues })),

  resetState: () =>
    set(() => ({ isPlaying: false, playedSeconds: 0, duration: 0, volume: 1 })),
}));
