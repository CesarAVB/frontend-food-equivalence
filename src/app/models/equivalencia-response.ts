import { Alimento } from './alimento';

export interface Equivalencia {
  id?: string;
  alimentoOrigemId: number;
  alimentoDestinoId: number;
  fatorEquivalencia: number;
  observacao?: string;
  alimentoOrigem?: Alimento;
  alimentoDestino?: Alimento;
}

/** Resultado enriquecido para exibição na home */
export interface EquivalenciaDetalhada extends Equivalencia {
  nomeDestino: string;
  grupoDestino: string;
  kcalDestino: number;
}
