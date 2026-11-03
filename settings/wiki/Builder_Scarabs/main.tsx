import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Builder_ScarabsArticle } from '../../../src/wiki/articles/Builder_ScarabsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Builder_ScarabsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Builder_ScarabsArticle} />);
}
