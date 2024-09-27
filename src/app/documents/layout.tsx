import { ReactNode } from 'react';

export default async function DocumentsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div>{children}</div>;
}
