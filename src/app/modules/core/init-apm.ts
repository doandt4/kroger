import { init as initApm } from '@elastic/apm-rum';
import { environment } from 'src/environments/environment';

const { serviceName = '', serverUrl = '', distributedTracingOrigins = [] } = environment.elasticAPM || {};

export const apm =
    serviceName && serverUrl
        ? initApm({
              serviceName,
              serverUrl,
              distributedTracingOrigins,
          })
        : undefined;
