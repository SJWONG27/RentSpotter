"use client";

import { Card, CardHeader, CardContent } from "components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  subheaderLabel?: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  subheaderLabel,
}: CardWrapperProps) => {
  return (
    <Card className="sm:w-[30rem]">
      <CardHeader>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{headerLabel}</h1>
          <p className="text-muted-foreground text-sm">{subheaderLabel}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
