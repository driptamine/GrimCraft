import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Energy_CoreArticle } from '../../../src/wiki/articles/Energy_CoreData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Energy_CoreArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Energy_CoreArticle} />);
}
