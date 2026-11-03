import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Da_Mek_ShopArticle } from '../../../src/wiki/articles/Da_Mek_ShopData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Da_Mek_ShopArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Da_Mek_ShopArticle} />);
}
