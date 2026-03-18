import { PlanoTipo } from './usuario';

export interface AuthResponse {
  token: string;
  tipo: 'ADMIN' | 'NUTRICIONISTA' | 'PACIENTE';
  nome: string;
  email: string;
  plano?: PlanoTipo;
  planoExpiraEm?: string;
}
