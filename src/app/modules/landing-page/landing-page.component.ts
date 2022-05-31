import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { CampaignService } from '../shared/services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  searchValue: string = 'foo';
  accessToken: string = '';
  //   dataDefault = {
  //     id: "ID",
  //     type: "Type",
  //     sku: "SKU",
  //     name: "Name",
  //     published: "Published",
  //     isFeatured: "Is featured?",
  //     visibilityInCatalog: "Visibility in catalog",
  //     shortDescription: "Short description",
  //     description: "Description",
  //     dateSalePriceStart: "Date sale price starts",
  //     dateSalePriceEnds: "Date sale price ends",
  //     taxStatus: "Tax status",
  //     taxClass: "Tax class",
  //     inStock: "In stock?",
  //     stock: "Stock",
  //     lowStockAmount: "Low stock amount",
  //     backOrderAllowed: "Backorders allowed?",
  //     soldIndividually: "Sold individually?",
  //     weight: "Weight(lbs)",
  //     length: "Length(in)",
  //     width: "Width(in)",
  //     height: "Height(in)",
  //     allowCustomerReviews: "Allow customer reviews?",
  //     purchaseNote: "Purchase note",
  //     salePrice: "Sale price",
  //     regularPrice: "Regular price",
  //     categories: "Categories",
  //     tags: "Tags",
  //     shippingClass: "Shipping class",
  //     images: "Images",
  //     downloadLimit: "Download limit",
  //     downloadExpiryDays: "Download expiry days",
  //     parent: "Parent",
  //     groupedProducts: "Grouped products",
  //     upSells: "Upsells",
  //     crossSells: "Cross-sells",
  //     externalUrl: "External URL",
  //     buttonText: "Button text",
  //     position: "Position",
  //     gpfProductDescription: "Google product feed: Product description",
  //     gpfAvailability: "Google product feed: Availability",
  //     gpfBundleIndicator: "Google product feed: Bundle indicator(is_bundle)",
  //     gpfAvailabilityDate: "Google product feed: Availability date",
  //     gpfCondition: "Google product feed: Condition",
  //     gpfBrand: "Google product feed: Brand",
  //     gpfManufacturePartNumber:
  //       "Google product feed: Manufacturer Part Number(MPN)",
  //     gpfProductType: "Google product feed: Product Type",
  //     gpfGoogleProductCategory: "Google product feed: Google Product Category",
  //     gpfGlobalTradeItemNumber:
  //       "Google product feed: Global Trade Item Number(GTIN)",
  //     gpfGender: "Google product feed: Gender",
  //     gpfAgeGroup: "Google product feed: Age Group",
  //     gpfColor: "Google product feed: Colour",
  //     gpfSize: "Google product feed: Size",
  //     gpfSizeType: "Google product feed: Size type",
  //     gpfSizeSystem: "Google product feed: Size system",
  //     gpfUnitPricingMeasure: "Google product feed: Unit pricing measure",
  //     gpfUnitPricingBaseMeasure: "Google product feed: Unit pricing base measure",
  //     gpfMultipack: "Google product feed: Multipack",
  //     gpfInstalment: "Google product feed: Instalment",
  //     gpfMaterial: "Google product feed: Material",
  //     gpfPattern: "Google product feed: Pattern",
  //     gpfAdultContent: "Google product feed: Adult content",
  //     gpfIdentifierExistsFlag: "Google product feed: Identifier exists flag",
  //     gpfAdwordsGroupFilter: "Google product feed: Adwords grouping filter",
  //     gpfAdwordsLabels: "Google product feed: Adwords labels",
  //     gpfBingCategory: "Google product feed: Bing Category",
  //     gpfDeliveryLabel: "Google product feed: Delivery label",
  //     gpfMinHandlingTime: "Google product feed: Minimum handling time",
  //     gpfMaxHandlingTime: "Google product feed: Maximum handling time",
  //     gpfEnergyEfficiencyClass: "Google product feed: Energy efficiency class",
  //     gpfMinEnergyEfficiencyClass:
  //       "Google product feed: Minimum energy efficiency class",
  //     gpfMaxEnergyEfficiencyClass:
  //       "Google product feed: Maximum energy efficiency class",
  //     gpfCostOfGoodsSold: "Google product feed: Cost of goods sold",
  //     gpfIncludedDestination: "Google product feed: Included destination",
  //     gpfExcludedDestination: "Google product feed: Excluded destination",
  //     gpfCustomLabel_0: "Google product feed: Custom label 0",
  //     gpfCustomLabel_1: "Google product feed: Custom label 1",
  //     gpfCustomLabel_2: "Google product feed: Custom label 2",
  //     gpfCustomLabel_3: "Google product feed: Custom label 3",
  //     gpfCustomLabel_4: "Google product feed: Custom label 4",
  //     gpfPromotionId: "Google product feed: Promotion ID",
  //     gpfBingShippingInfoPrice:
  //       "Google product feed: Bing shipping info(price only)",
  //     gpfBingShippingInfoCountryPrice:
  //       "Google product feed: Bing shipping info(country and price)",
  //     gpfBingShippingInfoCountryPriceService:
  //       "Google product feed: Bing shipping info(country service and price)",
  //     gpfHideProductFromFeed: "Google product feed: Hide product from feed(Y/N)",
  //   };

  //   data = [];
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
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

  data = [];
  isLoadingToken = false;
  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    this.isLoadingToken = true;
    this.campaignService.refreshToken().subscribe((res: any) => {
      this.accessToken = res.access_token;
      this.isLoadingToken = false;
    });
  }

  download() {
    this.campaignService
      .searchProduct(this.searchValue, this.accessToken)
      .subscribe((res: any) => {
        res.data.map((product: any) => {
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
          product.images.map((image: any) => {
            let a = image.sizes.filter((size: any) => size.size === 'large');
            let b = a.map((x: any) => {
              return x.url;
            });
            result.images = !result.images
              ? result.images + b[0]
              : result.images + ',' + b[0];
          });
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
        });
        new AngularCsv(this.data, 'My Report', this.options);
        this.data = [];
      });
  }
}

