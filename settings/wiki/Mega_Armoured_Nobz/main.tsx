import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mega_Armoured_NobzArticle } from '../../../src/wiki/articles/Mega_Armoured_NobzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mega_Armoured_NobzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mega_Armoured_NobzArticle} />);
}
