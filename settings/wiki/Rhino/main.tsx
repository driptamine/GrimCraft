import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { RhinoArticle } from '../../../src/wiki/articles/RhinoData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `RhinoArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={RhinoArticle} />);
}
