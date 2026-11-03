import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kronus_Necron_LordArticle } from '../../../src/wiki/articles/Kronus_Necron_LordData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kronus_Necron_LordArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kronus_Necron_LordArticle} />);
}
