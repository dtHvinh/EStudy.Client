"use client";

import FocusTimer from "@/components/focus-timer";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import useSetCards, { FlashCardResponseType } from "@/hooks/use-set-cards";
import useSetInfo from "@/hooks/use-set-info";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const { cards, scrollNext, skipCard, resetCards, isCardLoading } =
    useSetCards({
      id: id,
      pageSize: 6,
      shuffle: true,
      study: true,
    });
  const { setInfo, setInfoMutate } = useSetInfo(id);

  const playSkipSound = () => {
    const audio = new Audio("/audio/correct.wav");
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  const calcPercentage = () => {
    if (!setInfo) return 0;
    if (setInfo.cardCount === 0) return 0;
    return parseFloat(
      ((setInfo.progress / setInfo.cardCount) * 100).toFixed(0),
    );
  };

  const handleSkipCard = async (cardId: number | string) => {
    const success = await skipCard(cardId);
    if (success) {
      playSkipSound();
      setInfoMutate();
      scrollNext();
    }
  };

  const onResetCards = async () => {
    if (await resetCards(id)) {
      setInfoMutate();
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col overflow-hidden md:h-[calc(100vh-var(--header-height))]">
        <div className="flex items-center justify-between px-4">
          <div className="block">
            <NavigateBack />
          </div>
          <div className="block">
            <FocusTimer />
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            Study Mode
          </h1>
          {setInfo && (
            <div className="mx-auto w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <Label className="font-semibold">
                  Total cards: {setInfo.cardCount}
                </Label>
                <Label className="font-semibold">
                  Finished cards: {setInfo.progress}
                </Label>
                <span className="text-muted-foreground">
                  {calcPercentage()}% Complete
                </span>
              </div>
              <Progress value={calcPercentage()} className="h-2" />
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center justify-center gap-4 px-4 pb-8 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
          <div className="w-sm">
            <Carousel className="w-full">
              <CarouselContent>
                {cards.map((card, index) => (
                  <CarouselFlashCardItem
                    key={card.id}
                    card={card}
                    index={index}
                    onSkip={() => handleSkipCard(card.id)}
                  />
                ))}
                {cards.length === 0 && !isCardLoading && (
                  <FinishedCard onReset={onResetCards} />
                )}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const CarouselFlashCardItem = ({
  card,
  onSkip,
}: {
  card: FlashCardResponseType;
  index: number;
  onSkip: () => void;
}) => {
  const { scrollNext, scrollPrev } = useCarousel();

  return (
    <CarouselItem>
      <div className="p-2 sm:p-4">
        <Card className="w-full">
          <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="space-y-2 text-center sm:space-y-4">
              <span className="dsm:text-3xl text-2xl leading-tight font-semibold lg:text-4xl">
                {card.term}
              </span>
              {card.partOfSpeech && (
                <div className="text-muted-foreground text-sm sm:text-base">
                  {card.partOfSpeech}
                </div>
              )}
            </div>
          </CardContent>
          <CardAction className="flex w-full flex-col justify-between gap-2 p-4 sm:flex-row sm:gap-0">
            <Button
              disabled={card.isSkipped}
              variant={"default"}
              className="order-2 w-full sm:order-1 sm:w-auto"
              onClick={onSkip}
            >
              Already know it, skip!
            </Button>

            <div className="order-1 flex justify-center gap-2 sm:order-2">
              <Button
                variant={"outline"}
                onClick={scrollPrev}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <IconChevronLeft className="h-4 w-4" />
                <span className="ml-1 sm:hidden">Previous</span>
              </Button>
              <Button
                variant={"outline"}
                onClick={scrollNext}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <IconChevronRight className="h-4 w-4" />
                <span className="ml-1 sm:hidden">Next</span>
              </Button>
            </div>
          </CardAction>
        </Card>
      </div>
    </CarouselItem>
  );
};

const FinishedCard = ({ onReset }: { onReset: () => void }) => {
  return (
    <CarouselItem>
      <div className="p-2 sm:p-4">
        <Card className="w-full">
          <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="space-y-2 text-center sm:space-y-4">
              <span className="dsm:text-3xl text-2xl leading-tight font-semibold lg:text-4xl">
                You did it!!!
              </span>
              <div className="text-muted-foreground text-sm sm:text-base">
                Do you want to restart ?
              </div>
            </div>
          </CardContent>
          <CardAction className="flex w-full justify-center gap-2 sm:flex-row sm:gap-0">
            <Button onClick={onReset} variant={"default"} className="sm:w-auto">
              Restart
            </Button>
          </CardAction>
        </Card>
      </div>
    </CarouselItem>
  );
};
