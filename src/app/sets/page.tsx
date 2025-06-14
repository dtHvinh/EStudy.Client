"use client";

import AddFlashCardSetForm from "@/components/add-flash-card-set-form";
import ButtonIcon from "@/components/button-icon";
import DataErrorAlert from "@/components/data-error-alert";
import { FlashCardSetSkeleton } from "@/components/flash-card-set";
import FlashCardSetList from "@/components/flash-card-set-list";
import MainLayout from "@/components/layouts/MainLayout";
import H3 from "@/components/ui/h3";
import useMyFlashCardSet from "@/hooks/useMyFlashCardSet";
import { IconPlus } from "@tabler/icons-react";

export default function Page() {
  const {
    favoriteSets,
    nonFavoriteSets,
    getSetError,
    refresh,
    isSetLoading,
    addToFavorite,
    removeFromFavorite,
    addSet,
  } = useMyFlashCardSet({
    page: 1,
    pageSize: 10,
  });

  if (isSetLoading) {
    return (
      <MainLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 px-4">
          <FlashCardSetSkeleton number={4} />
        </div>
      </MainLayout>
    );
  }

  if (getSetError) {
    return (
      <MainLayout>
        <div className="px-4">
          <DataErrorAlert title="Failed to load your sets" onReload={refresh} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {!!favoriteSets.length && (
        <>
          <H3 className="px-4">My favorite</H3>
          <FlashCardSetList
            sets={favoriteSets}
            onAddToFavorite={addToFavorite}
            onRemoveFromFavorite={removeFromFavorite}
          />
        </>
      )}
      <div className="flex items-baseline">
        <H3 className="px-4">My sets</H3>
        <AddFlashCardSetForm
          trigger={
            <ButtonIcon
              icon={<IconPlus />}
              className="ml-4"
              variant={"outline"}
              type="button"
            />
          }
          onSubmit={addSet}
        />
      </div>
      {!!nonFavoriteSets.length ? (
        <FlashCardSetList
          sets={nonFavoriteSets}
          onAddToFavorite={addToFavorite}
          onRemoveFromFavorite={removeFromFavorite}
        />
      ) : (
        <div className="px-4">
          <p className="text-muted-foreground">
            You have no sets yet. Create a new set to get started.
          </p>
        </div>
      )}
    </MainLayout>
  );
}
