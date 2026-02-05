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
        <h1 className="text-3xl font-bold text-primary">Unleash the power of animations using dotLottie</h1>
        <p className="text-secondary">Create captivating product experiences with dotLottie animations.</p>

        <a
          href="https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/"
          className="p-4 font-bold text-white rounded-lg bg-lottie hover:bg-lottie/90 w-fit"
        >
          Get Started
        </a>
        <AnimationList />
      </div>
    </section>
  );
}
