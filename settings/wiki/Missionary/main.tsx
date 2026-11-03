import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { MissionaryArticle } from '../../../src/wiki/articles/MissionaryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `MissionaryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={MissionaryArticle} />);
}
