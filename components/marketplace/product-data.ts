export interface SupplierProduct {
  supplierId: string
  price: number
  stock: number
  location: string
  minOrder: number
  bulkDiscounts?: {
    quantity: number
    discount: number
  }[]
}

export interface BrandedProduct {
  id: string // e.g., "amoxicillin/floximox"
  brandName: string
  manufacturer: string
  strength: string
  dosageForm: string // e.g., "tablet", "capsule", "suspension"
  packSize: string
  verified: boolean
  rating: number
  image: string
  bioequivalence: number | "pending" | "N/A"
  nafdacNumber: string
  type: "prescription" | "otc"
  dateAdded: string
  countryOfOrigin: string
  suppliers: SupplierProduct[]
}

export interface GenericDrug {
  id: string // e.g., "amoxicillin"
  name: string
  category: string
  description: string
  indication: string
  brandProducts: BrandedProduct[]
}

export interface Product {
  id: string
  name: string
  genericName: string
  referenceBrand: string
  category: string
  unit: string
  verified: boolean
  rating: number
  image: string
  bioequivalence: number | "pending" | "N/A"
  nafdacNumber: string
  type: "prescription" | "otc"
  dateAdded: string
  suppliers: SupplierProduct[]
  // Keep these for backward compatibility
  price?: number
  stock?: number
  location?: string
  supplier?: string
  minOrder?: number
  supplierVerified?: boolean
}

export interface Supplier {
  name: string
  description: string
  verified: boolean
  logo: string
  address: string
  phone: string
  email: string
  website?: string
  foundedYear?: number
  certifications?: string[]
}

