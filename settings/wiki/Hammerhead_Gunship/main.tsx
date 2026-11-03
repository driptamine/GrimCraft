import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Hammerhead_GunshipArticle } from '../../../src/wiki/articles/Hammerhead_GunshipData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Hammerhead_GunshipArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Hammerhead_GunshipArticle} />);
}
