import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Task } from '../task.interface';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnChanges, OnDestroy {
  @Input() taskId?: string;
  task?: Task;
  taskSub?: Subscription;
  error?: string;
  @Output() close = new EventEmitter<void>();

  constructor(private service: TasksService) { }

  ngOnChanges() {
    if (this.taskId != undefined) {
      this.taskSub?.unsubscribe();
      this.taskSub = this.service.getTask(this.taskId).subscribe({
        next: (task) => {
          this.task = task;
        },
        error: (error) => {
          console.error(`Failed to get task: ${error}`);
          this.error = 'Task not found';
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.taskSub?.unsubscribe();
  }

  onTitleChange(title: string) {
    if (this.task == undefined) return;

    this.task = { ...this.task, title };
    this.service.updateTask(this.task);
  }

  onContentChange(content: string) {
    if (this.task == undefined) return;

    this.task = { ...this.task, content };
    this.service.updateTask(this.task);
  }
}
