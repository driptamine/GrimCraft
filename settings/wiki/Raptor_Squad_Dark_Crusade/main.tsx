import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Raptor_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Raptor_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Raptor_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Raptor_Squad_Dark_CrusadeArticle} />);
}
