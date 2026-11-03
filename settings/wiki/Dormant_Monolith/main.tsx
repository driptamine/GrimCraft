import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dormant_MonolithArticle } from '../../../src/wiki/articles/Dormant_MonolithData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dormant_MonolithArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dormant_MonolithArticle} />);
}
