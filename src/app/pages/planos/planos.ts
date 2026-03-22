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
      id: 'DEMO',
      nome: 'Demonstração',
      preco: 'Gratuito',
      periodo: '',
      descricao: 'Teste todos os recursos por 30 dias.',
      recursos: [
        'Acesso completo aos recursos por 30 dias',
        'Sem necessidade de cartão',
        'Relatórios básicos e histórico de consultas',
        'Exportação CSV'
      ],
      destaque: false,
      cor: 'plano-demo'
    },
    {
      id: 'BASIC',
      nome: 'Basic',
      preco: 'R$ 2,00',
      periodo: 'por mês',
      descricao: 'Plano mensal econômico para uso contínuo.',
      recursos: [
        'Tudo do plano Demonstração',
        'Histórico completo',
        'Suporte por e-mail',
        'Acesso a atualizações'
      ],
      destaque: true,
      cor: 'plano-basic'
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
        console.log('iniciarCheckout response:', res);
        const url = res?.checkoutUrl ?? res?.url;
        if (url) {
          window.location.href = url;
        } else {
          this.carregandoCheckout = null;
          this.notifier.error('Resposta inválida do servidor ao iniciar checkout.');
        }
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
        const url = res?.portalUrl ?? res?.url;
        if (url) {
          window.location.href = url;
        } else {
          this.carregandoPortal = false;
          this.notifier.error('Resposta inválida do servidor ao abrir portal de assinatura.');
        }
      },
      error: (err) => {
        this.carregandoPortal = false;
        const msg = err.error?.message ?? 'Erro ao abrir portal de assinatura.';
        this.notifier.error(msg);
      }
    });
  }
}
