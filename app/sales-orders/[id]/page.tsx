'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Download, Edit, Trash2, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SalesOrderItem, SalesOrderDetail } from '@/lib/types/sales-order-items/interface';

export default function SalesOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const [salesOrder, setSalesOrder] = useState<SalesOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SalesOrderItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ description: '', quantity: '', unitPrice: '', });

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
      toast.error('Failed to fetch sales order');
    } finally {
      setLoading(false);    }
  };

  const exportToPDF = () => {
    if (!salesOrder) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // MAKE A HEADER
    doc.setFontSize(20);
    doc.text('Sales Order', pageWidth / 2, 20, { align: 'center' });
    
    // MAKE ORDER INFORMATION
    doc.setFontSize(12);
    doc.text(`SO Number: ${salesOrder.soNumber}`, 20, 40);
    doc.text(`Customer: ${salesOrder.customerName}`, 20, 50);
    doc.text(`Address: ${salesOrder.customerAddress}`, 20, 60);
    doc.text(`Order Date: ${format(new Date(salesOrder.orderDate), 'MMM dd, yyyy')}`, 20, 70);
    doc.text(`Delivery Date: ${format(new Date(salesOrder.deliveryDate), 'MMM dd, yyyy')}`, 20, 80);
    doc.text(`Status: ${salesOrder.status}`, 20, 90);
    
    //ITEMS
    doc.setFontSize(14);
    doc.text('Items:', 20, 110);
    
    //TABLE
    doc.setFontSize(10);
    const startY = 120;
    let currentY = startY;
    
    // TABLE/HEADERS
    doc.text('Description', 20, currentY);
    doc.text('Qty', 120, currentY);
    doc.text('Unit Price', 140, currentY);
    doc.text('Total', 170, currentY);
    
    currentY += 10;
    doc.line(20, currentY - 5, 190, currentY - 5);
    
    //TABLE DATA
    salesOrder.items.forEach((item) => {
      doc.text(item.description, 20, currentY);
      doc.text(item.quantity.toString(), 120, currentY);
      doc.text(`$${parseFloat(item.unitPrice).toFixed(2)}`, 140, currentY);
      doc.text(`$${parseFloat(item.lineTotal).toFixed(2)}`, 170, currentY);
      currentY += 10;
    });
    
    //TOTAL
    doc.line(20, currentY, 190, currentY);
    currentY += 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: $${parseFloat(salesOrder.totalAmount).toFixed(2)}`, 140, currentY);
    
    // SAVE
    doc.save(`${salesOrder.soNumber}.pdf`);
    toast.success('PDF exported successfully!');
  };

  //EDIT ITEM
  const handleEditItem = (item: SalesOrderItem) => {
    setEditingItem(item);
    setItemForm({
      description: item.description,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice,
    });
    setIsEditDialogOpen(true);
  };

  //ADD ITEM
  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      description: '',
      quantity: '',
      unitPrice: '',
    });
    setIsAddDialogOpen(true);
  };

  //DELETE ITEM
  const handleDeleteItem = async (itemId: string, description: string) => {
    try {
      const response = await fetch(`/api/sales-orders/${params.id}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`Item "${description}" deleted successfully`);
        fetchSalesOrder(params.id as string); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  //SAVE ITEM
  const handleSaveItem = async () => {
    if (!itemForm.description || !itemForm.quantity || !itemForm.unitPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const url = editingItem ? `/api/sales-orders/${params.id}/items/${editingItem.id}` : `/api/sales-orders/${params.id}/items`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemForm),
      });

      if (response.ok) {
        toast.success(`Item ${editingItem ? 'updated' : 'added'} successfully`);
        setIsEditDialogOpen(false);
        setIsAddDialogOpen(false);
        fetchSalesOrder(params.id as string); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || `Failed to ${editingItem ? 'update' : 'add'} item`);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(`Failed to ${editingItem ? 'update' : 'add'} item`);
    }
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
        </Card>        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Order Items</CardTitle>
              <Button onClick={handleAddItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Line Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrder.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${parseFloat(item.unitPrice).toFixed(2)}</TableCell>
                    <TableCell>${parseFloat(item.lineTotal).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.description}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteItem(item.id, item.description)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the item details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={itemForm.description}
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                placeholder="Item description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unitPrice">Unit Price</Label>
                <Input
                  id="edit-unitPrice"
                  type="number"
                  step="0.01"
                  value={itemForm.unitPrice}
                  onChange={(e) => setItemForm({...itemForm, unitPrice: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to this sales order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Input
                id="add-description"
                value={itemForm.description}
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                placeholder="Item description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-quantity">Quantity</Label>
                <Input
                  id="add-quantity"
                  type="number"
                  
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-unitPrice">Unit Price</Label>
                <Input
                  id="add-unitPrice"
                  type="number"
                  step="0.01"
                  value={itemForm.unitPrice}
                  onChange={(e) => setItemForm({...itemForm, unitPrice: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}