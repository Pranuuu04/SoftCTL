import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMastComponent } from './branch-mast.component';

describe('BranchMastComponent', () => {
  let component: BranchMastComponent;
  let fixture: ComponentFixture<BranchMastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchMastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchMastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
