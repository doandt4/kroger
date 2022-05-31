import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSettingsComponent } from './generate-settings.component';

describe('GenerateSettingsComponent', () => {
  let component: GenerateSettingsComponent;
  let fixture: ComponentFixture<GenerateSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
