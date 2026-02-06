interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white p-3 flex items-start gap-2">
      <div className="flex-1 font-mono text-sm whitespace-pre-wrap">{error}</div>
      <button onClick={onDismiss} className="text-white hover:text-red-200 font-bold px-2" aria-label="Dismiss error">
        &times;
      </button>
    </div>
  );
};
