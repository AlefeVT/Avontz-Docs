export interface PlantData {
  id: number;
  userId: number;
  name: string;
  scientificName: string | null;
  description: string;
  history: string | null;
  qrCode: string | null;
  createdAt: Date | null;
  deletedAt: Date | null; // Remover o "undefined"
  photoName: string;
}

  