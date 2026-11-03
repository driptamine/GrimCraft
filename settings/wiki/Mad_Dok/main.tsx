import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mad_DokArticle } from '../../../src/wiki/articles/Mad_DokData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mad_DokArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mad_DokArticle} />);
}
