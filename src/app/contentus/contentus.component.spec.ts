import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentusComponent } from './contentus.component';

describe('ContentusComponent', () => {
  let component: ContentusComponent;
  let fixture: ComponentFixture<ContentusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
