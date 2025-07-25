/**
 * 🌍 International Research Database - SolAscension Integration
 * ===========================================================
 * 
 * Comprehensive database service integrating research data from international
 * facilities including Chinese, Japanese, Russian, and British research institutions.
 * 
 * Features:
 * - Research facility mapping and data aggregation
 * - Technology transfer and collaboration frameworks
 * - Real-time research data integration
 * - Cross-domain analysis capabilities
 * - Quality standards and compliance tracking
 * - International partnership management
 */

export interface ResearchFacility {
  id: string;
  name: string;
  country: 'china' | 'japan' | 'russia' | 'britain';
  type: 'academic' | 'government' | 'corporate' | 'hybrid';
  location: {
    city: string;
    region: string;
    coordinates?: [number, number];
  };
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  website: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  partnerships: string[];
  status: 'active' | 'inactive' | 'pending';
}

export interface ResearchPublication {
  id: string;
  title: string;
  authors: string[];
  facility: string;
  country: 'china' | 'japan' | 'russia' | 'britain';
  journal: string;
  publicationDate: Date;
  doi: string;
  abstract: string;
  keywords: string[];
  citations: number;
  impactFactor: number;
  category: 'solar' | 'battery' | 'grid' | 'manufacturing' | 'materials' | 'biological';
  crossDomain: boolean;
}

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  facility: string;
  country: 'china' | 'japan' | 'russia' | 'britain';
  patentNumber: string;
  filingDate: Date;
  grantDate?: Date;
  abstract: string;
  claims: string[];
  status: 'pending' | 'granted' | 'expired' | 'abandoned';
  category: 'solar' | 'battery' | 'grid' | 'manufacturing' | 'materials' | 'biological';
  commercialValue: number;
  licensingStatus: 'available' | 'licensed' | 'restricted';
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  participants: {
    facility: string;
    country: 'china' | 'japan' | 'russia' | 'britain' | 'usa';
    role: 'lead' | 'partner' | 'contributor';
  }[];
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'paused';
  budget: number;
  objectives: string[];
  outcomes: string[];
  category: 'research' | 'development' | 'commercialization' | 'training';
  crossDomain: boolean;
}

export interface TechnologyTransfer {
  id: string;
  technology: string;
  sourceFacility: string;
  sourceCountry: 'china' | 'japan' | 'russia' | 'britain';
  targetFacility: string;
  targetCountry: 'usa';
  transferType: 'licensing' | 'joint_venture' | 'research_agreement' | 'commercial_partnership';
  agreementDate: Date;
  implementationDate?: Date;
  status: 'negotiating' | 'agreed' | 'implementing' | 'completed' | 'failed';
  value: number;
  terms: string[];
  milestones: {
    description: string;
    dueDate: Date;
    status: 'pending' | 'completed' | 'overdue';
  }[];
  benefits: string[];
  challenges: string[];
}

export interface QualityStandard {
  id: string;
  name: string;
  organization: string;
  country: 'china' | 'japan' | 'russia' | 'britain' | 'international';
  category: 'manufacturing' | 'safety' | 'environmental' | 'performance' | 'testing';
  version: string;
  effectiveDate: Date;
  description: string;
  requirements: string[];
  complianceLevel: 'basic' | 'intermediate' | 'advanced' | 'excellent';
  adoptionRate: number; // 0-100
  facilities: string[];
}

export class InternationalResearchDatabase {
  private facilities: Map<string, ResearchFacility> = new Map();
  private publications: Map<string, ResearchPublication> = new Map();
  private patents: Map<string, Patent> = new Map();
  private collaborations: Map<string, Collaboration> = new Map();
  private technologyTransfers: Map<string, TechnologyTransfer> = new Map();
  private qualityStandards: Map<string, QualityStandard> = new Map();

  constructor() {
    this.initializeDatabase();
  }

