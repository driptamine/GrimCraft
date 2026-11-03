import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Flayed_OnesArticle } from '../../../src/wiki/articles/Flayed_OnesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Flayed_OnesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Flayed_OnesArticle} />);
}
