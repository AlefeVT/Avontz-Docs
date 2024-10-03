import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <Image
          src={"/empty-state/page_404.svg"}
          height={300}
          width={500}
          alt={"Página não encontrada!"}
          className="mx-auto"
        />
      </div>
      <p className="text-2xl sm:text-4xl text-gray-200 text-center mt-6 mb-8">
        Oops! A página que você está procurando não foi encontrada.
      </p>
      <Link href="/">
        <Button className="px-6 py-3 text-sm sm:text-base">
          Voltar para a Página Inicial
        </Button>
      </Link>
    </div>
  );
}
