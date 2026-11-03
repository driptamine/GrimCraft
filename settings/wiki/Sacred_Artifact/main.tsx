import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sacred_ArtifactArticle } from '../../../src/wiki/articles/Sacred_ArtifactData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sacred_ArtifactArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sacred_ArtifactArticle} />);
}
