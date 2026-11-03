import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dawn_of_War_Basic_CommandsArticle } from '../../../src/wiki/articles/Dawn_of_War_Basic_CommandsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dawn_of_War_Basic_CommandsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dawn_of_War_Basic_CommandsArticle} />);
}
