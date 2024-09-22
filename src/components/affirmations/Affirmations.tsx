"use client";

import { PrismaTypes } from "@/types/prisma";
import { Button, Card } from "flowbite-react";
import { FC, useState } from "react";
import { AffirmationForm } from "./components/AffirmationForm";
import { BiEdit } from "react-icons/bi";

interface AffirmationsProps {
  affirmations: PrismaTypes.Affirmation[];
}

export const Affirmations: FC<AffirmationsProps> = ({ affirmations }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <div>
      <div className="mt-10 flex items-center justify-between gap-6">
        <div className="text-4xl font-bold">Внушения</div>
        <Button
          gradientDuoTone="redToYellow"
          outline
          onClick={() => setMode((prev) => (prev === "edit" ? "view" : "edit"))}
        >
          <BiEdit className="size-6" />
        </Button>
      </div>
      <div className="mt-10 flex flex-col gap-4">
        {affirmations.map((item) => (
          <Card key={item.id}>
            {mode === "view" && <div className="overflow-hidden text-ellipsis">{item.text}</div>}
            {mode === "edit" && <AffirmationForm affirmation={item} />}
          </Card>
        ))}
      </div>
    </div>
  );
};
