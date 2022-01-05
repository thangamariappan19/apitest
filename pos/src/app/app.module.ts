import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { TableModule } from 'ngx-easy-table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { MatListModule } from '@angular/material/list';

//import { ZingchartAngularModule } from 'zingchart-angular';

// QZ Tray
import { QzTrayService } from './qz-tray-service';


import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommonService } from './common.service';
import { from } from 'rxjs';
import { OrderComponent } from './fullfillment/order/order.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmService } from './confirm/confirm.service';
import { PosComponent } from './pos/pos.component';
import { PaymentComponent } from './pos/payment/payment.component';
import { ReturnComponent } from './pos/return/return.component';
import { ExchangeComponent } from './pos/exchange/exchange.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerViewComponent } from './customer/customer-view/customer-view.component';
import { CompanyListComponent } from './master/company/company-list/company-list.component';
import { CompanyAddComponent } from './master/company/company-add/company-add.component';
import { CompanyEditComponent } from './master/company/company-edit/company-edit.component';
import { CountryListComponent } from './master/country/country-list/country-list.component';
import { CountryAddComponent } from './master/country/country-add/country-add.component';
import { CountryEditComponent } from './master/country/country-edit/country-edit.component';
import { ReturnPaymentComponent } from './pos/return/return-payment/return-payment.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { StockComponent } from './pos/stock/stock.component';
import { FindStockComponent } from './pos/find-stock/find-stock.component';
import { SearchInvoiceComponent } from './pos/search-invoice/search-invoice.component';
import { ProductSearchComponent } from './pos/product-search/product-search.component';
import { DayInOutComponent } from './day-in-out/day-in-out.component';
import { RecallInvoiceComponent } from './pos/recall-invoice/recall-invoice.component';
import { CashInComponent } from './pos/cash-in/cash-in.component';
import { CashOutComponent } from './pos/cash-out/cash-out.component';
import { DayOutComponent } from './day-out/day-out.component';
import { SalesOrderListComponent } from './pos/sales-order-list/sales-order-list.component';
import { SalesOrderComponent } from './pos/sales-order/sales-order.component';
import { SalesOrderPickComponent } from './pos/sales-order-pick/sales-order-pick.component';
import { TailoringListComponent } from './master/tailoring/tailoring-list/tailoring-list.component';
import { TailoringAddComponent } from './master/tailoring/tailoring-add/tailoring-add.component';
import { TailoringEditComponent } from './master/tailoring/tailoring-edit/tailoring-edit.component';
import { ManagerOverrideListComponent } from './master/manager-override/manager-override-list/manager-override-list.component';
import { ManagerOverrideAddComponent } from './master/manager-override/manager-override-add/manager-override-add.component';
import { ManagerOverrideEditComponent } from './master/manager-override/manager-override-edit/manager-override-edit.component';
import { StateAddComponent } from './master/state/state-add/state-add.component';
import { StateEditComponent } from './master/state/state-edit/state-edit.component';
import { StateListComponent } from './master/state/state-list/state-list.component';
import { LanguageListComponent } from './master/language/language-list/language-list.component';
import { LanguageAddComponent } from './master/language/language-add/language-add.component';
import { LanguageEditComponent } from './master/language/language-edit/language-edit.component';
import { WarehouseTypeEditComponent } from './master/warehouse-type/warehouse-type-edit/warehouse-type-edit.component';
import { WarehouseTypeListComponent } from './master/warehouse-type/warehouse-type-list/warehouse-type-list.component';
import { WarehouseTypeAddComponent } from './master/warehouse-type/warehouse-type-add/warehouse-type-add.component';
import { WarehouseAddComponent } from './master/warehouse/warehouse-add/warehouse-add.component';
import { WarehouseEditComponent } from './master/warehouse/warehouse-edit/warehouse-edit.component';
import { WarehouseListComponent } from './master/warehouse/warehouse-list/warehouse-list.component';
import { DesignationListComponent } from './master/designation/designation-list/designation-list.component';
import { DesignationAddComponent } from './master/designation/designation-add/designation-add.component';
import { DesignationEditComponent } from './master/designation/designation-edit/designation-edit.component';
import { VendorGroupListComponent } from './master/vendor-group/vendor-group-list/vendor-group-list.component';
import { VendorGroupAddComponent } from './master/vendor-group/vendor-group-add/vendor-group-add.component';
import { VendorGroupEditComponent } from './master/vendor-group/vendor-group-edit/vendor-group-edit.component';
import { VendorListComponent } from './master/vendor/vendor-list/vendor-list.component';
import { VendorAddComponent } from './master/vendor/vendor-add/vendor-add.component';
import { VendorEditComponent } from './master/vendor/vendor-edit/vendor-edit.component';
import { CustomerGroupListComponent } from './master/customer-group/customer-group-list/customer-group-list.component';
import { CustomerGroupAddComponent } from './master/customer-group/customer-group-add/customer-group-add.component';
import { CustomerGroupEditComponent } from './master/customer-group/customer-group-edit/customer-group-edit.component';
import { RetailSettingsListComponent } from './master/retail-settings/retail-settings-list/retail-settings-list.component';
import { RetailSettingsAddComponent } from './master/retail-settings/retail-settings-add/retail-settings-add.component';
import { RetailSettingsEditComponent } from './master/retail-settings/retail-settings-edit/retail-settings-edit.component';
import { StyleStatusListComponent } from './master/style-status/style-status-list/style-status-list.component';
import { StyleStatusAddComponent } from './master/style-status/style-status-add/style-status-add.component';
import { StyleStatusEditComponent } from './master/style-status/style-status-edit/style-status-edit.component';
import { SegmentationTypeListComponent } from './master/segmentation-type/segmentation-type-list/segmentation-type-list.component';
import { SegmentationTypeAddComponent } from './master/segmentation-type/segmentation-type-add/segmentation-type-add.component';
import { SegmentationTypeEditComponent } from './master/segmentation-type/segmentation-type-edit/segmentation-type-edit.component';
import { DropMasterListComponent } from './master/drop-master/drop-master-list/drop-master-list.component';
import { DropMasterAddComponent } from './master/drop-master/drop-master-add/drop-master-add.component';
import { DropMasterEditComponent } from './master/drop-master/drop-master-edit/drop-master-edit.component';
import { PriceTypeListComponent } from './master/price-type/price-type-list/price-type-list.component';
import { PriceTypeAddComponent } from './master/price-type/price-type-add/price-type-add.component';
import { PriceTypeEditComponent } from './master/price-type/price-type-edit/price-type-edit.component';
import { TaxListComponent } from './master/tax/tax-list/tax-list.component';
import { TaxAddComponent } from './master/tax/tax-add/tax-add.component';
import { TaxEditComponent } from './master/tax/tax-edit/tax-edit.component';
import { CollectionListComponent } from './master/collection/collection-list/collection-list.component';
import { CollectionAddComponent } from './master/collection/collection-add/collection-add.component';
import { CollectionEditComponent } from './master/collection/collection-edit/collection-edit.component';
import { AgentListComponent } from './master/agent/agent-list/agent-list.component';
import { AgentAddComponent } from './master/agent/agent-add/agent-add.component';
import { AgentEditComponent } from './master/agent/agent-edit/agent-edit.component';
import { RoleListComponent } from './master/role/role-list/role-list.component';
import { RoleAddComponent } from './master/role/role-add/role-add.component';
import { RoleEditComponent } from './master/role/role-edit/role-edit.component';
import { PaymentTypeListComponent } from './master/payment-type/payment-type-list/payment-type-list.component';
import { PaymentTypeAddComponent } from './master/payment-type/payment-type-add/payment-type-add.component';
import { PaymentTypeEditComponent } from './master/payment-type/payment-type-edit/payment-type-edit.component';
import { UserMasterListComponent } from './master/user-master/user-master-list/user-master-list.component';
import { UserMasterAddComponent } from './master/user-master/user-master-add/user-master-add.component';
import { UserMasterEditComponent } from './master/user-master/user-master-edit/user-master-edit.component';
import { ExpenseMasterListComponent } from './master/expense-master/expense-master-list/expense-master-list.component';
import { ExpenseMasterAddComponent } from './master/expense-master/expense-master-add/expense-master-add.component';
import { ExpenseMasterEditComponent } from './master/expense-master/expense-master-edit/expense-master-edit.component';
import { FranchiseListComponent } from './master/franchise/franchise-list/franchise-list.component';
import { FranchiseAddComponent } from './master/franchise/franchise-add/franchise-add.component';
import { FranchiseEditComponent } from './master/franchise/franchise-edit/franchise-edit.component';
import { PosListComponent } from './master/pos/pos-list/pos-list.component';
import { PosAddComponent } from './master/pos/pos-add/pos-add.component';
import { PosEditComponent } from './master/pos/pos-edit/pos-edit.component';
import { BrandListComponent } from './master/brand/brand-list/brand-list.component';
import { BrandAddComponent } from './master/brand/brand-add/brand-add.component';
import { BrandEditComponent } from './master/brand/brand-edit/brand-edit.component';
import { ProductLineListComponent } from './master/product-line/product-line-list/product-line-list.component';
import { ProductLineAddComponent } from './master/product-line/product-line-add/product-line-add.component';
import { ProductLineEditComponent } from './master/product-line/product-line-edit/product-line-edit.component';
import { ProductGroupListComponent } from './master/product-group/product-group-list/product-group-list.component';
import { ProductGroupAddComponent } from './master/product-group/product-group-add/product-group-add.component';
import { ProductGroupEditComponent } from './master/product-group/product-group-edit/product-group-edit.component';
import { SeasonListComponent } from './master/season/season-list/season-list.component';
import { SeasonAddComponent } from './master/season/season-add/season-add.component';
import { SeasonEditComponent } from './master/season/season-edit/season-edit.component';
import { EmployeeAddComponent } from './master/Employee/employee-add/employee-add.component';
import { EmployeeListComponent } from './master/Employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from './master/Employee/employee-edit/employee-edit.component';
import { DivisionListComponent } from './master/division/division-list/division-list.component';
import { DivisionAddComponent } from './master/division/division-add/division-add.component';
import { DivisionEditComponent } from './master/division/division-edit/division-edit.component';
import { YearListComponent } from './master/year/year-list/year-list.component';
import { YearAddComponent } from './master/year/year-add/year-add.component';
import { YearEditComponent } from './master/year/year-edit/year-edit.component';
import { ReasonListComponent } from './master/reason/reason-list/reason-list.component';
import { ReasonAddComponent } from './master/reason/reason-add/reason-add.component';
import { ReasonEditComponent } from './master/reason/reason-edit/reason-edit.component';
import { PriceListListComponent } from './master/price-list/price-list-list/price-list-list.component';
import { PriceListAddComponent } from './master/price-list/price-list-add/price-list-add.component';
import { PriceListEditComponent } from './master/price-list/price-list-edit/price-list-edit.component';
import { CityListComponent } from './master/city/city-list/city-list.component';
import { CityAddComponent } from './master/city/city-add/city-add.component';
import { CityEditComponent } from './master/city/city-edit/city-edit.component';
import { StoreListComponent } from './master/store/store-list/store-list.component';
import { StoreAddComponent } from './master/store/store-add/store-add.component';
import { StoreEditComponent } from './master/store/store-edit/store-edit.component';
import { BarcodeAllComponent } from './master/barcode/barcode-all/barcode-all.component';
import { DesignListComponent } from './master/design/design-list/design-list.component';
import { DesignAddComponent } from './master/design/design-add/design-add.component';
import { DesignEditComponent } from './master/design/design-edit/design-edit.component';
import { MassampleComponent } from './massample/massample.component';
import { StyleSegmentationListComponent } from './master/style-segmentation/style-segmentation-list/style-segmentation-list.component';
import { StyleSegmentationAddComponent } from './master/style-segmentation/style-segmentation-add/style-segmentation-add.component';
import { StyleSegmentationEditComponent } from './master/style-segmentation/style-segmentation-edit/style-segmentation-edit.component';
import { SubCollectionListComponent } from './master/sub-collection/sub-collection-list/sub-collection-list.component';
import { SubCollectionAddComponent } from './master/sub-collection/sub-collection-add/sub-collection-add.component';
import { SubCollectionEditComponent } from './master/sub-collection/sub-collection-edit/sub-collection-edit.component';
import { BrandDivisionMappingListComponent } from './master/brand-division-mapping/brand-division-mapping-list/brand-division-mapping-list.component';
import { BrandDivisionMappingEditComponent } from './master/brand-division-mapping/brand-division-mapping-edit/brand-division-mapping-edit.component';
import { UserPrevilegeListComponent } from './master/user-previlege/user-previlege-list/user-previlege-list.component';
import { UserPrevilegeEditComponent } from './master/user-previlege/user-previlege-edit/user-previlege-edit.component';
import { BarcodeAddComponent } from './master/barcode/barcode-add/barcode-add.component';
import { CurrencyListComponent } from './master/currency-master/currency-list/currency-list.component';
import { CurrencyAddComponent } from './master/currency-master/currency-add/currency-add.component';
import { CurrencyEditComponent } from './master/currency-master/currency-edit/currency-edit.component';
import { SubBrandListComponent } from './master/sub-brand-master/sub-brand-list/sub-brand-list.component';
import { SubBrandAddComponent } from './master/sub-brand-master/sub-brand-add/sub-brand-add.component';
import { SubBrandEditComponent } from './master/sub-brand-master/sub-brand-edit/sub-brand-edit.component';
import { StoreGroupListComponent } from './master/store-group-master/store-group-list/store-group-list.component';
import { StoreGroupAddComponent } from './master/store-group-master/store-group-add/store-group-add.component';
import { StoreGroupEditComponent } from './master/store-group-master/store-group-edit/store-group-edit.component';
import { ExchangeRateListComponent } from './master/exchange-rate-master/exchange-rate-list/exchange-rate-list.component';
import { ExchangeRateAddComponent } from './master/exchange-rate-master/exchange-rate-add/exchange-rate-add.component';
import { ExchangeRateEditComponent } from './master/exchange-rate-master/exchange-rate-edit/exchange-rate-edit.component';
import { DocumentNumberingListComponent } from './master/document-numbering-master/document-numbering-list/document-numbering-list.component';
import { DocumentNumberingAddComponent } from './master/document-numbering-master/document-numbering-add/document-numbering-add.component';
import { DocumentNumberingEditComponent } from './master/document-numbering-master/document-numbering-edit/document-numbering-edit.component';
import { ProductSubgroupListComponent } from './master/product-subgroup/product-subgroup-list/product-subgroup-list.component';
import { ProductSubgroupAddComponent } from './master/product-subgroup/product-subgroup-add/product-subgroup-add.component';
import { ProductSubgroupEditComponent } from './master/product-subgroup/product-subgroup-edit/product-subgroup-edit.component';
import { ShiftListComponent } from './master/shift/shift-list/shift-list.component';
import { ShiftAddComponent } from './master/shift/shift-add/shift-add.component';
import { ShiftEditComponent } from './master/shift/shift-edit/shift-edit.component';
import { ColorListComponent } from './master/color/color-list/color-list.component';
import { ColorAddComponent } from './master/color/color-add/color-add.component';
import { ColorEditComponent } from './master/color/color-edit/color-edit.component';
import { PromotionspriorityListComponent } from './master/promotionspriority/promotionspriority-list/promotionspriority-list.component';
import { ScaleListComponent } from './master/scale-master/scale-list/scale-list.component';
import { ScaleAddComponent } from './master/scale-master/scale-add/scale-add.component';
import { ScaleEditComponent } from './master/scale-master/scale-edit/scale-edit.component';
import { StyleListComponent } from './master/style-master/style-list/style-list.component';
import { StyleAddComponent } from './master/style-master/style-add/style-add.component';
import { StyleEditComponent } from './master/style-master/style-edit/style-edit.component';
import { SkuListComponent } from './master/sku-master/sku-list/sku-list.component';
import { SkuAddComponent } from './master/sku-master/sku-add/sku-add.component';
import { SkuEditComponent } from './master/sku-master/sku-edit/sku-edit.component';
import { PromotionListComponent } from './master/promotion-master/promotion-list/promotion-list.component';
import { PromotionAddComponent } from './master/promotion-master/promotion-add/promotion-add.component';
import { PromotionEditComponent } from './master/promotion-master/promotion-edit/promotion-edit.component';
import { OpeningstockListComponent } from './master/openingstock/openingstock-list/openingstock-list.component';
import { OpeningstockAddComponent } from './master/openingstock/openingstock-add/openingstock-add.component';
import { OpeningstockViewComponent } from './master/openingstock/openingstock-view/openingstock-view.component';
import { StockrequestListComponent } from './master/stockrequest/stockrequest-list/stockrequest-list.component';
import { StockrequestAddComponent } from './master/stockrequest/stockrequest-add/stockrequest-add.component';
import { StockrequestViewComponent } from './master/stockrequest/stockrequest-view/stockrequest-view.component';
import { StockreceiptListComponent } from './master/stockreceipt/stockreceipt-list/stockreceipt-list.component';
import { StockreceiptViewComponent } from './master/stockreceipt/stockreceipt-view/stockreceipt-view.component';
import { StockreturnListComponent } from './master/stockreturn/stockreturn-list/stockreturn-list.component';
import { StockreturnAddComponent } from './master/stockreturn/stockreturn-add/stockreturn-add.component';
import { StockreturnViewComponent } from './master/stockreturn/stockreturn-view/stockreturn-view.component';
import { StockadjustmentListComponent } from './master/stockadjustment/stockadjustment-list/stockadjustment-list.component';
import { StockadjustmentAddComponent } from './master/stockadjustment/stockadjustment-add/stockadjustment-add.component';
import { StockadjustmentViewComponent } from './master/stockadjustment/stockadjustment-view/stockadjustment-view.component';
import { PromotionMappingListComponent } from './master/promotion-mapping-master/promotion-mapping-list/promotion-mapping-list.component';
import { PromotionMappingEditComponent } from './master/promotion-mapping-master/promotion-mapping-edit/promotion-mapping-edit.component';
import { WnpromotionListComponent } from './master/wnpromotion/wnpromotion-list/wnpromotion-list.component';
import { WnpromotionAddComponent } from './master/wnpromotion/wnpromotion-add/wnpromotion-add.component';
import { WnpromotionEditComponent } from './master/wnpromotion/wnpromotion-edit/wnpromotion-edit.component';
import { ManagerLoginComponent } from './manager-login/manager-login.component';
import { NonTradingStockDistributionListComponent } from './master/non-trading-stock-distribution/non-trading-stock-distribution-list/non-trading-stock-distribution-list.component';
import { NonTradingStockDistributionAddComponent } from './master/non-trading-stock-distribution/non-trading-stock-distribution-add/non-trading-stock-distribution-add.component';
import { InventoryCountingListComponent } from './master/inventory-counting/inventory-counting-list/inventory-counting-list.component';
import { InventoryCountingAddComponent } from './master/inventory-counting/inventory-counting-add/inventory-counting-add.component';
import { InventoryCountingViewComponent } from './master/inventory-counting/inventory-counting-view/inventory-counting-view.component';
import { DiscountPopupComponent } from './pos/discount-popup/discount-popup.component';
import { PricePointListComponent } from './master/price-point/price-point-list/price-point-list.component';
import { PricePointAddComponent } from './master/price-point/price-point-add/price-point-add.component';
import { PricePointEditComponent } from './master/price-point/price-point-edit/price-point-edit.component';
import { PriceChangeListComponent } from './master/price-change/price-change-list/price-change-list.component';
import { PriceChangeAddComponent } from './master/price-change/price-change-add/price-change-add.component';
import { PriceChangeEditComponent } from './master/price-change/price-change-edit/price-change-edit.component';
import { QzTryComponent } from './try/qz-try/qz-try.component';
import { BinConfigurationComponent } from './master/bin/bin-configuration/bin-configuration.component';
import { BinConfigurationDetailsComponent } from './master/bin/bin-configuration-details/bin-configuration-details.component';
import { BinStockTransferComponent } from './master/bin/bin-stock-transfer/bin-stock-transfer.component';
import { StyleViewComponent } from './master/style-master/style-view/style-view.component';
import { PricepopupComponent } from './master/pricepopup/pricepopup.component';
import { SkuViewComponent } from './master/sku-master/sku-view/sku-view.component';
import { EmployeeViewComponent } from './master/Employee/employee-view/employee-view.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { DuplicateReceiptComponent } from './pos/duplicate-receipt/duplicate-receipt.component';
import { InvoiceReceiptComponent } from './pos/invoice-receipt/invoice-receipt.component';
import { HoldReceiptComponent } from './pos/hold-receipt/hold-receipt.component';
import { ReturnReceiptComponent } from './pos/return-receipt/return-receipt.component';
// import { XReportComponent } from './pos/x-report/x-report.component';
// import { ZReportComponent } from './pos/z-report/z-report.component';
import { ClosingReportComponent } from './pos/closing-report/closing-report.component';
import { ExchangeReceiptComponent } from './pos/exchange-receipt/exchange-receipt.component';
import { StocktransferComponent } from './master/stocktransfer/stocktransfer.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { PosOneComponent } from './pos/pos-one/pos-one.component';
import { XReportComponent } from './report/x-report/x-report.component';
import{ ZReportComponent} from './report/z-report/z-report.component';
import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';
import { StockReturnReportComponent } from './report/stock-return-report/stock-return-report.component';
import { StockReceiptReportComponent } from './report/stock-receipt-report/stock-receipt-report.component';
import { CouponAddComponent } from './master/coupon/coupon-add/coupon-add.component';
import { CouponMasterAddComponent } from './master/coupon-master/coupon-master-add/coupon-master-add.component';
import { CouponAdd1Component } from './master/coupon1/coupon-add1/coupon-add1.component';
import { CouponEdit1Component } from './master/coupon1/coupon-edit1/coupon-edit1.component';
import { CouponList1Component } from './master/coupon1/coupon-list1/coupon-list1.component';
// import { MCouponMaster } from './models/m-coupon-master.ts/m-coupon-master.ts.component';
import { ComboAddComponent } from './master/combo/combo-add/combo-add.component';
import { ComboListComponent } from './master/combo/combo-list/combo-list.component';
import { ComboViewComponent } from './master/combo/combo-view/combo-view.component';

