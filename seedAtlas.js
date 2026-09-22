const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Blog = require('./models/Blog');
const Banner = require('./models/Banner');
const Category = require('./models/Category');
const Setting = require('./models/Setting');
const Enquiry = require('./models/Enquiry');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devdigicoders_db_user:FppnvPOko6ax8Tzz@cluster0.ejrhpk3.mongodb.net/sfm_facility_db?retryWrites=true&w=majority';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully!');

    // 1. SEED CATEGORIES
    console.log('Seeding Categories...');
    await Category.deleteMany({});
    const categories = await Category.insertMany([
      { name: 'AI & Predictive FM', slug: 'ai-predictive-fm', count: 4, color: 'bg-sky-100 text-sky-800' },
      { name: 'Hard Engineering', slug: 'hard-engineering', count: 6, color: 'bg-emerald-100 text-emerald-800' },
      { name: 'Safety & Compliance', slug: 'safety-compliance', count: 3, color: 'bg-rose-100 text-rose-800' },
      { name: 'Case Studies', slug: 'case-studies', count: 5, color: 'bg-amber-100 text-amber-800' },
      { name: 'Energy & Sustainability', slug: 'energy-sustainability', count: 2, color: 'bg-teal-100 text-teal-800' }
    ]);
    console.log(`✓ Inserted ${categories.length} Categories`);

    // 2. SEED BANNERS (With high quality Unsplash facility management images)
    console.log('Seeding Banners...');
    await Banner.deleteMany({});
    const banners = await Banner.insertMany([
      {
        title: 'Strategic Repairs & Maintenance Partner',
        subtitle: 'Pan-India B2B Hard Services & Engineering Excellence with 100% SLA Guarantee',
        tagline: 'Spartans Facility Management',
        badge: 'June 2026 Corporate Profile',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
        active: true,
        ctaText: 'Request Facility Health Audit',
        ctaLink: '/contact',
        secondaryCtaText: 'Explore Vigyani.ai Hub',
        secondaryCtaLink: '/ifm-services'
      },
      {
        title: 'AI-Driven Predictive HVAC & Electrical Asset Oversight',
        subtitle: 'Eliminate unplanned downtime with Vigyani.ai IoT telemetry and real-time vibration sensing.',
        tagline: 'SFM | SMS | VIGYANI.AI',
        badge: 'Smart FM Telemetry',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
        active: true,
        ctaText: 'Book Technical Survey',
        ctaLink: '/contact',
        secondaryCtaText: 'View Engineering Suite',
        secondaryCtaLink: '/rm-services'
      },
      {
        title: 'Zero Liability Transfer & 100% Statutory Compliance',
        subtitle: 'Strict LOTO protocols, full ESIC, PF, and comprehensive Workmen Compensation backing.',
        tagline: 'Enterprise Safety Standard',
        badge: 'ISO & NBC 2016 Certified',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
        active: true,
        ctaText: 'Download Compliance Dossier',
        ctaLink: '/contact',
        secondaryCtaText: 'Explore Services',
        secondaryCtaLink: '/rm-services'
      }
    ]);
    console.log(`✓ Inserted ${banners.length} Banners`);

    // 3. SEED BLOGS (Technical Whitepapers & Articles)
    console.log('Seeding Blogs...');
    await Blog.deleteMany({});
    const blogs = await Blog.insertMany([
      {
        title: 'How AI Predictive Telemetry Prevents HVAC Chiller Failures in Luxury Hotels',
        slug: 'ai-predictive-hvac-chiller-failures',
        category: 'AI & Predictive FM',
        categoryId: categories[0]._id.toString(),
        author: 'Pranjal Gupta',
        readTime: '4 min read',
        excerpt: 'Traditional maintenance is reactive. Learn how Vigyani.ai IoT vibration and thermal sensors predict motor bearing degradation 72 hours before catastrophic breakdown.',
        content: `<h2>The Shift from Reactive to Predictive Asset Oversight</h2>
<p>Commercial chiller plants in five-star hotels operate under continuous thermal strain. When a bearing fails unexpectedly during a banquet event, the financial and reputational cost is enormous.</p>
<p>By deploying <strong>Vigyani.ai IoT sensor arrays</strong>, engineering heads receive real-time alerts 72 hours in advance of mechanical failure, ensuring zero downtime and 15-20% reduced energy consumption.</p>
<h3>Key Performance Indicators Monitored</h3>
<ul>
  <li>Continuous harmonic vibration and bearing resonance frequency</li>
  <li>Compressor thermal gradient mapping</li>
  <li>Refrigerant head pressure anomaly detection</li>
</ul>`,
        published: true
      },
      {
        title: 'Zero Liability Transfer: Why 100% ESIC, PF & LOTO Protocols Protect Property Owners',
        slug: 'zero-liability-transfer-esic-pf-loto',
        category: 'Safety & Compliance',
        categoryId: categories[2]._id.toString(),
        author: 'SFM Safety Cell',
        readTime: '5 min read',
        excerpt: 'Uncertified third-party contractors expose corporate facilities to severe legal liabilities. Discover how Spartans FM enforces strict Lock-Out, Tag-Out and statutory insurance backing.',
        content: `<h2>Corporate Protection through Strict Statutory Compliance</h2>
<p>Facility owners often face severe liabilities if uncertified third-party contractors suffer accidents on site. Spartans FM guarantees 100% ESIC and Workmen Compensation backing for every on-site technician.</p>
<h3>The Spartans Safety Standard</h3>
<p>Every maintenance intervention on high-voltage switchgear or pressurized chilled water lines strictly requires dual-key Lock-Out / Tag-Out (LOTO) verification logged digitally via mobile inspection terminals.</p>`,
        published: true
      },
      {
        title: 'Optimizing Central Command Dispatch in Multi-Tenant Commercial IT Parks',
        slug: 'central-command-dispatch-multi-tenant-it-parks',
        category: 'Hard Engineering',
        categoryId: categories[1]._id.toString(),
        author: 'Technical Operations Team',
        readTime: '6 min read',
        excerpt: 'Managing over 1,000,000 sq ft across multiple towers requires strict SLA velocity. Discover our 15-minute emergency response matrix deployed across Lucknow & Delhi NCR.',
        content: `<h2>SLA Velocity in Mission-Critical Infrastructure</h2>
<p>In tier-1 IT parks, an electrical blackout or server room cooling failure cannot wait for standard business hours. Spartans FM operates a 24/7/365 Central Command Hub with dedicated roving response engineers.</p>
<p>All service tickets are triaged automatically by priority tier, ensuring life-safety issues are contained within 15 minutes of trigger.</p>`,
        published: true
      },
      {
        title: 'Case Study: 32% Energy Saving at a 500-Bed Super Specialty Hospital',
        slug: 'case-study-energy-saving-hospital',
        category: 'Case Studies',
        categoryId: categories[3]._id.toString(),
        author: 'Energy Audit Cell',
        readTime: '7 min read',
        excerpt: 'A comprehensive retro-commissioning of air handling units, VFD tuning, and chilled water balance delivered massive cost reductions without compromising patient ward air quality.',
        content: `<h2>Healthcare Infrastructure Modernization</h2>
<p>Hospitals run 24/7 with strict ISO air-change requirements. Over a 90-day transition period, SFM engineers overhauled 42 Air Handling Units, optimized chilled water delta-T, and integrated automated VFD control loops.</p>
<p>The facility recorded a 32% net reduction in kilowatt-hour consumption within the first two billing cycles.</p>`,
        published: true
      }
    ]);
    console.log(`✓ Inserted ${blogs.length} Blogs`);

    // 4. SEED HOMEPAGE & SOCIALS SETTINGS
    console.log('Seeding Settings (Homepage & Socials)...');
    await Setting.deleteMany({});
    
    await Setting.create({
      key: 'homepage',
      value: {
        heroTagline: 'Spartans Facility Management • June 2026 Corporate Profile',
        heroHeading: 'Strategic Repairs & Maintenance Partner',
        heroSubheading: 'Pan-India B2B Hard Services & Engineering Excellence',
        heroDescription: 'Transforming infrastructure upkeep into seamless operational uptime. A single accountable partner for premium technical, engineering, and soft services — powered by Vigyani.ai.',
        milestone1: '100% ITI / Diploma Verified Manpower',
        milestone2: 'Lead Technical Partner: Taj Palace Lucknow',
        milestone3: 'Central Command Hub: Lucknow',
        retentionRate: '85%+',
        costReduction: '15-20%'
      }
    });

    await Setting.create({
      key: 'socials',
      value: {
        phone: '+91-8299726346',
        whatsapp: '+91-8299726346',
        email: 'Sales@spartansfacility.com',
        address: 'Headquarters & Command Hub: Lucknow, Uttar Pradesh (Pan-India Presence)',
        contactPerson: 'Pranjal Gupta',
        website: 'https://digicoders.in',
        linkedin: 'https://linkedin.com/company/spartans-facility-management',
        facebook: 'https://facebook.com/spartansfacility',
        instagram: 'https://instagram.com/spartansfacility'
      }
    });
    console.log('✓ Inserted Homepage and Social Settings');

    // 5. SEED ENQUIRIES
    console.log('Seeding Enquiries...');
    await Enquiry.deleteMany({});
    const enquiries = await Enquiry.insertMany([
      {
        customId: 'ENQ-2026-001',
        companyName: 'Taj Hotel & Banquets',
        contactPerson: 'Arunav Sharma (Chief Engineer)',
        phone: '+91-9876543210',
        email: 'arunav.s@tajhotels.com',
        city: 'Lucknow',
        facilityType: 'Luxury Hospitality',
        sqFootage: '150,000 - 300,000 sq ft',
        servicesNeeded: ['HVAC Chiller Maintenance', 'Vigyani.ai IoT Telemetry', 'Diesel Generator Overhaul'],
        status: 'Scheduled',
        notes: 'Site audit scheduled for Friday 11:00 AM. Key focus on 3x 250 TR screw chillers.'
      },
      {
        customId: 'ENQ-2026-002',
        companyName: 'Medanta Super Specialty Hospital',
        contactPerson: 'Dr. Vivek Malhotra',
        phone: '+91-9988776655',
        email: 'facilities@medanta.org',
        city: 'Lucknow',
        facilityType: 'Healthcare & Hospital',
        sqFootage: '300,000+ sq ft',
        servicesNeeded: ['Medical Gas Pipeline Systems', 'HT/LT Transformer Substations', '100% LOTO Statutory Audit'],
        status: 'Reviewed',
        notes: 'Requested proposal for comprehensive 24/7 technical operations team.'
      },
      {
        customId: 'ENQ-2026-003',
        companyName: 'Cyber Heights Tech Park',
        contactPerson: 'Rajesh Verma (Estate Head)',
        phone: '+91-9123456789',
        email: 'rverma@cyberheights.in',
        city: 'Lucknow',
        facilityType: 'Commercial IT Park',
        sqFootage: '50,000 - 150,000 sq ft',
        servicesNeeded: ['Fire & Life Safety Overhauls', 'ELV & BMS Diagnostics'],
        status: 'Pending',
        notes: 'Inbound enquiry from website contact form for annual maintenance contract.'
      }
    ]);
    console.log(`✓ Inserted ${enquiries.length} Enquiries`);

    console.log('\n=============================================');
    console.log('🎉 ALL COLLECTIONS SUCCESSFULLY SEEDED TO MONGODB ATLAS!');
    console.log('=============================================');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
