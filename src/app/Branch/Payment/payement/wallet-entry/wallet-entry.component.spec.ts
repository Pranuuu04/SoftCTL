import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletEntryComponent } from './wallet-entry.component';

describe('WalletEntryComponent', () => {
  let component: WalletEntryComponent;
  let fixture: ComponentFixture<WalletEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