import { CouponTransferListComponent } from './master/coupon-transfer/coupon-transfer-list/coupon-transfer-list/coupon-transfer-list.component';
import { CouponTransferEditComponent } from './master/coupon-transfer/coupon-transfer-edit/coupon-transfer-edit/coupon-transfer-edit.component';
import { CouponTransferAddComponent } from './master/coupon-transfer/coupon-transfer-add/coupon-transfer-add/coupon-transfer-add.component';
import { CouponReceiptListComponent } from './master/coupon-receipt/coupon-receipt-list/coupon-receipt-list.component';
import { CouponReceiptAddComponent } from './master/coupon-receipt/coupon-receipt-add/coupon-receipt-add.component';
import { CouponReceiptEditComponent } from './master/coupon-receipt/coupon-receipt-edit/coupon-receipt-edit.component';
import { OnaccountPaymentListComponent } from './pos/onaccount-payment/onaccount-payment-list/onaccount-payment-list.component';
import { OnaccountPaymentAddComponent } from './pos/onaccount-payment/onaccount-payment-add/onaccount-payment-add.component';
import { OnaccountPaymentViewComponent } from './pos/onaccount-payment/onaccount-payment-view/onaccount-payment-view.component';
import { CustomerlistPopupComponent } from './pos/onaccount-payment/customerlist-popup/customerlist-popup.component';
import { InventorydocUploadComponent } from './master/inventory-counting/inventorydoc-upload/inventorydoc-upload.component';
import { InventoryCountingApprovalComponent } from './master/inventory-counting/inventory-counting-approval/inventory-counting-approval.component';
import { SearchInvoiceViewComponent } from './pos/search-invoice/search-invoice-view/search-invoice-view.component';
import { SalesReturnReceiptComponent } from './pos/sales-return-receipt/sales-return-receipt.component';
import { StyleLedgerComponent } from './report/style-ledger/style-ledger.component';
import { CashInOutReportComponent } from './report/cash-in-out-report/cash-in-out-report.component';
import { CashierWiseReportComponent } from './report/cashier-wise-report/cashier-wise-report.component';
import { SalesManWiseReportComponent } from './report/sales-man-wise-report/sales-man-wise-report.component';
import { DetailedShowroomSalesReportComponent } from './report/detailed-showroom-sales-report/detailed-showroom-sales-report.component';
import { SalesReturnInvoiceReportComponent } from './report/sales-return-invoice-report/sales-return-invoice-report.component';
import { DetailedSalesInvoiceReportComponent } from './report/detailed-sales-invoice-report/detailed-sales-invoice-report.component';
import { DenominationComponent } from './pos/denomination/denomination.component';
import { SearchdemoComponent } from './master/searchdemo/searchdemo.component';
import { SearchdemosComponent } from './master/searchdemos/searchdemos.component';
import { SearchfilterPipe } from './master/scale-master/searchfilter.pipe';
import { PaymentModeAddComponent } from './master/payment-mode-master/payment-mode-add/payment-mode-add.component';
import { PaymentModeListComponent } from './master/payment-mode-master/payment-mode-list/payment-mode-list.component';
import { PaymentModeEditComponent } from './master/payment-mode-master/payment-mode-edit/payment-mode-edit.component';

