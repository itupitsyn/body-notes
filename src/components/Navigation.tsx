"use client";

import { Button } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const Navagation: FC = () => {
  const { push } = useRouter();

  const kek = useSession();

  console.log(kek);

  return (
    <Button.Group>
      <Button gradientDuoTone="purpleToBlue" onClick={() => push("/feelings")}>
        Чувства
      </Button>
      <Button gradientDuoTone="purpleToBlue" onClick={() => push("/thoughts")}>
        Мысли
      </Button>
      <Button gradientDuoTone="purpleToBlue" onClick={() => push("/affirmations")}>
        Внушения
      </Button>
      <Button gradientDuoTone="purpleToBlue" onClick={() => push("/home-tasks")}>
        Домашка
      </Button>
    </Button.Group>
  );
};
