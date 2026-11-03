import type { JSX } from 'react';
import { WikiArticlePage } from './article.jsx';
import { guardsmenSquadArticle } from './guardsmenSquadData.js';

export function GuardsmenSquadPage(): JSX.Element {
  return (
    <WikiArticlePage
      article={guardsmenSquadArticle}
      footer="Article “Guardsmen Squad” from the Dawn of War Player's Guide (warhammer-guide.ru, via RelicWiki), sections 1–2 removed."
    />
  );
}
