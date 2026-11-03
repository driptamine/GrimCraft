import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Summoning_CoreArticle } from '../../../src/wiki/articles/Summoning_CoreData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Summoning_CoreArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Summoning_CoreArticle} />);
}
