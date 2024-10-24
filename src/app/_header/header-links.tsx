'use client';

import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/use-media-query';
import { BookIcon, LayoutDashboard, File, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const path = usePathname();
  const { isMobile } = useMediaQuery();
  const isLandingPage = path === '/';

  if (isMobile) return null;

  return (
    <>
      {!isLandingPage && isAuthenticated && (
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant={'link'}
            asChild
            className="flex items-center justify-center gap-2 dark:text-white text-gray-800"
          >
            <Link href={'/dashboard'}>
              <LayoutDashboard className="w-4 h-4" /> Painel Geral
            </Link>
          </Button>

          <Button
            variant={'link'}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={'/container'}>
              <Package className="w-4 h-4" /> Caixas
            </Link>
          </Button>

          <Button
            variant={'link'}
            asChild
            className="flex items-center justify-center gap-2 dark:text-white text-gray-800"
          >
            {/* <Link href={"/browse"}>
              <SearchIcon className="w-4 h-4" /> Navegar nos grupos
            </Link> */}
          </Button>

          <Button
            variant={'link'}
            asChild
            className="flex items-center justify-center gap-2 dark:text-white text-gray-800"
          >
            <Link href={'/docs'}>
              <BookIcon className="w-4 h-4" /> API Docs
            </Link>
          </Button>
        </div>
      )}

      {(isLandingPage || !isAuthenticated) && (
        <div className="hidden md:flex gap-4">
          <Button variant={'link'} className="dark:text-white" asChild>
            <Link href="/#features">Sobre</Link>
          </Button>

          <Button variant={'link'} className="dark:text-white" asChild>
            <Link href="/#pricing">Preços</Link>
          </Button>
        </div>
      )}
    </>
  );
}
