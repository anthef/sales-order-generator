import { db } from '@/lib/db';
import { salesOrders, salesOrderItems } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const [salesOrder] = await db
      .select()
      .from(salesOrders)
      .where(eq(salesOrders.id, id));

    if (!salesOrder) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }

    const items = await db
      .select()
      .from(salesOrderItems)
      .where(eq(salesOrderItems.soId, id));

    return NextResponse.json({ ...salesOrder, items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales order' }, { status: 500 });
  }
}