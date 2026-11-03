import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kauyon_Command_PostArticle } from '../../../src/wiki/articles/Kauyon_Command_PostData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kauyon_Command_PostArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kauyon_Command_PostArticle} />);
}
