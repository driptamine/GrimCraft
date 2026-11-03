import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { XV8_Crisis_Battlesuit_Dark_CrusadeArticle } from '../../../src/wiki/articles/XV8_Crisis_Battlesuit_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `XV8_Crisis_Battlesuit_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={XV8_Crisis_Battlesuit_Dark_CrusadeArticle} />);
}
