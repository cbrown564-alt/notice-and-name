// Content type definitions for Notice & Name

export type ConceptCategory =
  | 'technique'
  | 'sensation'
  | 'timing'
  | 'psychological'
  | 'anatomy';

export type ConceptTier = 'free' | 'premium';
export type ConceptReviewStatus = 'draft' | 'reviewed' | 'approved' | 'retired';

export type ConceptSlideType = 'recognize' | 'name' | 'illustrate' | 'understand' | 'explore' | 'reflect';

export interface ConceptSlide {
  type: ConceptSlideType;
  title?: string;
  content: string;
  image?: any;
  illustrationAsset?: any;
  illustrationVideo?: any;
  illustrationCaption?: string;
}

export type DiagramType =
  | 'angling'
  | 'rocking'
  | 'shallowing'
  | 'pairing'
  | 'edging'
  | 'iceberg'
  | 'nerve-density'
  | 'cuv-complex'
  | 'warmup-window'
  | 'none';

export interface Concept {
  id: string;
  name: string;
  category: ConceptCategory;
  reviewStatus?: ConceptReviewStatus;
  thumbnail?: any;
  definition: string;
  description: string;
  researchBasis: string;
  source: string;
  recognitionPrompts: string[];
  relatedConcepts: string[];
  tier: ConceptTier;
  diagramType?: DiagramType;
  slides?: ConceptSlide[];
}

export type PathwayIntent =
  | 'understand-body'
  | 'notice-patterns'
  | 'communicate'
  | 'try-something'
  | 'return-to-presence';

export interface Pathway {
  id: string;
  name: string;
  description: string;
  intent: PathwayIntent;
  icon: string;
  image?: any;
  conceptIds: string[];
  estimatedTime: string;
}

export interface ResearchExplainer {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image?: any;
  readTime: string;
  overview: string;
  keyTakeaways: string[];
  sections: {
    title: string;
    content: string | LinkableContentBlock[];
    statistic?: {
      value: string;
      label: string;
      source: string;
    };
  }[];
  misconceptions: {
    myth: string;
    fact: string;
  }[];
  keySources: {
    citation: string;
    finding: string;
  }[];
  relatedConceptIds: string[];
  relatedExplainerIds: string[];
  tier: ConceptTier;
}

export type LinkableContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; source: any; caption?: string; height?: number }
  | { type: 'quote'; content: string; author?: string; accent?: 'primary' | 'secondary' }
  | { type: 'callout'; title: string; content: string; icon?: string };
