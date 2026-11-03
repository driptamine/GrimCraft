import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_Hound_PackArticle } from '../../../src/wiki/articles/Kroot_Hound_PackData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_Hound_PackArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_Hound_PackArticle} />);
}
