import { ReactNode } from 'react';

export default async function ContainersLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div>{children}</div>;
}
