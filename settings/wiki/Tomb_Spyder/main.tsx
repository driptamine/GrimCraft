import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tomb_SpyderArticle } from '../../../src/wiki/articles/Tomb_SpyderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tomb_SpyderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tomb_SpyderArticle} />);
}
