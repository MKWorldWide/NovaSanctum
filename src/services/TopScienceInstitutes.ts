/**
 * 🏛️ Top Science Institutes - NovaSanctum Integration
 * ===================================================
 * 
 * Comprehensive integration of the world's top science institutes, including:
 * - Leading universities and research institutions
 * - Advanced laboratories and research centers
 * - International science collaborations
 * - Cutting-edge research facilities
 * - Nobel Prize-winning institutions
 * 
 * This service provides access to the most prestigious and advanced
 * scientific research institutions in the world, integrating them into
 * NovaSanctum's unified research platform.
 */

export interface ScienceInstitute {
  id: string;
  name: string;
  type: 'university' | 'research_center' | 'laboratory' | 'institute' | 'foundation';
  country: string;
  location: {
    city: string;
    region: string;
    coordinates?: [number, number];
  };
  specialties: string[];
  established: number;
  staff: number;
  students: number;
  annualBudget: number;
  ranking: number; // Global ranking
  nobelPrizes: number;
  researchAreas: string[];
  internationalPartners: string[];
  facilities: string[];
  publications: number;
  patents: number;
  status: 'active' | 'inactive' | 'expanding';
  website: string;
  notes: string;
}

export interface ResearchLaboratory {
  id: string;
  name: string;
  institute: string;
  type: 'physics' | 'chemistry' | 'biology' | 'engineering' | 'computer_science' | 'medicine' | 'materials' | 'quantum';
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  equipment: string[];
  researchProjects: string[];
  internationalCollaborations: string[];
  publications: number;
  patents: number;
  status: 'active' | 'inactive' | 'under_construction';
  notes: string;
}

export interface InternationalCollaboration {
  id: string;
  name: string;
  participants: {
    institute: string;
    country: string;
    role: 'lead' | 'partner' | 'contributor';
  }[];
  researchArea: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  budget: number;
  objectives: string[];
  outcomes: string[];
  publications: number;
  patents: number;
  notes: string;
}

export interface NobelPrizeWinner {
  id: string;
  name: string;
  institute: string;
  country: string;
  category: 'physics' | 'chemistry' | 'medicine' | 'economics' | 'peace' | 'literature';
  year: number;
  research: string;
  impact: string;
  currentStatus: 'active' | 'retired' | 'deceased';
  notes: string;
}

export interface ResearchFacility {
  id: string;
  name: string;
  institute: string;
  type: 'particle_accelerator' | 'telescope' | 'supercomputer' | 'clean_room' | 'nuclear_reactor' | 'fusion_reactor' | 'quantum_computer';
  capabilities: string[];
  established: number;
  cost: number;
  staff: number;
  specifications: Record<string, any>;
  researchProjects: string[];
  internationalAccess: boolean;
  status: 'operational' | 'maintenance' | 'upgrade' | 'planned';
  notes: string;
}

export class TopScienceInstitutes {
  private institutes: Map<string, ScienceInstitute> = new Map();
  private laboratories: Map<string, ResearchLaboratory> = new Map();
  private collaborations: Map<string, InternationalCollaboration> = new Map();
  private nobelWinners: Map<string, NobelPrizeWinner> = new Map();
  private facilities: Map<string, ResearchFacility> = new Map();

  constructor() {
    this.initializeTopScienceInstitutes();
  }

  /**
   * Initialize top science institutes with comprehensive data
   */
  private initializeTopScienceInstitutes(): void {
    this.initializeScienceInstitutes();
    this.initializeResearchLaboratories();
    this.initializeInternationalCollaborations();
    this.initializeNobelPrizeWinners();
    this.initializeResearchFacilities();
  }

