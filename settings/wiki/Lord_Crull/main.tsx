import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Lord_CrullArticle } from '../../../src/wiki/articles/Lord_CrullData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Lord_CrullArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Lord_CrullArticle} />);
}
