import { FlashCardResponseType } from "@/hooks/use-set-cards";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { IconLoaderQuarter, IconVolume } from "@tabler/icons-react";
import ButtonIcon from "./button-icon";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";

export default function FlashCardDetail({ ...props }: FlashCardResponseType) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-foreground leading-tight">
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
          <h4 className="text-sm font-semibold text-foreground">Examples:</h4>
          <div className="bg-muted/50 p-3 border-l-4 border-primary/20">
            <ul className="space-y-1 text-sm text-muted-foreground">
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
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-md p-3">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
              💡
            </span>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
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
          <img
            src={props.imageUrl || "/placeholder.svg"}
            alt={props.term}
            className="object-cover w-full h-full transition-transform duration-200"
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
