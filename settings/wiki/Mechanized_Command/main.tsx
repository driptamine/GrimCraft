import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mechanized_CommandArticle } from '../../../src/wiki/articles/Mechanized_CommandData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mechanized_CommandArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mechanized_CommandArticle} />);
}
