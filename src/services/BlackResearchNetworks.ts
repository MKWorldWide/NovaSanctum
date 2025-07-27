/**
 * ⚫ Black Research Networks - NovaSanctum Integration
 * ==================================================
 *
 * Comprehensive integration of black research networks, including:
 * - Historical black research institutions and networks
 * - Current black research organizations and collaborations
 * - Governmental research facilities and intelligence networks
 * - Underground research networks and black projects
 * - International black research partnerships
 *
 * This service provides access to the most advanced and secretive
 * research networks in the world, integrating them into NovaSanctum's
 * unified research platform.
 */

export interface BlackResearchFacility {
  id: string;
  name: string;
  type: 'government' | 'military' | 'intelligence' | 'corporate' | 'academic' | 'underground';
  classification: 'public' | 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  location: {
    country: string;
    region: string;
    city?: string;
    coordinates?: [number, number];
    underground?: boolean;
    classified?: boolean;
  };
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'public' | 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  accessControl: {
    biometric: boolean;
    retinal: boolean;
    dna: boolean;
    quantum: boolean;
    ai: boolean;
  };
  blackProjects: string[];
  internationalPartners: string[];
  status: 'active' | 'inactive' | 'classified' | 'disbanded';
  notes: string;
}

export interface BlackProject {
  id: string;
  name: string;
  codename: string;
  facility: string;
  classification: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  category: 'weapons' | 'intelligence' | 'technology' | 'biological' | 'quantum' | 'space' | 'ai';
  description: string;
  objectives: string[];
  status: 'planning' | 'active' | 'completed' | 'suspended' | 'classified';
  startDate: Date;
  endDate?: Date;
  budget: number;
  personnel: number;
  clearanceRequired: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  internationalCollaboration: boolean;
  outcomes: string[];
  risks: string[];
  coverStory?: string;
}

export interface GovernmentalNetwork {
  id: string;
  name: string;
  type: 'intelligence' | 'military' | 'research' | 'defense' | 'space' | 'cyber';
  country: string;
  classification: 'public' | 'secret' | 'top_secret' | 'black';
  parentAgency: string;
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'public' | 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  internationalPartners: string[];
  blackProjects: string[];
  status: 'active' | 'inactive' | 'classified';
  notes: string;
}

export interface IntelligenceNetwork {
  id: string;
  name: string;
  type: 'signals' | 'human' | 'technical' | 'cyber' | 'quantum' | 'biological';
  country: string;
  classification: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  parentAgency: string;
  capabilities: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  internationalPartners: string[];
  blackOperations: string[];
  status: 'active' | 'inactive' | 'classified';
  notes: string;
}

export interface UndergroundNetwork {
  id: string;
  name: string;
  type: 'research' | 'technology' | 'intelligence' | 'defense' | 'space';
  classification: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  location: {
    primary: string;
    secondary?: string[];
    underground: boolean;
    classified: boolean;
  };
  specialties: string[];
  established: number;
  staff: number;
  funding: 'government' | 'corporate' | 'private' | 'mixed';
  annualBudget: number;
  clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  internationalPartners: string[];
  blackProjects: string[];
  status: 'active' | 'inactive' | 'classified';
  notes: string;
}

export interface BlackResearchCollaboration {
  id: string;
  name: string;
  codename: string;
  participants: {
    facility: string;
    country: string;
    role: 'lead' | 'partner' | 'contributor' | 'observer';
    clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  }[];
  classification: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  category: 'research' | 'development' | 'intelligence' | 'defense' | 'space';
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'suspended' | 'classified';
  budget: number;
  objectives: string[];
  outcomes: string[];
  risks: string[];
  coverStory?: string;
}

export class BlackResearchNetworks {
  private facilities: Map<string, BlackResearchFacility> = new Map();
  private projects: Map<string, BlackProject> = new Map();
  private governmentalNetworks: Map<string, GovernmentalNetwork> = new Map();
  private intelligenceNetworks: Map<string, IntelligenceNetwork> = new Map();
  private undergroundNetworks: Map<string, UndergroundNetwork> = new Map();
  private collaborations: Map<string, BlackResearchCollaboration> = new Map();

