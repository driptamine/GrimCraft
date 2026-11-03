import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Category_DoW_Pages_Needing_PicturesArticle } from '../../../src/wiki/articles/Category_DoW_Pages_Needing_PicturesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Category_DoW_Pages_Needing_PicturesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Category_DoW_Pages_Needing_PicturesArticle} />);
}