// Sample generic drugs data
const genericDrugs: GenericDrug[] = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "antibiotics",
    description: "Broad-spectrum penicillin antibiotic used to treat various bacterial infections",
    indication: "Treatment of respiratory tract infections, ear infections, urinary tract infections, skin infections, and dental infections",
    brandProducts: [
      {
        id: "amoxicillin/floximox",
        brandName: "Floximox",
        manufacturer: "FloxyPharma Ltd",
        strength: "500mg",
        dosageForm: "capsule",
        packSize: "pack of 10",
        verified: true,
        rating: 4.8,
        image: "/placeholder.svg?height=200&width=400&text=Floximox",
        bioequivalence: 95,
        nafdacNumber: "A4-0123",
        type: "prescription",
        dateAdded: "2023-05-15",
        countryOfOrigin: "Nigeria",
        suppliers: [
          {
            supplierId: "PharmaCare Ltd",
            price: 2500,
            stock: 200,
            location: "Lagos",
            minOrder: 5,
            bulkDiscounts: [
              { quantity: 10, discount: 5 },
              { quantity: 20, discount: 10 }
            ]
          },
          {
            supplierId: "MediPlus Nigeria",
            price: 2700,
            stock: 150,
            location: "Abuja",
            minOrder: 3
          }
        ]
      },
      {
        id: "amoxicillin/reichamox",
        brandName: "Reichamox",
        manufacturer: "Reich Pharmaceuticals",
        strength: "500mg",
        dosageForm: "capsule",
        packSize: "pack of 14",
        verified: true,
        rating: 4.6,
        image: "/placeholder.svg?height=200&width=400&text=Reichamox",
        bioequivalence: 92,
        nafdacNumber: "A4-0124",
        type: "prescription",
        dateAdded: "2023-06-01",
        countryOfOrigin: "India",
        suppliers: [
          {
            supplierId: "PharmaTrust",
            price: 2600,
            stock: 100,
            location: "Ibadan",
            minOrder: 4
          }
        ]
      },
      {
        id: "amoxicillin/emmox",
        brandName: "Emmox",
        manufacturer: "Emmy Pharmaceuticals",
        strength: "500mg",
        dosageForm: "capsule",
        packSize: "pack of 12",
        verified: true,
        rating: 4.7,
        image: "/placeholder.svg?height=200&width=400&text=Emmox",
        bioequivalence: 94,
        nafdacNumber: "A4-0125",
        type: "prescription",
        dateAdded: "2023-06-15",
        countryOfOrigin: "Nigeria",
        suppliers: [
          {
            supplierId: "MediPlus Nigeria",
            price: 2400,
            stock: 180,
            location: "Abuja",
            minOrder: 3,
            bulkDiscounts: [
              { quantity: 5, discount: 3 },
              { quantity: 15, discount: 8 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "paracetamol",
    name: "Paracetamol",
    category: "analgesics",
    description: "Common pain reliever and fever reducer",
    indication: "Treatment of mild to moderate pain and fever",
    brandProducts: [
      {
        id: "paracetamol/panadol",
        brandName: "Panadol",
        manufacturer: "GSK Consumer Healthcare",
        strength: "500mg",
        dosageForm: "tablet",
        packSize: "pack of 20",
        verified: true,
        rating: 4.8,
        image: "/placeholder.svg?height=200&width=400&text=Panadol",
        bioequivalence: 98,
        nafdacNumber: "A4-0126",
        type: "otc",
        dateAdded: "2023-06-20",
        countryOfOrigin: "UK",
        suppliers: [
          {
            supplierId: "MediPlus Nigeria",
            price: 800,
            stock: 500,
            location: "Abuja",
            minOrder: 10,
            bulkDiscounts: [
              { quantity: 20, discount: 5 },
              { quantity: 50, discount: 12 }
            ]
          }
        ]
      },
      {
        id: "paracetamol/emzor",
        brandName: "Emzor Paracetamol",
        manufacturer: "Emzor Pharmaceutical",
        strength: "500mg",
        dosageForm: "tablet",
        packSize: "pack of 24",
        verified: true,
        rating: 4.5,
        image: "/placeholder.svg?height=200&width=400&text=Emzor",
        bioequivalence: 96,
        nafdacNumber: "A4-0127",
        type: "otc",
        dateAdded: "2023-06-25",
        countryOfOrigin: "Nigeria",
        suppliers: [
          {
            supplierId: "PharmaCare Ltd",
            price: 850,
            stock: 300,
            location: "Lagos",
            minOrder: 5
          }
        ]
      }
    ]
  }
]

// Sample product data
const products: Product[] = [
  {
    id: "p1",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    referenceBrand: "Amoxil",
    category: "antibiotics",
    unit: "pack of 10",
    verified: true,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=400&text=Amoxicillin",
    bioequivalence: 95,
    nafdacNumber: "A4-0123",
    type: "prescription",
    dateAdded: "2023-05-15",
    suppliers: [
      {
        supplierId: "PharmaCare Ltd",
        price: 2500,
        stock: 200,
        location: "Lagos",
        minOrder: 5,
        bulkDiscounts: [
          { quantity: 10, discount: 5 },
          { quantity: 20, discount: 10 }
        ]
      },
      {
        supplierId: "MediPlus Nigeria",
        price: 2700,
        stock: 150,
        location: "Abuja",
        minOrder: 3,
        bulkDiscounts: [
          { quantity: 5, discount: 3 },
          { quantity: 15, discount: 8 }
        ]
      },
      {
        supplierId: "PharmaTrust",
        price: 2600,
        stock: 100,
        location: "Ibadan",
        minOrder: 4
      }
    ]
  },
  {
    id: "p2",
    name: "Paracetamol 500mg",
    genericName: "Paracetamol",
    referenceBrand: "Tylenol",
    category: "analgesics",
    unit: "pack of 20",
    verified: true,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=400&text=Paracetamol",
    bioequivalence: 98,
    nafdacNumber: "A4-0124",
    type: "otc",
    dateAdded: "2023-06-20",
    suppliers: [
      {
        supplierId: "MediPlus Nigeria",
        price: 800,
        stock: 500,
        location: "Abuja",
        minOrder: 10,
        bulkDiscounts: [
          { quantity: 20, discount: 5 },
          { quantity: 50, discount: 12 }
        ]
      },
      {
        supplierId: "PharmaCare Ltd",
        price: 850,
        stock: 300,
        location: "Lagos",
        minOrder: 5
      }
    ]
  },
  {
    id: "p3",
    name: "Metformin 850mg",
    genericName: "Metformin",
    referenceBrand: "Glucophage",
    category: "antidiabetic",
    unit: "pack of 30",
    verified: false,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=400&text=Metformin",
    bioequivalence: "pending",
    nafdacNumber: "Pending",
    type: "prescription",
    dateAdded: "2023-07-05",
    suppliers: [
      {
        supplierId: "DiabeCare Ltd",
        price: 1200,
        stock: 120,
        location: "Port Harcourt",
        minOrder: 3
      }
    ]
  },
  {
    id: "p4",
    name: "Lisinopril 10mg",
    genericName: "Lisinopril",
    referenceBrand: "Zestril",
    category: "cardiovascular",
    unit: "pack of 15",
    verified: true,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=400&text=Lisinopril",
    bioequivalence: 92,
    nafdacNumber: "A4-0125",
    type: "prescription",
    dateAdded: "2023-04-10",
    suppliers: [
      {
        supplierId: "CardioHealth Inc",
        price: 1800,
        stock: 80,
        location: "Lagos",
        minOrder: 2
      },
      {
        supplierId: "MediPlus Nigeria",
        price: 1750,
        stock: 100,
        location: "Abuja",
        minOrder: 3
      }
    ]
  },
  {
    id: "p5",
    name: "Azithromycin 250mg",
    genericName: "Azithromycin",
    referenceBrand: "Zithromax",
    category: "antibiotics",
    unit: "pack of 6",
    verified: true,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=400&text=Azithromycin",
    bioequivalence: 94,
    nafdacNumber: "A4-0126",
    type: "prescription",
    dateAdded: "2023-03-22",
    suppliers: [
      {
        supplierId: "PharmaTrust",
        price: 3500,
        stock: 150,
        location: "Ibadan",
        minOrder: 2
      },
      {
        supplierId: "PharmaCare Ltd",
        price: 3400,
        stock: 200,
        location: "Lagos",
        minOrder: 3,
        bulkDiscounts: [
          { quantity: 5, discount: 5 },
          { quantity: 10, discount: 10 }
        ]
      }
    ]
  },
  {
    id: "p6",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    referenceBrand: "Prilosec",
    category: "gastrointestinal",
    price: 1500,
    unit: "pack of 14",
    minOrder: 3,
    stock: 90,
    location: "Kano",
    supplier: "GastroMed Ltd",
    verified: false,
    supplierVerified: true,
    rating: 4.0,
    image: "/placeholder.svg?height=200&width=400&text=Omeprazole",
    bioequivalence: "N/A",
    nafdacNumber: "A4-0127",
    type: "prescription",
    dateAdded: "2023-08-15",
    suppliers: [],
  },
]

// Sample supplier data
const suppliers: Supplier[] = [
  {
    name: "PharmaCare Ltd",
    description: "Leading pharmaceutical supplier specializing in antibiotics and analgesics",
    verified: true,
    logo: "/placeholder.svg?height=200&width=400&text=PharmaCare",
    address: "15 Pharmaceutical Avenue, Lagos, Nigeria",
    phone: "+234 801 234 5678",
    email: "info@pharmacare.ng",
    website: "https://www.pharmacare.ng",
    foundedYear: 2005,
    certifications: ["ISO 9001", "NAFDAC Certified", "GMP Compliant"],
  },
  {
    name: "MediPlus Nigeria",
    description: "Trusted supplier of over-the-counter medications and medical supplies",
    verified: true,
    logo: "/placeholder.svg?height=200&width=400&text=MediPlus",
    address: "27 Health Road, Abuja, Nigeria",
    phone: "+234 802 345 6789",
    email: "contact@mediplus.ng",
    website: "https://www.mediplus.ng",
    foundedYear: 2010,
    certifications: ["NAFDAC Certified", "ISO 13485"],
  },
  {
    name: "DiabeCare Ltd",
    description: "Specialized in diabetes management medications and supplies",
    verified: false,
    logo: "/placeholder.svg?height=200&width=400&text=DiabeCare",
    address: "5 Medical Park, Port Harcourt, Nigeria",
    phone: "+234 803 456 7890",
    email: "info@diabecare.ng",
    website: "https://www.diabecare.ng",
    foundedYear: 2015,
  },
  {
    name: "CardioHealth Inc",
    description: "Premium supplier of cardiovascular medications and related products",
    verified: true,
    logo: "/placeholder.svg?height=200&width=400&text=CardioHealth",
    address: "10 Heart Street, Lagos, Nigeria",
    phone: "+234 804 567 8901",
    email: "sales@cardiohealth.ng",
    website: "https://www.cardiohealth.ng",
    foundedYear: 2008,
    certifications: ["ISO 9001", "NAFDAC Certified", "WHO GMP"],
  },
  {
    name: "PharmaTrust",
    description: "Reliable supplier of antibiotics and specialty medications",
    verified: true,
    logo: "/placeholder.svg?height=200&width=400&text=PharmaTrust",
    address: "22 Trust Lane, Ibadan, Nigeria",
    phone: "+234 805 678 9012",
    email: "info@pharmatrust.ng",
    website: "https://www.pharmatrust.ng",
    foundedYear: 2012,
    certifications: ["NAFDAC Certified", "ISO 9001"],
  },
  {
    name: "GastroMed Ltd",
    description: "Focused on gastrointestinal medications and digestive health products",
    verified: true,
    logo: "/placeholder.svg?height=200&width=400&text=GastroMed",
    address: "8 Digestive Road, Kano, Nigeria",
    phone: "+234 806 789 0123",
    email: "contact@gastromed.ng",
    foundedYear: 2017,
    certifications: ["NAFDAC Certified"],
  },
]

// Helper functions
export function getGenericDrugById(id: string): GenericDrug | undefined {
  return genericDrugs.find((drug) => drug.id === id)
}

export function getBrandedProductById(genericId: string, brandId: string): BrandedProduct | undefined {
  const genericDrug = getGenericDrugById(genericId)
  return genericDrug?.brandProducts.find((product) => product.id === `${genericId}/${brandId}`)
}

export function getSupplierByName(name: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.name === name)
}

export function getAllGenericDrugs(): GenericDrug[] {
  return genericDrugs
}

export function getAllBrandedProducts(): BrandedProduct[] {
  return genericDrugs.flatMap(drug => drug.brandProducts)
}

export function getAllProducts(): Product[] {
  return products
}

export function getAllSuppliers(): Supplier[] {
  return suppliers
}

export default genericDrugs
