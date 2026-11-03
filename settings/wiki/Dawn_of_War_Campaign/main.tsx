import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dawn_of_War_CampaignArticle } from '../../../src/wiki/articles/Dawn_of_War_CampaignData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dawn_of_War_CampaignArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dawn_of_War_CampaignArticle} />);
}
