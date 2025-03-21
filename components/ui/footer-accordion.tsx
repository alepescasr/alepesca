'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FooterAccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FooterAccordion = ({
  title,
  children,
  className = ""
}: FooterAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button 
        className="w-full flex items-center justify-between md:hidden mb-2 px-4 py-2 bg-primary-dark rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-accent">{title}</span>
        {isOpen ? 
          <ChevronUp size={20} className="text-accent" /> : 
          <ChevronDown size={20} className="text-accent" />
        }
      </button>
      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="hidden md:block text-lg font-semibold mb-4 text-accent">{title}</div>
        {children}
      </div>
    </div>
  );
};

export default FooterAccordion; 