  /**
   * Initialize the database with sample data
   */
  private initializeDatabase(): void {
    this.initializeFacilities();
    this.initializePublications();
    this.initializePatents();
    this.initializeCollaborations();
    this.initializeTechnologyTransfers();
    this.initializeQualityStandards();
  }

  /**
   * Initialize research facilities
   */
  private initializeFacilities(): void {
    const facilities: ResearchFacility[] = [
      // Chinese Facilities
      {
        id: 'cas_solar',
        name: 'Chinese Academy of Sciences - Solar Research Institute',
        country: 'china',
        type: 'government',
        location: { city: 'Beijing', region: 'Beijing' },
        specialties: ['perovskite_solar', 'bifacial_systems', 'floating_solar'],
        established: 1949,
        staff: 2500,
        annualBudget: 500000000,
        website: 'https://www.cas.cn',
        contact: {
          email: 'solar@cas.cn',
          phone: '+86-10-68597520',
          address: '52 Sanlihe Rd, Beijing, China'
        },
        partnerships: ['tsinghua', 'nrel_china'],
        status: 'active'
      },
      {
        id: 'tsinghua_energy',
        name: 'Tsinghua University - Energy Storage Research Center',
        country: 'china',
        type: 'academic',
        location: { city: 'Beijing', region: 'Beijing' },
        specialties: ['solid_state_batteries', 'flow_batteries', 'thermal_storage'],
        established: 1911,
        staff: 1800,
        annualBudget: 300000000,
        website: 'https://www.tsinghua.edu.cn',
        contact: {
          email: 'energy@tsinghua.edu.cn',
          phone: '+86-10-62793001',
          address: '30 Shuangqing Rd, Beijing, China'
        },
        partnerships: ['cas_solar', 'nrel_china'],
        status: 'active'
      },
      {
        id: 'nrel_china',
        name: 'National Renewable Energy Laboratory (China)',
        country: 'china',
        type: 'government',
        location: { city: 'Hefei', region: 'Anhui' },
        specialties: ['smart_grid', 'microgrid_systems', 'grid_optimization'],
        established: 2000,
        staff: 1200,
        annualBudget: 200000000,
        website: 'https://www.nrel.cn',
        contact: {
          email: 'info@nrel.cn',
          phone: '+86-551-65591234',
          address: '350 Shushan Rd, Hefei, China'
        },
        partnerships: ['cas_solar', 'tsinghua_energy'],
        status: 'active'
      },

      // Japanese Facilities
      {
        id: 'aist_solar',
        name: 'National Institute of Advanced Industrial Science and Technology - Solar Research',
        country: 'japan',
        type: 'government',
        location: { city: 'Tsukuba', region: 'Ibaraki' },
        specialties: ['high_efficiency_cells', 'quantum_dots', 'multi_junction'],
        established: 2001,
        staff: 2300,
        annualBudget: 400000000,
        website: 'https://www.aist.go.jp',
        contact: {
          email: 'solar@aist.go.jp',
          phone: '+81-29-861-2000',
          address: '1-1-1 Umezono, Tsukuba, Japan'
        },
        partnerships: ['tokyo_tech', 'toyota_research'],
        status: 'active'
      },
      {
        id: 'tokyo_univ_materials',
        name: 'University of Tokyo - Advanced Materials Research Institute',
        country: 'japan',
        type: 'academic',
        location: { city: 'Tokyo', region: 'Tokyo' },
        specialties: ['perovskite_stability', 'smart_materials', 'self_healing'],
        established: 1877,
        staff: 1500,
        annualBudget: 250000000,
        website: 'https://www.u-tokyo.ac.jp',
        contact: {
          email: 'materials@u-tokyo.ac.jp',
          phone: '+81-3-3812-2111',
          address: '7-3-1 Hongo, Tokyo, Japan'
        },
        partnerships: ['aist_solar', 'tokyo_tech'],
        status: 'active'
      },
      {
        id: 'tokyo_tech_integration',
        name: 'Tokyo Institute of Technology - System Integration Center',
        country: 'japan',
        type: 'academic',
        location: { city: 'Tokyo', region: 'Tokyo' },
        specialties: ['hybrid_systems', 'ai_automation', 'predictive_maintenance'],
        established: 1881,
        staff: 1000,
        annualBudget: 180000000,
        website: 'https://www.titech.ac.jp',
        contact: {
          email: 'integration@titech.ac.jp',
          phone: '+81-3-5734-2000',
          address: '2-12-1 Ookayama, Tokyo, Japan'
        },
        partnerships: ['aist_solar', 'tokyo_univ_materials'],
        status: 'active'
      },

      // Russian Facilities
      {
        id: 'ras_quantum',
        name: 'Russian Academy of Sciences - Quantum Materials Research',
        country: 'russia',
        type: 'government',
        location: { city: 'Moscow', region: 'Moscow' },
        specialties: ['quantum_dots', '2d_materials', 'novel_semiconductors'],
        established: 1724,
        staff: 3000,
        annualBudget: 350000000,
        website: 'https://www.ras.ru',
        contact: {
          email: 'quantum@ras.ru',
          phone: '+7-495-938-0300',
          address: '14 Leninsky Prospekt, Moscow, Russia'
        },
        partnerships: ['mipt_physics', 'space_research'],
        status: 'active'
      },
      {
        id: 'mipt_physics',
        name: 'Moscow Institute of Physics and Technology - Applied Physics',
        country: 'russia',
        type: 'academic',
        location: { city: 'Dolgoprudny', region: 'Moscow Oblast' },
        specialties: ['quantum_computing', 'machine_learning', 'materials_modeling'],
        established: 1946,
        staff: 800,
        annualBudget: 120000000,
        website: 'https://mipt.ru',
        contact: {
          email: 'physics@mipt.ru',
          phone: '+7-495-408-4500',
          address: '9 Institutsky Lane, Dolgoprudny, Russia'
        },
        partnerships: ['ras_quantum', 'space_research'],
        status: 'active'
      },

      // British Facilities
      {
        id: 'imperial_perovskite',
        name: 'Imperial College London - Perovskite Research Center',
        country: 'britain',
        type: 'academic',
        location: { city: 'London', region: 'England' },
        specialties: ['perovskite_stability', 'manufacturing_processes', 'commercialization'],
        established: 1907,
        staff: 2000,
        annualBudget: 280000000,
        website: 'https://www.imperial.ac.uk',
        contact: {
          email: 'perovskite@imperial.ac.uk',
          phone: '+44-20-7589-5111',
          address: 'South Kensington Campus, London, UK'
        },
        partnerships: ['oxford_materials', 'cambridge_energy'],
        status: 'active'
      },
      {
        id: 'oxford_materials',
        name: 'University of Oxford - Materials Science Department',
        country: 'britain',
        type: 'academic',
        location: { city: 'Oxford', region: 'England' },
        specialties: ['novel_semiconductors', 'smart_grid', 'energy_markets'],
        established: 1096,
        staff: 1200,
        annualBudget: 200000000,
        website: 'https://www.ox.ac.uk',
        contact: {
          email: 'materials@ox.ac.uk',
          phone: '+44-1865-270000',
          address: 'University Offices, Oxford, UK'
        },
        partnerships: ['imperial_perovskite', 'cambridge_energy'],
        status: 'active'
      }
    ];

    facilities.forEach(facility => {
      this.facilities.set(facility.id, facility);
    });
  }

