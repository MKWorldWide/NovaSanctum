/**
 * @file App.tsx
 * @description Main application component for the NovaSanctum platform.
 * This component serves as the root of the React application, containing the main layout,
 * routing, and global configuration.
 * 
 * @version 1.0.0
 * @license MIT
 */

import { useEffect } from 'react';
// Layout Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SectionHeader from './components/SectionHeader';
// Feature Components
import InfoCard from './components/InfoCard';
import CTAButton from './components/CTAButton';
import ContactForm from './components/ContactForm';
// Icons
import { FaDna, FaBrain, FaMicrochip, FaFlask } from 'react-icons/fa';

/**
 * Main application component that renders the entire NovaSanctum platform.
 * Manages global layout, routing, and provides context to child components.
 * 
 * @returns {JSX.Element} The root application component
 */
const App = (): JSX.Element => {
  /**
   * Initialize smooth scrolling behavior for the entire application
   */
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup function to remove smooth scrolling when component unmounts
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []); // Empty dependency array means this effect runs once on mount

  /**
   * Feature cards data for the about section
   * @type {Array<{title: string, description: string, icon: JSX.Element}>}
   */
  const features = [
    {
      title: 'Neural Integration',
      description: 'Advanced neural interfaces for seamless human-AI symbiosis.',
      icon: <FaBrain className="w-8 h-8" />,
    },
    {
      title: 'Synthetic Biology',
      description: "Cutting-edge bioengineering solutions for tomorrow's challenges.",
      icon: <FaDna className="w-8 h-8" />,
    },
    {
      title: 'AI Systems',
      description: 'Next-generation artificial intelligence for biological applications.',
      icon: <FaMicrochip className="w-8 h-8" />,
    },
    {
      title: 'Research & Development',
      description: 'Pioneering research in the intersection of biology and technology.',
      icon: <FaFlask className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-bio-dark text-bio-light">
      {/* Global Navigation */}
      <NavBar />

      {/**
       * Hero Section
       * First viewport section with a call-to-action
       */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        aria-label="Welcome to NovaSanctum"
      >
        {/* Background gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-radial from-neon-cyan/10 via-transparent to-transparent" 
          aria-hidden="true"
        />
        
        {/* Hero content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-synth-purple bg-clip-text text-transparent">
            NovaSanctum
          </h1>
          <p className="text-xl md:text-2xl text-bio-light/80 mb-8 max-w-3xl mx-auto">
            Where Biology Meets Digital Transcendence
          </p>
          <CTAButton 
            text="Explore Our Vision" 
            href="#about" 
            size="lg"
            ariaLabel="Learn more about NovaSanctum"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="About BioSynth"
            subtitle="Pioneering the future of biological and synthetic integration"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <InfoCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Synthetic Systems Section */}
      <section id="synthetic" className="py-20 px-4 bg-bio-dark/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Synthetic Systems"
            subtitle="Revolutionary approaches to biological computing and integration"
          />
          {/* Add content for synthetic systems */}
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Applications"
            subtitle="Transforming industries through biological innovation"
          />
          {/* Add content for applications */}
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="py-20 px-4 bg-bio-dark/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Partnership"
            subtitle="Join us in shaping the future of biological computing"
          />
          {/* Add content for partnership */}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Contact" subtitle="Get in touch with our team of experts" />
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;
