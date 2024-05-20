/**
 * Copyright 2023 Design Barn Inc.
 */

import { useEffect, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface BaseSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  items: { value: string; label: string }[];
  emptyMessage?: string;
  placeholder?: string;
}

const BaseSelect: React.FC<BaseSelectProps> = ({ className = '', items, placeholder, emptyMessage, ...props }) => {
  // Combine the default classes with any classes passed via props
  const combinedClassName = `border rounded-lg font-bold border-subtle bg-subtle px-2 py-1 h-9 ${className}`;

  const [allItems, setAllItems] = useState(() => {
    if (placeholder) {
      return [{ value: '', label: placeholder }, ...items];
    } else {
      return items;
    }
  });

  useEffect(() => {
    if (placeholder) {
      setAllItems([{ value: '', label: placeholder }, ...items]);
    } else {
      setAllItems(items);
    }
  }, [items, placeholder]);

  if (items.length === 0) {
    return (
      <span className={`min-h-9 text-gray-500 text-xs flex items-center gap-2 h-10`}>
        <FaInfoCircle />
        {emptyMessage}
      </span>
    );
  }

  return (
    <select className={`${combinedClassName}`} {...props}>
      {allItems.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default BaseSelect;
