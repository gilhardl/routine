import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task } from '../task';

@Component({
  selector: 'app-tasks-list-item',
  templateUrl: './tasks-list-item.component.html'
})
export class TasksListItemComponent {
  @Input() task!: Task;
  @Input() selected: boolean = false;
  @Output() delete = new EventEmitter<Task>();
}
