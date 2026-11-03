import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Whirlwind_Dark_CrusadeArticle } from '../../../src/wiki/articles/Whirlwind_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Whirlwind_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Whirlwind_Dark_CrusadeArticle} />);
}
