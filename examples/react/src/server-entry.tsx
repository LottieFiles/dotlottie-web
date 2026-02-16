import './index.css';
import ReactDOMServer from 'react-dom/server';
import App from './App';

export function render() {
  const html = ReactDOMServer.renderToString(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
  );
  return { html };
}
