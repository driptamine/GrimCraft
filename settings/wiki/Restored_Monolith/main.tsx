import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Restored_MonolithArticle } from '../../../src/wiki/articles/Restored_MonolithData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Restored_MonolithArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Restored_MonolithArticle} />);
}
