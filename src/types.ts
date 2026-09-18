export interface BusinessSettings {
  id: string;
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  tagline: string;
  logo_url?: string;
  updated_at?: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path?: string;
  image_url: string;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
}

export type PropertyPurpose = 'Buy' | 'Rent';
export type PropertyCategory = 'Residential' | 'Commercial';
export type AvailabilityStatus = 'Available' | 'Sold' | 'Rented' | 'Under Offer';

export interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  price_display: string;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  property_type: string;
  bhk?: string;
  area_sqft: number;
  description: string;
  features: string[];
  availability_status: AvailabilityStatus;
  published: boolean;
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  property_id?: string | null;
  property_name?: string | null;
  status: EnquiryStatus;
  created_at: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
}
