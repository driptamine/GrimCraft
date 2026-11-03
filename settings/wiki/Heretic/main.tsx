import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { HereticArticle } from '../../../src/wiki/articles/HereticData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `HereticArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={HereticArticle} />);
}
