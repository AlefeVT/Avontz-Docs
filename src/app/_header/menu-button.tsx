'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BookIcon,
  MenuIcon,
  SearchIcon,
  LayoutDashboard,
  File,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MenuButton() {
  const path = usePathname();
  const isLandingPage = path === '/';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2">
        {!isLandingPage && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex gap-2 items-center cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" /> Painel Geral
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link
                href="/plants"
                className="flex gap-2 items-center cursor-pointer"
              >
                <Package className="w-4 h-4" /> Plantas
              </Link>
            </DropdownMenuItem> */}

            {/* <DropdownMenuItem asChild>
              <Link
                href="/docs"
                className="flex gap-2 items-center cursor-pointer"
              >
                <BookIcon className="w-4 h-4" /> API Docs
              </Link>
            </DropdownMenuItem> */}
          </>
        )}
        {isLandingPage && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/#features"
                className="flex gap-2 items-center cursor-pointer"
              >
                Sobre
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/#pricing"
                className="flex gap-2 items-center cursor-pointer"
              >
                Preços
              </Link>
            </DropdownMenuItem>
            
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
