import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSelectDialogComponent } from './group-select-dialog.component';

describe('GroupSelectDialogComponent', () => {
  let component: GroupSelectDialogComponent;
  let fixture: ComponentFixture<GroupSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
