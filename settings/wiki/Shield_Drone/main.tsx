import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shield_DroneArticle } from '../../../src/wiki/articles/Shield_DroneData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shield_DroneArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shield_DroneArticle} />);
}
