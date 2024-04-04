/**
 * Copyright 2023 Design Barn Inc.
 */

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const BaseInput: React.FC<BaseInputProps> = ({ className = '', ...props }) => {
  // Combine the default classes with any classes passed via props
  let combinedClassName = `border bg-transparent w-full py-1 min-h-10 ${className}`;

  if (props.type !== 'color') {
    combinedClassName += ' px-2';
  } else {
    combinedClassName += ' px-1';
  }

  return <input className={combinedClassName} {...props} />;
};

export default BaseInput;
