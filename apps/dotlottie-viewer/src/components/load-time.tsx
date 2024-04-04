/**
 * Copyright 2023 Design Barn Inc.
 */

interface LoadTimeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  loadTime: number;
  title: string;
}

const LoadTime: React.FC<LoadTimeProps> = ({ className = '', title, loadTime, ...props }) => {
  return (
    <div className={`flex flex-col items-center ${className}`} {...props}>
      <p className="text-xl font-bold mb-2">{title}</p>
      <p className="text-xs px-2 py-1 bg-strong rounded-full flex justify-center items-center">
        Load Time: {loadTime}ms
      </p>
    </div>
  );
};

export default LoadTime;
