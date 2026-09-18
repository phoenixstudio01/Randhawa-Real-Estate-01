import { BusinessSettings, Property, Enquiry } from '../types';

export const initialBusinessSettings: BusinessSettings = {
  id: 'business_settings_default',
  business_name: 'Randhawa Real Estate',
  phone: '+91 90000 00000',
  whatsapp: '+91 90000 00000',
  email: 'hello@randhawarealestate.demo',
  location: 'Gurgaon, Haryana',
  tagline: 'Find a Place That Feels Like Home.',
  logo_url: '',
  updated_at: new Date().toISOString(),
};

export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Skyline Heights',
    slug: 'skyline-heights',
    location: 'Sector 67, Gurgaon',
    price: 12500000,
    price_display: '₹1.25 Cr',
    purpose: 'Buy',
    category: 'Residential',
    property_type: 'Apartment',
    bhk: '3 BHK',
    area_sqft: 1850,
    description: 'Skyline Heights offers an exceptional urban living experience in prime Sector 67, Gurgaon. Designed with attention to detail and panoramic views of the city skyline, this 3 BHK residence balances contemporary elegance with practical living spaces.',
    features: [
      'Spacious living room',
      'Modular kitchen',
      '3 bedrooms',
      '3 bathrooms',
      'Balcony',
      'Covered parking',
      'Security'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
    images: [
      {
        id: 'img-1-1',
        property_id: 'prop-1',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-1-2',
        property_id: 'prop-1',
        image_url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      },
      {
        id: 'img-1-3',
        property_id: 'prop-1',
        image_url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 3
      }
    ]
  },
  {
    id: 'prop-2',
    name: 'Palm Residency',
    slug: 'palm-residency',
    location: 'Sector 137, Noida',
    price: 7800000,
    price_display: '₹78 Lakh',
    purpose: 'Buy',
    category: 'Residential',
    property_type: 'Apartment',
    bhk: '2 BHK',
    area_sqft: 1250,
    description: 'Palm Residency provides sun-drenched, well-ventilated residential apartments in a tranquil, family-oriented neighborhood of Sector 137, Noida. Proximity to expressways and top schools makes it an ideal choice for young professionals and families.',
    features: [
      'Bright interiors',
      'Modular kitchen',
      '2 bedrooms',
      '2 bathrooms',
      'Balcony',
      'Parking',
      'Gated community'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-11T11:00:00Z',
    updated_at: '2025-01-11T11:00:00Z',
    images: [
      {
        id: 'img-2-1',
        property_id: 'prop-2',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-2-2',
        property_id: 'prop-2',
        image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-3',
    name: 'The Grand Avenue',
    slug: 'the-grand-avenue',
    location: 'Dwarka, New Delhi',
    price: 21500000,
    price_display: '₹2.15 Cr',
    purpose: 'Buy',
    category: 'Residential',
    property_type: 'Apartment',
    bhk: '4 BHK',
    area_sqft: 2600,
    description: 'An expansive 4 BHK sanctuary set in the heart of Dwarka, New Delhi. Designed for multigenerational comfort with double-height balcony views, customized joinery, and private elevator lobbies.',
    features: [
      'Large living area',
      'Premium interiors',
      '4 bedrooms',
      '4 bathrooms',
      'Multiple balconies',
      'Parking',
      'Security'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-12T09:30:00Z',
    updated_at: '2025-01-12T09:30:00Z',
    images: [
      {
        id: 'img-3-1',
        property_id: 'prop-3',
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-3-2',
        property_id: 'prop-3',
        image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-4',
    name: 'Urban Business Hub',
    slug: 'urban-business-hub',
    location: 'Golf Course Road, Gurgaon',
    price: 18000000,
    price_display: '₹1.80 Cr',
    purpose: 'Buy',
    category: 'Commercial',
    property_type: 'Commercial Office',
    area_sqft: 2100,
    description: 'Premier grade commercial office unit directly situated along Golf Course Road, Gurgaon. Features a versatile open-plan layout, floor-to-ceiling double-glazed windows, dedicated reception bay, and executive meeting suite.',
    features: [
      'Prime commercial location',
      'Open office layout',
      'Reception area',
      'Meeting room space',
      'Parking',
      'High visibility'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-13T14:00:00Z',
    updated_at: '2025-01-13T14:00:00Z',
    images: [
      {
        id: 'img-4-1',
        property_id: 'prop-4',
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-4-2',
        property_id: 'prop-4',
        image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-5',
    name: 'Greenview Enclave',
    slug: 'greenview-enclave',
    location: 'Sector 50, Noida',
    price: 42000,
    price_display: '₹42,000/month',
    purpose: 'Rent',
    category: 'Residential',
    property_type: 'Apartment',
    bhk: '3 BHK',
    area_sqft: 1650,
    description: 'Serene and well-maintained 3 BHK rental home in Sector 50, Noida. Boasts peaceful courtyard garden outlooks, generous room proportions, full wooden closets, and 24/7 power backup in a secure community.',
    features: [
      'Spacious interiors',
      '3 bedrooms',
      '3 bathrooms',
      'Balcony',
      'Parking',
      'Gated society'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-14T08:00:00Z',
    updated_at: '2025-01-14T08:00:00Z',
    images: [
      {
        id: 'img-5-1',
        property_id: 'prop-5',
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-5-2',
        property_id: 'prop-5',
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-6',
    name: 'Aria Villas',
    slug: 'aria-villas',
    location: 'Sector 70A, Gurgaon',
    price: 34000000,
    price_display: '₹3.40 Cr',
    purpose: 'Buy',
    category: 'Residential',
    property_type: 'Villa',
    bhk: '4 BHK',
    area_sqft: 3200,
    description: 'An architectural masterpiece offering timeless luxury and complete privacy. This standalone 4 BHK villa in Sector 70A, Gurgaon features manicured private lawn frontage, Italian marble flooring, and high ceilings.',
    features: [
      'Independent villa',
      'Private outdoor area',
      '4 bedrooms',
      '4 bathrooms',
      'Modern kitchen',
      'Parking',
      'Premium neighbourhood'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-15T12:00:00Z',
    updated_at: '2025-01-15T12:00:00Z',
    images: [
      {
        id: 'img-6-1',
        property_id: 'prop-6',
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-6-2',
        property_id: 'prop-6',
        image_url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-7',
    name: 'Metro View Homes',
    slug: 'metro-view-homes',
    location: 'Sector 75, Noida',
    price: 9200000,
    price_display: '₹92 Lakh',
    purpose: 'Buy',
    category: 'Residential',
    property_type: 'Apartment',
    bhk: '3 BHK',
    area_sqft: 1480,
    description: 'Contemporary 3 BHK residence conveniently located steps from Sector 75 metro station in Noida. Perfect for daily commuters seeking modern appointments, low maintenance costs, and a thriving neighborhood.',
    features: [
      'Modern interiors',
      '3 bedrooms',
      '2 bathrooms',
      'Balcony',
      'Parking',
      'Convenient location'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-16T15:00:00Z',
    updated_at: '2025-01-16T15:00:00Z',
    images: [
      {
        id: 'img-7-1',
        property_id: 'prop-7',
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-7-2',
        property_id: 'prop-7',
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-8',
    name: 'Central Plaza Office',
    slug: 'central-plaza-office',
    location: 'Sector 44, Gurgaon',
    price: 85000,
    price_display: '₹85,000/month',
    purpose: 'Rent',
    category: 'Commercial',
    property_type: 'Commercial Office',
    area_sqft: 1750,
    description: 'Ready-to-occupy corporate office space in Sector 44 institutional zone, Gurgaon. Equipped with high-speed elevator access, fiber-ready networking, wet pantry, and comfortable conference facilities.',
    features: [
      'Professional office space',
      'Reception area',
      'Meeting room',
      'Pantry',
      'Parking',
      'Business-friendly location'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-17T11:20:00Z',
    updated_at: '2025-01-17T11:20:00Z',
    images: [
      {
        id: 'img-8-1',
        property_id: 'prop-8',
        image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-8-2',
        property_id: 'prop-8',
        image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-9',
    name: 'Rosewood Residency',
    slug: 'rosewood-residency',
    location: 'Greater Kailash II, New Delhi',
    price: 27500000,
    price_display: '₹2.75 Cr',
    purpose: 'Buy',
    category: 'Residential',
    property_type: 'Builder Floor',
    bhk: '3 BHK',
    area_sqft: 2100,
    description: 'Bespoke builder floor located on a quiet residential avenue in GK-II, South Delhi. High-grade wooden paneling, German kitchen hardware, private stilt parking bays, and dedicated servant accommodation.',
    features: [
      'Premium builder floor',
      'Spacious bedrooms',
      'Modern kitchen',
      'Large living area',
      'Balcony',
      'Parking',
      'Prime South Delhi location'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-18T16:00:00Z',
    updated_at: '2025-01-18T16:00:00Z',
    images: [
      {
        id: 'img-9-1',
        property_id: 'prop-9',
        image_url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-9-2',
        property_id: 'prop-9',
        image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  },
  {
    id: 'prop-10',
    name: 'Lakeview Apartments',
    slug: 'lakeview-apartments',
    location: 'Sector 150, Noida',
    price: 35000,
    price_display: '₹35,000/month',
    purpose: 'Rent',
    category: 'Residential',
    property_type: 'Apartment',
    bhk: '2 BHK',
    area_sqft: 1300,
    description: 'Refreshing lake-facing 2 BHK flat situated in the greenest sector of Noida (Sector 150). Features expansive natural light, pollution-free park surroundings, sports arena access, and swift connectivity.',
    features: [
      'Green surroundings',
      '2 bedrooms',
      '2 bathrooms',
      'Balcony',
      'Parking',
      'Gated community'
    ],
    availability_status: 'Available',
    published: true,
    created_at: '2025-01-19T10:00:00Z',
    updated_at: '2025-01-19T10:00:00Z',
    images: [
      {
        id: 'img-10-1',
        property_id: 'prop-10',
        image_url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1
      },
      {
        id: 'img-10-2',
        property_id: 'prop-10',
        image_url: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab32f?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        sort_order: 2
      }
    ]
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Aarav Malhotra',
    phone: '+91 98112 34567',
    email: 'aarav.m@example.com',
    message: 'I am interested in visiting Skyline Heights in Sector 67 Gurgaon this Saturday for a walkthrough.',
    property_id: 'prop-1',
    property_name: 'Skyline Heights',
    status: 'New',
    created_at: '2025-02-01T11:15:00Z'
  },
  {
    id: 'enq-2',
    name: 'Pooja Verma',
    phone: '+91 98765 43210',
    email: 'pooja.v@example.com',
    message: 'Looking for a 2 BHK rental in Noida Sector 150 with immediate move-in option.',
    property_id: 'prop-10',
    property_name: 'Lakeview Apartments',
    status: 'Contacted',
    created_at: '2025-02-02T14:40:00Z'
  },
  {
    id: 'enq-3',
    name: 'Vikramjit Singh',
    phone: '+91 99998 88877',
    email: 'vikram.singh@example.com',
    message: 'Please send over the floor plan and commercial lease terms for Urban Business Hub.',
    property_id: 'prop-4',
    property_name: 'Urban Business Hub',
    status: 'Closed',
    created_at: '2025-01-28T09:05:00Z'
  }
];

export const demoTestimonials = [
  {
    id: 't-1',
    quote: 'The team guided us through every step of purchasing our 3 BHK apartment in Gurgaon. Transparent communication made the entire transaction effortless.',
    author: 'Sunil & Meera Kapoor',
    location: 'Sector 67, Gurgaon',
    role: 'Homeowners'
  },
  {
    id: 't-2',
    quote: 'Finding commercial space along Golf Course Road was straightforward. They respected our company budget and negotiated terms smoothly.',
    author: 'Rajesh Singhania',
    location: 'Golf Course Road, Gurgaon',
    role: 'Business Director'
  },
  {
    id: 't-3',
    quote: 'Found a rental apartment in Noida within 48 hours. Clear documentation, no hidden charges, and honest guidance from start to finish.',
    author: 'Ananya Deshmukh',
    location: 'Sector 137, Noida',
    role: 'Resident'
  }
];

export const valueProps = [
  {
    title: 'Carefully Selected Properties',
    description: 'Explore thoughtfully selected homes and commercial spaces.'
  },
  {
    title: 'Local Understanding',
    description: 'Get property guidance based on local market understanding.'
  },
  {
    title: 'Transparent Guidance',
    description: 'Clear information and straightforward communication.'
  },
  {
    title: 'Personal Support',
    description: 'Support throughout the property discovery process.'
  }
];

export const servicesList = [
  {
    title: 'Buy a Property',
    description: 'Find a home or commercial property that fits your requirements.',
    cta: 'Explore For Sale',
    purpose: 'Buy'
  },
  {
    title: 'Sell a Property',
    description: 'Present your property professionally to potential buyers.',
    cta: 'Contact Our Team',
    purpose: 'Contact'
  },
  {
    title: 'Rent a Property',
    description: 'Discover suitable rental properties across Delhi-NCR.',
    cta: 'View Rental Homes',
    purpose: 'Rent'
  }
];
