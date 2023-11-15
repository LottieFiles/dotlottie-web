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
    src="https://lottie.host/0e2d86ab-604d-4fc4-8512-d44a30eb81a8/YFj05ZHqHA.json"  
    autoplay
    loop
    controls
  ></dotlottie-wc>

  `;
}
