import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { JSX } from 'react';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
