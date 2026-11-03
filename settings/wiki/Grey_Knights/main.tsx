import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Grey_KnightsArticle } from '../../../src/wiki/articles/Grey_KnightsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Grey_KnightsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Grey_KnightsArticle} />);
}
