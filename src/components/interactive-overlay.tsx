'use client';

import { ReactNode, createContext, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import useMediaQuery from '@/hooks/use-media-query';

type ToggleContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  preventCloseRef: React.MutableRefObject<boolean>;
};

export const ToggleContext = createContext<ToggleContextType>({
  isOpen: false,
  setIsOpen: () => {},
  preventCloseRef: { current: false },
});

export function InteractiveOverlay({
  isOpen,
  setIsOpen,
  title,
  description,
  form,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: ReactNode;
  title: string;
  description: string;
}) {
  const { isMobile } = useMediaQuery();
  const preventCloseRef = useRef(false);

  return (
    <ToggleContext.Provider
      value={{
        isOpen,
        setIsOpen,
        preventCloseRef,
      }}
    >
      {!isMobile ? (
        <Sheet
          open={isOpen}
          onOpenChange={(value) => {
            if (preventCloseRef.current) return;
            setIsOpen(value);
          }}
        >
          <SheetContent className="max-h-screen overflow-auto">
            <SheetHeader className="px-2">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>

            {/* Scrollable area */}
            <ScrollArea className="flex-1 pr-4 pt-4 pb-8">
              {form}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer
          open={isOpen}
          onOpenChange={(value) => {
            if (preventCloseRef.current) return;
            setIsOpen(value);
          }}
        >
          <DrawerContent className="max-h-screen overflow-auto">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>

            {/* Scrollable area */}
            <ScrollArea className="px-8 pb-8">
              {form}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </ToggleContext.Provider>
  );
}
