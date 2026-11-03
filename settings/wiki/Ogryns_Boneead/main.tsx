import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Ogryns_BoneeadArticle } from '../../../src/wiki/articles/Ogryns_BoneeadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Ogryns_BoneeadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Ogryns_BoneeadArticle} />);
}
