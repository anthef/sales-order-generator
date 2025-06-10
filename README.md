# Sales Order Generator

A modern, full-stack sales order management application built with Next.js, PostgreSQL, and Drizzle ORM.

## Features

### Core Features
- ✅ **Create Sales Orders**: Add new sales orders with customer information and multiple items
- ✅ **View Sales Orders**: Browse all sales orders in a responsive table format
- ✅ **Sales Order Details**: View complete details of individual sales orders
- ✅ **Real-time Calculations**: Automatic calculation of line totals and order totals
- ✅ **Auto-generated SO Numbers**: Unique SO numbers with format `SO-YYYYMMDD-XXXX`

### Enhanced Features
- ✅ **Search & Filter**: Search by SO number or customer name, filter by status
- ✅ **Toast Notifications**: User-friendly success and error messages
- ✅ **PDF Export**: Export sales orders to PDF format
- ✅ **Form Validation**: Comprehensive client-side validation
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Loading States**: Visual feedback during operations

### Status Management
Sales orders support the following statuses:
- **Draft**: Initial state when created
- **Pending**: Awaiting approval
- **Approved**: Order has been approved
- **Received**: Order has been received by customer
- **Cancelled**: Order has been cancelled

## Tech Stack

- **Frontend & Backend**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **TypeScript**: Full type safety

## Database Schema

### Sales Orders Table
```sql
CREATE TABLE "sales_orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "so_number" varchar(50) NOT NULL UNIQUE,
  "customer_name" varchar(255) NOT NULL,
  "customer_address" text NOT NULL,
  "order_date" date NOT NULL,
  "delivery_date" date NOT NULL,
  "total_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "status" varchar(20) DEFAULT 'Draft' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

### Sales Order Items Table
```sql
CREATE TABLE "sales_order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "so_id" uuid NOT NULL REFERENCES "sales_orders"("id"),
  "description" varchar(500) NOT NULL,
  "quantity" integer NOT NULL,
  "unit_price" numeric(12, 2) NOT NULL,
  "line_total" numeric(12, 2) NOT NULL
);
```

## Installation & Setup

### Prerequisites
- Node.js 18 or later
- PostgreSQL database
- npm or yarn

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   DATABASE_URL=postgres://username:password@host:port/database_name
   ```

4. Generate and push database schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Database Configuration
The application is configured to work with PostgreSQL. Update the `drizzle.config.ts` and `.env.local` files with your database credentials.

Example database connection:
```
postgres://dev:dev@192.168.10.129:5432/anthony_salesordergenerator
```

## API Endpoints

### Sales Orders
- `GET /api/sales-orders` - Retrieve all sales orders
- `POST /api/sales-orders` - Create a new sales order
- `GET /api/sales-orders/[id]` - Retrieve a specific sales order with items

### Request/Response Examples

#### Create Sales Order
```json
POST /api/sales-orders
{
  "customerName": "Acme Corporation",
  "customerAddress": "123 Business Street, Business City, BC 12345",
  "orderDate": "2025-06-10",
  "deliveryDate": "2025-06-20",
  "items": [
    {
      "description": "Product A",
      "quantity": "5",
      "unitPrice": "100.00"
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "orderId": "77d0756b-9dc6-43d0-88c9-a06eda51eb94"
}
```

## Pages & Routes

- `/` - Home page with sales order list, search, and filtering
- `/new-sales-order` - Create new sales order form
- `/sales-orders/[id]` - Sales order detail page with PDF export

## Usage

### Creating a Sales Order
1. Navigate to the home page
2. Click "Create New SO"
3. Fill in customer information
4. Add items with description, quantity, and unit price
5. Review the calculated total
6. Click "Generate SO" to create the order

### Viewing Sales Orders
1. The home page displays all sales orders in a table
2. Use the search box to find orders by SO number or customer name
3. Use the status filter to show orders with specific statuses
4. Click "View Details" to see complete order information

### Exporting to PDF
1. Open any sales order detail page
2. Click the "Export PDF" button
3. The PDF will be automatically downloaded

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

### Project Structure
```
├── app/
│   ├── api/sales-orders/       # API routes
│   ├── new-sales-order/        # Create order page
│   ├── sales-orders/[id]/      # Order detail page
│   └── page.tsx               # Home page
├── components/ui/             # Shadcn UI components
├── lib/
│   ├── db/                   # Database configuration
│   └── utils.ts              # Utility functions
└── drizzle/                  # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is built as a technical assessment and is for educational purposes.
