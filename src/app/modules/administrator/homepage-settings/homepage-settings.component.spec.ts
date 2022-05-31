import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageSettingsComponent } from './homepage-settings.component';

describe('HomepageSettingsComponent', () => {
  let component: HomepageSettingsComponent;
  let fixture: ComponentFixture<HomepageSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
