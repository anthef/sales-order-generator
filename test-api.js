// Test script to create sample sales orders
const testData = {
  customerName: "Acme Corporation",
  customerAddress: "123 Business Street, Business City, BC 12345",
  orderDate: "2025-06-10",
  deliveryDate: "2025-06-20",
  items: [
    {
      description: "Product A",
      quantity: "5",
      unitPrice: "100.00"
    },
    {
      description: "Product B", 
      quantity: "3",
      unitPrice: "150.00"
    }
  ]
};

// You can use this data to test the API manually
console.log(JSON.stringify(testData, null, 2));
