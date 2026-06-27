import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = inject(ApiService);

  list(params?: { search?: string; status?: string; priority?: string }): Observable<Task[]> {
    const query: Record<string, string> = {};
    if (params?.search) query['search'] = params.search;
    if (params?.status) query['status'] = params.status;
    if (params?.priority) query['priority'] = params.priority;
    return this.api.get<Task[]>('tasks', query);
  }

  create(data: Partial<Task>): Observable<Task> {
    return this.api.post<Task>('tasks', data);
  }

  get(id: number): Observable<Task> {
    return this.api.get<Task>(`tasks/${id}`);
  }

  update(id: number, data: Partial<Task>): Observable<Task> {
    return this.api.put<Task>(`tasks/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`tasks/${id}`);
  }

  complete(id: number): Observable<Task> {
    return this.api.patch<Task>(`tasks/${id}/complete`);
  }
}
