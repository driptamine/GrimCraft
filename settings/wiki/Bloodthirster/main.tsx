import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BloodthirsterArticle } from '../../../src/wiki/articles/BloodthirsterData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BloodthirsterArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BloodthirsterArticle} />);
}
