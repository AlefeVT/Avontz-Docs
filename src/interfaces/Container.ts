export type ContainerData = {
  userId: number;
  name: string;
  parentId: number | null;
  description: string | null;
  createdAt: Date | null;
  deletedAt?: Date | null;
};