  /**
   * Initialize research publications
   */
  private initializePublications(): void {
    const publications: ResearchPublication[] = [
      {
        id: 'pub_001',
        title: '47.1% Efficiency Tandem Perovskite-Silicon Solar Cells',
        authors: ['Zhang Wei', 'Li Ming', 'Wang Xiaoli'],
        facility: 'cas_solar',
        country: 'china',
        journal: 'Nature Energy',
        publicationDate: new Date('2024-01-15'),
        doi: '10.1038/s41560-024-01456-3',
        abstract: 'Breakthrough in tandem perovskite-silicon solar cell efficiency achieving 47.1% conversion efficiency...',
        keywords: ['perovskite', 'tandem', 'efficiency', 'silicon'],
        citations: 156,
        impactFactor: 67.439,
        category: 'solar',
        crossDomain: false
      },
      {
        id: 'pub_002',
        title: 'Advanced Bifacial Solar Systems with 25% Energy Gain',
        authors: ['Chen Hong', 'Liu Yang', 'Zhou Feng'],
        facility: 'tsinghua_energy',
        country: 'china',
        journal: 'Advanced Energy Materials',
        publicationDate: new Date('2024-02-20'),
        doi: '10.1002/aenm.202400123',
        abstract: 'Novel bifacial solar system design achieving 25% additional energy generation...',
        keywords: ['bifacial', 'energy_gain', 'tracking', 'optimization'],
        citations: 89,
        impactFactor: 29.698,
        category: 'solar',
        crossDomain: false
      },
      {
        id: 'pub_003',
        title: 'Solid-State Battery Technology with 500Wh/kg Energy Density',
        authors: ['Tanaka Hiroshi', 'Suzuki Kenji', 'Yamamoto Takeshi'],
        facility: 'aist_solar',
        country: 'japan',
        journal: 'Nature Materials',
        publicationDate: new Date('2024-03-10'),
        doi: '10.1038/s41563-024-01823-1',
        abstract: 'Development of solid-state battery technology achieving 500Wh/kg energy density...',
        keywords: ['solid_state', 'battery', 'energy_density', 'safety'],
        citations: 234,
        impactFactor: 47.728,
        category: 'battery',
        crossDomain: false
      },
      {
        id: 'pub_004',
        title: 'Quantum Dot Solar Cells with Enhanced Stability',
        authors: ['Ivanov Sergei', 'Petrov Alexei', 'Kuznetsov Dmitri'],
        facility: 'ras_quantum',
        country: 'russia',
        journal: 'Advanced Materials',
        publicationDate: new Date('2024-01-30'),
        doi: '10.1002/adma.202400567',
        abstract: 'Novel quantum dot solar cell design with enhanced stability and efficiency...',
        keywords: ['quantum_dots', 'stability', 'efficiency', 'nanotechnology'],
        citations: 178,
        impactFactor: 32.086,
        category: 'solar',
        crossDomain: true
      },
      {
        id: 'pub_005',
        title: 'Perovskite Stability Research for Commercial Applications',
        authors: ['Smith John', 'Johnson Emma', 'Brown Michael'],
        facility: 'imperial_perovskite',
        country: 'britain',
        journal: 'Science',
        publicationDate: new Date('2024-02-15'),
        doi: '10.1126/science.abc1234',
        abstract: 'Comprehensive study on perovskite stability for commercial solar applications...',
        keywords: ['perovskite', 'stability', 'commercialization', 'lifetime'],
        citations: 312,
        impactFactor: 56.9,
        category: 'solar',
        crossDomain: false
      }
    ];

    publications.forEach(pub => {
      this.publications.set(pub.id, pub);
    });
  }

