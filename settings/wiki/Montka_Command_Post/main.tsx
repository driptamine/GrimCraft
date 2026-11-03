import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Montka_Command_PostArticle } from '../../../src/wiki/articles/Montka_Command_PostData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Montka_Command_PostArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Montka_Command_PostArticle} />);
}
