"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DictionaryEntry } from "@/hooks/use-word-definition";
import { Volume2Icon } from "lucide-react";

interface WordDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  definition: DictionaryEntry | null;
  loading?: boolean;
}

export function WordDefinitionDialog({
  open,
  onOpenChange,
  definition,
  loading = false,
}: WordDefinitionDialogProps) {
  const handlePlayPronunciation = () => {
    if (definition?.pronunciation) {
      const utterance = new SpeechSynthesisUtterance(definition.word);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {loading ? (
              "Loading definition..."
            ) : (
              <>
                {definition?.word}
                {definition?.pronunciation && (
                  <button
                    onClick={handlePlayPronunciation}
                    className="hover:bg-muted rounded-sm p-1 transition-colors"
                    title="Play pronunciation"
                  >
                    <Volume2Icon className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </DialogTitle>
          {definition?.pronunciation && (
            <DialogDescription className="font-mono text-sm">
              {definition.pronunciation}
            </DialogDescription>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : definition ? (
          <div className="space-y-6">
            {/* Part of Speech */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {definition.part_of_speech}
              </Badge>
            </div>

            {/* Definitions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Definitions</h3>
              <ol className="space-y-3">
                {definition.definitions.map((def, index) => (
                  <li key={index} className="space-y-2">
                    <div className="flex gap-3">
                      <span className="text-muted-foreground mt-0.5 text-sm font-medium">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          {def.definition}
                        </p>
                        {def.example && (
                          <p className="text-muted-foreground mt-1 text-xs italic">
                            Example: "{def.example}"
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Synonyms */}
            {definition.synonyms && definition.synonyms.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Synonyms</h3>
                <div className="flex flex-wrap gap-1">
                  {definition.synonyms.map((synonym, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {definition.antonyms && definition.antonyms.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Antonyms</h3>
                <div className="flex flex-wrap gap-1">
                  {definition.antonyms.map((antonym, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {antonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            No definition found for this word.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