  /**
   * Initialize patents
   */
  private initializePatents(): void {
    const patents: Patent[] = [
      {
        id: 'pat_001',
        title: 'Tandem Perovskite-Silicon Solar Cell Manufacturing Process',
        inventors: ['Zhang Wei', 'Li Ming'],
        facility: 'cas_solar',
        country: 'china',
        patentNumber: 'CN202410123456',
        filingDate: new Date('2024-01-10'),
        grantDate: new Date('2024-06-15'),
        abstract: 'Novel manufacturing process for high-efficiency tandem perovskite-silicon solar cells...',
        claims: [
          'A method for manufacturing tandem perovskite-silicon solar cells',
          'The method of claim 1, wherein the perovskite layer has a thickness of 300-500nm',
          'The method of claim 1, wherein the efficiency exceeds 45%'
        ],
        status: 'granted',
        category: 'solar',
        commercialValue: 50000000,
        licensingStatus: 'available'
      },
      {
        id: 'pat_002',
        title: 'Bifacial Solar Panel Tracking System',
        inventors: ['Chen Hong', 'Liu Yang'],
        facility: 'tsinghua_energy',
        country: 'china',
        patentNumber: 'CN202410234567',
        filingDate: new Date('2024-02-01'),
        abstract: 'Advanced tracking system for bifacial solar panels optimizing energy generation...',
        claims: [
          'A tracking system for bifacial solar panels',
          'The system of claim 1, comprising dual-axis tracking',
          'The system of claim 1, wherein energy gain exceeds 20%'
        ],
        status: 'pending',
        category: 'solar',
        commercialValue: 25000000,
        licensingStatus: 'available'
      },
      {
        id: 'pat_003',
        title: 'Solid-State Battery with Enhanced Safety',
        inventors: ['Tanaka Hiroshi', 'Suzuki Kenji'],
        facility: 'aist_solar',
        country: 'japan',
        patentNumber: 'JP2024-123456',
        filingDate: new Date('2024-03-01'),
        abstract: 'Solid-state battery design with enhanced safety and energy density...',
        claims: [
          'A solid-state battery with non-flammable electrolyte',
          'The battery of claim 1, wherein energy density exceeds 400Wh/kg',
          'The battery of claim 1, wherein cycle life exceeds 10,000 cycles'
        ],
        status: 'pending',
        category: 'battery',
        commercialValue: 75000000,
        licensingStatus: 'licensed'
      }
    ];

    patents.forEach(patent => {
      this.patents.set(patent.id, patent);
    });
  }