// interface IData {
//   id: string;
//   type: string;
//   sku: string;
//   name: string;
//   published: number;
//   isFeatured: number;
//   visibilityInCatalog: string;
//   shortDescription: string;
//   description: string;
//   dateSalePriceStart: string;
//   dateSalePriceEnds: string;
//   taxStatus: string;
//   taxClass: string;
//   inStock: number;
//   stock: string;
//   lowStockAmount: string;
//   backOrderAllowed: number;
//   soldIndividually: number;
//   weight: number;
//   length: string;
//   width: string;
//   height: string;
//   allowCustomerReviews: number;
//   purchaseNote: string;
//   salePrice: string;
//   regularPrice: string;
//   categories: string;
//   tags: string;
//   shippingClass: string;
//   images: string;
//   downloadLimit: string;
//   downloadExpiryDays: string;
//   parent: string;
//   groupedProducts: string;
//   upSells: string;
//   crossSells: string;
//   externalUrl: string;
//   buttonText: string;
//   position: number;
//   gpfProductDescription: string;
//   gpfAvailability: string;
//   gpfBundleIndicator: string;
//   gpfAvailabilityDate: string;
//   gpfCondition: string;
//   gpfBrand: string;
//   gpfManufacturePartNumber: string;
//   gpfProductType: string;
//   gpfGoogleProductCategory: string;
//   gpfGlobalTradeItemNumber: string;
//   gpfGender: string;
//   gpfAgeGroup: string;
//   gpfColor: string;
//   gpfSize: string;
//   gpfSizeType: string;
//   gpfSizeSystem: string;
//   gpfUnitPricingMeasure: string;
//   gpfUnitPricingBaseMeasure: string;
//   gpfMultipack: string;
//   gpfInstalment: string;
//   gpfMaterial: string;
//   gpfPattern: string;
//   gpfAdultContent: string;
//   gpfIdentifierExistsFlag: string;
//   gpfAdwordsGroupFilter: string;
//   gpfAdwordsLabels: string;
//   gpfBingCategory: string;
//   gpfDeliveryLabel: string;
//   gpfMinHandlingTime: string;
//   gpfMaxHandlingTime: string;
//   gpfEnergyEfficiencyClass: string;
//   gpfMinEnergyEfficiencyClass: string;
//   gpfMaxEnergyEfficiencyClass: string;
//   gpfCostOfGoodsSold: string;
//   gpfIncludedDestination: string;
//   gpfExcludedDestination: string;
//   gpfCustomLabel_0: string;
//   gpfCustomLabel_1: string;
//   gpfCustomLabel_2: string;
//   gpfCustomLabel_3: string;
//   gpfCustomLabel_4: string;
//   gpfPromotionId: string;
//   gpfBingShippingInfoPrice: string;
//   gpfBingShippingInfoCountryPrice: string;
//   gpfBingShippingInfoCountryPriceService: string;
//   gpfHideProductFromFeed: string;
// }
