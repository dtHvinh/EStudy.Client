import { FlashCardResponseType } from "@/hooks/use-set-cards";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import useStorageV2 from "@/hooks/use-storage-v2";
import { IconLoaderQuarter, IconVolume } from "@tabler/icons-react";
import ButtonIcon from "./button-icon";
import MediaRenderer from "./resources/media-renderer";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";

export default function FlashCardDetail({ ...props }: FlashCardResponseType) {
  const { getFileUrl } = useStorageV2();
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-foreground text-xl leading-tight font-bold">
          {props.term}
        </h3>
        {props.partOfSpeech && (
          <Badge variant="secondary" className="shrink-0 text-xs">
            {props.partOfSpeech}
          </Badge>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed">
        {props.definition}
      </p>

      {props.example && (
        <div className="space-y-2">
          <h4 className="text-foreground text-sm font-semibold">Examples:</h4>
          <div className="bg-muted/50 border-primary/20 border-l-4 p-3">
            <ul className="text-muted-foreground space-y-1 text-sm">
              {props.example
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => (
                  <FlashCardExample key={index} line={line} />
                ))}
            </ul>
          </div>
        </div>
      )}

      {props.note && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/30 dark:bg-amber-950/20">
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              💡
            </span>
            <div>
              <p className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-200">
                Note
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {props.note}
              </p>
            </div>
          </div>
        </div>
      )}

      {props.imageUrl && (
        <AspectRatio
          ratio={16 / 9}
          className="overflow-hidden rounded-lg border"
        >
          <MediaRenderer
            url={getFileUrl(props.imageUrl)}
            className="h-full w-full object-cover"
          />
        </AspectRatio>
      )}
    </>
  );
}

const FlashCardExample = ({ ...props }: { line: string }) => {
  const { isSpeaking, speak } = useSpeechSynthesis();

  const getIcon = () => {
    if (isSpeaking) {
      return (
        <ButtonIcon
          className="border-0 p-0"
          icon={<IconLoaderQuarter className="animate-spin" />}
        />
      );
    }
    return (
      <ButtonIcon
        className="border-0 p-0"
        icon={<IconVolume />}
        onClick={() => speak(props.line, "uk")}
      />
    );
  };
  return (
    <li className="flex items-center gap-2">
      <span className="text-primary/60 mt-1.5 text-xs">•</span>
      <span className="flex-1">{props.line.trim()}</span>
      <span className="text-primary/60 mt-1.5 text-xs">
        &nbsp;
        {getIcon()}
      </span>
    </li>
  );
};
