import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { serializeListing } from '@/lib/money';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          price: true,
          location: true,
          images: true,
          status: true,
          sellerId: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    favorites: favorites.map((favorite) => serializeListing(favorite.listing)),
    total: favorites.length,
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const listingId = typeof body.listingId === 'string' ? body.listingId.trim() : '';

  if (!listingId) {
    return NextResponse.json({ error: 'listingId is required' }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  });

  if (!listing) {
    return NextResponse.json({
      favorited: true,
      listingId,
      ignored: true,
      message: 'Listing ID is not backed by a database row yet; toggled locally only.',
    });
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_listingId: {
        userId: user.id,
        listingId,
      },
    },
  });

  if (favorite) {
    await prisma.favorite.delete({ where: { id: favorite.id } });
    return NextResponse.json({ favorited: false, listingId });
  }

  const created = await prisma.favorite.create({
    data: {
      userId: user.id,
      listingId,
    },
  });

  return NextResponse.json({ favorited: true, listingId, favoriteId: created.id });
}
