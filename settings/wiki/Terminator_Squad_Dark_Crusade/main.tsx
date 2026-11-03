import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Terminator_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Terminator_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Terminator_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Terminator_Squad_Dark_CrusadeArticle} />);
}
