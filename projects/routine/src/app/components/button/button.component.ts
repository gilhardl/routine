import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Icon } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() type: 'primary' | 'secondary' | 'tertiary' | 'destructive' = 'primary';
  @Input() icon?: Icon;
  @Output() onClick = new EventEmitter<void>();
}
