import { DotLottie } from '@lottiefiles/dotlottie-react';
import logo from '../assets/brand-logo.svg';
import AnimationList from './animation-list';
import SlotController from './slot-controller';

interface SidePanelProps {
  dotLottie?: DotLottie | null;
}

export default function SidePanel({ dotLottie }: SidePanelProps) {
  return (
    <section className="flex flex-col h-full gap-4 p-4">
      <a href="/">
        <img src={logo} alt="logo" />
      </a>
      <div className="flex flex-col flex-grow gap-4 overflow-auto">
        <SlotController dotLottie={dotLottie ?? null} />
        <AnimationList />
      </div>
    </section>
  );
}
