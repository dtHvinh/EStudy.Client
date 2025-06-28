"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TestOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Test Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Difficulty</span>
          <Badge variant="secondary">Intermediate</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Category</span>
          <Badge variant="outline">Programming</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Language</span>
          <span className="text-sm font-medium">JavaScript</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Pass Rate</span>
          <span className="text-sm font-medium text-green-600">78%</span>
        </div>
      </CardContent>
    </Card>
  );
}
