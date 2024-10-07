"use client";

import cn from "classnames";
import { Button, DarkThemeToggle } from "flowbite-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";

export const Navigation: FC = () => {
  const { push } = useRouter();
  const path = usePathname();
  const { status, data } = useSession();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 py-10",
        status === "authenticated" ? "justify-between" : "justify-end",
      )}
    >
      {status === "authenticated" && (
        <>
          <div className="flex items-center gap-4">
            {data.user?.image && (
              <Image
                src={data.user.image}
                alt="userImage"
                width={92}
                height={92}
                className="size-11 flex-none rounded-full object-cover"
              />
            )}
            <div className="font-medium">{data.user?.name}</div>
          </div>
          <div className="flex items-center gap-4">
            <DarkThemeToggle />
            <Button.Group>
              <Button gradientDuoTone="redToYellow" outline={path !== "/feelings"} onClick={() => push("/feelings")}>
                Чувства
              </Button>
              <Button gradientDuoTone="redToYellow" outline={path !== "/thoughts"} onClick={() => push("/thoughts")}>
                Мысли
              </Button>
              <Button
                gradientDuoTone="redToYellow"
                outline={path !== "/affirmations"}
                onClick={() => push("/affirmations")}
              >
                Внушения
              </Button>
              <Button
                gradientDuoTone="redToYellow"
                outline={path !== "/home-tasks"}
                onClick={() => push("/home-tasks")}
              >
                Домашка
              </Button>
            </Button.Group>
          </div>
        </>
      )}

      {status === "unauthenticated" && (
        <div className="flex items-center gap-4">
          <DarkThemeToggle />
          <Button gradientDuoTone="redToYellow" outline onClick={() => push("/api/auth/signin")}>
            Войти
          </Button>
        </div>
      )}
    </div>
  );
};
