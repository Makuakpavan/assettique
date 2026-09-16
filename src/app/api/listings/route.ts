import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { nairaToKobo, serializeListing } from '@/lib/money';
import { getCurrentSellerId } from '@/lib/currentSeller';

// Parses a query number, falling back to `fallback` and clamping to [min, max]
function clampInt(value: string | null, fallback: number, min: number, max: number) {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isNaN(n) ? fallback : Math.min(max, Math.max(min, n));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'vehicle' | 'property'
    const mine = searchParams.get('mine') === '1';
    const limit = clampInt(searchParams.get('limit'), 20, 1, 50);
    const skip = clampInt(searchParams.get('skip'), 0, 0, 10_000);

    // Public: published listings only.
    // ?mine=1: the signed-in seller's own listings in any status (for the seller dashboard).
    let where: Prisma.ListingWhereInput = { status: 'published' };
    if (mine) {
      const sellerId = await getCurrentSellerId();
      if (!sellerId) {
        return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
      }
      where = { sellerId };
    }
    if (type === 'vehicle' || type === 'property') where.type = type;

    const listings = await prisma.listing.findMany({
      where,
      orderBy: mine ? { createdAt: 'desc' } : { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        location: true,
        images: true,
        type: true,
        category: true,
        status: true,
        views: true,
        seller: {
          select: {
            name: true,
            rating: true,
            verified: true,
          },
        },
      },
    });

    const total = await prisma.listing.count({ where });

    return NextResponse.json({
      listings: listings.map(serializeListing),
      total,
      skip,
      limit,
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Seller comes from the verified session, never from the request body
    const sellerId = await getCurrentSellerId();
    if (!sellerId) {
      return NextResponse.json({ error: 'Please sign in to create a listing' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      title,
      description,
      type, // 'vehicle' | 'property'
      price,
      location,
      category,
      specs,
      images = [],
      documents = [],
      publish = false,
    } = body;

    // Validation
    if (!title || !type || !price || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type !== 'vehicle' && type !== 'property') {
      return NextResponse.json(
        { error: "type must be 'vehicle' or 'property'" },
        { status: 400 }
      );
    }

    // Client sends naira; DB stores kobo
    const priceKobo = nairaToKobo(price);
    if (priceKobo === null) {
      return NextResponse.json(
        { error: 'Price must be a positive amount in naira' },
        { status: 400 }
      );
    }

    const now = new Date();

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description ?? '',
        type,
        price: priceKobo,
        location,
        assetType: type,
        category,
        specs: specs && typeof specs === 'object' ? specs : undefined,
        images: Array.isArray(images) ? images.filter((u: unknown) => typeof u === 'string') : [],
        documents: Array.isArray(documents) ? documents.filter((u: unknown) => typeof u === 'string') : [],
        sellerId,
        status: publish ? 'published' : 'draft',
        published: Boolean(publish),
        publishedAt: publish ? now : null,
      },
    });

    return NextResponse.json(serializeListing(listing), { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
