import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chapel_BarracksArticle } from '../../../src/wiki/articles/Chapel-BarracksData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chapel_BarracksArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chapel_BarracksArticle} />);
}
