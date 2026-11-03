import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Webway_GateArticle } from '../../../src/wiki/articles/Webway_GateData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Webway_GateArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Webway_GateArticle} />);
}
