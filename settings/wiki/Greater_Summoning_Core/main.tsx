import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Greater_Summoning_CoreArticle } from '../../../src/wiki/articles/Greater_Summoning_CoreData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Greater_Summoning_CoreArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Greater_Summoning_CoreArticle} />);
}
