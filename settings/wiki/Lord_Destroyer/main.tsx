import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Lord_DestroyerArticle } from '../../../src/wiki/articles/Lord_DestroyerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Lord_DestroyerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Lord_DestroyerArticle} />);
}
