export type UsuarioTipo = 'ADMIN' | 'NUTRICIONISTA' | 'PACIENTE';
export type PlanoTipo = 'FREE' | 'BASIC' | 'PRO';

export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  cpf?: string;
  senha?: string;
  tipo: UsuarioTipo;
  ativo?: boolean;
  stripeCustomerId?: string;
  plano?: PlanoTipo;
  planoExpiraEm?: string;
}

export interface UsuarioSessao {
  nome: string;
  email: string;
  tipo: UsuarioTipo;
  plano?: PlanoTipo;
  planoExpiraEm?: string;
}
