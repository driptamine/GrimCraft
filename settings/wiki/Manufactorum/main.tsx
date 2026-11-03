import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ManufactorumArticle } from '../../../src/wiki/articles/ManufactorumData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ManufactorumArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ManufactorumArticle} />);
}
