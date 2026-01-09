import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { Home } from './pages/home';
import { List } from './pages/list';
import { Perf } from './pages/perf';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/perf-test" element={<Perf />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  // </React.StrictMode>,
);
