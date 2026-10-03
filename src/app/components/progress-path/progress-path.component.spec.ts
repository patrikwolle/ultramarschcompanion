import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPathComponent } from './progress-path.component';

describe('ProgressPathComponent', () => {
  let component: ProgressPathComponent;
  let fixture: ComponentFixture<ProgressPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressPathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
