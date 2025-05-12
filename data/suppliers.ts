export interface SupplierProduct {
  brandedProductId: string;
  price: number;
  stock: number;
  location: string;
  minOrder: number;
  bulkDiscounts?: {
    quantity: number;
    discount: number;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  foundedYear: number;
  certifications: string[];
  products: SupplierProduct[];
}

// Sample data - you'll need to replace this with your actual data
export const suppliers: Supplier[] = [
  {
    id: 'pharmaplus',
    name: 'PharmaPlusNG',
    description: 'Leading pharmaceutical distributor in Nigeria',
    verified: true,
    logo: '/images/pharmaplus.jpg',
    address: '123 Pharmaceutical Avenue, Lagos',
    phone: '+234 123 456 7890',
    email: 'info@pharmaplusng.com',
    website: 'https://pharmaplusng.com',
    foundedYear: 2005,
    certifications: ['ISO 9001', 'GDP'],
    products: [
      {
        brandedProductId: 'amoxicillin/amoxil',
        price: 2500,
        stock: 1000,
        location: 'Lagos Warehouse',
        minOrder: 100,
        bulkDiscounts: [
          { quantity: 500, discount: 10 },
          { quantity: 1000, discount: 15 }
        ]
      }
    ]
  }
  // Add more suppliers here
]; 