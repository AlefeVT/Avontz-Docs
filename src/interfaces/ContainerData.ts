export interface ContainerData {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  deletedAt?: Date | null;
  filesCount: number;
}
