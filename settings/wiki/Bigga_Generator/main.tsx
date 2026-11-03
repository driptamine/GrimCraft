import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Bigga_GeneratorArticle } from '../../../src/wiki/articles/Bigga_GeneratorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Bigga_GeneratorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Bigga_GeneratorArticle} />);
}
