import { motion } from 'framer-motion';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CTAButton = ({
  text,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
}: CTAButtonProps) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-neon-cyan to-synth-purple text-bio-dark hover:from-neon-cyan/90 hover:to-synth-purple/90',
    secondary: 'bg-bio-dark text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/10',
    outline: 'bg-transparent text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/10',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonContent = (
    <>
      <span className="relative z-10">{text}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-synth-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );

  const commonProps = {
    className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  if (href) {
    return (
      <motion.a href={href} {...commonProps}>
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} {...commonProps}>
      {buttonContent}
    </motion.button>
  );
};

export default CTAButton;
