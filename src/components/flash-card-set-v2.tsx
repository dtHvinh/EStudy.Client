import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import dayjs from "dayjs";
import { Clock, Heart } from "lucide-react";

interface DataCardProps {
  id: number;
  title: string;
  description?: string;
  lastAccess: string | null;
  progress: number;
  isFavorite: boolean;
  cardCount: number;
}

export function FlashCardSetV2({
  id,
  title,
  description,
  lastAccess,
  progress,
  isFavorite,
  cardCount,
}: DataCardProps) {
  const progressPercentage = cardCount > 0 ? (progress / cardCount) * 100 : 0;

  return (
    <Card className="@container/card hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {title}
          </CardTitle>
          {isFavorite && (
            <Heart className="h-5 w-5 text-red-500 fill-current flex-shrink-0 ml-2" />
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {progress}/{cardCount} ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Last Access Section */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{dayjs(lastAccess).fromNow()}</span>
        </div>

        {/* ID Badge */}
        <div className="flex justify-end">
          <Badge variant="secondary" className="text-xs">
            ID: {id}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
