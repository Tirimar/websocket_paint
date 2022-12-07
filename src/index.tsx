import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <React.StrictMode>
          <Routes>
              <Route path='/:id' element={<App />}/>
              <Route index element={<Navigate to={`f${(+new Date).toString(16)}`}/>}></Route>
          </Routes>
      </React.StrictMode>
    </BrowserRouter>
);
