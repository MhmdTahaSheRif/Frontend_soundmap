import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundFormComponent } from './submitsound.component';

describe('SubmitsoundComponent', () => {
  let component: SoundFormComponent;
  let fixture: ComponentFixture<SoundFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
