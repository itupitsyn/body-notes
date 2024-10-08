"use client";

import { PrismaTypes } from "@/types/prisma";
import { Button, Card } from "flowbite-react";
import { FC, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { AffirmationForm } from "./components/AffirmationForm";

interface AffirmationsProps {
  affirmations: PrismaTypes.Affirmation[];
}

export const Affirmations: FC<AffirmationsProps> = ({ affirmations }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const { refresh } = useRouter();

  return (
    <div>
      <div className="mt-10 flex items-center justify-between gap-6">
        <h1 className="text-4xl font-bold">Внушения</h1>
        <Button
          gradientDuoTone="redToYellow"
          outline
          onClick={() => setMode((prev) => (prev === "edit" ? "view" : "edit"))}
        >
          <BiEdit className="size-6" />
        </Button>
      </div>
      {mode === "edit" && (
        <Card className="mt-10">
          <AffirmationForm onAfterUpdate={refresh} />
        </Card>
      )}
      <div className="mt-10 flex flex-col gap-4">
        {mode === "view"
          ? affirmations
              .filter((item) => item.visible)
              .map((item) => (
                <Card key={item.id}>
                  <div className="overflow-hidden text-ellipsis">{item.text}</div>
                </Card>
              ))
          : affirmations.map((item) => (
              <Card key={item.id}>
                <AffirmationForm affirmation={item} onAfterUpdate={refresh} />
              </Card>
            ))}
      </div>
    </div>
  );
};
