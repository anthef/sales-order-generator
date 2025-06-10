import { db } from '@/lib/db';
import { salesOrderItems, salesOrders } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { id, itemId } = await params;
    const body = await request.json();
    const { description, quantity, unitPrice } = body;
    
    const lineTotal = parseInt(quantity) * parseFloat(unitPrice);
    
    const [updatedItem] = await db
      .update(salesOrderItems)
      .set({
        description,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice).toString(),
        lineTotal: lineTotal.toString()
      })
      .where(eq(salesOrderItems.id, itemId))
      .returning();
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Recalculate total amount for the sales order
    const allItems = await db
      .select()
      .from(salesOrderItems)
      .where(eq(salesOrderItems.soId, id));
    
    const totalAmount = allItems.reduce((sum, item) => 
      sum + parseFloat(item.lineTotal), 0
    );
    
    await db
      .update(salesOrders)
      .set({ 
        totalAmount: totalAmount.toString(),
        updatedAt: new Date()
      })
      .where(eq(salesOrders.id, id));
    
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { id, itemId } = await params;
    
    const [deletedItem] = await db
      .delete(salesOrderItems)
      .where(eq(salesOrderItems.id, itemId))
      .returning();
    
    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Recalculate total amount for the sales order
    const remainingItems = await db
      .select()
      .from(salesOrderItems)
      .where(eq(salesOrderItems.soId, id));
    
    const totalAmount = remainingItems.reduce((sum, item) => 
      sum + parseFloat(item.lineTotal), 0
    );
    
    await db
      .update(salesOrders)
      .set({ 
        totalAmount: totalAmount.toString(),
        updatedAt: new Date()
      })
      .where(eq(salesOrders.id, id));
    
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, quantity, unitPrice } = body;
    
    const lineTotal = parseInt(quantity) * parseFloat(unitPrice);
    
    const [newItem] = await db
      .insert(salesOrderItems)
      .values({
        soId: id,
        description,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice).toString(),
        lineTotal: lineTotal.toString()
      })
      .returning();
    
    // Recalculate total amount for the sales order
    const allItems = await db
      .select()
      .from(salesOrderItems)
      .where(eq(salesOrderItems.soId, id));
    
    const totalAmount = allItems.reduce((sum, item) => 
      sum + parseFloat(item.lineTotal), 0
    );
    
    await db
      .update(salesOrders)
      .set({ 
        totalAmount: totalAmount.toString(),
        updatedAt: new Date()
      })
      .where(eq(salesOrders.id, id));
    
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}
