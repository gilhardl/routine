import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() type: 'primary' | 'secondary' | 'tertiary' | 'destructive' = 'primary';
  @Input() icon?: string;
  @Output() onClick = new EventEmitter<void>();
}
