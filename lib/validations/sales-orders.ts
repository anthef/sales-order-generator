// import { z } from 'zod';

// export const OrderItemSchema = z.object({
//   id: z.string(),
//   description: z.string()
//     .min(1, 'Description is required')
//     .min(3, 'Description must be at least 3 characters')
//     .max(255, 'Description cannot exceed 255 characters'),
//   quantity: z.string()
//     .refine((val) => !isNaN(Number(val)), 'Quantity must be a valid number')
//     .refine((val) => Number(val) > 0, 'Quantity must be greater than 0')
//     .refine((val) => Number(val) <= 10000, 'Quantity cannot exceed 10,000')
//     .refine((val) => Number(val) % 1 === 0, 'Quantity must be a whole number'),
//   unitPrice: z.string()
//     .refine((val) => !isNaN(Number(val)), 'Unit price must be a valid number')
//     .refine((val) => Number(val) > 0, 'Unit price must be greater than 0')
//     .refine((val) => Number(val) <= 1000000, 'Unit price cannot exceed $1,000,000')
//     .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Unit price can have maximum 2 decimal places')
// });

// export const SalesOrderSchema = z.object({
//   customerName: z.string()
//     .min(1, 'Customer name is required')
//     .min(2, 'Customer name must be at least 2 characters')
//     .max(100, 'Customer name cannot exceed 100 characters')
//     .regex(/^[a-zA-Z\s\.]+$/, 'Customer name can only contain letters, spaces, and dots'),
//   customerAddress: z.string()
//     .min(1, 'Customer address is required')
//     .min(10, 'Customer address must be at least 10 characters')
//     .max(500, 'Customer address cannot exceed 500 characters'),
//   orderDate: z.string()
//     .min(1, 'Order date is required')
//     .refine((date) => {
//       const orderDate = new Date(date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return orderDate >= today;
//     }, 'Order date cannot be in the past'),
//   deliveryDate: z.string()
//     .min(1, 'Delivery date is required'),
//   items: z.array(OrderItemSchema)
//     .min(1, 'At least one item is required')
//     .max(50, 'Maximum 50 items allowed')
// }).refine((data) => {
//   const orderDate = new Date(data.orderDate);
//   const deliveryDate = new Date(data.deliveryDate);
//   return deliveryDate >= orderDate;
// }, {
//   message: 'Delivery date must be on or after order date',
//   path: ['deliveryDate']
// });

// export type SalesOrderFormData = z.infer<typeof SalesOrderSchema>;
// export type OrderItemFormData = z.infer<typeof OrderItemSchema>;

// export const validateSalesOrder = (data: any) => {
//   try {
//     const result = SalesOrderSchema.parse(data);
//     return { success: true, data: result, errors: null };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       const errors: Record<string, string> = {};
//       error.errors.forEach((err) => {
//         const path = err.path.join('.');
//         errors[path] = err.message;
//       });
//       return { success: false, data: null, errors };
//     }
//     return { success: false, data: null, errors: { general: 'Validation failed' } };
//   }
// };

// export const validateOrderItem = (data: any) => {
//   try {
//     const result = OrderItemSchema.parse(data);
//     return { success: true, data: result, errors: null };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       const errors: Record<string, string> = {};
//       error.errors.forEach((err) => {
//         const path = err.path.join('.');
//         errors[path] = err.message;
//       });
//       return { success: false, data: null, errors };
//     }
//     return { success: false, data: null, errors: { general: 'Validation failed' } };
//   }
// };
