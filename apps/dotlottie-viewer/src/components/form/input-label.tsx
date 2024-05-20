interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  lablel: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ className = '', lablel, children, ...props }) => {
  // Combine the default classes with any classes passed via props
  const combinedClassName = `flex flex-col gap-1 w-full ${className}`;
  return (
    <div className={combinedClassName}>
      <label className="text-sm font-bold" {...props}>
        {lablel}
      </label>
      <div>{children}</div>
    </div>
  );
};

export default InputLabel;
