import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PInscanManifNoComponent } from './p-inscan-manif-no.component';

describe('PInscanManifNoComponent', () => {
  let component: PInscanManifNoComponent;
  let fixture: ComponentFixture<PInscanManifNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PInscanManifNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PInscanManifNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
