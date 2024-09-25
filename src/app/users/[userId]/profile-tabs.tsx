"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { tabStyles } from "@/styles/common";
import { UserId } from "lucia";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileTabs({ userId }: { userId: UserId }) {
  const path = usePathname();
  const tabInUrl = path.includes("/posts") ? "posts" : path.split("/").pop();

  return (
    <div className={tabStyles}>
      <div className="container mx-auto">
        <Tabs value={tabInUrl} defaultValue={tabInUrl} activationMode="manual">
          <TabsList className="flex-wrap space-x-4 bg-inherit h-fit">
            <TabsTrigger asChild value="info">
              <Link href={`/users/${userId}/info`}>Biografia</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="posts">
              <Link href={`/users/${userId}/posts`}>Postagens recentes</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="groups">
              <Link href={`/users/${userId}/groups`}>Grupos</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="followers">
              <Link href={`/users/${userId}/followers`}>Seguidores</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
