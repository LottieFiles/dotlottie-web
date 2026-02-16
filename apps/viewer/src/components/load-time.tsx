interface LoadTimeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  version: string;
}

const LoadTime: React.FC<LoadTimeProps> = ({ className = '', title, version, ...props }) => {
  return (
    <div className={`flex flex-col items-center ${className}`} {...props}>
      <div className="flex items-start">
        <h6 className="text-xl font-bold mb-0">{title}</h6>
        <span className="ml-1 text-xs text-secondary bg-strong p-0.5 px-1 rounded-lg">{version}</span>
      </div>
    </div>
  );
};

export default LoadTime;
