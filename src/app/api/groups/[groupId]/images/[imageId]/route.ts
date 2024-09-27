import { streamImageFromUrl } from '@/app/api/streams';
import { env } from '@/env';
import { getCurrentUser } from '@/lib/session';
import { NextResponse } from 'next/server';

export const GET = async (
  req: Request,
  { params }: { params: { imageId: string } }
) => {
  try {
    const user = await getCurrentUser();
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
