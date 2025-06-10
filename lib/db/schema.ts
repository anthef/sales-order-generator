import { pgTable, uuid, varchar, text, date, decimal, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const salesOrders = pgTable('sales_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  soNumber: varchar('so_number', { length: 50 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerAddress: text('customer_address').notNull(),
  orderDate: date('order_date').notNull(),
  deliveryDate: date('delivery_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 20 }).notNull().default('Draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const salesOrderItems = pgTable('sales_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  soId: uuid('so_id').references(() => salesOrders.id).notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  lineTotal: decimal('line_total', { precision: 12, scale: 2 }).notNull(),
});

export const salesOrdersRelations = relations(salesOrders, ({ many }) => ({
  items: many(salesOrderItems),
}));

export const salesOrderItemsRelations = relations(salesOrderItems, ({ one }) => ({
  salesOrder: one(salesOrders, {
    fields: [salesOrderItems.soId],
    references: [salesOrders.id],
  }),
}));

export type SalesOrder = typeof salesOrders.$inferSelect;
export type NewSalesOrder = typeof salesOrders.$inferInsert;
export type SalesOrderItem = typeof salesOrderItems.$inferSelect;
export type NewSalesOrderItem = typeof salesOrderItems.$inferInsert;
