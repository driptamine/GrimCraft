import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Drone_HarbingerArticle } from '../../../src/wiki/articles/Drone_HarbingerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Drone_HarbingerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Drone_HarbingerArticle} />);
}
