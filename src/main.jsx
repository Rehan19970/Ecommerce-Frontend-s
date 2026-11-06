import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { store } from './app/store';
import App from './App.jsx';
import './i18n';
import './index.css';

AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out-cubic',
  offset: 50,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontSize: '13px',
              borderRadius: '0',
              padding: '12px 20px',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);