import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from "react-toastify";
import { store } from '@/store/store';
import AppContent from '@/components/AppContent';

export const AuthContext = createContext(null);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </Router>
    </Provider>
  );
}

export default App;