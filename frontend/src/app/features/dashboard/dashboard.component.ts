import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';
import { TaskState } from '../../core/state/task.state';
import { AuthState } from '../../core/state/auth.state';

@Component({
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="space-y-8">
      <!-- Welcome Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text">
            Welcome back, {{ firstName() }} 👋
          </h1>
          <p class="text-sm text-text-muted mt-1">Here's what's happening with your tasks today</p>
        </div>
        <a
          routerLink="/tasks"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover focus:outline-none focus:shadow-focus transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Task
        </a>
      </div>

      <!-- Stats Cards Grid -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="h-24 rounded-xl bg-surface-2 dark:bg-surface-3 animate-pulse">
              <div class="p-5 space-y-2">
                <div class="h-3 w-20 bg-border rounded"></div>
                <div class="h-8 w-12 bg-border rounded"></div>
              </div>
            </div>
          }
        </div>
      } @else if (stats()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Tasks Card -->
          <div
            class="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/20 rounded-xl p-5 border border-border transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-text-subtle uppercase tracking-wider"
                >Total Tasks</span
              >
              <div
                class="w-8 h-8 rounded-lg bg-accent/10 dark:bg-accent/20 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h12"
                  />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-text">{{ stats()!.total_tasks }}</p>
          </div>

          <!-- Completed Card -->
          <div
            class="bg-gradient-to-br from-success/5 to-success/10 dark:from-success/10 dark:to-success/20 rounded-xl p-5 border border-border transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-text-subtle uppercase tracking-wider"
                >Completed</span
              >
              <div
                class="w-8 h-8 rounded-lg bg-success/10 dark:bg-success/20 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-success">{{ stats()!.completed_tasks }}</p>
          </div>

          <!-- Pending Card -->
          <div
            class="bg-gradient-to-br from-warning/5 to-warning/10 dark:from-warning/10 dark:to-warning/20 rounded-xl p-5 border border-border transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-text-subtle uppercase tracking-wider"
                >Pending</span
              >
              <div
                class="w-8 h-8 rounded-lg bg-warning/10 dark:bg-warning/20 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-warning"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3"
                  />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-warning">{{ stats()!.pending_tasks }}</p>
          </div>

          <!-- Overdue Card -->
          <div
            class="bg-gradient-to-br from-danger/5 to-danger/10 dark:from-danger/10 dark:to-danger/20 rounded-xl p-5 border border-border transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-text-subtle uppercase tracking-wider"
                >Overdue</span
              >
              <div
                class="w-8 h-8 rounded-lg bg-danger/10 dark:bg-danger/20 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-danger">{{ stats()!.overdue_tasks }}</p>
          </div>
        </div>
      }

      <!-- Recent Tasks Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-text">Recent Tasks</h2>
          <a
            routerLink="/tasks"
            class="inline-flex items-center text-sm font-medium text-accent hover:underline transition-colors"
          >
            View all
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        @if (taskState.loading()) {
          <div class="space-y-2">
            @for (i of [1, 2, 3]; track i) {
              <div
                class="h-20 rounded-xl bg-surface-2 dark:bg-surface-3 animate-pulse border border-border"
              >
                <div class="p-4 space-y-2">
                  <div class="h-4 w-3/4 bg-border rounded"></div>
                  <div class="h-3 w-1/2 bg-border rounded"></div>
                </div>
              </div>
            }
          </div>
        } @else if (taskState.tasks().length === 0) {
          <div class="text-center py-12 bg-surface rounded-xl border border-border">
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 class="text-base font-medium text-text mb-2">No tasks yet</h3>
            <p class="text-sm text-text-muted mb-4">Create your first task to get started</p>
            <a
              routerLink="/tasks"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Task
            </a>
          </div>
        } @else {
          <div class="space-y-2">
            @for (task of taskState.tasks().slice(0, 5); track task.id) {
              <div
                class="group flex items-center justify-between bg-surface rounded-xl border border-border p-4 hover:shadow-sm transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    {{
                      task.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }}"
                  >
                    @if (task.status === 'completed') {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6l2 2"
                        />
                      </svg>
                    }
                  </div>
                  <div>
                    <p
                      class="text-sm font-medium text-text group-hover:text-accent transition-colors"
                    >
                      {{ task.title }}
                    </p>
                    <p class="text-xs text-text-muted mt-0.5">
                      {{ task.priority }} priority
                      @if (task.due_date) {
                        <span class="mx-1">·</span> Due {{ task.due_date | date: 'dd MMM yyyy' }}
                      }
                    </p>
                  </div>
                </div>
                <span
                  class="text-xs px-3 py-1 rounded-full font-medium
                  {{
                    task.status === 'completed'
                      ? 'bg-success-soft text-success'
                      : 'bg-warning-soft text-warning'
                  }}"
                >
                  {{ task.status }}
                </span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  protected authState = inject(AuthState);
  protected taskState = inject(TaskState);

  protected stats = signal<DashboardStats | null>(null);
  protected loading = signal(false);
  protected firstName = computed(() => {
    const name = this.authState.currentUser()?.name;
    return name ? name.split(' ')[0] : 'User';
  });

  ngOnInit() {
    this.loading.set(true);
    this.dashboardService.getStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.taskState.loadTasks();
  }
}
