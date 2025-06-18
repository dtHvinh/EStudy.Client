import {
  EditFlashCardSetParamType,
  FlashCardSetResponseType,
} from "@/hooks/useMyFlashCardSet";
import FlashCardSet from "./flash-card-set";

export default function FlashCardSetList({
  sets,
  onAddToFavorite,
  onRemoveFromFavorite,
  onEdit,
  onDelete,
}: {
  sets: FlashCardSetResponseType[];
  onAddToFavorite: (cardSet: FlashCardSetResponseType) => void;
  onRemoveFromFavorite: (cardSet: FlashCardSetResponseType) => void;
  onDelete: (cardSet: FlashCardSetResponseType) => void;
  onEdit: (cardSet: EditFlashCardSetParamType) => Promise<boolean>;
}) {
  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-8 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3">
      {sets.map((set) => (
        <FlashCardSet
          {...set}
          key={set.id}
          onAddToFavorite={() => onAddToFavorite(set)}
          onRemoveFromFavorite={() => onRemoveFromFavorite(set)}
          onEdit={onEdit}
          onDelete={() => onDelete(set)}
        />
      ))}
    </div>
  );
}
