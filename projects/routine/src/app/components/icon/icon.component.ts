import { Component, Input } from '@angular/core';

export type Icon = string;

@Component({
  selector: 'app-icon[name]',
  templateUrl: './icon.component.html',
})
export class IconComponent {
  @Input() name!: Icon;
  @Input() size?: 'sm' | 'md' | 'lg' = 'md';
}
