import { type PlaygroundExample, playgroundExamples } from '../../data/playground-examples';
import BaseSelect from '../form/base-select';

interface ExampleSelectorProps {
  selectedId: string;
  onSelect: (example: PlaygroundExample) => void;
}

export const ExampleSelector: React.FC<ExampleSelectorProps> = ({ selectedId, onSelect }) => {
  const items = playgroundExamples.map((example) => ({
    value: example.id,
    label: example.name,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const example = playgroundExamples.find((ex) => ex.id === e.target.value);
    if (example) {
      onSelect(example);
    }
  };

  return <BaseSelect items={items} value={selectedId} onChange={handleChange} className="min-w-40" />;
};
