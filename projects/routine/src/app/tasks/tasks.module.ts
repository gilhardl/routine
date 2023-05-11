import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksListItemComponent } from './tasks-list-item/tasks-list-item.component';
import { TaskDetailsComponent } from './task-details/task-details.component';


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    TasksRoutingModule
  ],
  declarations: [
    TasksPageComponent,
    TasksListComponent,
    TasksListItemComponent,
    TaskDetailsComponent
  ]
})
export class TasksModule { }
