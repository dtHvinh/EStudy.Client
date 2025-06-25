"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TestSettingsProps {
  passingScore: number;
  maxAttempts: number | "unlimited";
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  onUpdatePassingScore: (score: number) => void;
  onUpdateMaxAttempts: (attempts: number | "unlimited") => void;
  onUpdateShuffleQuestions: (shuffle: boolean) => void;
  onUpdateShowResultsImmediately: (show: boolean) => void;
}

export function TestSettings({
  passingScore,
  maxAttempts,
  shuffleQuestions,
  showResultsImmediately,
  onUpdatePassingScore,
  onUpdateMaxAttempts,
  onUpdateShuffleQuestions,
  onUpdateShowResultsImmediately,
}: TestSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Settings</CardTitle>
        <CardDescription>
          Configure advanced settings for your test
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) =>
                  onUpdatePassingScore(Number.parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Attempts</Label>
              <Select
                value={maxAttempts.toString()}
                onValueChange={(value) =>
                  onUpdateMaxAttempts(
                    value === "unlimited"
                      ? "unlimited"
                      : Number.parseInt(value),
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 attempt</SelectItem>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Shuffle Questions</Label>
              <Switch
                checked={shuffleQuestions}
                onCheckedChange={onUpdateShuffleQuestions}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Results Immediately</Label>
              <Switch
                checked={showResultsImmediately}
                onCheckedChange={onUpdateShowResultsImmediately}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
