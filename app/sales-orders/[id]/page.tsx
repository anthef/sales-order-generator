'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface SalesOrderItem {
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

export default function SalesOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const [salesOrder, setSalesOrder] = useState<SalesOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSalesOrder(params.id as string);
    }
  }, [params.id]);
  const fetchSalesOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/sales-orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSalesOrder(data);
      } else if (response.status === 404) {
        toast.error('Sales order not found');
      } else {
        toast.error('Failed to fetch sales order');
      }
    } catch (error) {
      console.error('Error fetching sales order:', error);
      toast.error('Failed to fetch sales order');
    } finally {
      setLoading(false);    }
  };

  const exportToPDF = () => {
    if (!salesOrder) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Sales Order', pageWidth / 2, 20, { align: 'center' });
    
    // Order Information
    doc.setFontSize(12);
    doc.text(`SO Number: ${salesOrder.soNumber}`, 20, 40);
    doc.text(`Customer: ${salesOrder.customerName}`, 20, 50);
    doc.text(`Address: ${salesOrder.customerAddress}`, 20, 60);
    doc.text(`Order Date: ${format(new Date(salesOrder.orderDate), 'MMM dd, yyyy')}`, 20, 70);
    doc.text(`Delivery Date: ${format(new Date(salesOrder.deliveryDate), 'MMM dd, yyyy')}`, 20, 80);
    doc.text(`Status: ${salesOrder.status}`, 20, 90);
    
    // Items Table Header
    doc.setFontSize(14);
    doc.text('Items:', 20, 110);
    
    // Table
    doc.setFontSize(10);
    const startY = 120;
    let currentY = startY;
    
    // Table headers
    doc.text('Description', 20, currentY);
    doc.text('Qty', 120, currentY);
    doc.text('Unit Price', 140, currentY);
    doc.text('Total', 170, currentY);
    
    currentY += 10;
    doc.line(20, currentY - 5, 190, currentY - 5); // Header line
    
    // Table data
    salesOrder.items.forEach((item) => {
      doc.text(item.description, 20, currentY);
      doc.text(item.quantity.toString(), 120, currentY);
      doc.text(`$${parseFloat(item.unitPrice).toFixed(2)}`, 140, currentY);
      doc.text(`$${parseFloat(item.lineTotal).toFixed(2)}`, 170, currentY);
      currentY += 10;
    });
    
    // Total
    doc.line(20, currentY, 190, currentY);
    currentY += 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: $${parseFloat(salesOrder.totalAmount).toFixed(2)}`, 140, currentY);
    
    // Save
    doc.save(`${salesOrder.soNumber}.pdf`);
    toast.success('PDF exported successfully!');
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!salesOrder) {
    return <div className="container mx-auto p-6">Sales order not found</div>;
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Order Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => router.push('/')}>
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>SO Number:</strong> {salesOrder.soNumber}</p>
                <p><strong>Customer Name:</strong> {salesOrder.customerName}</p>
                <p><strong>Customer Address:</strong> {salesOrder.customerAddress}</p>
              </div>
              <div>
                <p><strong>Order Date:</strong> {format(new Date(salesOrder.orderDate), 'MMM dd, yyyy')}</p>
                <p><strong>Delivery Date:</strong> {format(new Date(salesOrder.deliveryDate), 'MMM dd, yyyy')}</p>
                <p><strong>Status:</strong> <Badge>{salesOrder.status}</Badge></p>
                <p><strong>Total Amount:</strong> ${parseFloat(salesOrder.totalAmount).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrder.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${parseFloat(item.unitPrice).toFixed(2)}</TableCell>
                    <TableCell>${parseFloat(item.lineTotal).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}