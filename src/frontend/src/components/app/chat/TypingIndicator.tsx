import React from 'react';

interface TypingUser {
  userId: string;
  username: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  typingUsers = [], 
  className = "" 
}) => {
  if (!typingUsers.length) {
    return <div className={`h-6 ${className}`}></div>;
  }

  const formatTypingText = () => {
    const names = typingUsers.map(u => u.username);
    if (names.length === 1) {
      return `${names[0]} печатает...`;
    } else if (names.length === 2) {
      return `${names[0]} и ${names[1]} печатают...`;
    } else {
      return `${names.slice(0, 2).join(', ')} и ещё ${names.length - 2} печатают...`;
    }
  };

  return (
    <div className={`flex items-center gap-2 text-muted-foreground h-6 ${className}`}>
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