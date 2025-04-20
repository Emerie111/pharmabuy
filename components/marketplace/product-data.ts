export interface Product {
  id: string
  name: string
  genericName: string
  referenceBrand: string
  category: string
  price: number
  unit: string
  minOrder: number
  stock: number
  location: string
  supplier: string
  verified: boolean
  supplierVerified: boolean
  rating: number
  image: string
  bioequivalence: number | "pending" | "N/A"
  nafdacNumber: string
  type: "prescription" | "otc"
  dateAdded: string
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

// Sample product data
const products: Product[] = [
  {
    id: "p1",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    referenceBrand: "Amoxil",
    category: "antibiotics",
    price: 2500,
    unit: "pack of 10",
    minOrder: 5,
    stock: 200,
    location: "Lagos",
    supplier: "PharmaCare Ltd",
    verified: true,
    supplierVerified: true,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=400&text=Amoxicillin",
    bioequivalence: 95,
    nafdacNumber: "A4-0123",
    type: "prescription",
    dateAdded: "2023-05-15",
  },
  {
    id: "p2",
    name: "Paracetamol 500mg",
    genericName: "Paracetamol",
    referenceBrand: "Tylenol",
    category: "analgesics",
    price: 800,
    unit: "pack of 20",
    minOrder: 10,
    stock: 500,
    location: "Abuja",
    supplier: "MediPlus Nigeria",
    verified: true,
    supplierVerified: true,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=400&text=Paracetamol",
    bioequivalence: 98,
    nafdacNumber: "A4-0124",
    type: "otc",
    dateAdded: "2023-06-20",
  },
  {
    id: "p3",
    name: "Metformin 850mg",
    genericName: "Metformin",
    referenceBrand: "Glucophage",
    category: "antidiabetic",
    price: 1200,
    unit: "pack of 30",
    minOrder: 3,
    stock: 120,
    location: "Port Harcourt",
    supplier: "DiabeCare Ltd",
    verified: false,
    supplierVerified: false,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=400&text=Metformin",
    bioequivalence: "pending",
    nafdacNumber: "Pending",
    type: "prescription",
    dateAdded: "2023-07-05",
  },
  {
    id: "p4",
    name: "Lisinopril 10mg",
    genericName: "Lisinopril",
    referenceBrand: "Zestril",
    category: "cardiovascular",
    price: 1800,
    unit: "pack of 15",
    minOrder: 2,
    stock: 80,
    location: "Lagos",
    supplier: "CardioHealth Inc",
    verified: true,
    supplierVerified: true,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=400&text=Lisinopril",
    bioequivalence: 92,
    nafdacNumber: "A4-0125",
    type: "prescription",
    dateAdded: "2023-04-10",
  },
  {
    id: "p5",
    name: "Azithromycin 250mg",
    genericName: "Azithromycin",
    referenceBrand: "Zithromax",
    category: "antibiotics",
    price: 3500,
    unit: "pack of 6",
    minOrder: 2,
    stock: 150,
    location: "Ibadan",
    supplier: "PharmaTrust",
    verified: true,
    supplierVerified: true,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=400&text=Azithromycin",
    bioequivalence: 94,
    nafdacNumber: "A4-0126",
    type: "prescription",
    dateAdded: "2023-03-22",
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
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getSupplierByName(name: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.name === name)
}

export function getProductsBySupplier(supplierName: string): Product[] {
  return products.filter((product) => product.supplier === supplierName)
}

export function getAllProducts(): Product[] {
  return products
}

export function getAllSuppliers(): Supplier[] {
  return suppliers
}

export default products
