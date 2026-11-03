import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Land_Speeder_TempestArticle } from '../../../src/wiki/articles/Land_Speeder_TempestData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Land_Speeder_TempestArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Land_Speeder_TempestArticle} />);
}
