import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Guardsmen_Squad_SergeantArticle } from '../../../src/wiki/articles/Guardsmen_Squad_SergeantData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Guardsmen_Squad_SergeantArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Guardsmen_Squad_SergeantArticle} />);
}
