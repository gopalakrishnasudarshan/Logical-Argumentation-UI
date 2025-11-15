import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentViewComponent } from './argument-view.component';
import { MoveHistoryComponent } from '../../component/move-history/move-history.component';
describe('ArgumentViewComponent', () => {
  let component: ArgumentViewComponent;
  let fixture: ComponentFixture<ArgumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgumentViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
