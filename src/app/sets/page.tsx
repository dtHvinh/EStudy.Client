"use client";

import DataErrorAlert from "@/components/data-error-alert";
import { FlashCardSetSkeleton } from "@/components/flash-card-set";
import FlashCardSetList from "@/components/flash-card-set-list";
import MainLayout from "@/components/layouts/MainLayout";
import H3 from "@/components/ui/h3";
import useMyFlashCardSet from "@/hooks/useMyFlashCardSet";

export default function Page() {
  const {
    favoriteSets,
    nonFavoriteSets,
    getSetError,
    refresh,
    isSetLoading,
    addToFavorite,
    removeFromFavorite,
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
      <H3 className="px-4">My sets</H3>
      <FlashCardSetList
        sets={nonFavoriteSets}
        onAddToFavorite={addToFavorite}
        onRemoveFromFavorite={removeFromFavorite}
      />
    </MainLayout>
  );
}
