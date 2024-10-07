import { SignedIn } from '@/components/auth';
import { SignedOut } from '@/components/auth';
import Container from '@/components/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row gap-y-14 w-full justify-between">
          <div className="">
            <Badge className="text-sm md:text-base">
              Gerencie seus documentos com facilidade
            </Badge>
            <h1 className="text-4xl md:text-6xl max-w-2xl mt-10 leading-[1.2] font-semibold">
              Organize, armazene e acesse seus documentos em um só lugar
            </h1>
            <p className="mt-5 text-gray-500 text-lg max-w-[600px]">
              Nosso sistema permite que você gerencie todos os seus documentos
              de forma segura e eficiente. Acesse seus arquivos rapidamente e
              compartilhe com quem precisar. Comece agora a organizar suas
              informações com facilidade.
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-10">
              <SignedIn>
                <Button asChild>
                  <Link href={'/dashboard'}>Visualizar Painel</Link>
                </Button>
              </SignedIn>

              <SignedOut>
                <Button asChild>
                  <Link href={'/sign-in'}>Crie uma conta</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
          <div className="rounded-xl w-[400px] h-[400px] dark:bg-card bg-gray-100 flex items-center justify-center">
            <Image
              className="rounded-xl w-[400px] h-[400px]"
              width="400"
              height="400"
              src="/ilustracao.svg"
              alt="Imagem de documentos sendo gerenciados"
            />
          </div>
        </div>
      </Container>
    </>
  );
}
