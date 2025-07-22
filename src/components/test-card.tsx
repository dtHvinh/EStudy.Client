import { CreateTestCollectionButton } from "@/app/tests/page";
import { GetTestResponseType } from "@/hooks/use-tests";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { IconLibraryPlusFilled } from "@tabler/icons-react";
import { Clock, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import api from "./utils/requestUtils";

export default function TestCard({
  className,
  ...props
}: { className?: string } & GetTestResponseType) {
  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-md", className)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{props.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {props.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto space-y-4">
        <div className="text-muted-foreground text-sm">
          Created by: {props.authorName}
        </div>
        <div>
          {props.sectionCount} sections | {props.questionCount} questions
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-b py-3">
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">{props.duration}m</div>
            <div className="text-muted-foreground truncate text-xs">
              Duration
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">
              {props.attemptCount.toLocaleString("en")}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              Attempts
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">
              {props.commentCount.toLocaleString("en")}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              Comments
            </div>
          </div>
        </div>

        {/* Action Button */}
        {/* <Button className="w-full" size="sm">
          <Play className="mr-2 h-4 w-4" />
          {isCompleted ? "Retake Test" : "Start Test"}
        </Button> */}
      </CardContent>
      <CardAction className="flex w-full gap-2 px-5">
        <Link className="flex-1" href={`/tests/${props.id}`}>
          <Button variant={"outline"} className="w-full">
            Details
          </Button>
        </Link>
        <AddToCollectionButton testId={props.id} />
      </CardAction>
    </Card>
  );
}

const AddToCollectionButton = ({ testId }: { testId: string | number }) => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null; // No more
    return `/api/tests/${testId}/test-collections-with-add-status?page=${pageIndex + 1}&pageSize=20`;
  };

  const { data, setSize, mutate } = useSWRInfinite<
    {
      id: string;
      name: string;
      description: string;
      isAdded: boolean;
    }[]
  >(getKey, api.get);
  const { ref, inView } = useInView();

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await api.post(`/api/tests/test-collections/add-test`, {
        testId,
        collectionId,
        isAdd: true,
      });
      toast.success("Test added to collection successfully!", {
        duration: 750,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error adding to collection:", error);
    }
  };

  const handleRemoveFromCollection = async (collectionId: string) => {
    try {
      await api.post(`/api/tests/test-collections/add-test`, {
        testId,
        collectionId,
        isAdd: false,
      });
      toast.error("Test removed from collection successfully!", {
        duration: 750,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error removing from collection:", error);
    }
  };

  const collections = data ? data.flat() : [];

  useEffect(() => {
    if (inView) {
      setSize((pre) => pre + 1);
    }
  }, [inView]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <IconLibraryPlusFilled />
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[320px]">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Select a collection to add this test to.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] overflow-auto">
          <div className="space-y-4">
            {collections.map((collection) => (
              <div className="flex items-center gap-5" key={collection.id}>
                <Checkbox
                  className="h-5 w-5"
                  id={`collection-${collection.id}`}
                  defaultChecked={collection.isAdded}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAddToCollection(collection.id);
                    } else {
                      handleRemoveFromCollection(collection.id);
                    }
                  }}
                />
                <div className="flex flex-col">
                  <p>{collection.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {collection.description}
                  </p>
                </div>
              </div>
            ))}
            <div ref={ref} />
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="w-full [&_button]:w-full">
            <CreateTestCollectionButton onCollectionCreated={mutate} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
