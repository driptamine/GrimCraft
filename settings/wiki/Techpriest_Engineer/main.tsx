import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Techpriest_EngineerArticle } from '../../../src/wiki/articles/Techpriest_EngineerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Techpriest_EngineerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Techpriest_EngineerArticle} />);
}
