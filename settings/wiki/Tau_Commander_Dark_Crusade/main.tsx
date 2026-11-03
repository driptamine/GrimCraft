import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tau_Commander_Dark_CrusadeArticle } from '../../../src/wiki/articles/Tau_Commander_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tau_Commander_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tau_Commander_Dark_CrusadeArticle} />);
}
