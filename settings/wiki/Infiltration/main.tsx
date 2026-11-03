import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { InfiltrationArticle } from '../../../src/wiki/articles/InfiltrationData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `InfiltrationArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={InfiltrationArticle} />);
}