import { CouponPopupComponent } from './pos/coupon-popup/coupon-popup.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
  // return new TranslateHttpLoader(http, “./assets/i18n/”, “.json”);
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        OrderComponent,
        ConfirmComponent,
        PosComponent,
        PaymentComponent,
        ReturnComponent,
        ExchangeComponent,
        CustomerAddComponent,
        CustomerEditComponent,
        CustomerViewComponent,
        CompanyListComponent,
        CompanyAddComponent,
        CompanyEditComponent,
        CountryListComponent,
        CountryAddComponent,
        CountryEditComponent,
        ReturnPaymentComponent,
        CustomerListComponent,
        StockComponent,
        FindStockComponent,
        SearchInvoiceComponent,
        ProductSearchComponent,
        DayInOutComponent,
        RecallInvoiceComponent,
        CashInComponent,
        CashOutComponent,
        DayOutComponent,
        SalesOrderListComponent,
        SalesOrderComponent,
        SalesOrderPickComponent,
        TailoringListComponent,
        TailoringAddComponent,
        TailoringEditComponent,
        ManagerOverrideListComponent,
        ManagerOverrideAddComponent,
        ManagerOverrideEditComponent,
        StateAddComponent,
        StateEditComponent,
        StateListComponent,
        CityListComponent,
        CityAddComponent,
        CityEditComponent,
        LanguageListComponent,
        LanguageAddComponent,
        LanguageEditComponent,
        WarehouseTypeEditComponent,
        WarehouseTypeListComponent,
        WarehouseTypeAddComponent,
        WarehouseAddComponent,
        WarehouseEditComponent,
        WarehouseListComponent,
        DesignationListComponent,
        DesignationAddComponent,
        DesignationEditComponent,
        VendorGroupListComponent,
        VendorGroupAddComponent,
        VendorGroupEditComponent,
        VendorListComponent,
        VendorAddComponent,
        VendorEditComponent,
        CustomerGroupListComponent,
        CustomerGroupAddComponent,
        CustomerGroupEditComponent,
        RetailSettingsListComponent,
        RetailSettingsAddComponent,
        RetailSettingsEditComponent,
        StyleStatusListComponent,
        StyleStatusAddComponent,
        StyleStatusEditComponent,
        SegmentationTypeListComponent,
        SegmentationTypeAddComponent,
        SegmentationTypeEditComponent,
        DropMasterListComponent,
        DropMasterAddComponent,
        DropMasterEditComponent,
        PriceTypeListComponent,
        PriceTypeAddComponent,
        PriceTypeEditComponent,
        TaxListComponent,
        TaxAddComponent,
        TaxEditComponent,
        CollectionListComponent,
        CollectionAddComponent,
        CollectionEditComponent,
        AgentListComponent,
        AgentAddComponent,
        AgentEditComponent,
        RoleListComponent,
        RoleAddComponent,
        RoleEditComponent,
        PaymentTypeListComponent,
        PaymentTypeAddComponent,
        PaymentTypeEditComponent,
        UserMasterListComponent,
        UserMasterAddComponent,
        UserMasterEditComponent,
        ExpenseMasterListComponent,
        ExpenseMasterAddComponent,
        ExpenseMasterEditComponent,
        FranchiseListComponent,
        FranchiseAddComponent,
        FranchiseEditComponent,
        PosListComponent,
        PosAddComponent,
        PosEditComponent,
        BrandListComponent,
        BrandAddComponent,
        BrandEditComponent,
        ProductLineListComponent,
        ProductLineAddComponent,
        ProductLineEditComponent,
        ProductGroupListComponent,
        ProductGroupAddComponent,
        ProductGroupEditComponent,
        SeasonListComponent,
        SeasonAddComponent,
        SeasonEditComponent,
        DesignListComponent,
        DesignAddComponent,
        DesignEditComponent,
        EmployeeAddComponent,
        EmployeeEditComponent,
        EmployeeListComponent,
        DivisionListComponent,
        DivisionAddComponent,
        DivisionEditComponent,
        YearListComponent,
        YearAddComponent,
        YearEditComponent,
        ReasonListComponent,
        ReasonAddComponent,
        ReasonEditComponent,
        PriceListListComponent,
        PriceListAddComponent,
        PriceListEditComponent,
        StoreListComponent,
        StoreAddComponent,
        StoreEditComponent,
        BarcodeAllComponent,
        DesignListComponent,
        DesignAddComponent,
        DesignEditComponent,
        MassampleComponent,
        StyleSegmentationListComponent,
        StyleSegmentationAddComponent,
        StyleSegmentationEditComponent,
        SubCollectionListComponent,
        SubCollectionAddComponent,
        SubCollectionEditComponent,
        BrandDivisionMappingListComponent,
        BrandDivisionMappingEditComponent,
        UserPrevilegeListComponent,
        UserPrevilegeEditComponent,
        BarcodeAddComponent,
        CurrencyListComponent,
        CurrencyAddComponent,
        CurrencyEditComponent,
        SubBrandListComponent,
        SubBrandAddComponent,
        SubBrandEditComponent,
        StoreGroupListComponent,
        StoreGroupAddComponent,
        StoreGroupEditComponent,
        ExchangeRateListComponent,
        ExchangeRateAddComponent,
        ExchangeRateEditComponent,
        DocumentNumberingListComponent,
        DocumentNumberingAddComponent,
        DocumentNumberingEditComponent,
        ProductSubgroupListComponent,
        ProductSubgroupAddComponent,
        ProductSubgroupEditComponent,
        ShiftListComponent,
        ShiftAddComponent,
        ShiftEditComponent,
        ColorListComponent,
        ColorAddComponent,
        ColorEditComponent,
        PromotionspriorityListComponent,
        ScaleListComponent,
        ScaleAddComponent,
        ScaleEditComponent,
        StyleListComponent,
        StyleAddComponent,
        StyleEditComponent,
        SkuListComponent,
        SkuAddComponent,
        SkuEditComponent,
        PromotionListComponent,
        PromotionAddComponent,
        PromotionEditComponent,
        OpeningstockListComponent,
        OpeningstockAddComponent,
        OpeningstockViewComponent,
        StockrequestListComponent,
        StockrequestAddComponent,
        StockrequestViewComponent,
        StockreceiptListComponent,
        StockreceiptViewComponent,
        StockreturnListComponent,
        StockreturnAddComponent,
        StockreturnViewComponent,
        StockadjustmentListComponent,
        StockadjustmentAddComponent,
        StockadjustmentViewComponent,
        PromotionMappingListComponent,
        PromotionMappingEditComponent,
        WnpromotionListComponent,
        WnpromotionAddComponent,
        WnpromotionEditComponent,
        ManagerLoginComponent,
        NonTradingStockDistributionListComponent,
        NonTradingStockDistributionAddComponent,
        InventoryCountingListComponent,
        InventoryCountingAddComponent,
        InventoryCountingViewComponent,
        DiscountPopupComponent,
        PricePointListComponent,
        PricePointAddComponent,
        PricePointEditComponent,
        PriceChangeListComponent,
        PriceChangeAddComponent,
        PriceChangeEditComponent,
        QzTryComponent,
        BinConfigurationComponent,
        BinConfigurationDetailsComponent,
        BinStockTransferComponent,
        StyleViewComponent,
        PricepopupComponent,
        SkuViewComponent,
        EmployeeViewComponent,
        ScrollToTopComponent,
        DuplicateReceiptComponent,
        InvoiceReceiptComponent,
        HoldReceiptComponent,
        ReturnReceiptComponent,
        XReportComponent,
        ZReportComponent,
        ClosingReportComponent,
        ExchangeReceiptComponent,
        StocktransferComponent,
        PosOneComponent,
        StockReturnReportComponent,
        StockReceiptReportComponent,
        CouponAddComponent,
        CouponMasterAddComponent,
        CouponAdd1Component,
        CouponEdit1Component,
        CouponList1Component,
        // MCouponMaster.TsComponent
        CouponTransferListComponent,
        CouponTransferEditComponent,
        CouponTransferAddComponent,
        CouponReceiptListComponent,
        CouponReceiptAddComponent,
        CouponReceiptEditComponent,
        OnaccountPaymentListComponent,
        OnaccountPaymentAddComponent,
        OnaccountPaymentViewComponent,
        CustomerlistPopupComponent,
        InventorydocUploadComponent,
        InventoryCountingApprovalComponent,
        ComboAddComponent,
        ComboListComponent,
        ComboViewComponent,
        SearchInvoiceViewComponent,
        SalesReturnReceiptComponent,
        StyleLedgerComponent,
        CashInOutReportComponent,
        CashierWiseReportComponent,
        SalesManWiseReportComponent,
        DetailedShowroomSalesReportComponent,
        SalesReturnInvoiceReportComponent,
        DetailedSalesInvoiceReportComponent,
        DenominationComponent,
        SearchdemoComponent,
        SearchdemosComponent,
        SearchfilterPipe,
        PaymentModeAddComponent,
        PaymentModeListComponent,
        PaymentModeEditComponent,
        SearchfilterPipe,
        CouponPopupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        NgbModule,
        NgxTrimDirectiveModule,
        TableModule,
        NgMultiSelectDropDownModule.forRoot(),
        CommonModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatCarouselModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatListModule,
        Ng2TelInputModule,
        PdfViewerModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        NgxPageScrollCoreModule,
        NgxPageScrollModule,
        NgxChartsModule,
    ],
    providers: [
        CommonService,
        ConfirmService,
        QzTrayService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}


// Encrypt & Decrypt
// npm install crypto-js --save
// npm install @types/crypto-js –-save

// ngx-trim-directive
// npm i -S ngx-trim-directive

// ngx easy table
// npm install ngx-easy-table --save
// npm install @angular/cdk --save


// multi select dropdown
// npm install ng-multiselect-dropdown

// Excel
// npm install xlsx

// Material Modal
// ng add @angular/material

// <<<< QZ Tray 
// npm install qz-tray sha ws
// npm install --save rxjs-compat 
// npm install jsrsasign jsrsasign-util
// npm install rsvp
// QZ Tray >>>>

// <<<< PDF Viewer
// npm install ng2-pdf-viewer --save
// PDF Viewer >>>>

// ,
//               {
//                 "input": "src/assets/css/style-en.css",
//                 "bundleName": "englishStyle",
//                 "inject": true
//               },
//               {
//                 "input": "src/assets/css/style-ar.css",
//                 "bundleName": "arabicStyle",
//                 "inject": true
//               }