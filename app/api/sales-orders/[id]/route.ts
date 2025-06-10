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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if it's just a status update
    if (body.status && Object.keys(body).length === 1) {
      const [updatedOrder] = await db
        .update(salesOrders)
        .set({ status: body.status, updatedAt: new Date() })
        .where(eq(salesOrders.id, id))
        .returning();
      
      if (!updatedOrder) {
        return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, salesOrder: updatedOrder });
    }
    
    // Full update of sales order and items
    const { customerName, customerAddress, orderDate, deliveryDate, items, status } = body;
    
    // Calculate new total amount
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
    );
    
    // Update sales order
    const [updatedOrder] = await db
      .update(salesOrders)
      .set({
        customerName,
        customerAddress,
        orderDate: new Date(orderDate),
        deliveryDate: new Date(deliveryDate),
        totalAmount: totalAmount.toString(),
        status: status || 'Draft',
        updatedAt: new Date()
      })
      .where(eq(salesOrders.id, id))
      .returning();
    
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }
    
    // Delete existing items
    await db.delete(salesOrderItems).where(eq(salesOrderItems.soId, id));
    
    // Insert new items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        soId: id,
        description: item.description,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice).toString(),
        lineTotal: (parseInt(item.quantity) * parseFloat(item.unitPrice)).toString(),
      }));
      
      await db.insert(salesOrderItems).values(orderItems);
    }
    
    return NextResponse.json({ success: true, salesOrder: updatedOrder });
  } catch (error) {
    console.error('Error updating sales order:', error);
    return NextResponse.json({ error: 'Failed to update sales order' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // First delete all related items
    await db.delete(salesOrderItems).where(eq(salesOrderItems.soId, id));
    
    // Then delete the sales order
    const [deletedOrder] = await db
      .delete(salesOrders)
      .where(eq(salesOrders.id, id))
      .returning();
    
    if (!deletedOrder) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Sales order deleted successfully' });
  } catch (error) {
    console.error('Error deleting sales order:', error);
    return NextResponse.json({ error: 'Failed to delete sales order' }, { status: 500 });
  }
}