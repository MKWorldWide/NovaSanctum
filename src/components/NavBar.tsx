/**
 * @file NavBar.tsx
 * @description Responsive navigation bar component with mobile menu support.
 * Features smooth animations, scroll detection, and responsive design.
 * 
 * @version 1.0.0
 * @license MIT
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Navigation item type definition
 * @typedef {Object} NavItem
 * @property {string} name - Display text for the navigation item
 * @property {string} href - URL or anchor link for the navigation item
 */
type NavItem = {
  name: string;
  href: string;
};

/**
 * Animation variants for the mobile menu
 */
const mobileMenuVariants = {
  open: { opacity: 1, height: 'auto' },
  closed: { opacity: 0, height: 0 },
};

/**
 * Main navigation bar component with responsive design and smooth animations
 * @returns {JSX.Element} Navigation bar component
 */
const NavBar = (): JSX.Element => {
  // State for scroll detection
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Intersection observer for scroll-based animations
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  /**
   * Effect to handle scroll events and update scroll state
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Cleanup function to remove event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this effect runs once on mount

  /**
   * Navigation items for the main menu
   * @type {NavItem[]}
   */
  const navItems: NavItem[] = [
    { name: 'About', href: '#about' },
    { name: 'Synthetic Systems', href: '#synthetic' },
    { name: 'Applications', href: '#applications' },
    { name: 'Partnership', href: '#partnership' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bio-dark/90 backdrop-blur-lg' : 'bg-transparent'
      }`}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <a 
              href="/" 
              className="text-neon-cyan font-mono text-2xl font-bold hover:opacity-80 transition-opacity"
              aria-label="NovaSanctum Home"
            >
              NovaSanctum
            </a>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-bio-light hover:text-neon-cyan px-3 py-2 text-sm font-medium transition-colors duration-300"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button - Only visible on small screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-bio-light hover:text-neon-cyan focus:outline-none p-2 -mr-2"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Animated with Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-bio-dark/95 backdrop-blur-lg overflow-hidden"
            id="mobile-menu"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-bio-light hover:bg-bio-darker/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                  tabIndex={0}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
