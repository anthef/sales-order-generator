import { db } from '@/lib/db';
import { salesOrders, salesOrderItems } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const orders = await db.select().from(salesOrders).orderBy(salesOrders.createdAt);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerAddress, orderDate, deliveryDate, items } = body;

    // Generate SO number
    const soNumber = `SO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
    );    // Insert sales order
    const [salesOrder] = await db.insert(salesOrders).values({
      soNumber,
      customerName,
      customerAddress,
      orderDate: new Date(orderDate),
      deliveryDate: new Date(deliveryDate),
      totalAmount: totalAmount.toString(),
      status: 'Draft',
    }).returning();

    // Insert sales order items
    const orderItems = items.map((item: any) => ({
      soId: salesOrder.id,
      description: item.description,
      quantity: parseInt(item.quantity),
      unitPrice: parseFloat(item.unitPrice).toString(),
      lineTotal: (parseInt(item.quantity) * parseFloat(item.unitPrice)).toString(),
    }));

    await db.insert(salesOrderItems).values(orderItems);

    return NextResponse.json({ success: true, orderId: salesOrder.id });
  } catch (error) {
    console.error('Error creating sales order:', error);
    return NextResponse.json({ error: 'Failed to create sales order' }, { status: 500 });
  }
}