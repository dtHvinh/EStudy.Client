import api from "@/components/utils/requestUtils";
import { useState } from "react";

export interface DictionaryEntry {
  word: string;
  part_of_speech: PartOfSpeech;
  pronunciation: string;
  definitions: DefinitionItem[];
  synonyms: string[];
  antonyms: string[];
}

export interface DefinitionItem {
  definition: string;
  example: string;
}

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "interjection"
  | "determiner";

export default function useWordDefinition() {
  const [definition, setDefinition] = useState<DictionaryEntry | null>(null);

  const fetchDefinition = async (term: string) => {
    const response = await api.post<DictionaryEntry>(`/api/ai/definition`, {
      term,
    });
    setDefinition(response);
  };

  return { definition, fetchDefinition };
}
