import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSellerId } from '@/lib/currentSeller';

export async function GET() {
  try {
    const sellerId = await getCurrentSellerId();
    if (!sellerId) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
    }

    const [total, grouped] = await Promise.all([
      prisma.listing.count({ where: { sellerId } }),
      prisma.listing.groupBy({
        by: ['status'],
        where: { sellerId },
        _count: { status: true },
      }),
    ]);

    const counts: Partial<Record<'DRAFT' | 'PUBLISHED' | 'SOLD', number>> = {
      DRAFT: 0,
      PUBLISHED: 0,
      SOLD: 0,
    };

    for (const item of grouped) {
      const key = item.status as 'DRAFT' | 'PUBLISHED' | 'SOLD';
      if (key in counts) {
        counts[key] = item._count.status;
      }
    }

    return NextResponse.json({
      total,
      published: counts.PUBLISHED ?? 0,
      draft: counts.DRAFT ?? 0,
      sold: counts.SOLD ?? 0,
    });
  } catch (error) {
    console.error('Error fetching listing stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing stats' },
      { status: 500 }
    );
  }
}
