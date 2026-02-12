import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Embed } from './pages/embed';
import { Home } from './pages/home';
import { List } from './pages/list';
import { Perf } from './pages/perf';
import { Playground } from './pages/playground';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/perf-test" element={<Perf />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/embed" element={<Embed />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  // </React.StrictMode>,
);
