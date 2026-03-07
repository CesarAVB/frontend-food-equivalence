import { Alimento } from './alimento';
import { Equivalente } from './equivalente';

export interface EquivalenciaResponse {
  alimentoSelecionado: Alimento;
  quantidade: number;
  calorias: number;
  equivalentes: Equivalente[];
}