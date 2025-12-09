import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CNoteIssueComponent } from './c-note-issue.component';

describe('CNoteIssueComponent', () => {
  let component: CNoteIssueComponent;
  let fixture: ComponentFixture<CNoteIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CNoteIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CNoteIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
