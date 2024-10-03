import Image from "next/image";
import { getPlantById } from "@/data-access/plants";
import { NotFoundError } from "@/app/util";
import { getFileUrl } from "@/lib/files";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default async function InfoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const parsedPlantId = Number(id);

  if (isNaN(parsedPlantId)) {
    throw new NotFoundError("ID da planta inválido.");
  }

  const plant = await getPlantById(parsedPlantId);

  if (!plant) {
    throw new NotFoundError("Planta não encontrada!");
  }

  const photoNames = plant.photoName
    ? plant.photoName.split(",").map((fileName) => fileName.trim())
    : [];

  const photoUrls = await Promise.all(
    photoNames.map((photoName) =>
      getFileUrl({ key: `plants/${id}/images/${photoName}` })
    )
  );

  return (
    <div className="min-h-screen text-white mb-10">
      {/* Header */}
      <header className="bg-green-500/10 dark:bg-green-900/20 text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold">{plant.name}</h1>
          {plant.scientificName && (
            <p className="italic text-gray-700 dark:text-gray-200 text-xl mt-2">{plant.scientificName}</p>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6 space-y-10">
        {/* Plant Info */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">
              Sobre a Planta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-200">{plant.description}</p>
            {plant.history && (
              <>
                <h3 className="text-2xl font-bold">História</h3>
                <p className="text-md text-gray-600 dark:text-gray-100">{plant.history}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Images */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">
              Galeria de Imagens
              <Badge className="ml-2 bg-green-500 text-white">
                {photoUrls.length} Imagem(ns)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {photoUrls.length > 0 ? (
              photoUrls.map((url, index) => (
                <div key={index} className="relative h-64 w-full">
                  <Image
                    src={url}
                    alt={`Foto da planta ${plant.name} - ${index + 1}`}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-gray-500">Nenhuma imagem disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
