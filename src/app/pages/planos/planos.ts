import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PagamentoService } from '../../services/pagamento.service';
import { NotificationService } from '../../services/notification.service';
import { PlanoTipo } from '../../models/usuario';

interface Plano {
  id: PlanoTipo;
  nome: string;
  preco: string;
  periodo: string;
  descricao: string;
  recursos: string[];
  destaque: boolean;
  cor: string;
}

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './planos.html',
  styleUrls: ['./planos.scss']
})
export class PlanosComponent implements OnInit {
  planoAtual: PlanoTipo = 'FREE';
  carregandoCheckout: PlanoTipo | null = null;
  carregandoPortal = false;

  readonly planos: Plano[] = [
    {
      id: 'FREE',
      nome: 'Gratuito',
      preco: 'R$ 0',
      periodo: 'para sempre',
      descricao: 'Acesso básico para consulta de equivalências.',
      recursos: [
        'Consulta de equivalências alimentares',
        'Busca por grupo alimentar',
        'Exportação CSV',
        'Acesso ao banco de 95 alimentos'
      ],
      destaque: false,
      cor: 'plano-free'
    },
    {
      id: 'BASIC',
      nome: 'Basic',
      preco: 'R$ 29,90',
      periodo: 'por mês',
      descricao: 'Ideal para pacientes em acompanhamento nutricional.',
      recursos: [
        'Tudo do plano Gratuito',
        'Histórico de consultas',
        'Plano alimentar personalizado',
        'Suporte por e-mail'
      ],
      destaque: false,
      cor: 'plano-basic'
    },
    {
      id: 'PRO',
      nome: 'Pro',
      preco: 'R$ 59,90',
      periodo: 'por mês',
      descricao: 'Para quem busca o máximo de recursos e suporte prioritário.',
      recursos: [
        'Tudo do plano Basic',
        'Relatórios nutricionais avançados',
        'Acesso antecipado a novos recursos',
        'Suporte prioritário via WhatsApp',
        'Múltiplos perfis de paciente'
      ],
      destaque: true,
      cor: 'plano-pro'
    }
  ];

  constructor(
    private auth: AuthService,
    private pagamento: PagamentoService,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.planoAtual = (this.auth.planoAtual as PlanoTipo) ?? 'FREE';
  }

  isPlanoAtual(planoId: PlanoTipo): boolean {
    return this.planoAtual === planoId;
  }

  assinar(planoId: PlanoTipo): void {
    if (planoId === 'FREE') return;
    this.carregandoCheckout = planoId;

    this.pagamento.iniciarCheckout(planoId).subscribe({
      next: (res) => {
        window.location.href = res.checkoutUrl;
      },
      error: (err) => {
        this.carregandoCheckout = null;
        const msg = err.error?.message ?? 'Erro ao iniciar checkout. Tente novamente.';
        this.notifier.error(msg);
      }
    });
  }

  gerenciarAssinatura(): void {
    this.carregandoPortal = true;
    this.pagamento.abrirPortal().subscribe({
      next: (res) => {
        window.location.href = res.portalUrl;
      },
      error: (err) => {
        this.carregandoPortal = false;
        const msg = err.error?.message ?? 'Erro ao abrir portal de assinatura.';
        this.notifier.error(msg);
      }
    });
  }
}
