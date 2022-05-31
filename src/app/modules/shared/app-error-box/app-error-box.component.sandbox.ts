import { sandboxOf } from 'angular-playground';
import { AppErrorBoxComponent } from './app-error-box.component';
import { AppErrorBoxModule } from './app-error-box.module';

export default sandboxOf(AppErrorBoxComponent, {
    imports: [AppErrorBoxModule],
    declareComponent: false,
    label: 'shared',
})
    .add('App Error Box - full width', {
        styles: [
            `
        app-error-box {
          display: block;
          width: 100%;
        }
      `,
        ],
        template: `
        <app-error-box [errorMessages]="errorMEssages"></app-error-box>
      `,
        context: {
            errorMEssages: ['Error 1', 'Error 2', 'Error 3 - longer message'],
        },
    })
    .add('App Error Box - custom width', {
        styles: [
            `
        app-error-box {
          display: block;
          width: 50%;
        }
      `,
        ],
        template: `
        <app-error-box [errorMessages]="errorMEssages"></app-error-box>
      `,
        context: {
            errorMEssages: ['Error 1', 'Error 2', 'Error 3 - longer message'],
        },
    });
