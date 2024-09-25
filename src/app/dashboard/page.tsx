
import { Button } from "@/components/ui/button";
import { assertAuthenticated } from "@/lib/session";
import { cn } from "@/lib/utils";
import { cardStyles, pageTitleStyles } from "@/styles/common";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateGroupButton } from "./create-group-button";
import { PageHeader } from "@/components/page-header";

export default async function DashboardPage() {
  const user = await assertAuthenticated();

  if (false) {
    return (
      <div
        className={cn(
          "space-y-8 container mx-auto py-24 min-h-screen max-w-2xl flex flex-col items-center"
        )}
      >
        <div className="flex justify-between items-center">
          <h1 className={pageTitleStyles}>Seus grupos</h1>
        </div>

        <div
          className={cn(
            cardStyles,
            "flex flex-col items-center gap-6 p-12 w-full"
          )}
        >
          <Image
            src="/empty-state/no-data.svg"
            width="200"
            height="200"
            alt="no image placeholder image"
          ></Image>
          <h2>Uh-oh, você não possui nenhum grupo</h2>

          <div className="flex gap-4">
            <CreateGroupButton />

            <Button asChild className={btnStyles} variant={"secondary"}>
              <Link href={`/browse`}>
                <Search className={btnIconStyles} /> Navegar nos grupos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            "flex justify-between items-center flex-wrap gap-4"
          )}
        >
          Seus grupos
          <CreateGroupButton />
        </h1>
      </PageHeader>
      <div className={cn("space-y-8 container mx-auto py-12 min-h-screen")}>
        <div className="flex justify-between items-center">
          <h2 className={"text-2xl"}>Grupos que você gerencia</h2>
        </div>

        <div className="flex justify-between items-center">
          <h2 className={"text-2xl"}>Seus outros grupos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
        </div>
      </div>
    </>
  );
}
