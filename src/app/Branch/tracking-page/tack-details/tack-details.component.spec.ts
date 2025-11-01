import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TackDetailsComponent } from './tack-details.component';

describe('TackDetailsComponent', () => {
  let component: TackDetailsComponent;
  let fixture: ComponentFixture<TackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TackDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
