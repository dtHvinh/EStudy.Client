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

  const calcPercentage = () => {
    if (!setInfo) return 0;
    if (setInfo.cardCount === 0) return 0;
    return parseFloat(
      ((setInfo.progress / setInfo.cardCount) * 100).toFixed(0)
    );
  };

  const handleSkipCard = async (cardId: number | string) => {
    const success = await skipCard(cardId);
    if (success) {
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
      <div className="flex flex-col overflow-hidden md:h-[calc(100vh-3*var(--header-height))]">
        <div className="flex justify-between items-center px-4">
          <div className="block">
            <NavigateBack />
          </div>
          <div className="block">
            <FocusTimer />
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Study Mode
          </h1>
          {setInfo && (
            <div className="w-full max-w-md mx-auto space-y-2">
              <div className="flex justify-between items-center text-sm sm:text-base">
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
        <div className="flex-1 flex lg:flex-row items-center justify-center gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8 pb-8">
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
    <CarouselItem key={card.id}>
      <div className="p-2 sm:p-4">
        <Card className="w-full">
          <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="text-center space-y-2 sm:space-y-4">
              <span className="text-2xl dsm:text-3xl lg:text-4xl font-semibold leading-tight">
                {card.term}
              </span>
              {card.partOfSpeech && (
                <div className="text-sm sm:text-base text-muted-foreground">
                  {card.partOfSpeech}
                </div>
              )}
            </div>
          </CardContent>
          <CardAction className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full justify-between p-4">
            <Button
              disabled={card.isSkipped}
              variant={"default"}
              className="w-full sm:w-auto order-2 sm:order-1"
              onClick={onSkip}
            >
              Already know it, skip!
            </Button>

            <div className="flex gap-2 justify-center order-1 sm:order-2">
              <Button
                variant={"outline"}
                onClick={scrollPrev}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <IconChevronLeft className="w-4 h-4" />
                <span className="ml-1 sm:hidden">Previous</span>
              </Button>
              <Button
                variant={"outline"}
                onClick={scrollNext}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <IconChevronRight className="w-4 h-4" />
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
            <div className="text-center space-y-2 sm:space-y-4">
              <span className="text-2xl dsm:text-3xl lg:text-4xl font-semibold leading-tight">
                You did it!!!
              </span>
              <div className="text-sm sm:text-base text-muted-foreground">
                Do you want to restart ?
              </div>
            </div>
          </CardContent>
          <CardAction className="flex justify-center sm:flex-row gap-2 sm:gap-0 w-full">
            <Button onClick={onReset} variant={"default"} className="sm:w-auto">
              Restart
            </Button>
          </CardAction>
        </Card>
      </div>
    </CarouselItem>
  );
};
