import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-6 py-3 font-semibold rounded-md transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm";
  
  const variants = {
    primary: "bg-[#C96B3C] hover:bg-[#B45D33] text-white",
    secondary: "bg-[#4A2C2A] hover:bg-[#3A2220] text-white border border-[#C96B3C]/30",
    outline: "bg-transparent border border-[#C96B3C] text-[#C96B3C] hover:bg-[#C96B3C] hover:text-white"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
