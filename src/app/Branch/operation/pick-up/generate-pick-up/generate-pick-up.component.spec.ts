import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePickUpComponent } from './generate-pick-up.component';

describe('GeneratePickUpComponent', () => {
  let component: GeneratePickUpComponent;
  let fixture: ComponentFixture<GeneratePickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratePickUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
