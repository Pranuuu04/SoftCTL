import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtlTabComponent } from './ftl-tab.component';

describe('FtlTabComponent', () => {
  let component: FtlTabComponent;
  let fixture: ComponentFixture<FtlTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtlTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FtlTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
