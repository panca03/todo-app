import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskState } from '../../core/state/task.state';
import { Task } from '../../core/models/task.model';
import { TaskFormComponent } from './task-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

@Component({
  standalone: true,
  imports: [FormsModule, TaskFormComponent, DatePipe, ConfirmModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text">Tasks</h1>
          <p class="text-sm text-text-muted mt-1">Manage and organize your work</p>
        </div>
        <button
          (click)="showForm.set(true)"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover focus:outline-none focus:shadow-focus transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create Task
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 min-w-[200px]">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            [(ngModel)]="search"
            (input)="onFilter()"
            placeholder="Search tasks..."
            class="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200"
          />
        </div>

        <div class="relative">
          <select
            [(ngModel)]="statusFilter"
            (change)="onFilter()"
            class="appearance-none pl-4 pr-10 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text focus:outline-none focus:shadow-focus transition-all duration-200 cursor-pointer min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <div class="relative">
          <select
            [(ngModel)]="priorityFilter"
            (change)="onFilter()"
            class="appearance-none pl-4 pr-10 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text focus:outline-none focus:shadow-focus transition-all duration-200 cursor-pointer min-w-[140px]"
          >
            <option value="">All Priorities</option>
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

      <!-- Task List -->
      @if (taskState.loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="h-20 rounded-xl bg-surface-2 dark:bg-surface-3 animate-pulse border border-border">
              <div class="p-4 space-y-2">
                <div class="h-4 w-3/4 bg-border rounded"></div>
                <div class="h-3 w-1/2 bg-border rounded"></div>
              </div>
            </div>
          }
        </div>
      } @else if (taskState.tasks().length === 0) {
        <div class="text-center py-16 bg-surface rounded-xl border border-border">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
            <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h3 class="text-base font-medium text-text mb-2">No tasks found</h3>
          <p class="text-sm text-text-muted mb-4">Get started by creating your first task</p>
          <button
            (click)="showForm.set(true)"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Create Task
          </button>
        </div>
      } @else {
        <div class="space-y-3">
          @for (task of taskState.tasks(); track task.id) {
            <div class="group flex items-start justify-between bg-surface rounded-xl border border-border p-4 hover:shadow-sm transition-all duration-200 hover:border-border-strong">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  {{ task.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning' }}">
                  @if (task.status === 'completed') {
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  } @else {
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l2 2"/>
                    </svg>
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <h3 class="text-base font-medium
                      {{ task.status === 'completed' ? 'text-text-muted line-through' : 'text-text' }}">
                      {{ task.title }}
                    </h3>
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium
                      {{ priorityClass(task.priority) }}">
                      {{ task.priority }}
                    </span>
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium
                      {{ task.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning' }}">
                      {{ task.status }}
                    </span>
                  </div>
                  @if (task.description) {
                    <p class="text-sm text-text-muted mb-2 line-clamp-2">{{ task.description }}</p>
                  }
                  @if (task.due_date) {
                    <div class="flex items-center gap-2 text-xs text-text-subtle">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke-linecap="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke-linecap="round"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Due {{ task.due_date | date:'dd MMM yyyy' }}
                    </div>
                  }
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                @if (task.status === 'pending') {
                  <button
                    (click)="onComplete(task)"
                    class="p-2 rounded-lg text-success hover:bg-success/10 transition-colors"
                    title="Mark complete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>
                }
                <button
                  (click)="editTask(task)"
                  class="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  (click)="onDelete(task)"
                  class="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Task Form Modal -->
      @if (showForm()) {
        <app-task-form
          [task]="editingTask()"
          (close)="showForm.set(false); editingTask.set(null)"
          (saved)="onSaved()"
        />
      }

      <!-- Delete Confirmation Modal -->
      @if (taskToDelete()) {
        <app-confirm-modal
          message="Are you sure you want to delete this task?"
          confirmLabel="Delete"
          [danger]="true"
          (confirm)="onDeleteConfirm()"
          (cancel)="taskToDelete.set(null)"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  protected taskState = inject(TaskState);

  protected search = signal('');
  protected statusFilter = signal('');
  protected priorityFilter = signal('');
  protected showForm = signal(false);
  protected editingTask = signal<Task | null>(null);
  protected taskToDelete = signal<Task | null>(null);

  ngOnInit() {
    this.taskState.loadTasks();
  }

  protected onFilter() {
    this.taskState.loadTasks({
      search: this.search() || undefined,
      status: this.statusFilter() || undefined,
      priority: this.priorityFilter() || undefined,
    });
  }

  protected onComplete(task: Task) {
    this.taskState.completeTask(task.id).subscribe({
      next: () =>
        this.taskState.loadTasks({
          search: this.search() || undefined,
          status: this.statusFilter() || undefined,
          priority: this.priorityFilter() || undefined,
        }),
    });
  }

  protected editTask(task: Task) {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  protected onDelete(task: Task) {
    this.taskToDelete.set(task);
  }

  protected onDeleteConfirm() {
    const task = this.taskToDelete();
    if (!task) return;
    this.taskToDelete.set(null);
    this.taskState.deleteTask(task.id).subscribe({
      next: () =>
        this.taskState.loadTasks({
          search: this.search() || undefined,
          status: this.statusFilter() || undefined,
          priority: this.priorityFilter() || undefined,
        }),
    });
  }

  protected onSaved() {
    this.showForm.set(false);
    this.editingTask.set(null);
    this.taskState.loadTasks({
      search: this.search() || undefined,
      status: this.statusFilter() || undefined,
      priority: this.priorityFilter() || undefined,
    });
  }

  protected priorityClass(p: string): string {
    switch (p) {
      case 'high':
        return 'bg-danger/10 text-danger';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'low':
        return 'bg-info/10 text-info';
      default:
        return 'bg-surface-2 text-text-muted';
    }
  }
}
