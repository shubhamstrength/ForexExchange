import "@fontsource/roboto";
import React from 'react'
import ReactDOM from 'react-dom/client'
import ForexApp from './forexApp'
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import './index.css'
import HistoryApp from "./historyApp";
import ResponsiveAppBar from "./components/header";
import { DBConfig } from "./DBConfig";
import { initDB } from "react-indexed-db";

//@ts-ignore
initDB(DBConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <ForexApp />,
  },
  {
    path: "/ForexExchange",
    element: <ForexApp />,
  },
  {
    path: "/forex",
    element: <ForexApp />,
  },
  {
    path: "/history",
    element: <HistoryApp />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ResponsiveAppBar />
      <Routes>
      <Route path="/history" element={<HistoryApp />} />
      <Route path="/forex" element={<ForexApp />} />
      <Route path="/" element={<ForexApp />} />
      <Route path="/ForexExchange" element={<ForexApp />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
