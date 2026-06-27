import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30" (click)="cancel.emit()">
      <div class="bg-surface rounded-lg border border-border shadow-lg w-full max-w-sm p-6 m-4 anim-scale-in" (click)="\$event.stopPropagation()">
        <p class="text-text text-sm mb-6">{{ message() }}</p>
        <div class="flex gap-3 justify-end">
          <button (click)="cancel.emit()" class="px-4 py-2 rounded-md border border-border text-text-muted hover:bg-surface-2 transition-colors text-sm">
            Cancel
          </button>
          <button (click)="confirm.emit()" class="px-4 py-2 rounded-md text-accent-fg text-sm font-medium transition-colors"
            [class.bg-danger]="danger()"
            [class.hover:bg-danger/90]="danger()"
            [class.bg-accent]="!danger()"
            [class.hover:bg-accent-hover]="!danger()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  readonly message = input('Are you sure?');
  readonly confirmLabel = input('Confirm');
  readonly danger = input(true);
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