  /**
   * Initialize science institutes
   */
  private initializeScienceInstitutes(): void {
    const institutes: ScienceInstitute[] = [
      // Top Universities
      {
        id: 'mit',
        name: 'Massachusetts Institute of Technology',
        type: 'university',
        country: 'USA',
        location: { city: 'Cambridge', region: 'Massachusetts' },
        specialties: ['engineering', 'computer_science', 'physics', 'biology', 'economics'],
        established: 1861,
        staff: 12000,
        students: 11500,
        annualBudget: 4000000000,
        ranking: 1,
        nobelPrizes: 97,
        researchAreas: ['ai', 'quantum_computing', 'biotechnology', 'nanotechnology', 'climate_science'],
        internationalPartners: ['stanford', 'harvard', 'caltech', 'oxford', 'cambridge'],
        facilities: ['lincoln_laboratory', 'media_lab', 'nuclear_reactor', 'quantum_computing_center'],
        publications: 50000,
        patents: 3000,
        status: 'active',
        website: 'https://www.mit.edu',
        notes: 'World-leading institution in science and technology'
      },
      {
        id: 'stanford',
        name: 'Stanford University',
        type: 'university',
        country: 'USA',
        location: { city: 'Stanford', region: 'California' },
        specialties: ['computer_science', 'engineering', 'medicine', 'business', 'psychology'],
        established: 1885,
        staff: 15000,
        students: 17000,
        annualBudget: 7000000000,
        ranking: 2,
        nobelPrizes: 85,
        researchAreas: ['ai', 'biotechnology', 'clean_energy', 'neuroscience', 'materials_science'],
        internationalPartners: ['mit', 'berkeley', 'caltech', 'oxford', 'cambridge'],
        facilities: ['slac_national_accelerator', 'stanford_ai_lab', 'medical_center', 'clean_energy_institute'],
        publications: 45000,
        patents: 2500,
        status: 'active',
        website: 'https://www.stanford.edu',
        notes: 'Leading research university in Silicon Valley'
      },
      {
        id: 'harvard',
        name: 'Harvard University',
        type: 'university',
        country: 'USA',
        location: { city: 'Cambridge', region: 'Massachusetts' },
        specialties: ['medicine', 'law', 'business', 'arts_sciences', 'public_health'],
        established: 1636,
        staff: 20000,
        students: 36000,
        annualBudget: 5000000000,
        ranking: 3,
        nobelPrizes: 161,
        researchAreas: ['medicine', 'biotechnology', 'economics', 'climate_science', 'social_sciences'],
        internationalPartners: ['mit', 'stanford', 'oxford', 'cambridge', 'yale'],
        facilities: ['harvard_medical_school', 'harvard_business_school', 'harvard_law_school', 'wyss_institute'],
        publications: 60000,
        patents: 2000,
        status: 'active',
        website: 'https://www.harvard.edu',
        notes: 'Oldest and most prestigious university in the United States'
      },
      {
        id: 'caltech',
        name: 'California Institute of Technology',
        type: 'university',
        country: 'USA',
        location: { city: 'Pasadena', region: 'California' },
        specialties: ['physics', 'chemistry', 'biology', 'engineering', 'astronomy'],
        established: 1891,
        staff: 3000,
        students: 2200,
        annualBudget: 3000000000,
        ranking: 4,
        nobelPrizes: 76,
        researchAreas: ['quantum_physics', 'astronomy', 'biotechnology', 'materials_science', 'climate_science'],
        internationalPartners: ['nasa_jpl', 'mit', 'stanford', 'berkeley'],
        facilities: ['jpl', 'palomar_observatory', 'quantum_institute', 'clean_room'],
        publications: 25000,
        patents: 1500,
        status: 'active',
        website: 'https://www.caltech.edu',
        notes: 'Small but highly prestigious science and engineering institution'
      },
      {
        id: 'oxford',
        name: 'University of Oxford',
        type: 'university',
        country: 'UK',
        location: { city: 'Oxford', region: 'England' },
        specialties: ['medicine', 'humanities', 'social_sciences', 'physical_sciences', 'life_sciences'],
        established: 1096,
        staff: 12000,
        students: 24000,
        annualBudget: 2500000000,
        ranking: 5,
        nobelPrizes: 72,
        researchAreas: ['medicine', 'vaccine_development', 'climate_science', 'artificial_intelligence', 'materials_science'],
        internationalPartners: ['cambridge', 'imperial', 'harvard', 'mit', 'stanford'],
        facilities: ['oxford_vaccine_group', 'clarendon_laboratory', 'radcliffe_observatory', 'diamond_light_source'],
        publications: 40000,
        patents: 1800,
        status: 'active',
        website: 'https://www.ox.ac.uk',
        notes: 'Oldest university in the English-speaking world'
      },
      {
        id: 'cambridge',
        name: 'University of Cambridge',
        type: 'university',
        country: 'UK',
        location: { city: 'Cambridge', region: 'England' },
        specialties: ['mathematics', 'physics', 'chemistry', 'biology', 'engineering'],
        established: 1209,
        staff: 11000,
        students: 23000,
        annualBudget: 2300000000,
        ranking: 6,
        nobelPrizes: 121,
        researchAreas: ['quantum_physics', 'biotechnology', 'materials_science', 'climate_science', 'artificial_intelligence'],
        internationalPartners: ['oxford', 'imperial', 'mit', 'stanford', 'harvard'],
        facilities: ['cavendish_laboratory', 'sanger_institute', 'cambridge_quantum_computing', 'astronomy_institute'],
        publications: 38000,
        patents: 1600,
        status: 'active',
        website: 'https://www.cam.ac.uk',
        notes: 'World-leading research university with strong focus on science'
      },
      {
        id: 'imperial',
        name: 'Imperial College London',
        type: 'university',
        country: 'UK',
        location: { city: 'London', region: 'England' },
        specialties: ['engineering', 'medicine', 'natural_sciences', 'business'],
        established: 1907,
        staff: 8000,
        students: 17000,
        annualBudget: 1200000000,
        ranking: 7,
        nobelPrizes: 14,
        researchAreas: ['clean_energy', 'biotechnology', 'materials_science', 'artificial_intelligence', 'climate_science'],
        internationalPartners: ['oxford', 'cambridge', 'mit', 'stanford', 'eth_zurich'],
        facilities: ['grantham_institute', 'quantum_optics_lab', 'clean_energy_lab', 'biotechnology_center'],
        publications: 30000,
        patents: 1200,
        status: 'active',
        website: 'https://www.imperial.ac.uk',
        notes: 'Leading science and engineering institution in London'
      },
      {
        id: 'eth_zurich',
        name: 'ETH Zurich',
        type: 'university',
        country: 'Switzerland',
        location: { city: 'Zurich', region: 'Zurich' },
        specialties: ['engineering', 'natural_sciences', 'architecture', 'mathematics'],
        established: 1855,
        staff: 6000,
        students: 20000,
        annualBudget: 1500000000,
        ranking: 8,
        nobelPrizes: 21,
        researchAreas: ['quantum_physics', 'materials_science', 'biotechnology', 'climate_science', 'artificial_intelligence'],
        internationalPartners: ['mit', 'stanford', 'imperial', 'max_planck', 'cnrs'],
        facilities: ['quantum_center', 'materials_lab', 'biotechnology_institute', 'climate_lab'],
        publications: 25000,
        patents: 1000,
        status: 'active',
        website: 'https://www.ethz.ch',
        notes: 'Leading science and technology university in Switzerland'
      },
      {
        id: 'max_planck',
        name: 'Max Planck Society',
        type: 'research_center',
        country: 'Germany',
        location: { city: 'Munich', region: 'Bavaria' },
        specialties: ['physics', 'chemistry', 'biology', 'medicine', 'mathematics'],
        established: 1948,
        staff: 15000,
        students: 0,
        annualBudget: 2000000000,
        ranking: 9,
        nobelPrizes: 18,
        researchAreas: ['quantum_physics', 'biotechnology', 'materials_science', 'neuroscience', 'climate_science'],
        internationalPartners: ['cnrs', 'eth_zurich', 'mit', 'stanford', 'oxford'],
        facilities: ['quantum_institute', 'biotechnology_center', 'materials_lab', 'neuroscience_institute'],
        publications: 35000,
        patents: 2000,
        status: 'active',
        website: 'https://www.mpg.de',
        notes: 'Premier research organization in Germany'
      },
      {
        id: 'cnrs',
        name: 'Centre National de la Recherche Scientifique',
        type: 'research_center',
        country: 'France',
        location: { city: 'Paris', region: 'Île-de-France' },
        specialties: ['physics', 'chemistry', 'biology', 'mathematics', 'engineering'],
        established: 1939,
        staff: 32000,
        students: 0,
        annualBudget: 3500000000,
        ranking: 10,
        nobelPrizes: 12,
        researchAreas: ['quantum_physics', 'biotechnology', 'materials_science', 'climate_science', 'artificial_intelligence'],
        internationalPartners: ['max_planck', 'eth_zurich', 'mit', 'stanford', 'oxford'],
        facilities: ['quantum_lab', 'biotechnology_institute', 'materials_center', 'climate_research'],
        publications: 50000,
        patents: 3000,
        status: 'active',
        website: 'https://www.cnrs.fr',
        notes: 'Largest governmental research organization in France'
      }
    ];

    institutes.forEach(institute => {
      this.institutes.set(institute.id, institute);
    });
  }

