import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Adepta_Sororitas_ConventArticle } from '../../../src/wiki/articles/Adepta_Sororitas_ConventData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Adepta_Sororitas_ConventArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Adepta_Sororitas_ConventArticle} />);
}
