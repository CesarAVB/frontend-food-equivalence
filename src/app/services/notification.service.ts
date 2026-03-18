import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private containerId = 'app-toasts';
  private duration = 3500;

  private getContainer(): HTMLElement {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'app-toasts';
      document.body.appendChild(container);
    }
    return container;
  }

  private createToast(message: string, type: 'success' | 'info' | 'error') {
    const container = this.getContainer();
    const toast = document.createElement('div');
    toast.className = `app-toast app-toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // force reflow then show
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, this.duration);
  }

  success(message: string) {
    this.createToast(message, 'success');
  }

  info(message: string) {
    this.createToast(message, 'info');
  }

  error(message: string) {
    this.createToast(message, 'error');
  }
}
