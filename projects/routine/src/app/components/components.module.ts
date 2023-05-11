import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from './icon/icon.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IconComponent,
    ButtonComponent
  ],
  exports: [
    IconComponent,
    ButtonComponent
  ]
})
export class ComponentsModule { }
