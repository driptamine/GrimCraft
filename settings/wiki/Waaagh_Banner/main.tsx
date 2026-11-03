import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Waaagh_BannerArticle } from '../../../src/wiki/articles/Waaagh_BannerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Waaagh_BannerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Waaagh_BannerArticle} />);
}
