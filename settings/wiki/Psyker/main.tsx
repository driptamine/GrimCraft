import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { PsykerArticle } from '../../../src/wiki/articles/PsykerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `PsykerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={PsykerArticle} />);
}
