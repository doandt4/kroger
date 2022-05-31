# Deployment

## Production

```bash
az login
az account set -s beba65be-a48e-456d-8181-cccabf81d25e
az aks get-credentials --resource-group aksc50775cb --name aksclusterdf4d75f1
helm repo add harbor https://harbor.dev.diginex.fun/chartrepo/diginex --username $HARBOR_LOGIN --password $HARBOR_PASSWORD
helm repo update
helm upgrade midasmoon-frontend-prod harbor/monochart --namespace midasmoon-prod -f ./prod.values.yaml --install
```
