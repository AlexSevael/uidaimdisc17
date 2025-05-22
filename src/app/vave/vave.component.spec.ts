import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaveComponent } from './vave.component';

describe('VaveComponent', () => {
  let component: VaveComponent;
  let fixture: ComponentFixture<VaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
