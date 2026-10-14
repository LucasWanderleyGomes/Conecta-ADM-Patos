import { HashRouter, Routes, Route } from 'react-router-dom';
import EventPage from './pages/EventPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminPage from './pages/AdminPage';
import './styles/global.css';
import './styles/admin.css';
import './styles/form.css';
import './styles/admin-extra.css';

// HashRouter (URLs tipo /#/admin) em vez de BrowserRouter: assim as rotas
// funcionam direto no GitHub Pages, sem precisar configurar rewrites de
// servidor para uma SPA — GitHub Pages só serve arquivos estáticos.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EventPage />} />
        <Route path="/inscricao" element={<RegistrationPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  );
}
