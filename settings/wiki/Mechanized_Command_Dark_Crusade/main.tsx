import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mechanized_Command_Dark_CrusadeArticle } from '../../../src/wiki/articles/Mechanized_Command_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mechanized_Command_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mechanized_Command_Dark_CrusadeArticle} />);
}
