/**
 * 🧪 Top Science Institutes - Unit Tests
 *
 * Comprehensive test suite for the TopScienceInstitutes service
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { topScienceInstitutes } from '../../../src/services/TopScienceInstitutes';

describe('TopScienceInstitutes Service', () => {
  describe('Initialization', () => {
    it('should initialize successfully', () => {
      expect(topScienceInstitutes).to.exist;
      expect(topScienceInstitutes.getScienceInstitutes).to.be.a('function');
    });
  });

  describe('Science Institutes', () => {
    it('should retrieve all institutes', () => {
      const institutes = topScienceInstitutes.getScienceInstitutes();
      expect(institutes).to.be.an('array');
      expect(institutes.length).to.be.greaterThan(0);
    });

    it('should get top institutes', () => {
      const topInstitutes = topScienceInstitutes.getTopInstitutes(5);
      expect(topInstitutes).to.be.an('array');
      expect(topInstitutes.length).to.be.at.most(5);

      if (topInstitutes.length > 1) {
        // Verify sorting by rank (ascending)
        for (let i = 1; i < topInstitutes.length; i++) {
          expect(topInstitutes[i].ranking).to.be.at.least(topInstitutes[i - 1].ranking);
        }
      }
    });

    it('should get institutes by country', () => {
      const country = 'United States';
      const institutes = topScienceInstitutes.getInstitutesByCountry(country);
      expect(institutes).to.be.an('array');
      if (institutes.length > 0) {
        expect(institutes.every(i => i.country === country)).to.be.true;
      }
    });

    it('should get institutes by type', () => {
      const type = 'university';
      const institutes = topScienceInstitutes.getInstitutesByType(type);
      expect(institutes).to.be.an('array');
      if (institutes.length > 0) {
        expect(institutes.every(i => i.type === type)).to.be.true;
      }
    });

    it('should search institutes by specialty', () => {
      const specialty = 'Physics';
      const results = topScienceInstitutes.searchInstitutesBySpecialty(specialty);
      expect(results).to.be.an('array');
      if (results.length > 0) {
        expect(results.every(i => i.specialties.some((s: string) => s.includes(specialty)))).to.be
          .true;
      }
    });
  });

  describe('Research Laboratories', () => {
    it('should get all research laboratories', () => {
      const labs = topScienceInstitutes.getResearchLaboratories();
      expect(labs).to.be.an('array');
    });

    it('should get laboratories by type', () => {
      const type = 'physics';
      const labs = topScienceInstitutes.getLaboratoriesByType(type);
      expect(labs).to.be.an('array');
      if (labs.length > 0) {
        expect(labs.every(lab => lab.type === type)).to.be.true;
      }
    });

    it('should search laboratories by specialty', () => {
      const specialty = 'Quantum';
      const results = topScienceInstitutes.searchLaboratoriesBySpecialty(specialty);
      expect(results).to.be.an('array');
      if (results.length > 0) {
        expect(results.every(lab => lab.specialties.some((s: string) => s.includes(specialty)))).to
          .be.true;
      }
    });
  });

  describe('International Collaborations', () => {
    it('should get all international collaborations', () => {
      const collabs = topScienceInstitutes.getInternationalCollaborations();
      expect(collabs).to.be.an('array');
    });

    it('should get active collaborations', () => {
      const activeCollabs = topScienceInstitutes.getActiveCollaborations();
      expect(activeCollabs).to.be.an('array');
      if (activeCollabs.length > 0) {
        expect(activeCollabs.every(c => c.status === 'active')).to.be.true;
      }
    });
  });

  describe('Nobel Prize Winners', () => {
    it('should get all Nobel Prize winners', () => {
      const winners = topScienceInstitutes.getNobelPrizeWinners();
      expect(winners).to.be.an('array');
    });

    it('should get winners by category', () => {
      const category = 'physics';
      const winners = topScienceInstitutes.getNobelWinnersByCategory(category);
      expect(winners).to.be.an('array');
      if (winners.length > 0) {
        expect(winners.every(winner => winner.category === category)).to.be.true;
      }
    });
  });

  describe('Research Facilities', () => {
    it('should get all research facilities', () => {
      const facilities = topScienceInstitutes.getResearchFacilities();
      expect(facilities).to.be.an('array');
    });

    it('should get facilities by type', () => {
      const type = 'supercomputer';
      const facilities = topScienceInstitutes.getFacilitiesByType(type);
      expect(facilities).to.be.an('array');
      if (facilities.length > 0) {
        expect(facilities.every(facility => facility.type === type)).to.be.true;
      }
    });

    it('should get gaming facilities', async () => {
      const facilities = await topScienceInstitutes.getGamingFacilities();
      expect(facilities).to.be.an('array');
      if (facilities.length > 0) {
        expect(facilities.every(facility => facility.gameIntegration)).to.be.true;
      }
    });
  });

  describe('Statistics', () => {
    it('should get science institute statistics', () => {
      const stats = topScienceInstitutes.getScienceInstituteStatistics();
      expect(stats).to.be.an('object');
      expect(stats).to.have.property('totalInstitutes').that.is.a('number');
      expect(stats).to.have.property('totalLaboratories').that.is.a('number');
      expect(stats).to.have.property('totalNobelWinners').that.is.a('number');
    });
  });

  describe('Search and Filter', () => {
    it('should return empty array for non-matching search', () => {
      const nonMatchingSearch = 'NonExistentSpecialty123';
      const results = topScienceInstitutes.searchInstitutesBySpecialty(nonMatchingSearch);
      expect(results).to.be.an('array').that.is.empty;
    });

    it('should return empty array for non-existent country', () => {
      const nonExistentCountry = 'NonExistentCountry';
      const results = topScienceInstitutes.getInstitutesByCountry(nonExistentCountry);
      expect(results).to.be.an('array').that.is.empty;
    });

    it('should return empty array for non-existent laboratory type', () => {
      const nonExistentType = 'NonExistentLabType';
      const results = topScienceInstitutes.getLaboratoriesByType(nonExistentType);
      expect(results).to.be.an('array').that.is.empty;
    });
  });

  describe('Data Integrity', () => {
    it('should have valid data in all institutes', () => {
      const institutes = topScienceInstitutes.getScienceInstitutes();

      for (const institute of institutes) {
        expect(institute).to.have.property('id').that.is.a('string');
        expect(institute).to.have.property('name').that.is.a('string').and.not.empty;
        expect(institute)
          .to.have.property('type')
          .that.is.oneOf([
            'university',
            'research_center',
            'laboratory',
            'institute',
            'foundation',
          ]);
        expect(institute).to.have.property('country').that.is.a('string').and.not.empty;
        expect(institute).to.have.property('location').that.is.an('object');
        expect(institute.location).to.have.property('city').that.is.a('string').and.not.empty;
        expect(institute).to.have.property('specialties').that.is.an('array');
        expect(institute).to.have.property('established').that.is.a('number');
        expect(institute).to.have.property('staff').that.is.a('number').and.at.least(0);
        expect(institute).to.have.property('students').that.is.a('number').and.at.least(0);
        expect(institute).to.have.property('ranking').that.is.a('number').and.at.least(1);
        expect(institute).to.have.property('nobelPrizes').that.is.a('number').and.at.least(0);
        expect(institute).to.have.property('researchAreas').that.is.an('array');
        expect(institute).to.have.property('internationalPartners').that.is.an('array');
        expect(institute).to.have.property('facilities').that.is.an('array');
        expect(institute).to.have.property('publications').that.is.a('number').and.at.least(0);
        expect(institute).to.have.property('patents').that.is.a('number').and.at.least(0);
        expect(institute)
          .to.have.property('status')
          .that.is.oneOf(['active', 'inactive', 'expanding']);
        expect(institute).to.have.property('website').that.is.a('string');
      }
    });
  });
});
