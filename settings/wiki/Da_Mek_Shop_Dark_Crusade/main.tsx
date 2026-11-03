import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Da_Mek_Shop_Dark_CrusadeArticle } from '../../../src/wiki/articles/Da_Mek_Shop_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Da_Mek_Shop_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Da_Mek_Shop_Dark_CrusadeArticle} />);
}