  /**
   * Initialize research laboratories
   */
  private initializeResearchLaboratories(): void {
    const laboratories: ResearchLaboratory[] = [
      {
        id: 'cavendish_laboratory',
        name: 'Cavendish Laboratory',
        institute: 'cambridge',
        type: 'physics',
        specialties: ['quantum_physics', 'materials_science', 'biophysics', 'astronomy'],
        established: 1874,
        staff: 300,
        annualBudget: 50000000,
        equipment: ['electron_microscopes', 'quantum_computers', 'telescopes', 'clean_rooms'],
        researchProjects: ['quantum_computing', 'graphene_research', 'biophysics', 'astronomy'],
        internationalCollaborations: ['mit', 'stanford', 'oxford', 'max_planck'],
        publications: 5000,
        patents: 200,
        status: 'active',
        notes: 'Famous physics laboratory where many Nobel Prizes were won'
      },
      {
        id: 'media_lab',
        name: 'MIT Media Laboratory',
        institute: 'mit',
        type: 'computer_science',
        specialties: ['artificial_intelligence', 'human_computer_interaction', 'biotechnology', 'design'],
        established: 1985,
        staff: 200,
        annualBudget: 40000000,
        equipment: ['ai_supercomputers', 'biotech_labs', 'design_studios', 'prototyping_labs'],
        researchProjects: ['ai_research', 'biotechnology', 'human_centered_design', 'digital_media'],
        internationalCollaborations: ['stanford', 'harvard', 'oxford', 'cambridge'],
        publications: 3000,
        patents: 150,
        status: 'active',
        notes: 'Innovative research lab focusing on technology and society'
      },
      {
        id: 'slac_national_accelerator',
        name: 'SLAC National Accelerator Laboratory',
        institute: 'stanford',
        type: 'physics',
        specialties: ['particle_physics', 'x_ray_science', 'quantum_physics', 'materials_science'],
        established: 1962,
        staff: 1500,
        annualBudget: 400000000,
        equipment: ['linear_accelerator', 'x_ray_lasers', 'quantum_computers', 'detectors'],
        researchProjects: ['particle_physics', 'quantum_computing', 'materials_science', 'biophysics'],
        internationalCollaborations: ['cern', 'fermilab', 'desy', 'jlab'],
        publications: 8000,
        patents: 400,
        status: 'active',
        notes: 'Major particle physics and X-ray science facility'
      }
    ];

    laboratories.forEach(lab => {
      this.laboratories.set(lab.id, lab);
    });
  }

