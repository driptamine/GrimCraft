import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BonesingerArticle } from '../../../src/wiki/articles/BonesingerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BonesingerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BonesingerArticle} />);
}
