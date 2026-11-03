import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Necron_Warriors_Dark_CrusadeArticle } from '../../../src/wiki/articles/Necron_Warriors_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Necron_Warriors_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Necron_Warriors_Dark_CrusadeArticle} />);
}
