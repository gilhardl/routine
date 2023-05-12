import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { Task } from './task.interface';
import { TASKS } from './task.mock-data';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private subject: BehaviorSubject<Task[]>;

  constructor() {
    this.subject = new BehaviorSubject<Task[]>(TASKS);
  }

  getTasks(): Observable<Task[]> {
    return this.subject.asObservable();
  }

  getTask(id: string): Observable<Task | undefined> {
    return this.getTasks().pipe(
      map<Task[], Task | undefined>(tasks => {
        return tasks.find((task) => task.id === id);
      })
    );
  }

  addTask(task: Task): void {
    TASKS.push(task);
    this.subject.next(TASKS);
  }

  updateTask(task: Task): void {
    TASKS[TASKS.findIndex((t) => t.id === task.id)] = task;
    this.subject.next(TASKS);
  }

  deleteTask(task: Task): void {
    TASKS.splice(TASKS.findIndex((t) => t.id === task.id), 1);
    this.subject.next(TASKS);
  }
}
