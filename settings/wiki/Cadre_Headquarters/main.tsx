import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Cadre_HeadquartersArticle } from '../../../src/wiki/articles/Cadre_HeadquartersData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Cadre_HeadquartersArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Cadre_HeadquartersArticle} />);
}
