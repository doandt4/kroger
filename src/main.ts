// import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { hmr } from '@ngxs/hmr-plugin';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

function bootstrap() {
    return platformBrowserDynamic().bootstrapModule(AppModule);
}

if (environment.hmr) {
    hmr(module, bootstrap).catch(err => console.error(err));
} else {
    bootstrap().catch(err => console.error(err));
}
