// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import 'antd/dist/reset.css';
import './styles/fonts.css'
//import './index.css'
import theme  from './styles/theme.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
    <Reset />
    <App />
      </ThemeProvider>
  </React.StrictMode>,
);
