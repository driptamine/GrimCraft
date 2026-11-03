import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Carus_BromArticle } from '../../../src/wiki/articles/Carus_BromData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Carus_BromArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Carus_BromArticle} />);
}
