import { HashRouter, Routes, Route } from 'react-router-dom';
import EventPage from './pages/EventPage';
import AdminPage from './pages/AdminPage';
import './styles/global.css';
import './styles/admin.css';

// HashRouter (URLs tipo /#/admin) em vez de BrowserRouter: assim as rotas
// funcionam direto no GitHub Pages, sem precisar configurar rewrites de
// servidor para uma SPA — GitHub Pages só serve arquivos estáticos.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EventPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  );
}