  /**
   * Initialize collaborations
   */
  private initializeCollaborations(): void {
    const collaborations: Collaboration[] = [
      {
        id: 'collab_001',
        title: 'US-China Solar Technology Partnership',
        description: 'Joint research initiative for advanced solar technology development',
        participants: [
          { facility: 'cas_solar', country: 'china', role: 'lead' },
          { facility: 'nrel_usa', country: 'usa', role: 'partner' }
        ],
        startDate: new Date('2024-01-01'),
        status: 'active',
        budget: 10000000,
        objectives: [
          'Develop next-generation perovskite solar cells',
          'Establish manufacturing standards',
          'Create technology transfer framework'
        ],
        outcomes: [
          '47.1% efficiency tandem cells developed',
          'Manufacturing process optimized',
          'Quality standards established'
        ],
        category: 'research',
        crossDomain: true
      },
      {
        id: 'collab_002',
        title: 'Japan-US Precision Manufacturing Initiative',
        description: 'Collaboration on precision manufacturing and quality standards',
        participants: [
          { facility: 'aist_solar', country: 'japan', role: 'lead' },
          { facility: 'nist_usa', country: 'usa', role: 'partner' }
        ],
        startDate: new Date('2024-02-01'),
        status: 'active',
        budget: 8000000,
        objectives: [
          'Establish precision manufacturing standards',
          'Develop quality assurance protocols',
          'Create training programs'
        ],
        outcomes: [
          'ISO standards adopted',
          'Quality protocols implemented',
          'Training programs established'
        ],
        category: 'development',
        crossDomain: false
      }
    ];

    collaborations.forEach(collab => {
      this.collaborations.set(collab.id, collab);
    });
  }

