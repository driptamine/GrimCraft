import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dawn_of_War_Air_UnitsArticle } from '../../../src/wiki/articles/Dawn_of_War_Air_UnitsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dawn_of_War_Air_UnitsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dawn_of_War_Air_UnitsArticle} />);
}
