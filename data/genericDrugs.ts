export interface BrandedProduct {
  id: string;
  brandName: string;
  manufacturer: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  verified: boolean;
  rating: number;
  image: string;
  bioequivalence: number | null;
  nafdacNumber: string;
  type: 'prescription' | 'otc';
  countryOfOrigin: string;
}

export interface GenericDrug {
  id: string;
  name: string;
  category: string;
  description: string;
  indication: string;
  brandProducts: BrandedProduct[];
}

// Sample data - you'll need to replace this with your actual data
export const genericDrugs: GenericDrug[] = [
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    category: 'Antibiotics',
    description: 'Amoxicillin is a penicillin antibiotic that fights bacteria...',
    indication: 'Treatment of bacterial infections',
    brandProducts: [
      {
        id: 'amoxicillin/amoxil',
        brandName: 'Amoxil',
        manufacturer: 'GlaxoSmithKline',
        strength: '500mg',
        dosageForm: 'Capsule',
        packSize: '21 capsules',
        verified: true,
        rating: 4.5,
        image: '/images/amoxil.jpg',
        bioequivalence: 100,
        nafdacNumber: 'A4-0123',
        type: 'prescription',
        countryOfOrigin: 'United Kingdom'
      }
      // Add more branded products here
    ]
  }
  // Add more generic drugs here
]; 