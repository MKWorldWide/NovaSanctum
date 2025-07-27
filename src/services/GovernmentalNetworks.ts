/**
 * 🏛️ Governmental Networks - NovaSanctum Integration
 * ==================================================
 *
 * Comprehensive integration of governmental networks, including:
 * - Intelligence agencies and security services
 * - Military research and defense organizations
 * - International governmental organizations
 * - Research and development agencies
 * - Space and cyber security organizations
 *
 * This service provides access to the most powerful and secretive
 * governmental networks in the world, integrating them into NovaSanctum's
 * unified research platform.
 */

export interface IntelligenceAgency {
  id: string;
  name: string;
  country: string;
  type:
    | 'signals_intelligence'
    | 'human_intelligence'
    | 'technical_intelligence'
    | 'cyber_intelligence';
  classification: 'public' | 'secret' | 'top_secret' | 'black';
  parentAgency: string;
  capabilities: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  headquarters: {
    city: string;
    country: string;
    coordinates?: [number, number];
    underground?: boolean;
  };
  internationalPartners: string[];
  blackOperations: string[];
  status: 'active' | 'inactive' | 'classified';
  website?: string;
  notes: string;
}

export interface MilitaryResearch {
  id: string;
  name: string;
  country: string;
  type:
    | 'weapons_research'
    | 'defense_research'
    | 'space_research'
    | 'cyber_research'
    | 'biological_research';
  classification: 'public' | 'secret' | 'top_secret' | 'black';
  parentAgency: string;
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  facilities: string[];
  researchProjects: string[];
  internationalPartners: string[];
  status: 'active' | 'inactive' | 'classified';
  notes: string;
}

export interface InternationalOrganization {
  id: string;
  name: string;
  type: 'united_nations' | 'nato' | 'eu' | 'g7' | 'g20' | 'who' | 'iaea' | 'custom';
  classification: 'public' | 'secret' | 'top_secret';
  memberCountries: string[];
  established: number;
  staff: number;
  annualBudget: number;
  headquarters: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  objectives: string[];
  programs: string[];
  researchInitiatives: string[];
  status: 'active' | 'inactive' | 'suspended';
  website: string;
  notes: string;
}

export interface SpaceAgency {
  id: string;
  name: string;
  country: string;
  type: 'civilian' | 'military' | 'mixed';
  classification: 'public' | 'secret' | 'top_secret';
  parentAgency: string;
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'public' | 'secret' | 'top_secret' | 'black';
  facilities: string[];
  missions: string[];
  internationalPartners: string[];
  blackProjects: string[];
  status: 'active' | 'inactive' | 'classified';
  website: string;
  notes: string;
}

export interface CyberSecurityAgency {
  id: string;
  name: string;
  country: string;
  type: 'defense' | 'intelligence' | 'law_enforcement' | 'critical_infrastructure';
  classification: 'public' | 'secret' | 'top_secret' | 'black';
  parentAgency: string;
  capabilities: string[];
  established: number;
  staff: number;
  annualBudget: number;
  clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  headquarters: {
    city: string;
    country: string;
    coordinates?: [number, number];
    underground?: boolean;
  };
  cyberOperations: string[];
  internationalPartners: string[];
  status: 'active' | 'inactive' | 'classified';
  notes: string;
}

export interface GovernmentalCollaboration {
  id: string;
  name: string;
  codename: string;
  participants: {
    agency: string;
    country: string;
    role: 'lead' | 'partner' | 'contributor' | 'observer';
    clearanceLevel: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  }[];
  classification: 'secret' | 'top_secret' | 'black' | 'above_top_secret';
  category: 'intelligence' | 'defense' | 'space' | 'cyber' | 'research';
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'suspended' | 'classified';
  budget: number;
  objectives: string[];
  outcomes: string[];
  risks: string[];
  coverStory?: string;
  notes: string;
}

