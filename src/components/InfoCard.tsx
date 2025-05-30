import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}

const InfoCard = ({ title, description, icon, delay = 0 }: InfoCardProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-synth-purple/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative p-6 bg-bio-dark/50 backdrop-blur-sm rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-colors duration-300">
        {icon && (
          <div className="mb-4 text-neon-cyan">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-bio-light mb-2">
          {title}
        </h3>
        <p className="text-bio-light/70">
          {description}
        </p>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-synth-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    </motion.div>
  );
};

export default InfoCard; 