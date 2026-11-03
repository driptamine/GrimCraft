import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { SoulstormArticle } from '../../../src/wiki/articles/SoulstormData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `SoulstormArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={SoulstormArticle} />);
}
