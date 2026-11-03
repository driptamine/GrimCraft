import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Orbital_RelayArticle } from '../../../src/wiki/articles/Orbital_RelayData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Orbital_RelayArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Orbital_RelayArticle} />);
}
