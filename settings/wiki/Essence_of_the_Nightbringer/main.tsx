import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Essence_of_the_NightbringerArticle } from '../../../src/wiki/articles/Essence_of_the_NightbringerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Essence_of_the_NightbringerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Essence_of_the_NightbringerArticle} />);
}
