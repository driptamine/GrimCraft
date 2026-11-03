import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Field_Command_Dark_CrusadeArticle } from '../../../src/wiki/articles/Field_Command_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Field_Command_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Field_Command_Dark_CrusadeArticle} />);
}
