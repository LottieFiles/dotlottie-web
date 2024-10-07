import logo from '../assets/brand-logo.svg';
import AnimationList from './animation-list';

export default function SidePanel() {
  return (
    <section className="p-4 flex flex-col gap-4 h-full">
      <a href="/">
        <img src={logo} alt="logo" />
      </a>
      <div className="flex flex-col gap-4 flex-grow overflow-auto">
        <h1 className="text-primary text-3xl font-bold">Unleash the power of animations using dotLottie</h1>
        <p className="text-secondary">Create captivating product experiences with dotLottie animations.</p>

        <a
          href="https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/"
          className="bg-lottie hover:bg-lottie/90 rounded-lg p-4 text-white font-bold w-fit"
        >
          Get Started
        </a>
        <AnimationList />
      </div>
    </section>
  );
}
