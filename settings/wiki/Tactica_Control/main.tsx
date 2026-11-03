import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tactica_ControlArticle } from '../../../src/wiki/articles/Tactica_ControlData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tactica_ControlArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tactica_ControlArticle} />);
}