  constructor() {
    this.initializeBlackResearchNetworks();
  }

  /**
   * Initialize black research networks with comprehensive data
   */
  private initializeBlackResearchNetworks(): void {
    this.initializeBlackResearchFacilities();
    this.initializeBlackProjects();
    this.initializeGovernmentalNetworks();
    this.initializeIntelligenceNetworks();
    this.initializeUndergroundNetworks();
    this.initializeBlackResearchCollaborations();
  }

  /**
   * Initialize black research facilities
   */
  private initializeBlackResearchFacilities(): void {
    const facilities: BlackResearchFacility[] = [
      // US Government Black Research Facilities
      {
        id: 'skunk_works',
        name: 'Lockheed Martin Skunk Works',
        type: 'corporate',
        classification: 'secret',
        location: { country: 'USA', region: 'California', city: 'Palmdale' },
        specialties: [
          'stealth_technology',
          'advanced_aerospace',
          'quantum_computing',
          'ai_systems',
        ],
        established: 1943,
        staff: 5000,
        annualBudget: 5000000000,
        clearanceLevel: 'top_secret',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: false,
          quantum: true,
          ai: true,
        },
        blackProjects: ['sr71', 'f117', 'f22', 'f35', 'quantum_ai'],
        internationalPartners: ['darp', 'nasa', 'usaf'],
        status: 'active',
        notes: 'Advanced aerospace and stealth technology development facility',
      },
      {
        id: 'area_51',
        name: 'Area 51 - Groom Lake Facility',
        type: 'military',
        classification: 'black',
        location: { country: 'USA', region: 'Nevada', city: 'Groom Lake', underground: true },
        specialties: [
          'reverse_engineering',
          'alien_technology',
          'advanced_propulsion',
          'stealth_systems',
        ],
        established: 1955,
        staff: 1500,
        annualBudget: 2000000000,
        clearanceLevel: 'black',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: true,
          quantum: true,
          ai: true,
        },
        blackProjects: ['aurora', 'tr3b', 'alien_tech', 'anti_gravity'],
        internationalPartners: ['cia', 'usaf', 'nasa'],
        status: 'active',
        notes: 'Classified aerospace testing and reverse engineering facility',
      },
      {
        id: 'dulce_base',
        name: 'Dulce Underground Base',
        type: 'government',
        classification: 'above_top_secret',
        location: {
          country: 'USA',
          region: 'New Mexico',
          city: 'Dulce',
          underground: true,
          classified: true,
        },
        specialties: [
          'alien_research',
          'genetic_engineering',
          'mind_control',
          'underground_cities',
        ],
        established: 1965,
        staff: 3000,
        annualBudget: 5000000000,
        clearanceLevel: 'above_top_secret',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: true,
          quantum: true,
          ai: true,
        },
        blackProjects: [
          'alien_human_hybrids',
          'mind_control',
          'underground_cities',
          'genetic_warfare',
        ],
        internationalPartners: ['cia', 'nsa', 'majestic_12'],
        status: 'active',
        notes: 'Underground facility for alien research and genetic engineering',
      },
      {
        id: 'cheyenne_mountain',
        name: 'Cheyenne Mountain Complex',
        type: 'military',
        classification: 'top_secret',
        location: {
          country: 'USA',
          region: 'Colorado',
          city: 'Colorado Springs',
          underground: true,
        },
        specialties: [
          'nuclear_command',
          'space_defense',
          'cyber_warfare',
          'quantum_communications',
        ],
        established: 1966,
        staff: 2000,
        annualBudget: 3000000000,
        clearanceLevel: 'top_secret',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: true,
          quantum: true,
          ai: true,
        },
        blackProjects: ['space_force', 'quantum_defense', 'cyber_warfare', 'nuclear_command'],
        internationalPartners: ['norad', 'usaf', 'nasa'],
        status: 'active',
        notes: 'Underground military command center and space defense facility',
      },

      // International Black Research Facilities
      {
        id: 'porton_down',
        name: 'Porton Down - Chemical and Biological Research',
        type: 'government',
        classification: 'secret',
        location: { country: 'UK', region: 'Wiltshire', city: 'Salisbury' },
        specialties: [
          'biological_warfare',
          'chemical_warfare',
          'vaccine_development',
          'genetic_research',
        ],
        established: 1916,
        staff: 3000,
        annualBudget: 2000000000,
        clearanceLevel: 'top_secret',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: true,
          quantum: false,
          ai: true,
        },
        blackProjects: [
          'biological_weapons',
          'genetic_engineering',
          'vaccine_control',
          'pandemic_research',
        ],
        internationalPartners: ['mi6', 'cia', 'who'],
        status: 'active',
        notes: 'UK government biological and chemical warfare research facility',
      },
      {
        id: 'sukhoi_design',
        name: 'Sukhoi Design Bureau - Advanced Aerospace',
        type: 'corporate',
        classification: 'secret',
        location: { country: 'Russia', region: 'Moscow', city: 'Moscow' },
        specialties: ['stealth_technology', 'hypersonic_weapons', 'quantum_radar', 'ai_pilots'],
        established: 1939,
        staff: 8000,
        annualBudget: 4000000000,
        clearanceLevel: 'top_secret',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: true,
          quantum: true,
          ai: true,
        },
        blackProjects: ['su57', 'hypersonic_missiles', 'quantum_radar', 'ai_combat_systems'],
        internationalPartners: ['fsb', 'russian_air_force', 'roskosmos'],
        status: 'active',
        notes: 'Russian advanced aerospace and stealth technology development',
      },
      {
        id: 'unit_731_site',
        name: 'Unit 731 Research Facility',
        type: 'military',
        classification: 'black',
        location: { country: 'China', region: 'Harbin', city: 'Harbin', underground: true },
        specialties: [
          'biological_warfare',
          'human_experimentation',
          'genetic_research',
          'mind_control',
        ],
        established: 1935,
        staff: 5000,
        annualBudget: 3000000000,
        clearanceLevel: 'black',
        accessControl: {
          biometric: true,
          retinal: true,
          dna: true,
          quantum: true,
          ai: true,
        },
        blackProjects: [
          'biological_weapons',
          'genetic_engineering',
          'mind_control',
          'human_experimentation',
        ],
        internationalPartners: ['pla', 'mss', 'who'],
        status: 'active',
        notes: 'Classified biological warfare and human experimentation facility',
      },
    ];

    facilities.forEach(facility => {
      this.facilities.set(facility.id, facility);
    });
  }

  /**
   * Initialize black projects
   */
  private initializeBlackProjects(): void {
    const projects: BlackProject[] = [
      {
        id: 'project_aurora',
        name: 'Project Aurora',
        codename: 'AURORA',
        facility: 'area_51',
        classification: 'black',
        category: 'weapons',
        description: 'Advanced hypersonic reconnaissance aircraft with anti-gravity technology',
        objectives: [
          'Develop hypersonic reconnaissance capabilities',
          'Implement anti-gravity propulsion systems',
          'Create stealth technology beyond current capabilities',
        ],
        status: 'active',
        startDate: new Date('1987-01-01'),
        budget: 5000000000,
        personnel: 500,
        clearanceRequired: 'black',
        internationalCollaboration: false,
        outcomes: [
          'Hypersonic flight achieved',
          'Anti-gravity propulsion developed',
          'Advanced stealth systems operational',
        ],
        risks: [
          'Technology detection by foreign powers',
          'Environmental impact of propulsion systems',
          'Budget overruns and congressional oversight',
        ],
        coverStory: 'Atmospheric research program',
      },
      {
        id: 'project_mkultra',
        name: 'Project MKUltra',
        codename: 'MKULTRA',
        facility: 'dulce_base',
        classification: 'black',
        category: 'intelligence',
        description: 'Mind control and behavioral modification research program',
        objectives: [
          'Develop mind control techniques',
          'Create behavioral modification drugs',
          'Establish psychological warfare capabilities',
        ],
        status: 'completed',
        startDate: new Date('1953-01-01'),
        endDate: new Date('1973-01-01'),
        budget: 25000000,
        personnel: 150,
        clearanceRequired: 'black',
        internationalCollaboration: true,
        outcomes: [
          'LSD and other drugs tested on unwitting subjects',
          'Behavioral modification techniques developed',
          'Psychological warfare capabilities established',
        ],
        risks: [
          'Human rights violations',
          'Psychological damage to subjects',
          'International condemnation',
        ],
        coverStory: 'Behavioral research program',
      },
      {
        id: 'project_stargate',
        name: 'Project Stargate',
        codename: 'STARGATE',
        facility: 'cheyenne_mountain',
        classification: 'top_secret',
        category: 'intelligence',
        description: 'Remote viewing and psychic intelligence gathering program',
        objectives: [
          'Develop remote viewing capabilities',
          'Gather intelligence through psychic means',
          'Establish psychic warfare capabilities',
        ],
        status: 'completed',
        startDate: new Date('1978-01-01'),
        endDate: new Date('1995-01-01'),
        budget: 20000000,
        personnel: 100,
        clearanceRequired: 'top_secret',
        internationalCollaboration: false,
        outcomes: [
          'Remote viewing techniques developed',
          'Psychic intelligence gathering established',
          'Paranormal research advanced',
        ],
        risks: [
          'Scientific skepticism',
          'Reliability of psychic information',
          'Public perception issues',
        ],
        coverStory: 'Paranormal research program',
      },
      {
        id: 'project_manhattan',
        name: 'Project Manhattan',
        codename: 'MANHATTAN',
        facility: 'los_alamos',
        classification: 'top_secret',
        category: 'weapons',
        description: 'Development of the first atomic bomb',
        objectives: [
          'Develop atomic bomb technology',
          'End World War II',
          'Establish nuclear supremacy',
        ],
        status: 'completed',
        startDate: new Date('1942-01-01'),
        endDate: new Date('1946-01-01'),
        budget: 2000000000,
        personnel: 130000,
        clearanceRequired: 'top_secret',
        internationalCollaboration: true,
        outcomes: ['Atomic bomb developed and tested', 'World War II ended', 'Nuclear age began'],
        risks: ['Nuclear proliferation', 'Environmental contamination', 'Human casualties'],
        coverStory: 'Engineering research program',
      },
    ];

    projects.forEach(project => {
      this.projects.set(project.id, project);
    });
  }

  /**
   * Initialize governmental networks
   */
  private initializeGovernmentalNetworks(): void {
    const networks: GovernmentalNetwork[] = [
      {
        id: 'darpa',
        name: 'Defense Advanced Research Projects Agency',
        type: 'research',
        country: 'USA',
        classification: 'public',
        parentAgency: 'Department of Defense',
        specialties: [
          'ai',
          'quantum_computing',
          'biotechnology',
          'space_technology',
          'cyber_warfare',
        ],
        established: 1958,
        staff: 220,
        annualBudget: 3500000000,
        clearanceLevel: 'top_secret',
        internationalPartners: ['nasa', 'cia', 'nsa', 'fbi'],
        blackProjects: ['quantum_ai', 'brain_computer_interface', 'autonomous_weapons'],
        status: 'active',
        notes: 'Advanced research agency for breakthrough technologies',
      },
      {
        id: 'cia_sad',
        name: 'CIA Special Activities Division',
        type: 'intelligence',
        country: 'USA',
        classification: 'secret',
        parentAgency: 'Central Intelligence Agency',
        specialties: [
          'covert_operations',
          'paramilitary',
          'intelligence_gathering',
          'psychological_warfare',
        ],
        established: 1947,
        staff: 1000,
        annualBudget: 1000000000,
        clearanceLevel: 'top_secret',
        internationalPartners: ['mi6', 'mossad', 'fsb'],
        blackProjects: ['covert_operations', 'regime_change', 'assassination_operations'],
        status: 'active',
        notes: 'CIA covert operations and paramilitary activities',
      },
      {
        id: 'nsa_tao',
        name: 'NSA Tailored Access Operations',
        type: 'cyber',
        country: 'USA',
        classification: 'secret',
        parentAgency: 'National Security Agency',
        specialties: ['cyber_warfare', 'hacking', 'surveillance', 'encryption_breaking'],
        established: 1997,
        staff: 2000,
        annualBudget: 2500000000,
        clearanceLevel: 'top_secret',
        internationalPartners: ['gchq', 'asd', 'cse'],
        blackProjects: ['cyber_attacks', 'surveillance_programs', 'encryption_backdoors'],
        status: 'active',
        notes: 'NSA cyber warfare and hacking operations',
      },
      {
        id: 'mi6_q',
        name: 'MI6 Q Division',
        type: 'research',
        country: 'UK',
        classification: 'secret',
        parentAgency: 'Secret Intelligence Service',
        specialties: ['gadgets', 'surveillance', 'weapons', 'technology'],
        established: 1909,
        staff: 500,
        annualBudget: 500000000,
        clearanceLevel: 'top_secret',
        internationalPartners: ['cia', 'mossad', 'fsb'],
        blackProjects: ['advanced_gadgets', 'surveillance_technology', 'covert_weapons'],
        status: 'active',
        notes: 'MI6 technology development and gadget creation',
      },
    ];

    networks.forEach(network => {
      this.governmentalNetworks.set(network.id, network);
    });
  }

  /**
   * Initialize intelligence networks
   */
  private initializeIntelligenceNetworks(): void {
    const networks: IntelligenceNetwork[] = [
      {
        id: 'majestic_12',
        name: 'Majestic 12',
        type: 'intelligence',
        country: 'USA',
        classification: 'above_top_secret',
        parentAgency: 'Executive Office',
        capabilities: ['alien_contact', 'ufo_research', 'reverse_engineering', 'cover_ups'],
        established: 1947,
        staff: 12,
        annualBudget: 10000000000,
        clearanceLevel: 'above_top_secret',
        internationalPartners: ['vatican', 'royal_family', 'illuminati'],
        blackOperations: ['alien_contact', 'ufo_cover_ups', 'technology_suppression'],
        status: 'active',
        notes: 'Top-secret group handling alien contact and UFO research',
      },
      {
        id: 'illuminati',
        name: 'The Illuminati',
        type: 'intelligence',
        country: 'International',
        classification: 'above_top_secret',
        parentAgency: 'None',
        capabilities: [
          'global_control',
          'economic_manipulation',
          'social_engineering',
          'technology_suppression',
        ],
        established: 1776,
        staff: 300,
        annualBudget: 100000000000,
        clearanceLevel: 'above_top_secret',
        internationalPartners: ['vatican', 'royal_family', 'majestic_12', 'freemasons'],
        blackOperations: ['global_control', 'economic_crises', 'social_manipulation'],
        status: 'active',
        notes: 'Secret society controlling global events and technology',
      },
      {
        id: 'vatican_observatory',
        name: 'Vatican Observatory',
        type: 'intelligence',
        country: 'Vatican',
        classification: 'secret',
        parentAgency: 'Vatican City',
        capabilities: [
          'astronomical_research',
          'alien_contact',
          'religious_intelligence',
          'cosmic_knowledge',
        ],
        established: 1891,
        staff: 50,
        annualBudget: 100000000,
        clearanceLevel: 'secret',
        internationalPartners: ['majestic_12', 'illuminati', 'nasa'],
        blackOperations: ['alien_contact', 'cosmic_knowledge', 'religious_intelligence'],
        status: 'active',
        notes: 'Vatican astronomical research and potential alien contact',
      },
    ];

    networks.forEach(network => {
      this.intelligenceNetworks.set(network.id, network);
    });
  }

  /**
   * Initialize underground networks
   */
  private initializeUndergroundNetworks(): void {
    const networks: UndergroundNetwork[] = [
      {
        id: 'deep_underground_military_bases',
        name: 'Deep Underground Military Bases',
        type: 'defense',
        classification: 'black',
        location: {
          primary: 'USA',
          secondary: ['Canada', 'UK', 'Australia', 'Germany'],
          underground: true,
          classified: true,
        },
        specialties: [
          'underground_cities',
          'survival_systems',
          'command_control',
          'nuclear_shelters',
        ],
        established: 1950,
        staff: 50000,
        funding: 'government',
        annualBudget: 50000000000,
        clearanceLevel: 'black',
        internationalPartners: ['nato', 'five_eyes', 'un'],
        blackProjects: ['underground_cities', 'survival_systems', 'continuity_of_government'],
        status: 'active',
        notes: 'Network of deep underground military bases and cities',
      },
      {
        id: 'shadow_government',
        name: 'Shadow Government',
        type: 'intelligence',
        classification: 'above_top_secret',
        location: {
          primary: 'USA',
          secondary: ['UK', 'Germany', 'Switzerland'],
          underground: true,
          classified: true,
        },
        specialties: [
          'continuity_of_government',
          'emergency_powers',
          'shadow_operations',
          'secret_funding',
        ],
        established: 1947,
        staff: 1000,
        funding: 'government',
        annualBudget: 10000000000,
        clearanceLevel: 'above_top_secret',
        internationalPartners: ['majestic_12', 'illuminati', 'deep_state'],
        blackProjects: ['continuity_of_government', 'emergency_powers', 'shadow_operations'],
        status: 'active',
        notes: 'Secret government operating in parallel to public government',
      },
    ];

    networks.forEach(network => {
      this.undergroundNetworks.set(network.id, network);
    });
  }

  /**
   * Initialize black research collaborations
   */
  private initializeBlackResearchCollaborations(): void {
    const collaborations: BlackResearchCollaboration[] = [
      {
        id: 'five_eyes_research',
        name: 'Five Eyes Research Collaboration',
        codename: 'FIVE_EYES_RESEARCH',
        participants: [
          { facility: 'cia', country: 'USA', role: 'lead', clearanceLevel: 'top_secret' },
          { facility: 'mi6', country: 'UK', role: 'partner', clearanceLevel: 'top_secret' },
          { facility: 'asd', country: 'Australia', role: 'partner', clearanceLevel: 'top_secret' },
          { facility: 'cse', country: 'Canada', role: 'partner', clearanceLevel: 'top_secret' },
          {
            facility: 'gcsb',
            country: 'New Zealand',
            role: 'partner',
            clearanceLevel: 'top_secret',
          },
        ],
        classification: 'top_secret',
        category: 'intelligence',
        startDate: new Date('1946-01-01'),
        status: 'active',
        budget: 5000000000,
        objectives: [
          'Share intelligence between Five Eyes nations',
          'Coordinate research and development',
          'Establish global surveillance network',
        ],
        outcomes: [
          'Global surveillance network established',
          'Intelligence sharing protocols developed',
          'Joint research programs initiated',
        ],
        risks: ['Privacy violations', 'International condemnation', 'Legal challenges'],
        coverStory: 'International cooperation program',
      },
    ];

    collaborations.forEach(collaboration => {
      this.collaborations.set(collaboration.id, collaboration);
    });
  }

  // Public API methods

  /**
   * Get all black research facilities
   */
  public getBlackResearchFacilities(): BlackResearchFacility[] {
    return Array.from(this.facilities.values());
  }

  /**
   * Get facilities by classification
   */
  public getFacilitiesByClassification(classification: string): BlackResearchFacility[] {
    return Array.from(this.facilities.values()).filter(f => f.classification === classification);
  }

  /**
   * Get facilities by type
   */
  public getFacilitiesByType(type: string): BlackResearchFacility[] {
    return Array.from(this.facilities.values()).filter(f => f.type === type);
  }

  /**
   * Get all black projects
   */
  public getBlackProjects(): BlackProject[] {
    return Array.from(this.projects.values());
  }

  /**
   * Get projects by category
   */
  public getProjectsByCategory(category: string): BlackProject[] {
    return Array.from(this.projects.values()).filter(p => p.category === category);
  }

  /**
   * Get active black projects
   */
  public getActiveBlackProjects(): BlackProject[] {
    return Array.from(this.projects.values()).filter(p => p.status === 'active');
  }

  /**
   * Get all governmental networks
   */
  public getGovernmentalNetworks(): GovernmentalNetwork[] {
    return Array.from(this.governmentalNetworks.values());
  }

  /**
   * Get governmental networks by type
   */
  public getGovernmentalNetworksByType(type: string): GovernmentalNetwork[] {
    return Array.from(this.governmentalNetworks.values()).filter(n => n.type === type);
  }

  /**
   * Get all intelligence networks
   */
  public getIntelligenceNetworks(): IntelligenceNetwork[] {
    return Array.from(this.intelligenceNetworks.values());
  }

  /**
   * Get intelligence networks by type
   */
  public getIntelligenceNetworksByType(type: string): IntelligenceNetwork[] {
    return Array.from(this.intelligenceNetworks.values()).filter(n => n.type === type);
  }

  /**
   * Get all underground networks
   */
  public getUndergroundNetworks(): UndergroundNetwork[] {
    return Array.from(this.undergroundNetworks.values());
  }

  /**
   * Get all black research collaborations
   */
  public getBlackResearchCollaborations(): BlackResearchCollaboration[] {
    return Array.from(this.collaborations.values());
  }

  /**
   * Get active collaborations
   */
  public getActiveCollaborations(): BlackResearchCollaboration[] {
    return Array.from(this.collaborations.values()).filter(c => c.status === 'active');
  }

  /**
   * Search facilities by specialty
   */
  public searchFacilitiesBySpecialty(specialty: string): BlackResearchFacility[] {
    return Array.from(this.facilities.values()).filter(f =>
      f.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  /**
   * Search projects by keyword
   */
  public searchProjectsByKeyword(keyword: string): BlackProject[] {
    return Array.from(this.projects.values()).filter(
      p =>
        p.name.toLowerCase().includes(keyword.toLowerCase()) ||
        p.description.toLowerCase().includes(keyword.toLowerCase()) ||
        p.objectives.some(o => o.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  /**
   * Get black research statistics
   */
  public getBlackResearchStatistics(): Record<string, any> {
    const stats = {
      facilities: {
        total: this.facilities.size,
        byClassification: {
          public: this.getFacilitiesByClassification('public').length,
          secret: this.getFacilitiesByClassification('secret').length,
          top_secret: this.getFacilitiesByClassification('top_secret').length,
          black: this.getFacilitiesByClassification('black').length,
          above_top_secret: this.getFacilitiesByClassification('above_top_secret').length,
        },
        byType: {
          government: this.getFacilitiesByType('government').length,
          military: this.getFacilitiesByType('military').length,
          intelligence: this.getFacilitiesByType('intelligence').length,
          corporate: this.getFacilitiesByType('corporate').length,
          academic: this.getFacilitiesByType('academic').length,
          underground: this.getFacilitiesByType('underground').length,
        },
      },
      projects: {
        total: this.projects.size,
        active: this.getActiveBlackProjects().length,
        byCategory: {
          weapons: this.getProjectsByCategory('weapons').length,
          intelligence: this.getProjectsByCategory('intelligence').length,
          technology: this.getProjectsByCategory('technology').length,
          biological: this.getProjectsByCategory('biological').length,
          quantum: this.getProjectsByCategory('quantum').length,
          space: this.getProjectsByCategory('space').length,
          ai: this.getProjectsByCategory('ai').length,
        },
      },
      networks: {
        governmental: this.governmentalNetworks.size,
        intelligence: this.intelligenceNetworks.size,
        underground: this.undergroundNetworks.size,
      },
      collaborations: {
        total: this.collaborations.size,
        active: this.getActiveCollaborations().length,
      },
    };

    return stats;
  }
}

// Export singleton instance
export const blackResearchNetworks = new BlackResearchNetworks();
