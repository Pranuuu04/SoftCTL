import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMastFormComponent } from './item-mast-form.component';

describe('ItemMastFormComponent', () => {
  let component: ItemMastFormComponent;
  let fixture: ComponentFixture<ItemMastFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMastFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
