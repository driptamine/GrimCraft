import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sacred_Artifact_Dark_CrusadeArticle } from '../../../src/wiki/articles/Sacred_Artifact_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sacred_Artifact_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sacred_Artifact_Dark_CrusadeArticle} />);
}
