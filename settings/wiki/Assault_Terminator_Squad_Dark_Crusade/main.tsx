import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Assault_Terminator_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Assault_Terminator_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Assault_Terminator_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Assault_Terminator_Squad_Dark_CrusadeArticle} />);
}
