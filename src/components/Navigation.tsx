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
    <div className="fixed bottom-0 left-0 flex w-full flex-col bg-white dark:bg-gray-800">
      <div className="h-[2px] bg-gradient-to-r from-red-200 via-red-300 to-yellow-200" />
      <div className="container py-1">
        <div
          className={cn("flex flex-col gap-2 sm:flex-row", "overflow-hidden", {
            "items-end justify-end": status === "unauthenticated",
            "items-center justify-center": status === "loading",
          })}
        >
          {status === "authenticated" && (
            <>
              <div className="flex grow items-center justify-between overflow-hidden py-2 pr-2 [&>div]:!min-w-0">
                <Dropdown
                  label=""
                  placement="top-start"
                  renderTrigger={() => (
                    <div className="flex cursor-pointer items-center gap-4 overflow-hidden transition-opacity hover:opacity-80">
                      {data.user?.image && (
                        <Image
                          src={data.user.image}
                          alt="userImage"
                          width={92}
                          height={92}
                          className="size-11 flex-none rounded-full object-cover"
                        />
                      )}
                      <div className="truncate font-medium">{data.user?.name}</div>
                    </div>
                  )}
                >
                  <DropdownItem className="max-w-28" onClick={() => push("/api/auth/signout")}>
                    Выйти
                  </DropdownItem>
                </Dropdown>
                <DarkThemeToggle />
              </div>
              <div className="flex max-w-full items-center justify-end">
                <div className="overflow-auto">
                  <Button.Group className="p-0.5">
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
                </div>
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

          {status === "loading" && <Spinner color="pink" size="xl" />}
        </div>
      </div>
    </div>
  );
};
