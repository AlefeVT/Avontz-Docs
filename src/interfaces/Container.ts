export interface ContainerData {
  id: string;
  userId: number | null;
  name: string;
  description: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  parentId: number | null;
  filesCount: number;
  files: {
    id: string;
  }[];
}
