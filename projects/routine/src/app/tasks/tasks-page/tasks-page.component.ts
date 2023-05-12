import { Component } from '@angular/core';

import { Task } from '../task.interface';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent {
  selectedTask?: Task;

  selectTask(task: Task): void {
    this.selectedTask = task;
  }

  unselectTask(): void {
    this.selectedTask = undefined;
  }

  handleDeletedtask(task: Task): void {
    if (this.selectedTask?.id == task.id) this.selectedTask = undefined;
  }
}
