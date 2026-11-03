import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Webway_AssemblyArticle } from '../../../src/wiki/articles/Webway_AssemblyData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Webway_AssemblyArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Webway_AssemblyArticle} />);
}
