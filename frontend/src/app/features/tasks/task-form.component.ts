import { Component, ChangeDetectionStrategy, inject, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskState } from '../../core/state/task.state';
import { Task } from '../../core/models/task.model';
import { ApiError } from '../../core/api/api-error';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" (click)="close.emit()">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div class="relative bg-surface dark:bg-surface-2 rounded-2xl border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto anim-scale-in" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 class="text-xl font-bold text-text">{{ task() ? 'Edit Task' : 'Create Task' }}</h2>
            <p class="text-sm text-text-muted mt-1">{{ task() ? 'Update your task details' : 'Add a new task to track' }}</p>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="w-10 h-10 rounded-lg flex items-center justify-center text-text-subtle hover:text-text hover:bg-surface-2 transition-colors"
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Error Alert -->
        @if (error()) {
          <div class="mx-6 mt-4 flex items-start gap-3 p-4 rounded-lg bg-danger-soft border border-danger/20 text-danger text-sm animate-scale-in">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0016 8zm3.707-9.293a1 1 0 010 1.414L9 14.414 7.707 13.121a1 1 0 011.414-1.414L8 11.586l2.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>{{ error() }}</span>
          </div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5" novalidate>
          <!-- Title Field -->
          <div>
            <label for="title" class="block text-sm font-medium text-text mb-2">Task Title *</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6"/>
                </svg>
              </div>
              <input
                id="title"
                type="text"
                [(ngModel)]="title"
                name="title"
                required
                autocomplete="off"
                class="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200"
                placeholder="What needs to be done?"
              />
            </div>
          </div>

          <!-- Description Field -->
          <div>
            <label for="description" class="block text-sm font-medium text-text mb-2">Description</label>
            <textarea
              id="description"
              [(ngModel)]="description"
              name="description"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200 resize-none"
              placeholder="Add more details about this task..."
            ></textarea>
          </div>

          <!-- Due Date Field -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-text mb-2">Due Date</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <input
                id="dueDate"
                type="date"
                [(ngModel)]="dueDate"
                name="due_date"
                class="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200"
              />
            </div>
          </div>

          <!-- Priority Field -->
          <div>
            <label for="priority" class="block text-sm font-medium text-text mb-2">Priority</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/>
                </svg>
              </div>
              <select
                id="priority"
                [(ngModel)]="priority"
                name="priority"
                class="w-full pl-11 pr-10 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text focus:outline-none focus:shadow-focus transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 justify-end pt-2 border-t border-border">
            <button
              type="button"
              (click)="close.emit()"
              class="px-5 py-2.5 rounded-lg border border-border text-text-muted font-medium hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="submitting()"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover focus:outline-none focus:shadow-focus transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              @if (submitting()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              }
              <span>{{ submitting() ? 'Saving...' : task() ? 'Update Task' : 'Create Task' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  private taskState = inject(TaskState);

  readonly task = input<Task | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();

  protected title = signal('');
  protected description = signal('');
  protected dueDate = signal('');
  protected priority = signal<'low' | 'medium' | 'high'>('medium');
  protected submitting = signal(false);
  protected error = signal('');

  ngOnInit() {
    const t = this.task();
    if (t) {
      this.title.set(t.title);
      this.description.set(t.description || '');
      this.dueDate.set(t.due_date ? t.due_date.substring(0, 10) : '');
      this.priority.set(t.priority);
    }
  }

  protected onSubmit() {
    if (!this.title().trim()) {
      this.error.set('Title is required');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const data: Partial<Task> = {
      title: this.title(),
      description: this.description() || undefined,
      due_date: this.dueDate() || undefined,
      priority: this.priority(),
    };

    const t = this.task();
    const request = t
      ? this.taskState.updateTask(t.id, data)
      : this.taskState.createTask(data);

    request.subscribe({
      next: () => {
        this.saved.emit();
      },
      error: (err: unknown) => {
        this.error.set(this.getErrorMessage(err));
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }

  private getErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
      return err.toToastMessage();
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'An unexpected error occurred';
  }
}