export class GovernmentalNetworks {
  private intelligenceAgencies: Map<string, IntelligenceAgency> = new Map();
  private militaryResearch: Map<string, MilitaryResearch> = new Map();
  private internationalOrganizations: Map<string, InternationalOrganization> = new Map();
  private spaceAgencies: Map<string, SpaceAgency> = new Map();
  private cyberSecurityAgencies: Map<string, CyberSecurityAgency> = new Map();
  private collaborations: Map<string, GovernmentalCollaboration> = new Map();

  constructor() {
    this.initializeGovernmentalNetworks();
  }

  /**
   * Initialize governmental networks with comprehensive data
   */
  private initializeGovernmentalNetworks(): void {
    this.initializeIntelligenceAgencies();
    this.initializeMilitaryResearch();
    this.initializeInternationalOrganizations();
    this.initializeSpaceAgencies();
    this.initializeCyberSecurityAgencies();
    this.initializeGovernmentalCollaborations();
  }

  /**
   * Initialize intelligence agencies
   */
  private initializeIntelligenceAgencies(): void {
    const agencies: IntelligenceAgency[] = [
      // US Intelligence Agencies
      {
        id: 'cia',
        name: 'Central Intelligence Agency',
        country: 'USA',
        type: 'human_intelligence',
        classification: 'public',
        parentAgency: 'Office of the Director of National Intelligence',
        capabilities: [
          'human_intelligence',
          'covert_operations',
          'analysis',
          'counterintelligence',
        ],
        established: 1947,
        staff: 21000,
        annualBudget: 15000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Langley',
          country: 'USA',
          coordinates: [38.9517, -77.1461],
        },
        internationalPartners: ['mi6', 'mossad', 'fsb', 'dgse'],
        blackOperations: ['mkultra', 'bay_of_pigs', 'iran_contra'],
        status: 'active',
        website: 'https://www.cia.gov',
        notes: 'Primary human intelligence agency of the United States',
      },
      {
        id: 'nsa',
        name: 'National Security Agency',
        country: 'USA',
        type: 'signals_intelligence',
        classification: 'secret',
        parentAgency: 'Department of Defense',
        capabilities: [
          'signals_intelligence',
          'cyber_intelligence',
          'cryptanalysis',
          'surveillance',
        ],
        established: 1952,
        staff: 30000,
        annualBudget: 10000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Fort Meade',
          country: 'USA',
          coordinates: [39.1089, -76.7739],
        },
        internationalPartners: ['gchq', 'asd', 'cse', 'gcsb'],
        blackOperations: ['prism', 'xkeyscore', 'upstream'],
        status: 'active',
        notes: 'Signals intelligence and cybersecurity agency',
      },
      {
        id: 'fbi',
        name: 'Federal Bureau of Investigation',
        country: 'USA',
        type: 'human_intelligence',
        classification: 'public',
        parentAgency: 'Department of Justice',
        capabilities: ['law_enforcement', 'counterintelligence', 'counterterrorism', 'cyber_crime'],
        established: 1908,
        staff: 37000,
        annualBudget: 10000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Washington DC',
          country: 'USA',
          coordinates: [38.8944, -77.0334],
        },
        internationalPartners: ['interpol', 'mi5', 'rcmp', 'asio'],
        blackOperations: ['cointelpro', 'terrorism_investigations'],
        status: 'active',
        website: 'https://www.fbi.gov',
        notes: 'Primary federal law enforcement and counterintelligence agency',
      },

      // UK Intelligence Agencies
      {
        id: 'mi6',
        name: 'Secret Intelligence Service',
        country: 'UK',
        type: 'human_intelligence',
        classification: 'secret',
        parentAgency: 'Foreign, Commonwealth and Development Office',
        capabilities: [
          'human_intelligence',
          'covert_operations',
          'analysis',
          'counterintelligence',
        ],
        established: 1909,
        staff: 2500,
        annualBudget: 3000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'London',
          country: 'UK',
          coordinates: [51.4875, -0.1687],
        },
        internationalPartners: ['cia', 'mossad', 'dgse', 'bnd'],
        blackOperations: ['operation_gladio', 'iran_operations'],
        status: 'active',
        notes: 'UK foreign intelligence service',
      },
      {
        id: 'mi5',
        name: 'Security Service',
        country: 'UK',
        type: 'human_intelligence',
        classification: 'public',
        parentAgency: 'Home Office',
        capabilities: [
          'domestic_intelligence',
          'counterintelligence',
          'counterterrorism',
          'protective_security',
        ],
        established: 1909,
        staff: 4000,
        annualBudget: 3000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'London',
          country: 'UK',
          coordinates: [51.4952, -0.1245],
        },
        internationalPartners: ['fbi', 'asio', 'csis', 'nzsis'],
        blackOperations: ['domestic_surveillance', 'terrorism_prevention'],
        status: 'active',
        website: 'https://www.mi5.gov.uk',
        notes: 'UK domestic security service',
      },
      {
        id: 'gchq',
        name: 'Government Communications Headquarters',
        country: 'UK',
        type: 'signals_intelligence',
        classification: 'secret',
        parentAgency: 'Foreign, Commonwealth and Development Office',
        capabilities: [
          'signals_intelligence',
          'cyber_intelligence',
          'cryptanalysis',
          'surveillance',
        ],
        established: 1919,
        staff: 6000,
        annualBudget: 3000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Cheltenham',
          country: 'UK',
          coordinates: [51.8979, -2.0744],
        },
        internationalPartners: ['nsa', 'asd', 'cse', 'gcsb'],
        blackOperations: ['tempora', 'mastering_the_internet'],
        status: 'active',
        notes: 'UK signals intelligence and cybersecurity agency',
      },

      // Russian Intelligence Agencies
      {
        id: 'fsb',
        name: 'Federal Security Service',
        country: 'Russia',
        type: 'human_intelligence',
        classification: 'public',
        parentAgency: 'President of Russia',
        capabilities: [
          'domestic_intelligence',
          'counterintelligence',
          'counterterrorism',
          'border_security',
        ],
        established: 1995,
        staff: 350000,
        annualBudget: 2000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Moscow',
          country: 'Russia',
          coordinates: [55.7558, 37.6176],
        },
        internationalPartners: ['cia', 'mi6', 'mossad'],
        blackOperations: ['election_interference', 'cyber_attacks'],
        status: 'active',
        notes: 'Russian domestic security service',
      },
      {
        id: 'svr',
        name: 'Foreign Intelligence Service',
        country: 'Russia',
        type: 'human_intelligence',
        classification: 'secret',
        parentAgency: 'President of Russia',
        capabilities: [
          'human_intelligence',
          'covert_operations',
          'analysis',
          'counterintelligence',
        ],
        established: 1991,
        staff: 13000,
        annualBudget: 1000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Moscow',
          country: 'Russia',
          coordinates: [55.7558, 37.6176],
        },
        internationalPartners: ['cia', 'mi6', 'mossad'],
        blackOperations: ['election_interference', 'cyber_espionage'],
        status: 'active',
        notes: 'Russian foreign intelligence service',
      },

      // Israeli Intelligence Agencies
      {
        id: 'mossad',
        name: 'Mossad',
        country: 'Israel',
        type: 'human_intelligence',
        classification: 'secret',
        parentAgency: 'Prime Minister of Israel',
        capabilities: [
          'human_intelligence',
          'covert_operations',
          'assassination',
          'cyber_intelligence',
        ],
        established: 1949,
        staff: 7000,
        annualBudget: 3000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Tel Aviv',
          country: 'Israel',
          coordinates: [32.0853, 34.7818],
        },
        internationalPartners: ['cia', 'mi6', 'dgse', 'bnd'],
        blackOperations: ['operation_wrath_of_god', 'stuxnet', 'assassination_operations'],
        status: 'active',
        notes: 'Israeli foreign intelligence service',
      },
    ];

    agencies.forEach(agency => {
      this.intelligenceAgencies.set(agency.id, agency);
    });
  }

  /**
   * Initialize military research
   */
  private initializeMilitaryResearch(): void {
    const research: MilitaryResearch[] = [
      {
        id: 'darpa',
        name: 'Defense Advanced Research Projects Agency',
        country: 'USA',
        type: 'defense_research',
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
        facilities: ['arlington', 'silicon_valley', 'boston'],
        researchProjects: ['quantum_ai', 'brain_computer_interface', 'autonomous_weapons'],
        internationalPartners: ['nasa', 'cia', 'nsa', 'fbi'],
        status: 'active',
        notes: 'Advanced research agency for breakthrough technologies',
      },
      {
        id: 'dstl',
        name: 'Defence Science and Technology Laboratory',
        country: 'UK',
        type: 'defense_research',
        classification: 'public',
        parentAgency: 'Ministry of Defence',
        specialties: [
          'chemical_warfare',
          'biological_warfare',
          'cyber_warfare',
          'materials_science',
        ],
        established: 2001,
        staff: 3500,
        annualBudget: 500000000,
        clearanceLevel: 'top_secret',
        facilities: ['porton_down', 'fort_halstead', 'aldergrove'],
        researchProjects: ['chemical_defense', 'cyber_warfare', 'autonomous_systems'],
        internationalPartners: ['darpa', 'nato', 'five_eyes'],
        status: 'active',
        notes: 'UK defense research and development agency',
      },
    ];

    research.forEach(r => {
      this.militaryResearch.set(r.id, r);
    });
  }

  /**
   * Initialize international organizations
   */
  private initializeInternationalOrganizations(): void {
    const organizations: InternationalOrganization[] = [
      {
        id: 'un',
        name: 'United Nations',
        type: 'united_nations',
        classification: 'public',
        memberCountries: ['193 member states'],
        established: 1945,
        staff: 44000,
        annualBudget: 3000000000,
        headquarters: {
          city: 'New York',
          country: 'USA',
          coordinates: [40.7489, -73.968],
        },
        objectives: [
          'Maintain international peace and security',
          'Develop friendly relations among nations',
          'Promote social progress and better living standards',
        ],
        programs: ['peacekeeping', 'humanitarian_aid', 'sustainable_development'],
        researchInitiatives: ['climate_research', 'health_research', 'economic_research'],
        status: 'active',
        website: 'https://www.un.org',
        notes: 'International organization for peace and cooperation',
      },
      {
        id: 'nato',
        name: 'North Atlantic Treaty Organization',
        type: 'nato',
        classification: 'public',
        memberCountries: ['30 member states'],
        established: 1949,
        staff: 4000,
        annualBudget: 1000000000,
        headquarters: {
          city: 'Brussels',
          country: 'Belgium',
          coordinates: [50.8503, 4.3517],
        },
        objectives: [
          'Collective defense of member states',
          'Political and military cooperation',
          'Crisis management and conflict prevention',
        ],
        programs: ['collective_defense', 'crisis_management', 'partnership_cooperation'],
        researchInitiatives: ['defense_research', 'cyber_defense', 'emerging_technologies'],
        status: 'active',
        website: 'https://www.nato.int',
        notes: 'Military alliance for collective defense',
      },
      {
        id: 'who',
        name: 'World Health Organization',
        type: 'who',
        classification: 'public',
        memberCountries: ['194 member states'],
        established: 1948,
        staff: 7000,
        annualBudget: 2000000000,
        headquarters: {
          city: 'Geneva',
          country: 'Switzerland',
          coordinates: [46.2044, 6.1432],
        },
        objectives: [
          'Promote health worldwide',
          'Coordinate international health responses',
          'Set health standards and guidelines',
        ],
        programs: ['disease_prevention', 'health_emergencies', 'universal_health_coverage'],
        researchInitiatives: [
          'vaccine_research',
          'disease_surveillance',
          'health_systems_research',
        ],
        status: 'active',
        website: 'https://www.who.int',
        notes: 'International health organization',
      },
    ];

    organizations.forEach(org => {
      this.internationalOrganizations.set(org.id, org);
    });
  }

  /**
   * Initialize space agencies
   */
  private initializeSpaceAgencies(): void {
    const agencies: SpaceAgency[] = [
      {
        id: 'nasa',
        name: 'National Aeronautics and Space Administration',
        country: 'USA',
        type: 'civilian',
        classification: 'public',
        parentAgency: 'Executive Office of the President',
        specialties: ['space_exploration', 'aeronautics', 'earth_science', 'space_technology'],
        established: 1958,
        staff: 17000,
        annualBudget: 25000000000,
        clearanceLevel: 'public',
        facilities: ['johnson_space_center', 'kennedy_space_center', 'jet_propulsion_laboratory'],
        missions: ['apollo', 'space_shuttle', 'international_space_station', 'mars_rovers'],
        internationalPartners: ['esa', 'roscosmos', 'jaxa', 'csa'],
        blackProjects: ['x_37b', 'space_force', 'classified_satellites'],
        status: 'active',
        website: 'https://www.nasa.gov',
        notes: 'US civilian space agency',
      },
      {
        id: 'esa',
        name: 'European Space Agency',
        country: 'Europe',
        type: 'civilian',
        classification: 'public',
        parentAgency: 'European Union',
        specialties: [
          'space_exploration',
          'earth_observation',
          'satellite_navigation',
          'space_science',
        ],
        established: 1975,
        staff: 2200,
        annualBudget: 7000000000,
        clearanceLevel: 'public',
        facilities: ['estec', 'esoc', 'esrin', 'eac'],
        missions: ['hubble', 'cassini', 'rosetta', 'galileo'],
        internationalPartners: ['nasa', 'roscosmos', 'jaxa', 'csa'],
        blackProjects: ['classified_satellites', 'military_communications'],
        status: 'active',
        website: 'https://www.esa.int',
        notes: 'European space agency',
      },
      {
        id: 'roscosmos',
        name: 'Roscosmos',
        country: 'Russia',
        type: 'mixed',
        classification: 'public',
        parentAgency: 'Government of Russia',
        specialties: ['space_exploration', 'satellite_launches', 'space_station', 'military_space'],
        established: 1992,
        staff: 170000,
        annualBudget: 3000000000,
        clearanceLevel: 'secret',
        facilities: ['baikonur', 'plesetsk', 'vostochny'],
        missions: ['soyuz', 'progress', 'mir', 'international_space_station'],
        internationalPartners: ['nasa', 'esa', 'jaxa', 'csa'],
        blackProjects: ['military_satellites', 'anti_satellite_weapons'],
        status: 'active',
        website: 'https://www.roscosmos.ru',
        notes: 'Russian space agency',
      },
    ];

    agencies.forEach(agency => {
      this.spaceAgencies.set(agency.id, agency);
    });
  }

  /**
   * Initialize cybersecurity agencies
   */
  private initializeCyberSecurityAgencies(): void {
    const agencies: CyberSecurityAgency[] = [
      {
        id: 'us_cyber_command',
        name: 'United States Cyber Command',
        country: 'USA',
        type: 'defense',
        classification: 'public',
        parentAgency: 'Department of Defense',
        capabilities: ['cyber_warfare', 'cyber_defense', 'cyber_intelligence', 'cyber_operations'],
        established: 2009,
        staff: 6000,
        annualBudget: 5000000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'Fort Meade',
          country: 'USA',
          coordinates: [39.1089, -76.7739],
        },
        cyberOperations: [
          'offensive_cyber_operations',
          'defensive_cyber_operations',
          'cyber_intelligence',
        ],
        internationalPartners: ['nato', 'five_eyes', 'allied_cyber_command'],
        status: 'active',
        notes: 'US military cyber command',
      },
      {
        id: 'ncsc',
        name: 'National Cyber Security Centre',
        country: 'UK',
        type: 'defense',
        classification: 'public',
        parentAgency: 'Government Communications Headquarters',
        capabilities: [
          'cyber_defense',
          'cyber_intelligence',
          'incident_response',
          'security_guidance',
        ],
        established: 2016,
        staff: 1000,
        annualBudget: 500000000,
        clearanceLevel: 'top_secret',
        headquarters: {
          city: 'London',
          country: 'UK',
          coordinates: [51.4875, -0.1687],
        },
        cyberOperations: ['cyber_defense', 'incident_response', 'threat_intelligence'],
        internationalPartners: ['us_cyber_command', 'nato', 'five_eyes'],
        status: 'active',
        notes: 'UK national cybersecurity center',
      },
    ];

    agencies.forEach(agency => {
      this.cyberSecurityAgencies.set(agency.id, agency);
    });
  }

  /**
   * Initialize governmental collaborations
   */
  private initializeGovernmentalCollaborations(): void {
    const collaborations: GovernmentalCollaboration[] = [
      {
        id: 'five_eyes',
        name: 'Five Eyes Intelligence Alliance',
        codename: 'FVEY',
        participants: [
          { agency: 'cia', country: 'USA', role: 'lead', clearanceLevel: 'top_secret' },
          { agency: 'mi6', country: 'UK', role: 'partner', clearanceLevel: 'top_secret' },
          { agency: 'asd', country: 'Australia', role: 'partner', clearanceLevel: 'top_secret' },
          { agency: 'cse', country: 'Canada', role: 'partner', clearanceLevel: 'top_secret' },
          { agency: 'gcsb', country: 'New Zealand', role: 'partner', clearanceLevel: 'top_secret' },
        ],
        classification: 'top_secret',
        category: 'intelligence',
        startDate: new Date('1946-01-01'),
        status: 'active',
        budget: 5000000000,
        objectives: [
          'Share intelligence between Five Eyes nations',
          'Coordinate intelligence operations',
          'Establish global surveillance network',
        ],
        outcomes: [
          'Global surveillance network established',
          'Intelligence sharing protocols developed',
          'Joint operations conducted',
        ],
        risks: ['Privacy violations', 'International condemnation', 'Legal challenges'],
        coverStory: 'International cooperation program',
        notes: 'Intelligence sharing alliance between five English-speaking countries',
      },
    ];

    collaborations.forEach(collaboration => {
      this.collaborations.set(collaboration.id, collaboration);
    });
  }

  // Public API methods

  /**
   * Get all intelligence agencies
   */
  public getIntelligenceAgencies(): IntelligenceAgency[] {
    return Array.from(this.intelligenceAgencies.values());
  }

  /**
   * Get agencies by type
   */
  public getIntelligenceAgenciesByType(type: string): IntelligenceAgency[] {
    return Array.from(this.intelligenceAgencies.values()).filter(a => a.type === type);
  }

  /**
   * Get agencies by country
   */
  public getIntelligenceAgenciesByCountry(country: string): IntelligenceAgency[] {
    return Array.from(this.intelligenceAgencies.values()).filter(a => a.country === country);
  }

  /**
   * Get all military research
   */
  public getMilitaryResearch(): MilitaryResearch[] {
    return Array.from(this.militaryResearch.values());
  }

  /**
   * Get military research by type
   */
  public getMilitaryResearchByType(type: string): MilitaryResearch[] {
    return Array.from(this.militaryResearch.values()).filter(r => r.type === type);
  }

  /**
   * Get all international organizations
   */
  public getInternationalOrganizations(): InternationalOrganization[] {
    return Array.from(this.internationalOrganizations.values());
  }

  /**
   * Get organizations by type
   */
  public getInternationalOrganizationsByType(type: string): InternationalOrganization[] {
    return Array.from(this.internationalOrganizations.values()).filter(o => o.type === type);
  }

  /**
   * Get all space agencies
   */
  public getSpaceAgencies(): SpaceAgency[] {
    return Array.from(this.spaceAgencies.values());
  }

  /**
   * Get space agencies by type
   */
  public getSpaceAgenciesByType(type: string): SpaceAgency[] {
    return Array.from(this.spaceAgencies.values()).filter(a => a.type === type);
  }

  /**
   * Get all cybersecurity agencies
   */
  public getCyberSecurityAgencies(): CyberSecurityAgency[] {
    return Array.from(this.cyberSecurityAgencies.values());
  }

  /**
   * Get cybersecurity agencies by type
   */
  public getCyberSecurityAgenciesByType(type: string): CyberSecurityAgency[] {
    return Array.from(this.cyberSecurityAgencies.values()).filter(a => a.type === type);
  }

  /**
   * Get all governmental collaborations
   */
  public getGovernmentalCollaborations(): GovernmentalCollaboration[] {
    return Array.from(this.collaborations.values());
  }

  /**
   * Get active collaborations
   */
  public getActiveCollaborations(): GovernmentalCollaboration[] {
    return Array.from(this.collaborations.values()).filter(c => c.status === 'active');
  }

  /**
   * Search intelligence agencies by capability
   */
  public searchIntelligenceAgenciesByCapability(capability: string): IntelligenceAgency[] {
    return Array.from(this.intelligenceAgencies.values()).filter(a =>
      a.capabilities.some(c => c.toLowerCase().includes(capability.toLowerCase()))
    );
  }

  /**
   * Search military research by specialty
   */
  public searchMilitaryResearchBySpecialty(specialty: string): MilitaryResearch[] {
    return Array.from(this.militaryResearch.values()).filter(r =>
      r.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  /**
   * Get governmental network statistics
   */
  public getGovernmentalNetworkStatistics(): Record<string, any> {
    const stats = {
      intelligenceAgencies: {
        total: this.intelligenceAgencies.size,
        byType: {
          signals_intelligence: this.getIntelligenceAgenciesByType('signals_intelligence').length,
          human_intelligence: this.getIntelligenceAgenciesByType('human_intelligence').length,
          technical_intelligence:
            this.getIntelligenceAgenciesByType('technical_intelligence').length,
          cyber_intelligence: this.getIntelligenceAgenciesByType('cyber_intelligence').length,
        },
        byCountry: {
          USA: this.getIntelligenceAgenciesByCountry('USA').length,
          UK: this.getIntelligenceAgenciesByCountry('UK').length,
          Russia: this.getIntelligenceAgenciesByCountry('Russia').length,
          Israel: this.getIntelligenceAgenciesByCountry('Israel').length,
        },
      },
      militaryResearch: {
        total: this.militaryResearch.size,
        byType: {
          weapons_research: this.getMilitaryResearchByType('weapons_research').length,
          defense_research: this.getMilitaryResearchByType('defense_research').length,
          space_research: this.getMilitaryResearchByType('space_research').length,
          cyber_research: this.getMilitaryResearchByType('cyber_research').length,
          biological_research: this.getMilitaryResearchByType('biological_research').length,
        },
      },
      internationalOrganizations: {
        total: this.internationalOrganizations.size,
        byType: {
          united_nations: this.getInternationalOrganizationsByType('united_nations').length,
          nato: this.getInternationalOrganizationsByType('nato').length,
          eu: this.getInternationalOrganizationsByType('eu').length,
          g7: this.getInternationalOrganizationsByType('g7').length,
          g20: this.getInternationalOrganizationsByType('g20').length,
          who: this.getInternationalOrganizationsByType('who').length,
          iaea: this.getInternationalOrganizationsByType('iaea').length,
          custom: this.getInternationalOrganizationsByType('custom').length,
        },
      },
      spaceAgencies: {
        total: this.spaceAgencies.size,
        byType: {
          civilian: this.getSpaceAgenciesByType('civilian').length,
          military: this.getSpaceAgenciesByType('military').length,
          mixed: this.getSpaceAgenciesByType('mixed').length,
        },
      },
      cyberSecurityAgencies: {
        total: this.cyberSecurityAgencies.size,
        byType: {
          defense: this.getCyberSecurityAgenciesByType('defense').length,
          intelligence: this.getCyberSecurityAgenciesByType('intelligence').length,
          law_enforcement: this.getCyberSecurityAgenciesByType('law_enforcement').length,
          critical_infrastructure:
            this.getCyberSecurityAgenciesByType('critical_infrastructure').length,
        },
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
export const governmentalNetworks = new GovernmentalNetworks();
