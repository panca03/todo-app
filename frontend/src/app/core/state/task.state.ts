import { Injectable, inject, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskState {
  private taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);

  loadTasks(params?: { search?: string; status?: string; priority?: string }) {
    this.loading.set(true);
    this.taskService.list(params).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createTask(data: Partial<Task>) {
    return this.taskService.create(data);
  }

  getTask(id: number) {
    return this.taskService.get(id);
  }

  updateTask(id: number, data: Partial<Task>) {
    return this.taskService.update(id, data);
  }

  deleteTask(id: number) {
    return this.taskService.delete(id);
  }

  completeTask(id: number) {
    return this.taskService.complete(id);
  }
}
