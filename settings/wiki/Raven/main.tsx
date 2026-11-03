import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { RavenArticle } from '../../../src/wiki/articles/RavenData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `RavenArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={RavenArticle} />);
}
