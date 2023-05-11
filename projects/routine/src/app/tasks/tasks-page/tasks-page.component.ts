import { Component } from '@angular/core';

import { Task } from '../task';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styles: [':host { @apply min-h-screen px-2 py-2 flex flex-row; }']
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
