import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Seer_CouncilArticle } from '../../../src/wiki/articles/Seer_CouncilData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Seer_CouncilArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Seer_CouncilArticle} />);
}
