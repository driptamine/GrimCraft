import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dais_of_DestructionArticle } from '../../../src/wiki/articles/Dais_of_DestructionData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dais_of_DestructionArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dais_of_DestructionArticle} />);
}
