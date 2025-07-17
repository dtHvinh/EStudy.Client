"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import api from "../utils/requestUtils";

interface Review {
  id: string;
  value: number;
  review: string;
  userName: string;
  userProfilePicture: string;
  creationDate: string;
}

function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = "w-5 h-5",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground"
          } ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
}

export default function CourseRatings({
  courseId,
  onCourseRated,
}: {
  courseId: string;
  onCourseRated?: (rating: number, review: string) => void;
}) {
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const { ref, inView } = useInView();
  const getKey = (pageIndex: number, previousPageData: Review[] | null) => {
    if (previousPageData && !previousPageData.length) return null; // No more
    return `/api/courses/${courseId}/ratings?page=${pageIndex + 1}&pageSize=10`;
  };
  const { data: myRating, mutate: myRatingMutate } = useSWR<{
    id: string;
    value: number;
    review: string;
    creationDate: string;
    userName: string;
    userProfilePicture: string;
  }>(`/api/courses/${courseId}/ratings/my`, api.get);

  useEffect(() => {
    if (inView) {
      setSize((prev) => prev + 1);
    }
  }, [inView]);

  const {
    data: reviews,
    isLoading,
    setSize,
  } = useSWRInfinite<Review[]>(getKey, api.get);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading reviews...", {
        id: "loading-reviews",
      });
    } else {
      toast.dismiss("loading-reviews");
    }
  }, [isLoading]);

  const flattenedReviews = reviews ? reviews.flat() : [];

  const handleSubmitReview = () => {
    onCourseRated?.(newRating, newReview);
    myRatingMutate();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Review Submission Form */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Write a Review</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-full justify-center space-y-2">
            <div className="mx-auto flex flex-col space-y-2">
              <Label className="mx-auto">Your Rating</Label>
              {myRating ? (
                <>
                  <StarRating
                    rating={myRating.value}
                    interactive={false}
                    size="w-6 h-6"
                  />
                  <div className="text-muted-foreground text-sm">
                    {myRating.review || "No review provided"}
                  </div>
                </>
              ) : (
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  interactive
                  size="w-6 h-6"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this product..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              spellCheck="false"
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={!newRating || !newReview.trim()}
            className="w-full sm:w-auto"
          >
            Submit Review
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="space-y-4">
          {flattenedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* User Info and Rating */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={review.userProfilePicture || "/placeholder.svg"}
                          alt={review.userName}
                        />
                        <AvatarFallback>
                          {review.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-muted-foreground text-sm">
                          {dayjs(review.creationDate).fromNow()}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.value} />
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref} />
        </div>
      </div>
    </div>
  );
}
