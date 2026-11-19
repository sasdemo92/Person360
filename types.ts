export interface CivilRecord {
  residency_id: string;
  full_name_en: string;
  full_name_ar: string;
  dob: string;
  gender: string;
  nationality: string;
  phone: string;
  email: string;
  current_city: string;
  current_address: string;
  photo_url: string;
}

export interface BusinessRecord {
  residency_id: string;
  business_id: string;
  business_name: string;
  license_number: string;
  license_type: string;
  issue_date: string;
  expiry_date: string;
  license_status: 'Active' | 'Expired' | 'Suspended';
  business_city: string;
  employees_est: number;
}

export interface VehicleRecord {
  residency_id: string;
  vehicle_id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vehicle_status: 'Active' | 'Impounded' | 'Flagged';
  registered_city: string;
  registration_date: string;
}

export interface HousingRecord {
  residency_id: string;
  property_id: string;
  property_type: 'Apartment' | 'Villa' | 'Townhouse';
  ownership_type: 'Owned' | 'Rented';
  city: string;
  address: string;
  move_in_date: string;
  move_out_date?: string;
}

// The Unified Profile (SSOT)
export interface PersonProfile extends CivilRecord {
  age: number;
  businesses: BusinessRecord[];
  vehicles: VehicleRecord[];
  housing: HousingRecord[];
  flags: string[];
  matchConfidence: number;
}

export enum AppTab {
  DATA_HUB = 'DATA_HUB',
  DIRECTORY = 'DIRECTORY',
  PERSON_360 = 'PERSON_360'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestions?: string[];
}