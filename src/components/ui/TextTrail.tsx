import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type TextTrailProps = {
  children: ReactNode;
  className?: string;
};

const TextTrail: React.FC<TextTrailProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default TextTrail;
