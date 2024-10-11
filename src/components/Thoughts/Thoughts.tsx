"use client";

import { PrismaTypes } from "@/types/prisma";
import { Button, Card } from "flowbite-react";
import { FC, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { ThoughtForm } from "./components/ThoughtForm";
import { DEFAULT_LOCALE } from "@/api/constants";

interface ThoughtsProps {
  thoughts: PrismaTypes.Thought[];
}

export const Thoughts: FC<ThoughtsProps> = ({ thoughts }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const { refresh } = useRouter();

  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-6">
        <h1 className="text-4xl font-bold">Мысли</h1>
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
          <ThoughtForm onAfterUpdate={refresh} />
        </Card>
      )}
      <div className="mt-10 flex flex-col gap-4">
        {mode === "view"
          ? thoughts.map((item) => (
              <Card key={item.id}>
                <div className="flex justify-end font-medium">
                  {item.date.toLocaleString(DEFAULT_LOCALE, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="overflow-hidden text-ellipsis">{item.text}</div>
              </Card>
            ))
          : thoughts.map((item) => (
              <Card key={item.id}>
                <ThoughtForm thought={item} onAfterUpdate={refresh} />
              </Card>
            ))}
      </div>
    </>
  );
};
