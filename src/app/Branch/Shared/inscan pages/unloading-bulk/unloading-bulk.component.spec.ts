import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadingBulkComponent } from './unloading-bulk.component';

describe('UnloadingBulkComponent', () => {
  let component: UnloadingBulkComponent;
  let fixture: ComponentFixture<UnloadingBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnloadingBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnloadingBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
