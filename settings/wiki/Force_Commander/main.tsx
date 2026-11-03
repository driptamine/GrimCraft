import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Force_CommanderArticle } from '../../../src/wiki/articles/Force_CommanderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Force_CommanderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Force_CommanderArticle} />);
}