  /**
   * Initialize international collaborations
   */
  private initializeInternationalCollaborations(): void {
    const collaborations: InternationalCollaboration[] = [
      {
        id: 'cern_collaboration',
        name: 'CERN International Collaboration',
        participants: [
          { institute: 'cern', country: 'Switzerland', role: 'lead' },
          { institute: 'mit', country: 'USA', role: 'partner' },
          { institute: 'oxford', country: 'UK', role: 'partner' },
          { institute: 'max_planck', country: 'Germany', role: 'partner' },
          { institute: 'cnrs', country: 'France', role: 'partner' }
        ],
        researchArea: 'particle_physics',
        startDate: new Date('1954-01-01'),
        status: 'active',
        budget: 1000000000,
        objectives: [
          'Study fundamental particles and forces',
          'Discover new particles and phenomena',
          'Advance particle accelerator technology'
        ],
        outcomes: [
          'Discovery of Higgs boson',
          'Advancement of particle physics',
          'Development of new technologies'
        ],
        publications: 10000,
        patents: 500,
        notes: 'World\'s largest particle physics laboratory'
      },
      {
        id: 'human_genome_project',
        name: 'Human Genome Project',
        participants: [
          { institute: 'nih', country: 'USA', role: 'lead' },
          { institute: 'sanger_institute', country: 'UK', role: 'partner' },
          { institute: 'max_planck', country: 'Germany', role: 'partner' },
          { institute: 'cnrs', country: 'France', role: 'partner' }
        ],
        researchArea: 'genomics',
        startDate: new Date('1990-01-01'),
        endDate: new Date('2003-01-01'),
        status: 'completed',
        budget: 3000000000,
        objectives: [
          'Sequence the entire human genome',
          'Identify all human genes',
          'Develop genomic technologies'
        ],
        outcomes: [
          'Complete human genome sequence',
          'Advancement of genomic technologies',
          'Foundation for personalized medicine'
        ],
        publications: 5000,
        patents: 300,
        notes: 'Landmark project that sequenced the human genome'
      }
    ];

    collaborations.forEach(collaboration => {
      this.collaborations.set(collaboration.id, collaboration);
    });
  }

