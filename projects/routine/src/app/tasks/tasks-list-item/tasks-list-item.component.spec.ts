import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksListItemComponent } from './tasks-list-item.component';

describe('TasksListItemComponent', () => {
  let component: TasksListItemComponent;
  let fixture: ComponentFixture<TasksListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
