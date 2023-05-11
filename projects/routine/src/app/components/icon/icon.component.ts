import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon[name]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent {
  @Input() name!: string;
  @Input() size?: 'sm' | 'md' | 'lg' = 'md';
}
