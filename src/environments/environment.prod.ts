const endpoint = "https://api.kroger.com/v1";

export const environment = {
  production: true,
  hmr: false,
  api: {
    endpoint,
    socketServer: "https://api.kroger.com/v1",
  },
  elasticAPM: {
    serviceName: "midasmoon-frontend",
    serverUrl: "https://apm.aks.diginex.app",
    distributedTracingOrigins: [endpoint],
    transactionName: "Transaction-Name",
    sensitiveParamNames: [
      "password",
      "currentPassword",
      "newPassword",
      "confirmPassword",
    ],
  },
  enableLogging: false,
  findOutMoreUrl: "https://iris.iom.int/",
  enableIomTermsAndConditions: false,
};
