/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-secrets/no-secrets */

// eslint-disable-next-line import/no-unassigned-import
import '@lottiefiles/dotlottie-wc';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
  <dotlottie-wc
    src="https://lottie.host/35326116-a8ca-4219-81ca-df9ce56a3f22/zCGFevEA23.lottie"  
    autoplay
    loop
    width="200"
    height="200"
  ></dotlottie-wc>
  <dotlottie-wc
    src="https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie"  
    autoplay
    loop
    width="200"
    height="200"
  ></dotlottie-wc>
  `;
}
