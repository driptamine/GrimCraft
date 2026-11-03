import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_RhinoArticle } from '../../../src/wiki/articles/Chaos_RhinoData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_RhinoArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_RhinoArticle} />);
}
