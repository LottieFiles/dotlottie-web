import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '400px';
document.body.appendChild(canvas);

// Play specific frame segments
const dotLottie = new DotLottie({
  canvas,
  src: 'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie',
  autoplay: false,
  loop: true,
});

dotLottie.addEventListener('load', () => {
  const totalFrames = dotLottie.totalFrames;
  console.log('Total frames:', totalFrames);

  // Play first half of the animation
  const midFrame = Math.floor(totalFrames / 2);
  dotLottie.setSegment(0, midFrame);
  dotLottie.play();
  console.log('Playing frames 0 to', midFrame);

  // After 4 seconds, play second half
  setTimeout(() => {
    dotLottie.setSegment(midFrame, totalFrames);
    console.log('Playing frames', midFrame, 'to', totalFrames);
  }, 4000);
});
