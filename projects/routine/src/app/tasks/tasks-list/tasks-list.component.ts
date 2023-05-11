import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Task } from '../task';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html'
})
export class TasksListComponent implements OnInit, OnDestroy {
  @Input() selectedTaskId?: string;
  tasks: Task[] = [];
  tasksSub: Subscription;
  error?: string;

  selectedTask?: Task;
  @Output() select = new EventEmitter<Task>();
  @Output() deleted = new EventEmitter<Task>();

  constructor(private service: TasksService) {
    this.tasksSub = this.service.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      }, error: (error) => {
        console.error(`Failed to get tasks: ${error}`);
        this.error = 'Cound not load tasks';
      }
    });
  }

  ngOnInit(): void {
    if (this.selectedTaskId != undefined) {
      this.selectedTask = this.tasks.find((task) => task.id == this.selectedTaskId);
    }
  }

  selectTask(task: Task): void {
    this.selectedTask = task;
    this.select.emit(task);
  }

  deleteTask(task: Task): void {
    this.service.deleteTask(task);
    this.deleted.emit(task);
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }
}

