'use client';

import cn from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from './ui/menubar';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './ui/navigation-menu';
import dynamic from 'next/dynamic';

const GridLoader = dynamic(() => import('react-spinners/GridLoader'), { ssr: false });

export const Navigation: FC = () => {
  const { push } = useRouter();
  const path = usePathname();
  const { status, data } = useSession();

  return (
    <div className="bg-background fixed bottom-0 left-0 flex w-full flex-col">
      <div className="from-pink-500-200 h-[2px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-fuchsia-950" />
      <div className="container mx-auto px-2 sm:px-0">
        <div
          className={cn('flex flex-col flex-wrap gap-2 sm:flex-row', 'overflow-hidden py-2', {
            'items-end justify-end': status === 'unauthenticated',
            'items-center justify-center': status === 'loading',
            'items-start justify-between': status === 'authenticated',
          })}
        >
          {status === 'authenticated' && (
            <>
              <Menubar className="max-w-full overflow-hidden">
                <MenubarMenu>
                  <MenubarTrigger className="overflow-hidden">
                    <div className="flex cursor-pointer items-center gap-2 overflow-hidden transition-opacity hover:opacity-80">
                      {data.user?.image && (
                        <Image
                          src={data.user.image}
                          alt="userImage"
                          width={72}
                          height={72}
                          className="size-6 flex-none rounded-full object-cover"
                        />
                      )}
                      <div className="truncate font-medium">{data.user?.name}</div>
                    </div>
                  </MenubarTrigger>

                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link href="/api/auth/signout">Выйти</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              <NavigationMenu className="max-w-full justify-end overflow-auto">
                <NavigationMenuList>
                  <NavigationMenuItem asChild>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/feelings"
                        className={cn('min-w-24 text-center', path === '/feelings' && 'font-medium')}
                      >
                        Эмоции
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem asChild>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/thoughts"
                        className={cn('min-w-24 text-center', path === '/thoughts' && 'font-medium')}
                      >
                        Мысли
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem asChild>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/affirmations"
                        className={cn('min-w-24 text-center', path === '/affirmations' && 'font-medium')}
                      >
                        Внушения
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem asChild>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/home-tasks"
                        className={cn('min-w-24 text-center', path === '/home-tasks' && 'font-medium')}
                      >
                        Домашка
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          )}

          {status === 'unauthenticated' && (
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => push('/api/auth/signin')}>
                Войти
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex h-9 items-center">
              <GridLoader color="gray" className="self-center" size={5} loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
