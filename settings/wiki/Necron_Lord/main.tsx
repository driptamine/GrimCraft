import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Necron_LordArticle } from '../../../src/wiki/articles/Necron_LordData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Necron_LordArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Necron_LordArticle} />);
}
