import { createRoot } from 'react-dom/client';
import { GuardsmenSquadPage } from '../../../src/wiki/guardsmen.jsx';

const el = document.getElementById('wiki-root');
if (el) {
  createRoot(el).render(<GuardsmenSquadPage />);
}
