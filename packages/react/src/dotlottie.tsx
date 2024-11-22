import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import type { BaseDotLottieProps } from './base-dotlottie-react';
import { BaseDotLottieReact } from './base-dotlottie-react';

export type DotLottieReactProps = Omit<BaseDotLottieProps<DotLottie>, 'createDotLottie'>;

const createDotLottie = (config: Config): DotLottie => new DotLottie(config);

export const DotLottieReact: React.FC<DotLottieReactProps> = (props) => {
  return <BaseDotLottieReact {...props} createDotLottie={createDotLottie} />;
};
