import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { nairaToKobo, serializeListing } from '@/lib/money';
import { getCurrentSellerId } from '@/lib/currentSeller';

const STATUSES = ['draft', 'published', 'sold'] as const;

const jsonError = (error: string, status: number) => NextResponse.json({ error }, { status });

/** Signed in + owns the listing, or an error response to return as-is. */
async function authorizeOwner(id: string) {
  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: jsonError('Please sign in', 401) };

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { sellerId: true, publishedAt: true },
  });
  if (!listing) return { error: jsonError('Listing not found', 404) };
  if (listing.sellerId !== sellerId) return { error: jsonError('You can only change your own listings', 403) };

  return { listing };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            rating: true,
            verified: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.status !== 'published') {
      // Drafts and sold listings are only visible to their owner
      const sellerId = await getCurrentSellerId();
      if (sellerId !== listing.sellerId) {
        return jsonError('Listing not found', 404);
      }
    } else {
      await prisma.listing.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json(serializeListing(listing));
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const auth = await authorizeOwner(id);
    if (auth.error) return auth.error;

    const body = await request.json();
    // Only these fields can be edited. Anything else (sellerId, views, favorites…) is ignored.
    const data: Prisma.ListingUpdateInput = {};

    for (const key of ['title', 'location'] as const) {
      if (body[key] !== undefined) {
        if (typeof body[key] !== 'string' || !body[key].trim()) return jsonError(`${key} cannot be empty`, 400);
        data[key] = body[key].trim();
      }
    }
    for (const key of ['description', 'category'] as const) {
      if (body[key] !== undefined) {
        if (typeof body[key] !== 'string') return jsonError(`${key} must be text`, 400);
        data[key] = body[key].trim();
      }
    }

    // Client sends naira; DB stores kobo
    if (body.price !== undefined) {
      const priceKobo = nairaToKobo(body.price);
      if (priceKobo === null) return jsonError('Price must be a positive amount in naira', 400);
      data.price = priceKobo;
    }

    if (body.specs !== undefined) {
      if (!body.specs || typeof body.specs !== 'object' || Array.isArray(body.specs)) {
        return jsonError('specs must be an object', 400);
      }
      data.specs = body.specs as Prisma.InputJsonObject;
    }

    for (const key of ['images', 'documents'] as const) {
      if (body[key] !== undefined) {
        if (!Array.isArray(body[key]) || !body[key].every((u: unknown) => typeof u === 'string')) {
          return jsonError(`${key} must be a list of links`, 400);
        }
        data[key] = body[key];
      }
    }

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) return jsonError('status must be draft, published or sold', 400);
      data.status = body.status;
      data.published = body.status === 'published';
      if (body.status === 'published' && !auth.listing.publishedAt) data.publishedAt = new Date();
    }

    const listing = await prisma.listing.update({
      where: { id },
      data,
    });

    return NextResponse.json(serializeListing(listing));
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const auth = await authorizeOwner(id);
    if (auth.error) return auth.error;

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
