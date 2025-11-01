import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefixMasterComponent } from './prefix-master.component';

describe('PrefixMasterComponent', () => {
  let component: PrefixMasterComponent;
  let fixture: ComponentFixture<PrefixMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrefixMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrefixMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
