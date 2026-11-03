import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { TankbustazArticle } from '../../../src/wiki/articles/TankbustazData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `TankbustazArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={TankbustazArticle} />);
}
