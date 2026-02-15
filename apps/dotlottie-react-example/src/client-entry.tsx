import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  // <React.StrictMode>
  <App />,
  {
    /* </React.StrictMode>, */
  },
);