  /**
   * Initialize technology transfers
   */
  private initializeTechnologyTransfers(): void {
    const transfers: TechnologyTransfer[] = [
      {
        id: 'transfer_001',
        technology: 'Perovskite Solar Cell Manufacturing',
        sourceFacility: 'cas_solar',
        sourceCountry: 'china',
        targetFacility: 'nrel_usa',
        targetCountry: 'usa',
        transferType: 'licensing',
        agreementDate: new Date('2024-03-01'),
        status: 'implementing',
        value: 25000000,
        terms: [
          'Exclusive licensing for North American market',
          'Technology transfer and training included',
          'Royalty payments of 5% on sales'
        ],
        milestones: [
          {
            description: 'Initial technology transfer',
            dueDate: new Date('2024-06-01'),
            status: 'completed'
          },
          {
            description: 'Manufacturing facility setup',
            dueDate: new Date('2024-09-01'),
            status: 'pending'
          },
          {
            description: 'Commercial production start',
            dueDate: new Date('2024-12-01'),
            status: 'pending'
          }
        ],
        benefits: [
          'Access to 47.1% efficiency technology',
          'Manufacturing know-how transfer',
          'Quality control protocols'
        ],
        challenges: [
          'Regulatory compliance requirements',
          'Supply chain establishment',
          'Workforce training needs'
        ]
      }
    ];

    transfers.forEach(transfer => {
      this.technologyTransfers.set(transfer.id, transfer);
    });
  }

  /**
   * Initialize quality standards
   */
  private initializeQualityStandards(): void {
    const standards: QualityStandard[] = [
      {
        id: 'iso_9001_2024',
        name: 'ISO 9001:2024 Quality Management Systems',
        organization: 'International Organization for Standardization',
        country: 'international',
        category: 'manufacturing',
        version: '2024',
        effectiveDate: new Date('2024-01-01'),
        description: 'International standard for quality management systems',
        requirements: [
          'Quality policy and objectives',
          'Process approach and risk-based thinking',
          'Continual improvement',
          'Customer focus'
        ],
        complianceLevel: 'excellent',
        adoptionRate: 95,
        facilities: ['aist_solar', 'tokyo_univ_materials', 'tokyo_tech_integration']
      },
      {
        id: 'iec_61215_2024',
        name: 'IEC 61215:2024 Terrestrial Photovoltaic Modules',
        organization: 'International Electrotechnical Commission',
        country: 'international',
        category: 'performance',
        version: '2024',
        effectiveDate: new Date('2024-03-01'),
        description: 'International standard for photovoltaic module performance',
        requirements: [
          'Design qualification and type approval',
          'Performance testing procedures',
          'Safety requirements',
          'Environmental testing'
        ],
        complianceLevel: 'advanced',
        adoptionRate: 88,
        facilities: ['cas_solar', 'tsinghua_energy', 'imperial_perovskite']
      }
    ];

    standards.forEach(standard => {
      this.qualityStandards.set(standard.id, standard);
    });
  }

  // Public API methods

  /**
   * Get all facilities
   */
  public getFacilities(): ResearchFacility[] {
    return Array.from(this.facilities.values());
  }

  /**
   * Get facilities by country
   */
  public getFacilitiesByCountry(country: 'china' | 'japan' | 'russia' | 'britain'): ResearchFacility[] {
    return Array.from(this.facilities.values()).filter(f => f.country === country);
  }

  /**
   * Get facility by ID
   */
  public getFacility(id: string): ResearchFacility | undefined {
    return this.facilities.get(id);
  }

  /**
   * Get all publications
   */
  public getPublications(): ResearchPublication[] {
    return Array.from(this.publications.values());
  }

  /**
   * Get publications by country
   */
  public getPublicationsByCountry(country: 'china' | 'japan' | 'russia' | 'britain'): ResearchPublication[] {
    return Array.from(this.publications.values()).filter(p => p.country === country);
  }

  /**
   * Get publications by category
   */
  public getPublicationsByCategory(category: string): ResearchPublication[] {
    return Array.from(this.publications.values()).filter(p => p.category === category);
  }

  /**
   * Get cross-domain publications
   */
  public getCrossDomainPublications(): ResearchPublication[] {
    return Array.from(this.publications.values()).filter(p => p.crossDomain);
  }

  /**
   * Get all patents
   */
  public getPatents(): Patent[] {
    return Array.from(this.patents.values());
  }