  /**
   * Initialize Nobel Prize winners
   */
  private initializeNobelPrizeWinners(): void {
    const winners: NobelPrizeWinner[] = [
      {
        id: 'einstein',
        name: 'Albert Einstein',
        institute: 'princeton',
        country: 'USA',
        category: 'physics',
        year: 1921,
        research: 'Theoretical physics, especially for his discovery of the law of the photoelectric effect',
        impact: 'Revolutionized our understanding of space, time, and energy',
        currentStatus: 'deceased',
        notes: 'One of the most influential physicists of all time'
      },
      {
        id: 'curie',
        name: 'Marie Curie',
        institute: 'sorbonne',
        country: 'France',
        category: 'physics',
        year: 1903,
        research: 'Research on radiation phenomena',
        impact: 'Pioneered research on radioactivity',
        currentStatus: 'deceased',
        notes: 'First woman to win a Nobel Prize'
      },
      {
        id: 'watson_crick',
        name: 'James Watson & Francis Crick',
        institute: 'cambridge',
        country: 'UK',
        category: 'medicine',
        year: 1962,
        research: 'Discovery of the molecular structure of nucleic acids',
        impact: 'Foundation of molecular biology and genetics',
        currentStatus: 'retired',
        notes: 'Discovered the double helix structure of DNA'
      }
    ];

    winners.forEach(winner => {
      this.nobelWinners.set(winner.id, winner);
    });
  }

  /**
   * Initialize research facilities
   */
  private initializeResearchFacilities(): void {
    const facilities: ResearchFacility[] = [
      {
        id: 'large_hadron_collider',
        name: 'Large Hadron Collider',
        institute: 'cern',
        type: 'particle_accelerator',
        capabilities: ['particle_collisions', 'higgs_boson_detection', 'dark_matter_search'],
        established: 2008,
        cost: 10000000000,
        staff: 10000,
        specifications: {
          circumference: '27 km',
          energy: '13 TeV',
          temperature: '1.9 K'
        },
        researchProjects: ['atlas', 'cms', 'alice', 'lhcb'],
        internationalAccess: true,
        status: 'operational',
        notes: 'World\'s largest and most powerful particle accelerator'
      },
      {
        id: 'james_webb_telescope',
        name: 'James Webb Space Telescope',
        institute: 'nasa',
        type: 'telescope',
        capabilities: ['infrared_astronomy', 'exoplanet_detection', 'galaxy_observation'],
        established: 2021,
        cost: 10000000000,
        staff: 1000,
        specifications: {
          mirror_diameter: '6.5 meters',
          wavelength: '0.6-28.5 μm',
          orbit: 'L2 Lagrange point'
        },
        researchProjects: ['exoplanet_survey', 'galaxy_formation', 'cosmic_reionization'],
        internationalAccess: true,
        status: 'operational',
        notes: 'Most powerful space telescope ever built'
      }
    ];

    facilities.forEach(facility => {
      this.facilities.set(facility.id, facility);
    });
  }

  // Public API methods

  /**
   * Get all science institutes
   */
  public getScienceInstitutes(): ScienceInstitute[] {
    return Array.from(this.institutes.values());
  }

  /**
   * Get institutes by ranking
   */
  public getTopInstitutes(limit: number = 10): ScienceInstitute[] {
    return Array.from(this.institutes.values())
      .sort((a, b) => a.ranking - b.ranking)
      .slice(0, limit);
  }

  /**
   * Get institutes by country
   */
  public getInstitutesByCountry(country: string): ScienceInstitute[] {
    return Array.from(this.institutes.values()).filter(i => i.country === country);
  }

  /**
   * Get institutes by type
   */
  public getInstitutesByType(type: string): ScienceInstitute[] {
    return Array.from(this.institutes.values()).filter(i => i.type === type);
  }

  /**
   * Get all research laboratories
   */
  public getResearchLaboratories(): ResearchLaboratory[] {
    return Array.from(this.laboratories.values());
  }

