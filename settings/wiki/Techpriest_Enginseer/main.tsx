import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Techpriest_EnginseerArticle } from '../../../src/wiki/articles/Techpriest_EnginseerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Techpriest_EnginseerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Techpriest_EnginseerArticle} />);
}
