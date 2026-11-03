import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Slave_ChamberArticle } from '../../../src/wiki/articles/Slave_ChamberData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Slave_ChamberArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Slave_ChamberArticle} />);
}