  /**
   * Get laboratories by type
   */
  public getLaboratoriesByType(type: string): ResearchLaboratory[] {
    return Array.from(this.laboratories.values()).filter(l => l.type === type);
  }

  /**
   * Get all international collaborations
   */
  public getInternationalCollaborations(): InternationalCollaboration[] {
    return Array.from(this.collaborations.values());
  }

  /**
   * Get active collaborations
   */
  public getActiveCollaborations(): InternationalCollaboration[] {
    return Array.from(this.collaborations.values()).filter(c => c.status === 'active');
  }

  /**
   * Get all Nobel Prize winners
   */
  public getNobelPrizeWinners(): NobelPrizeWinner[] {
    return Array.from(this.nobelWinners.values());
  }

  /**
   * Get Nobel winners by category
   */
  public getNobelWinnersByCategory(category: string): NobelPrizeWinner[] {
    return Array.from(this.nobelWinners.values()).filter(w => w.category === category);
  }

  /**
   * Get all research facilities
   */
  public getResearchFacilities(): ResearchFacility[] {
    return Array.from(this.facilities.values());
  }

  /**
   * Get facilities by type
   */
  public getFacilitiesByType(type: string): ResearchFacility[] {
    return Array.from(this.facilities.values()).filter(f => f.type === type);
  }

  /**
   * Search institutes by specialty
   */
  public searchInstitutesBySpecialty(specialty: string): ScienceInstitute[] {
    return Array.from(this.institutes.values()).filter(i => 
      i.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  /**
   * Search laboratories by specialty
   */
  public searchLaboratoriesBySpecialty(specialty: string): ResearchLaboratory[] {
    return Array.from(this.laboratories.values()).filter(l => 
      l.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  /**
   * Get science institute statistics
   */
  public getScienceInstituteStatistics(): Record<string, any> {
    const stats = {
      institutes: {
        total: this.institutes.size,
        byType: {
          university: this.getInstitutesByType('university').length,
          research_center: this.getInstitutesByType('research_center').length,
          laboratory: this.getInstitutesByType('laboratory').length,
          institute: this.getInstitutesByType('institute').length,
          foundation: this.getInstitutesByType('foundation').length
        },
        byCountry: {
          USA: this.getInstitutesByCountry('USA').length,
          UK: this.getInstitutesByCountry('UK').length,
          Germany: this.getInstitutesByCountry('Germany').length,
          France: this.getInstitutesByCountry('France').length,
          Switzerland: this.getInstitutesByCountry('Switzerland').length
        }
      },
      laboratories: {
        total: this.laboratories.size,
        byType: {
          physics: this.getLaboratoriesByType('physics').length,
          chemistry: this.getLaboratoriesByType('chemistry').length,
          biology: this.getLaboratoriesByType('biology').length,
          engineering: this.getLaboratoriesByType('engineering').length,
          computer_science: this.getLaboratoriesByType('computer_science').length,
          medicine: this.getLaboratoriesByType('medicine').length,
          materials: this.getLaboratoriesByType('materials').length,
          quantum: this.getLaboratoriesByType('quantum').length
        }
      },
      collaborations: {
        total: this.collaborations.size,
        active: this.getActiveCollaborations().length
      },
      nobelWinners: {
        total: this.nobelWinners.size,
        byCategory: {
          physics: this.getNobelWinnersByCategory('physics').length,
          chemistry: this.getNobelWinnersByCategory('chemistry').length,
          medicine: this.getNobelWinnersByCategory('medicine').length,
          economics: this.getNobelWinnersByCategory('economics').length,
          peace: this.getNobelWinnersByCategory('peace').length,
          literature: this.getNobelWinnersByCategory('literature').length
        }
      },
      facilities: {
        total: this.facilities.size,
        byType: {
          particle_accelerator: this.getFacilitiesByType('particle_accelerator').length,
          telescope: this.getFacilitiesByType('telescope').length,
          supercomputer: this.getFacilitiesByType('supercomputer').length,
          clean_room: this.getFacilitiesByType('clean_room').length,
          nuclear_reactor: this.getFacilitiesByType('nuclear_reactor').length,
          fusion_reactor: this.getFacilitiesByType('fusion_reactor').length,
          quantum_computer: this.getFacilitiesByType('quantum_computer').length
        }
      }
    };

    return stats;
  }
}

// Export singleton instance
export const topScienceInstitutes = new TopScienceInstitutes(); 