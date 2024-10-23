"use client";

import cn from "classnames";
import { Button, DarkThemeToggle, Dropdown, DropdownItem, Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";

export const Navigation: FC = () => {
  const { push } = useRouter();
  const path = usePathname();
  const { status, data } = useSession();

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-auto bg-inherit dark:bg-gray-800">
      <div
        className={cn(
          "container flex flex-wrap gap-4 py-5 flex-col sm:flex-row",
          status === "authenticated" ? "justify-between" : "justify-end",
        )}
      >
        {status === "authenticated" && (
          <>
            <div className="flex grow justify-between">
              <Dropdown
                label=""
                renderTrigger={() => (
                  <div className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80">
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
                )}
              >
                <DropdownItem onClick={() => push("/api/auth/signout")}>Выйти</DropdownItem>
              </Dropdown>
              <DarkThemeToggle />
            </div>
            <Button.Group className="self-end">
              <Button
                gradientDuoTone="redToYellow"
                outline={path !== "/feelings"}
                onClick={() => push("/feelings")}
                size="sm"
              >
                Эмоции
              </Button>
              <Button
                gradientDuoTone="redToYellow"
                outline={path !== "/thoughts"}
                onClick={() => push("/thoughts")}
                size="sm"
              >
                Мысли
              </Button>
              <Button
                gradientDuoTone="redToYellow"
                outline={path !== "/affirmations"}
                onClick={() => push("/affirmations")}
                size="sm"
              >
                Внушения
              </Button>
              <Button
                gradientDuoTone="redToYellow"
                outline={path !== "/home-tasks"}
                onClick={() => push("/home-tasks")}
                size="sm"
              >
                Домашка
              </Button>
            </Button.Group>
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

        {status === "loading" && <Spinner color="pink" size="xl" />}
      </div>
    </div>
  );
};
