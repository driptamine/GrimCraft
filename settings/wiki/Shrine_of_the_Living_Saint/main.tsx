import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shrine_of_the_Living_SaintArticle } from '../../../src/wiki/articles/Shrine_of_the_Living_SaintData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shrine_of_the_Living_SaintArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shrine_of_the_Living_SaintArticle} />);
}
