import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Company_of_HeroesArticle } from '../../../src/wiki/articles/Company_of_HeroesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Company_of_HeroesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Company_of_HeroesArticle} />);
}
