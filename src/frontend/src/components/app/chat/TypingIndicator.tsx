import React from 'react';

interface TypingIndicatorProps {
  typingUsers?: string[];
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  typingUsers = ['Алексей М.'], 
  className = "" 
}) => {
  if (!typingUsers.length) {
    return null;
  }

  const formatTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} печатает...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} и ${typingUsers[1]} печатают...`;
    } else {
      return `${typingUsers[0]} и ещё ${typingUsers.length - 1} печатают...`;
    }
  };

  return (
    <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
      {/* Typing animation dots */}
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>
      
      {/* Typing text */}
      <span className="text-xs">{formatTypingText()}</span>
    </div>
  );
};

export default TypingIndicator; 