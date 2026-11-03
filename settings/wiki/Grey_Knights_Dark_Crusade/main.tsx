import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Grey_Knights_Dark_CrusadeArticle } from '../../../src/wiki/articles/Grey_Knights_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Grey_Knights_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Grey_Knights_Dark_CrusadeArticle} />);
}
