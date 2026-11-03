import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Greater_Knarloc_Dark_CrusadeArticle } from '../../../src/wiki/articles/Greater_Knarloc_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Greater_Knarloc_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Greater_Knarloc_Dark_CrusadeArticle} />);
}
