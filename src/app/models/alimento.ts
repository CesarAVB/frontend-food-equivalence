export type GrupoAlimentar = 'Frutas' | 'Carboidratos' | 'Proteína' | 'Laticíneos' | 'Gordura Vegetal';

export const GRUPOS_ALIMENTARES: GrupoAlimentar[] = [
  'Frutas',
  'Carboidratos',
  'Proteína',
  'Laticíneos',
  'Gordura Vegetal'
];

export interface Alimento {
  id: number;
  codigoSubstituicao: string;
  grupo: GrupoAlimentar;
  descricao: string;
  energiaKcal: number;
  createdAt?: string;
  updatedAt?: string;
}
