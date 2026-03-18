export interface AuthResponse {
  token: string;
  tipo: 'ADMIN' | 'NUTRICIONISTA' | 'PACIENTE';
  nome: string;
  email: string;
}
