import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { MistressArticle } from '../../../src/wiki/articles/MistressData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `MistressArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={MistressArticle} />);
}
