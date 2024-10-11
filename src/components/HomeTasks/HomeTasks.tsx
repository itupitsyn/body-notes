"use client";

import { PrismaTypes } from "@/types/prisma";
import { Button, Card } from "flowbite-react";
import { FC, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { HomeTaskForm } from "./components/HomeTaskForm";
import { DEFAULT_LOCALE } from "@/api/constants";

interface HomeTasksProps {
  tasks: PrismaTypes.Hometask[];
}

export const HomeTasks: FC<HomeTasksProps> = ({ tasks }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const { refresh } = useRouter();

  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-6">
        <h1 className="text-4xl font-bold">Домашка</h1>
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
          <HomeTaskForm onAfterUpdate={refresh} />
        </Card>
      )}
      <div className="mt-10 flex flex-col gap-4">
        {mode === "view"
          ? tasks.map((item) => (
              <Card key={item.id}>
                <div className="flex justify-end font-medium">{item.date.toLocaleDateString(DEFAULT_LOCALE)}</div>
                <div className="overflow-hidden text-ellipsis">{item.text}</div>
              </Card>
            ))
          : tasks.map((item) => (
              <Card key={item.id}>
                <HomeTaskForm task={item} onAfterUpdate={refresh} />
              </Card>
            ))}
      </div>
    </>
  );
};
