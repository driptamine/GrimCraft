import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ImagiferArticle } from '../../../src/wiki/articles/ImagiferData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ImagiferArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ImagiferArticle} />);
}
