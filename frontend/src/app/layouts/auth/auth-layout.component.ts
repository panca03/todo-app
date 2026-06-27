import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <!-- Brand Panel - Desktop Only -->
      <div class="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/15"></div>
        <div class="absolute top-20 left-20 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-5 dark:opacity-10">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 0 L0 32 L32 32" fill="none" stroke="currentColor" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div class="relative z-10 text-center">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-accent/10 dark:bg-accent/20 rounded-2xl mb-6">
              <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h12M9 12l3-3M9 12l3 3" />
              </svg>
            </div>
            <h1 class="text-4xl font-bold text-text mb-3">TaskFlow</h1>
            <p class="text-lg text-text-muted max-w-sm mx-auto">
              Stay organized, stay productive. Manage your tasks with clarity and focus.
            </p>
          </div>

          <!-- Feature List -->
          <div class="space-y-4 max-w-sm mx-auto text-left">
            <div class="flex items-center gap-3 text-sm text-text-muted">
              <div class="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span>Intuitive task management</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-text-muted">
              <div class="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span>Real-time collaboration</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-text-muted">
              <div class="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span>Secure and reliable</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Brand Header -->
      <div class="lg:hidden px-6 pt-8 pb-4">
        <a routerLink="/" class="inline-block text-2xl font-bold text-accent">TaskFlow</a>
      </div>

      <!-- Auth Card Panel -->
      <div class="flex items-center justify-center p-6 lg:p-12">
        <div class="w-full max-w-md">
          <div class="bg-surface dark:bg-surface-2 rounded-2xl shadow-xl dark:shadow-2xl p-8 lg:p-10 border border-border transition-all duration-300">
            <router-outlet />
          </div>
        </div>
      </div>
    </div>

    @if (toast.message()) {
      <div class="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg bg-success text-accent-fg text-sm shadow-lg anim-slide-up">
        {{ toast.message() }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  protected toast = inject(ToastService);
}