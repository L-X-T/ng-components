export type NgcComponentArchetype = 'component' | 'directive';

export interface NgcComponentGeneratorSchema {
  name: string;
  archetype?: NgcComponentArchetype;
  skipFormat?: boolean;
}
