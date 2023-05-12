import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    TasksRoutingModule
  ],
  declarations: [
    TasksPageComponent,
    TasksListComponent,
    TaskDetailsComponent
  ]
})
export class TasksModule { }
