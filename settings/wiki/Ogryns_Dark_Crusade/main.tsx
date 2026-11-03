import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Ogryns_Dark_CrusadeArticle } from '../../../src/wiki/articles/Ogryns_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Ogryns_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Ogryns_Dark_CrusadeArticle} />);
}
