import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App.jsx';
import { Provider } from 'react-redux';
import store, { persistor } from './utils/store/index.js';
import { PersistGate } from 'redux-persist/integration/react';



const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(

  <BrowserRouter>
    < Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PersistGate>
    </ Provider>
  </BrowserRouter>
)