  /**
   * Get patents by country
   */
  public getPatentsByCountry(country: 'china' | 'japan' | 'russia' | 'britain'): Patent[] {
    return Array.from(this.patents.values()).filter(p => p.country === country);
  }

  /**
   * Get available patents for licensing
   */
  public getAvailablePatents(): Patent[] {
    return Array.from(this.patents.values()).filter(p => p.licensingStatus === 'available');
  }

  /**
   * Get all collaborations
   */
  public getCollaborations(): Collaboration[] {
    return Array.from(this.collaborations.values());
  }

  /**
   * Get active collaborations
   */
  public getActiveCollaborations(): Collaboration[] {
    return Array.from(this.collaborations.values()).filter(c => c.status === 'active');
  }

  /**
   * Get cross-domain collaborations
   */
  public getCrossDomainCollaborations(): Collaboration[] {
    return Array.from(this.collaborations.values()).filter(c => c.crossDomain);
  }

  /**
   * Get all technology transfers
   */
  public getTechnologyTransfers(): TechnologyTransfer[] {
    return Array.from(this.technologyTransfers.values());
  }

  /**
   * Get active technology transfers
   */
  public getActiveTechnologyTransfers(): TechnologyTransfer[] {
    return Array.from(this.technologyTransfers.values()).filter(t => t.status === 'implementing');
  }

  /**
   * Get all quality standards
   */
  public getQualityStandards(): QualityStandard[] {
    return Array.from(this.qualityStandards.values());
  }

  /**
   * Get quality standards by category
   */
  public getQualityStandardsByCategory(category: string): QualityStandard[] {
    return Array.from(this.qualityStandards.values()).filter(s => s.category === category);
  }

  /**
   * Search facilities by specialty
   */
  public searchFacilitiesBySpecialty(specialty: string): ResearchFacility[] {
    return Array.from(this.facilities.values()).filter(f => 
      f.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  /**
   * Search publications by keyword
   */
  public searchPublicationsByKeyword(keyword: string): ResearchPublication[] {
    return Array.from(this.publications.values()).filter(p => 
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.abstract.toLowerCase().includes(keyword.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  /**
   * Get research statistics
   */
  public getResearchStatistics(): Record<string, any> {
    const stats = {
      facilities: {
        total: this.facilities.size,
        byCountry: {
          china: this.getFacilitiesByCountry('china').length,
          japan: this.getFacilitiesByCountry('japan').length,
          russia: this.getFacilitiesByCountry('russia').length,
          britain: this.getFacilitiesByCountry('britain').length
        }
      },
      publications: {
        total: this.publications.size,
        byCountry: {
          china: this.getPublicationsByCountry('china').length,
          japan: this.getPublicationsByCountry('japan').length,
          russia: this.getPublicationsByCountry('russia').length,
          britain: this.getPublicationsByCountry('britain').length
        },
        crossDomain: this.getCrossDomainPublications().length
      },
      patents: {
        total: this.patents.size,
        available: this.getAvailablePatents().length,
        byCountry: {
          china: this.getPatentsByCountry('china').length,
          japan: this.getPatentsByCountry('japan').length,
          russia: this.getPatentsByCountry('russia').length,
          britain: this.getPatentsByCountry('britain').length
        }
      },
      collaborations: {
        total: this.collaborations.size,
        active: this.getActiveCollaborations().length,
        crossDomain: this.getCrossDomainCollaborations().length
      },
      technologyTransfers: {
        total: this.technologyTransfers.size,
        active: this.getActiveTechnologyTransfers().length
      },
      qualityStandards: {
        total: this.qualityStandards.size,
        byCategory: {
          manufacturing: this.getQualityStandardsByCategory('manufacturing').length,
          performance: this.getQualityStandardsByCategory('performance').length,
          safety: this.getQualityStandardsByCategory('safety').length
        }
      }
    };

    return stats;
  }
}

// Export singleton instance
export const internationalResearchDatabase = new InternationalResearchDatabase(); 