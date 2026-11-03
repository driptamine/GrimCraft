import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Penitent_EngineArticle } from '../../../src/wiki/articles/Penitent_EngineData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Penitent_EngineArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Penitent_EngineArticle} />);
}
