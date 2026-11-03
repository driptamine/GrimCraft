import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mega_Armored_NobzArticle } from '../../../src/wiki/articles/Mega_Armored_NobzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mega_Armored_NobzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mega_Armored_NobzArticle} />);
}
