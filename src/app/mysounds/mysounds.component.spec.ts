import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysoundsComponent } from './mysounds.component';

describe('MysoundsComponent', () => {
  let component: MysoundsComponent;
  let fixture: ComponentFixture<MysoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysoundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
