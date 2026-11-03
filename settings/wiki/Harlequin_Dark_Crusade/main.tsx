import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Harlequin_Dark_CrusadeArticle } from '../../../src/wiki/articles/Harlequin_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Harlequin_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Harlequin_Dark_CrusadeArticle} />);
}
