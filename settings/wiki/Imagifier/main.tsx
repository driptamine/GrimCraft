import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ImagifierArticle } from '../../../src/wiki/articles/ImagifierData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ImagifierArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ImagifierArticle} />);
}
