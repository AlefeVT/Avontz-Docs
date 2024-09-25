"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { tabStyles } from "@/styles/common";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabsSection({
  groupId,
  showSettings,
}: {
  groupId: string;
  showSettings: boolean;
}) {
  const path = usePathname();
  const tabInUrl = path.includes("/posts") ? "posts" : path.split("/").pop();

  return (
    <div className={tabStyles}>
      <div className="container mx-auto">
        <Tabs value={tabInUrl} defaultValue={tabInUrl} activationMode="manual">
          <TabsList className="flex-wrap space-x-4 bg-inherit h-fit">
            <TabsTrigger asChild value="info">
              <Link href={`/dashboard/groups/${groupId}/info`}>Informações</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="posts">
              <Link href={`/dashboard/groups/${groupId}/posts`}>Postagens</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="events">
              <Link href={`/dashboard/groups/${groupId}/events`}>Eventos</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="Membros">
              <Link href={`/dashboard/groups/${groupId}/members`}>Membros</Link>
            </TabsTrigger>

            {showSettings && (
              <>
                <TabsTrigger asChild value="settings">
                  <Link href={`/dashboard/groups/${groupId}/settings`}>
                  Configurações
                  </Link>
                </TabsTrigger>

                <TabsTrigger asChild value="danger">
                  <Link href={`/dashboard/groups/${groupId}/danger`}>
                    Perigo
                  </Link>
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
