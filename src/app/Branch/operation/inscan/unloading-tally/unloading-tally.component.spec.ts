import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadingTallyComponent } from './unloading-tally.component';

describe('UnloadingTallyComponent', () => {
  let component: UnloadingTallyComponent;
  let fixture: ComponentFixture<UnloadingTallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnloadingTallyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnloadingTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
