import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagamento-cancelado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cancelado.html',
  styleUrls: ['./retorno.scss']
})
export class PagamentoCanceladoComponent {}
