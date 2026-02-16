interface SwitchProps {
  className?: string;
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

const Switch: React.FC<SwitchProps> = ({ className = '', onChange, items, value }) => {
  return (
    <div
      className={`h-9 w-min p-1 text-sm flex justify-evenly gap-1 rounded-lg bg-subtle border border-subtle ${className}`}
    >
      {items.map((item) => (
        <button
          key={item.value}
          className={`text-secondary flex justify-center items-center min-w-9 flex-1 p-2 rounded-lg border font-bold ${
            value === item.value
              ? 'bg-white border-subtle'
              : 'bg-subtle border-transparent hover:border-subtle text-tertiary'
          }`}
          onClick={() => {
            onChange(item.value);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Switch;
