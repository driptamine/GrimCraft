import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Rhino_TransportArticle } from '../../../src/wiki/articles/Rhino_TransportData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Rhino_TransportArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Rhino_TransportArticle} />);
}
