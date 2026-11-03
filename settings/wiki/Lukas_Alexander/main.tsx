import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Lukas_AlexanderArticle } from '../../../src/wiki/articles/Lukas_AlexanderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Lukas_AlexanderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Lukas_AlexanderArticle} />);
}
