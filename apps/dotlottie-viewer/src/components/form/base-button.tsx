/**
 * Copyright 2023 Design Barn Inc.
 */

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const BaseButton: React.FC<BaseButtonProps> = ({ className = '', children, ...props }) => {
  // Combine the default classes with any classes passed via props
  const combinedClassName = `text-white border bg-brand hover:bg-brand/50 px-2 py-2 ${className}`;
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default BaseButton;
