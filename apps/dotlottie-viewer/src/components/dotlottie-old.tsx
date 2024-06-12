import { DotLottiePlayer, Props } from '@dotlottie/react-player';

export default function DotLottieNew(props: Props) {
  return (
    <>
      <div className="">
        <DotLottiePlayer {...props} />
      </div>
    </>
  );
}
