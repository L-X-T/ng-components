export type NgcComponentArchetype = 'component' | 'directive';

export type NgcComponentCategory = 'form' | 'layout' | 'overlay' | 'feedback' | 'navigation';

export interface NgcComponentGeneratorSchema {
  name: string;
  archetype?: NgcComponentArchetype;
  category?: NgcComponentCategory;
  summary?: string;
  skipFormat?: boolean;
}
