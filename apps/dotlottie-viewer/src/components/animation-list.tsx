import { DotLottieWorkerReact } from '@lottiefiles/dotlottie-react';
import { useAppDispatch } from '../store/hooks';
import { setSrc } from '../store/viewer-slice';

interface ListItemProps {
  name: string;
  url: string;
}

function ListItem(props: ListItemProps) {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => {
        dispatch(setSrc(props.url));
      }}
      className="rounded-lg bg-white border border-transparent hover:border-lottie"
    >
      <div>
        <DotLottieWorkerReact style={{ height: '120px' }} src={props.url} autoplay loop />
      </div>
      <div className="text-xs py-1 bg-strong rounded-b-lg">{props.name}</div>
    </button>
  );
}

interface AnimationListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
const AnimationList: React.FC<AnimationListProps> = ({ className = '', ...props }) => {
  return (
    <div className={`gap-2 flex flex-col ${className}`} {...props}>
      <ListItem
        name="multi-animations"
        url="https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie"
      />
      <ListItem
        name="theming example"
        url="https://lottie.host/884c11a9-e648-4b2f-9906-2c77279710b1/PalAqPKzRZ.lottie"
      />
      <ListItem
        name="marker example"
        url={`https://lottie.host/a04c548c-307f-420b-9ba8-e90a4a2efea4/MT9OsNynSw.lottie`}
      />
    </div>
  );
};

export default AnimationList;
