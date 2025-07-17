import { Star } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const ratingVariants = {
  default: {
    star: "text-foreground",
    emptyStar: "text-muted-foreground",
  },
  destructive: {
    star: "text-red-500",
    emptyStar: "text-red-200",
  },
  yellow: {
    star: "text-yellow-500",
    emptyStar: "text-yellow-200",
  },
};

interface RatingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  size?: number;
  fill?: boolean;
  Icon?: React.ReactElement;
  variant?: keyof typeof ratingVariants;
}

const Ratings = ({ ...props }: RatingsProps) => {
  const {
    rating,
    totalStars = 5,
    size = 20,
    fill = true,
    Icon = <Star />,
    variant = "default",
  } = props;

  const fullStars = Math.floor(rating);

  return (
    <div className={cn("flex items-center gap-2")} {...props}>
      {[...Array(fullStars)].map((_, i) =>
        React.cloneElement(Icon, {
          key: i,
          size,
          className: cn(
            fill ? "fill-current" : "fill-transparent",
            ratingVariants[variant].star,
          ),
        }),
      )}
      {[...Array(totalStars - fullStars)].map((_, i) =>
        React.cloneElement(Icon, {
          key: i + fullStars + 1,
          size,
          className: cn(ratingVariants[variant].emptyStar),
        }),
      )}
    </div>
  );
};

export { Ratings };
