import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { CampaignService } from '../shared/services';
import { uniqBy, groupBy } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  searchValue: string = '';
  accessToken: string = '';

  data = [];
  isLoadingToken = false;
  isLoading = false;

  page: number = 1;
  start: number = 1;
  totalPage: number = 1;

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    showTitle: false,
    title: 'Your title',
    useBom: true,
    noDownload: false,
    useHeader: false,
    nullToEmptyString: true,
    headers: [
      'ID',
      'Type',
      'SKU',
      'Name',
      'Published',
      'Is featured?',
      'Visibility in catalog',
      'Short description',
      'Description',
      'Date sale price starts',
      'Date sale price ends',
      'Tax status',
      'Tax class',
      'In stock?',
      'Stock',
      'Low stock amount',
      'Backorders allowed?',
      'Sold individually?',
      'Weight(lbs)',
      'Length(in)',
      'Width(in)',
      'Height(in)',
      'Allow customer reviews?',
      'Purchase note',
      'Sale price',
      'Regular price',
      'Categories',
      'Tags',
      'Shipping class',
      'Images',
      'Download limit',
      'Download expiry days',
      'Parent',
      'Grouped products',
      'Upsells',
      'Cross-sells',
      'External URL',
      'Button text',
      'Position',
      'Google product feed: Product description',
      'Google product feed: Availability',
      'Google product feed: Bundle indicator(is_bundle)',
      'Google product feed: Availability date',
      'Google product feed: Condition',
      'Google product feed: Brand',
      'Google product feed: Manufacturer Part Number(MPN)',
      'Google product feed: Product Type',
      'Google product feed: Google Product Category',
      'Google product feed: Global Trade Item Number(GTIN)',
      'Google product feed: Gender',
      'Google product feed: Age Group',
      'Google product feed: Colour',
      'Google product feed: Size',
      'Google product feed: Size type',
      'Google product feed: Size system',
      'Google product feed: Unit pricing measure',
      'Google product feed: Unit pricing base measure',
      'Google product feed: Multipack',
      'Google product feed: Instalment',
      'Google product feed: Material',
      'Google product feed: Pattern',
      'Google product feed: Adult content',
      'Google product feed: Identifier exists flag',
      'Google product feed: Adwords grouping filter',
      'Google product feed: Adwords labels',
      'Google product feed: Bing Category',
      'Google product feed: Delivery label',
      'Google product feed: Minimum handling time',
      'Google product feed: Maximum handling time',
      'Google product feed: Energy efficiency class',
      'Google product feed: Minimum energy efficiency class',
      'Google product feed: Maximum energy efficiency class',
      'Google product feed: Cost of goods sold',
      'Google product feed: Included destination',
      'Google product feed: Excluded destination',
      'Google product feed: Custom label 0',
      'Google product feed: Custom label 1',
      'Google product feed: Custom label 2',
      'Google product feed: Custom label 3',
      'Google product feed: Custom label 4',
      'Google product feed: Promotion ID',
      'Google product feed: Bing shipping info(price only)',
      'Google product feed: Bing shipping info(country and price)',
      'Google product feed: Bing shipping info(country service and price)',
      'Google product feed: Hide product from feed(Y/N)',
    ],
  };

  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    this.refreshToken();
  }

  download(type: 'all' | 'brand') {
    if (this.searchValue.length >= 3) {
      this.page = 1;
      this.start = 1;
      this.totalPage = 1;
      this.data = [];
      this.isLoading = true;
      this.searchProduct(type);
    }
  }

  async refreshToken() {
    this.isLoadingToken = true;
    this.campaignService.refreshToken().subscribe((res: any) => {
      this.accessToken = res.access_token;
      this.isLoadingToken = false;
    });
  }

  toDataURL(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  searchProduct(type: 'all' | 'brand') {
    this.campaignService
      .searchProduct(this.searchValue, this.accessToken, this.start)
      .subscribe(
        async (res: any) => {
          await Promise.all(
            res.data.map(async (product: any) => {
              let result: any = {};
              result.id = `ItemGroup${product.productId}`;
              result.type = 'simple';
              result.sku = `\t${product.upc}`;
              result.name = `${product.description}`;
              result.published = 1;
              result.isFeatured = `\t0`;
              result.visibilityInCatalog = 'visible';
              result.shortDescription = '';
              result.description = `${product.description}`;
              result.dateSalePriceStart = '';
              result.dateSalePriceEnds = '';
              result.taxStatus = 'taxable';
              result.taxClass = '';
              result.inStock = 1;
              result.stock = '';
              result.lowStockAmount = '';
              result.backOrderAllowed = `\t0`;
              result.soldIndividually = `\t0`;
              result.weight = `\t0 pounds`;
              result.length = `\t${product.itemInformation.depth || 0} inches`;
              result.width = `\t${product.itemInformation.width || 0} inches`;
              result.height = `\t${product.itemInformation.height || 0} inches`;
              result.allowCustomerReviews = 1;
              result.purchaseNote = '';
              result.salePrice = '';
              result.regularPrice = '';
              // product.categories[0].replace(/\s/g, '');
              result.categories = `\t${product.categories.join(', ')}`;
              result.tags = '';
              result.shippingClass = '';
              result.images = '';
              await Promise.all(
                product.images.slice(0, 2).map(async (image: any) => {
                  let a = image.sizes.filter(
                    (size: any) => size.size === 'large'
                  );
                  let b = await Promise.all(
                    a.map(async (x: any) => {
                      let dataUrl: any = await this.toDataURLPromise(x.url);
                      dataUrl = dataUrl.replace('data:image/webp;base64,', '');
                      dataUrl = dataUrl.replace('data:image/jpeg;base64,', '');
                      dataUrl = dataUrl.replace('data:image/png;base64,', '');
                      let convertedImg: any = await this.campaignService.convertWebpToJpgBase64(
                        dataUrl
                      );
                      return convertedImg.Files[0].Url;
                    })
                  );
                  result.images = !result.images
                    ? result.images + b
                    : result.images + ',' + b;
                })
              );
              result.downloadLimit = '';
              result.downloadExpiryDays = '';
              result.parent = '';
              result.groupedProducts = '';
              result.upSells = '';
              result.crossSells = '';
              result.externalUrl = '';
              result.buttonText = '';
              result.position = `\t0`;
              result.gpfProductDescription = '';
              result.gpfAvailability = '';
              result.gpfBundleIndicator = '';
              result.gpfAvailabilityDate = '';
              result.gpfCondition = '';
              result.gpfBrand = product.brand;
              result.gpfManufacturePartNumber = '';
              result.gpfProductType = '';
              result.gpfGoogleProductCategory = '';
              result.gpfGlobalTradeItemNumber = `\t${product.upc}`;
              result.gpfGender = '';
              result.gpfAgeGroup = '';
              result.gpfColor = '';
              result.gpfSize = '';
              result.gpfSizeType = '';
              result.gpfSizeSystem = '';
              result.gpfUnitPricingMeasure = '';
              result.gpfUnitPricingBaseMeasure = '';
              result.gpfMultipack = '';
              result.gpfInstalment = '';
              result.gpfMaterial = '';
              result.gpfPattern = '';
              result.gpfAdultContent = '';
              result.gpfIdentifierExistsFlag = '';
              result.gpfAdwordsGroupFilter = '';
              result.gpfAdwordsLabels = '';
              result.gpfBingCategory = '';
              result.gpfDeliveryLabel = '';
              result.gpfMinHandlingTime = '';
              result.gpfMaxHandlingTime = '';
              result.gpfEnergyEfficiencyClass = '';
              result.gpfMinEnergyEfficiencyClass = '';
              result.gpfMaxEnergyEfficiencyClass = '';
              result.gpfCostOfGoodsSold = '';
              result.gpfIncludedDestination = '';
              result.gpfExcludedDestination;
              result.gpfCustomLabel_0 = '';
              result.gpfCustomLabel_1 = '';
              result.gpfCustomLabel_2 = '';
              result.gpfCustomLabel_3 = '';
              result.gpfCustomLabel_4 = '';
              result.gpfPromotionId = '';
              result.gpfBingShippingInfoPrice;
              result.gpfBingShippingInfoCountryPrice = '';
              result.gpfBingShippingInfoCountryPriceService = '';
              result.gpfHideProductFromFeed = '';
              this.data.push(result);
            })
          );
          this.totalPage = Math.ceil(res.meta?.pagination?.total / 50) || 0; //109
          if (this.page < this.totalPage) {
            this.page = this.page + 1;
            this.start = (this.page - 1) * 50 + 1;
            this.searchProduct(type);
          } else {
            this.exportCSV(type);
            this.isLoading = false;
          }
        },
        (_error: HttpErrorResponse) => {
          if (_error.status === 400) {
            this.exportCSV(type);
            this.isLoading = false;
          } else {
            this.campaignService.refreshToken().subscribe((res: any) => {
              this.accessToken = res.access_token;
              this.searchProduct(type);
            });
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }
  toDataURLPromise = (url: any) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  exportCSV(type: 'all' | 'brand') {
    if (this.data.length === 0) {
      alert('Have no data by this search');
    } else {
      this.data = uniqBy(this.data, 'id');
      if (type === 'all') {
        new AngularCsv(
          this.data,
          `${moment().format('YYYYMMDDkkmmss')}_${this.searchValue}`,
          this.options
        );
      }
      if (type === 'brand') {
        const listGroupBrand = groupBy(this.data, 'gpfBrand');
        for (const property in listGroupBrand) {
          new AngularCsv(
            listGroupBrand[property],
            `${moment().format('YYYYMMDDkkmmss')}_${property}`,
            this.options
          );
        }
      }
    }
  }
}
