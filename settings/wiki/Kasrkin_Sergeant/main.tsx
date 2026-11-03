import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kasrkin_SergeantArticle } from '../../../src/wiki/articles/Kasrkin_SergeantData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kasrkin_SergeantArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kasrkin_SergeantArticle} />);
}
