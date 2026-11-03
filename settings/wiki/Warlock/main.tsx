import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WarlockArticle } from '../../../src/wiki/articles/WarlockData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WarlockArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WarlockArticle} />);
}
