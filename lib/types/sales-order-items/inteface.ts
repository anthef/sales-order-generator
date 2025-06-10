export interface SalesOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

interface SalesOrderDetail {
  id: string;
  soNumber: string;
  customerName: string;
  customerAddress: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: string;
  status: string;
  items: SalesOrderItem[];
}