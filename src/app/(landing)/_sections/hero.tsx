import { SignedIn } from "@/components/auth";
import { SignedOut } from "@/components/auth";
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row gap-y-14 w-full justify-between">
          <div className="">
            <Badge className="text-sm md:text-base">
              Descubra pessoas que pensam como você
            </Badge>
            <h1 className="text-5xl md:text-7xl max-w-3xl mt-10 leading-[1.2] font-semibold">
              Crie e descubra novos grupos de hobby
            </h1>
            <p className="mt-5 text-gray-500 text-lg max-w-[600px]">
              Nosso serviço on-line facilita a conexão com outras pessoas que compartilham
              seus interesses, seja caminhar, pintar ou jogar futebol.
              Crie ou participe de um grupo, agende encontros e divirta-se perseguindo seus objetivos.
              paixões com novos amigos ao seu lado. Comece a construir o seu
              comunidade hoje!
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-10">
              <SignedIn>
                <Button asChild>
                  <Link href={"/dashboard"}>Visualizar Painel Geral</Link>
                </Button>
              </SignedIn>

              <SignedOut>
                <Button asChild>
                  <Link href={"/sign-in"}>Crie uma conta</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
          <Image
            className="rounded-xl w-[400px] h-[400px]"
            width="200"
            height="200"
            src="/group.jpeg"
            alt="hero image"
          />
        </div>
      </Container>
    </>
  );
}
