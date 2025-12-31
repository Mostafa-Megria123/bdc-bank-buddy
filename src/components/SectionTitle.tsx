import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionTitleProps {
  title: string;
  icon: LucideIcon;
  className?: string;
}

const SectionTitle = ({
  title,
  icon: Icon,
  className = "",
}: SectionTitleProps) => {
  return (
    <div className={`text-center mb-12 animate-fade-in ${className}`}>
      <div className="w-16 h-16 bg-gradient-primary rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg transition-transform hover:rotate-6 duration-300">
        <Icon className="h-8 w-8 text-white -rotate-3" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
    </div>
  );
};

export default SectionTitle;
