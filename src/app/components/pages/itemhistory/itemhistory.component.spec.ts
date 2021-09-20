import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemhistoryComponent } from './itemhistory.component';

describe('ItemhistoryComponent', () => {
  let component: ItemhistoryComponent;
  let fixture: ComponentFixture<ItemhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
