import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Necron_Lord_Dark_CrusadeArticle } from '../../../src/wiki/articles/Necron_Lord_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Necron_Lord_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Necron_Lord_Dark_CrusadeArticle} />);
}
