import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentEditorComponent, ContentEditorModule } from 'content-editor';

import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '', component: HomePageComponent,
  },
  {
    path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
  },
  {
    path: '**', component: NotFoundPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
    ContentEditorModule
  ]
})
export class AppRoutingModule { }
