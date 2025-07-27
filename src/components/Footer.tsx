import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com/biosynth', label: 'GitHub' },
    { icon: <FaTwitter />, href: 'https://twitter.com/biosynth', label: 'Twitter' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com/company/biosynth', label: 'LinkedIn' },
  ];

  const footerLinks = [
    { name: 'About', href: '#about' },
    { name: 'Synthetic Systems', href: '#synthetic' },
    { name: 'Applications', href: '#applications' },
    { name: 'Partnership', href: '#partnership' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-bio-dark border-t border-neon-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-neon-cyan font-mono text-2xl font-bold"
            >
              BioSynth
            </motion.div>
            <p className="text-bio-light/70 text-sm">
              Bridging the gap between biological engineering and synthetic intelligence.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-bio-light font-semibold">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-bio-light/70 hover:text-neon-cyan transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-bio-light font-semibold">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map(link => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bio-light/70 hover:text-neon-cyan transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{link.label}</span>
                  <span className="text-xl">{link.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-neon-cyan/10">
          <p className="text-center text-bio-light/50 text-sm">
            © {currentYear} BioSynth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
