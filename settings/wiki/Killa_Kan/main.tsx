import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Killa_KanArticle } from '../../../src/wiki/articles/Killa_KanData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Killa_KanArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Killa_KanArticle} />);
}
