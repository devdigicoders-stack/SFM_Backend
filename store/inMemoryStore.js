const bcrypt = require('bcryptjs');

// Mock in-memory database with presentation data
const store = {
  admin: {
    name: 'Pranjal Gupta',
    email: 'admin@spartansfacility.com',
    password: 'admin123',
    role: 'Super Administrator',
    avatar: 'PG',
    phone: '+91-8299726346'
  },
  enquiries: [
    {
      id: 'ENQ-1001',
      companyName: 'Taj Palace Lucknow',
      contactPerson: 'Sanjay Verma (Director of Engineering)',
      phone: '+91-9839011223',
      email: 'sanjay.verma@tajhotels.com',
      city: 'Lucknow',
      facilityType: 'Hospitality / 5-Star Hotel',
      sqFootage: '150,000 - 500,000 sq ft',
      servicesNeeded: ['HVAC & Chiller Plants', 'Electrical & Power Systems', 'Fire & Life Safety Overhauls'],
      status: 'Scheduled',
      date: '2026-06-20',
      notes: 'Annual chiller descaling & thermography audit required before high summer occupancy.'
    },
    {
      id: 'ENQ-1002',
      companyName: 'Phoenix Palassio Mall',
      contactPerson: 'Aditi Sharma (Operations Head)',
      phone: '+91-9721455667',
      email: 'aditi.sharma@phoenixpalassio.com',
      city: 'Lucknow',
      facilityType: 'Commercial Shopping Mall',
      sqFootage: '500,000+ sq ft',
      servicesNeeded: ['Plumbing & Hydro-Pneumatics', 'Civil & Architectural Fit-outs', 'ELV & BMS Diagnostics'],
      status: 'Reviewed',
      date: '2026-06-19',
      notes: 'High footfall atrium glazing check and food court grease-trap motorized desilting scope.'
    },
    {
      id: 'ENQ-1003',
      companyName: 'Hyatt Regency Hub',
      contactPerson: 'Vikram Rajput (Chief Engineer)',
      phone: '+91-8899223344',
      email: 'vikram.rajput@hyatt.com',
      city: 'Lucknow',
      facilityType: 'Hospitality / 5-Star Hotel',
      sqFootage: '150,000 - 500,000 sq ft',
      servicesNeeded: ['HVAC & Chiller Plants', 'Vigyani.ai IoT Predictive Hub'],
      status: 'Pending',
      date: '2026-06-21',
      notes: 'Requesting pilot deployment of Vigyani.ai IoT vibration sensors on main chiller pumps.'
    },
    {
      id: 'ENQ-1004',
      companyName: 'Teleperformance Tech Campus',
      contactPerson: 'Rohan Mehra (Facilities Manager)',
      phone: '+91-9123456789',
      email: 'rohan.m@teleperformance.com',
      city: 'Lucknow',
      facilityType: 'Corporate Tech Park',
      sqFootage: '50,000 - 150,000 sq ft',
      servicesNeeded: ['Electrical & Power Systems', 'ELV & BMS Diagnostics'],
      status: 'Completed',
      date: '2026-06-15',
      notes: 'Server room Precision AC audit and DB thermography completed with zero downtime.'
    }
  ],
  categories: [
    { id: 'cat-1', name: 'AI & Predictive FM', slug: 'ai-predictive', count: 2, color: 'bg-sky-100 text-sky-800' },
    { id: 'cat-2', name: 'Hard Engineering', slug: 'hard-engineering', count: 2, color: 'bg-amber-100 text-amber-800' },
    { id: 'cat-3', name: 'Safety & Compliance', slug: 'safety-compliance', count: 1, color: 'bg-emerald-100 text-emerald-800' },
    { id: 'cat-4', name: 'Case Studies', slug: 'case-studies', count: 1, color: 'bg-purple-100 text-purple-800' }
  ],
  blogs: [
    {
      id: 'blog-1',
      title: 'How AI Predictive Telemetry Prevents HVAC Chiller Failures in Luxury Hotels',
      category: 'AI & Predictive FM',
      categoryId: 'cat-1',
      author: 'Pranjal Gupta',
      date: '2026-06-18',
      readTime: '4 min read',
      published: true,
      excerpt: 'Traditional maintenance is reactive. Learn how Vigyani.ai IoT vibration and thermal sensors predict motor bearing degradation 72 hours before catastrophic breakdown.',
      content: '<h2>The Shift from Reactive to Predictive Asset Oversight</h2><p>Commercial chiller plants in five-star hotels operate under continuous thermal strain. When a bearing fails unexpectedly during a banquet event, the financial and reputational cost is enormous.</p><p>By deploying <strong>Vigyani.ai IoT sensor arrays</strong>, engineering heads receive real-time alerts 72 hours in advance of mechanical failure.</p>'
    },
    {
      id: 'blog-2',
      title: 'Zero Liability Transfer: Why 100% ESIC, PF & LOTO Protocols Protect Property Owners',
      category: 'Safety & Compliance',
      categoryId: 'cat-3',
      author: 'SFM Safety Cell',
      date: '2026-06-12',
      readTime: '5 min read',
      published: true,
      excerpt: 'Uncertified third-party contractors expose corporate facilities to severe legal liabilities. Discover how Spartans FM enforces strict Lock-Out, Tag-Out and statutory insurance backing.',
      content: '<h2>Corporate Protection through Strict Statutory Compliance</h2><p>Facility owners often face severe liabilities if uncertified third-party contractors suffer accidents on site. Spartans FM guarantees 100% ESIC and Workmen Compensation backing.</p>'
    }
  ],
  banners: [
    {
      id: 'ban-1',
      title: 'Strategic Repairs & Maintenance Partner',
      subtitle: 'Pan-India B2B Hard Services & Engineering Excellence',
      tagline: 'Spartans Facility Management • June 2026 Profile',
      badge: 'B2B Enterprise SLA',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      active: true,
      ctaText: 'Request Facility Health Audit',
      ctaLink: '/contact',
      secondaryCtaText: 'Explore Vigyani.ai Hub',
      secondaryCtaLink: '/vigyani-ai'
    },
    {
      id: 'ban-2',
      title: 'Redefining Excellence in Integrated FM',
      subtitle: 'A single accountable partner for premium technical and soft services, powered by AI.',
      tagline: 'SFM | SMS | VIGYANI.AI',
      badge: 'AI Telemetry Engine',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      active: true,
      ctaText: 'Explore Vigyani.ai Hub',
      ctaLink: '/vigyani-ai',
      secondaryCtaText: 'View R&M Scope',
      secondaryCtaLink: '/rm-services'
    },
    {
      id: 'ban-3',
      title: 'Heavy HVAC & Precision Chiller Overhauls',
      subtitle: '100% ITI certified engineers delivering predictive thermal telemetry and zero guest downtime.',
      tagline: '5-Star Hospitality & Tech Parks',
      badge: 'Zero-Downtime Guarantee',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      active: true,
      ctaText: 'Book Technical Survey',
      ctaLink: '/contact',
      secondaryCtaText: 'Download Capabilities',
      secondaryCtaLink: '/about'
    }
  ],
  homepage: {
    heroTagline: 'Spartans Facility Management • June 2026 Corporate Profile',
    heroHeading: 'Strategic Repairs & Maintenance Partner',
    heroSubheading: 'Pan-India B2B Hard Services & Engineering Excellence',
    heroDescription: 'Transforming infrastructure upkeep into seamless operational uptime. A single accountable partner for premium technical, engineering, and soft services — powered by Vigyani.ai.',
    milestone1: '100% ITI / Diploma Verified Manpower',
    milestone2: 'Lead Technical Partner: Taj Palace Lucknow',
    milestone3: 'Central Command Hub: Lucknow',
    retentionRate: '85%+',
    costReduction: '15-20%'
  },
  socials: {
    phone: '+91-8299726346',
    whatsapp: '+91-8299726346',
    email: 'Sales@spartansfacility.com',
    address: 'Headquarters & Command Hub: Lucknow, Uttar Pradesh (Pan-India Presence)',
    contactPerson: 'Pranjal Gupta',
    website: 'https://digicoders.in',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com'
  }
};

module.exports = store;
