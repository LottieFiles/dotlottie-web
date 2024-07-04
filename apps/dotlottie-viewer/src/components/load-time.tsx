interface LoadTimeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  loadTime: number;
  title: string;
  rendererVersion: string;
  version: string;
}

const LoadTime: React.FC<LoadTimeProps> = ({ className = '', title, version, rendererVersion, loadTime, ...props }) => {
  return (
    <div className={`flex flex-col items-center ${className}`} {...props}>
      <div className="flex items-start">
        <h6 className="text-xl font-bold mb-0">{title}</h6>
        <span className="ml-1 text-xs text-secondary bg-strong p-0.5 px-1 rounded-lg">{version}</span>
      </div>
      <span className="p-1 rounded text-xs mb-1 text-secondary">
        <strong>Renderer: </strong>
        {rendererVersion}
      </span>
      <p className="text-xs px-2 py-1 bg-strong rounded-full flex justify-center items-center">
        Load Time: {loadTime}ms
      </p>
    </div>
  );
};

export default LoadTime;
