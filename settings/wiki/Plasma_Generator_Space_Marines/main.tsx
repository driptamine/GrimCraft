import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Plasma_Generator_Space_MarinesArticle } from '../../../src/wiki/articles/Plasma_Generator_Space_MarinesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Plasma_Generator_Space_MarinesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Plasma_Generator_Space_MarinesArticle} />);
}
