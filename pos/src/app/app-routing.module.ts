import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './login/auth-guard.service';
import { QzTryComponent } from './try/qz-try/qz-try.component';
import { OrderComponent } from './fullfillment/order/order.component';
import { PosComponent } from './pos/pos.component';
import { PaymentComponent } from './pos/payment/payment.component';
import { ReturnComponent } from './pos/return/return.component';
import { ExchangeComponent } from './pos/exchange/exchange.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerViewComponent } from './customer/customer-view/customer-view.component';
import { StockComponent } from './pos/stock/stock.component';
import { FindStockComponent } from './pos/find-stock/find-stock.component';
import { SearchInvoiceComponent } from './pos/search-invoice/search-invoice.component';
import { ProductSearchComponent } from './pos/product-search/product-search.component';
import { RecallInvoiceComponent } from './pos/recall-invoice/recall-invoice.component';
import { CashInComponent } from './pos/cash-in/cash-in.component';
import { CashOutComponent } from './pos/cash-out/cash-out.component';
import { DayInOutComponent } from './day-in-out/day-in-out.component';
import { MassampleComponent } from './massample/massample.component';
import { InvoiceReceiptComponent } from './pos/invoice-receipt/invoice-receipt.component';
import { ReturnReceiptComponent } from './pos/return-receipt/return-receipt.component';
import { DuplicateReceiptComponent } from './pos/duplicate-receipt/duplicate-receipt.component';
import { HoldReceiptComponent } from './pos/hold-receipt/hold-receipt.component';
// import { XReportComponent } from './pos/x-report/x-report.component';
// import { ZReportComponent } from './pos/z-report/z-report.component';
import { ExchangeReceiptComponent } from './pos/exchange-receipt/exchange-receipt.component';
import { ClosingReportComponent } from './pos/closing-report/closing-report.component';

import { CompanyListComponent } from './master/company/company-list/company-list.component'
import { CompanyAddComponent } from './master/company/company-add/company-add.component';
import { CompanyEditComponent } from './master/company/company-edit/company-edit.component';
import { CountryListComponent } from './master/country/country-list/country-list.component';
import { CountryAddComponent } from './master/country/country-add/country-add.component';
import { CountryEditComponent } from './master/country/country-edit/country-edit.component';
import { ReturnPaymentComponent } from './pos/return/return-payment/return-payment.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { DayOutComponent } from './day-out/day-out.component';
import { SalesOrderComponent } from './pos/sales-order/sales-order.component';
import { SalesOrderListComponent } from './pos/sales-order-list/sales-order-list.component';
import { SalesOrderPickComponent } from './pos/sales-order-pick/sales-order-pick.component';
import { TailoringListComponent } from './master/tailoring/tailoring-list/tailoring-list.component';
import { TailoringAddComponent } from './master/tailoring/tailoring-add/tailoring-add.component';
import { TailoringEditComponent } from './master/tailoring/tailoring-edit/tailoring-edit.component';
import { ManagerOverrideListComponent } from './master/manager-override/manager-override-list/manager-override-list.component';
import { ManagerOverrideAddComponent } from './master/manager-override/manager-override-add/manager-override-add.component';
import { ManagerOverrideEditComponent } from './master/manager-override/manager-override-edit/manager-override-edit.component';
import { StateListComponent } from './master/state/state-list/state-list.component';
import { StateAddComponent } from './master/state/state-add/state-add.component';
import { StateEditComponent } from './master/state/state-edit/state-edit.component';

import { LanguageListComponent } from './master/language/language-list/language-list.component';
import { LanguageAddComponent } from './master/language/language-add/language-add.component';
import { LanguageEditComponent } from './master/language/language-edit/language-edit.component';
import { WarehouseTypeListComponent } from './master/warehouse-type/warehouse-type-list/warehouse-type-list.component';
import { WarehouseTypeAddComponent } from './master/warehouse-type/warehouse-type-add/warehouse-type-add.component';
import { WarehouseTypeEditComponent } from './master/warehouse-type/warehouse-type-edit/warehouse-type-edit.component';
import { WarehouseListComponent } from './master/warehouse/warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './master/warehouse/warehouse-add/warehouse-add.component';
import { WarehouseEditComponent } from './master/warehouse/warehouse-edit/warehouse-edit.component';
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
import { PaymentTypeEditComponent } from './master/payment-type/payment-type-edit/payment-type-edit.component';
import { PaymentTypeListComponent } from './master/payment-type/payment-type-list/payment-type-list.component';
import { PaymentTypeAddComponent } from './master/payment-type/payment-type-add/payment-type-add.component';
import { UserMasterListComponent } from './master/user-master/user-master-list/user-master-list.component';
import { UserMasterAddComponent } from './master/user-master/user-master-add/user-master-add.component';
import { UserMasterEditComponent } from './master/user-master/user-master-edit/user-master-edit.component';
import { ExpenseMasterListComponent } from './master/expense-master/expense-master-list/expense-master-list.component';
import { ExpenseMasterAddComponent } from './master/expense-master/expense-master-add/expense-master-add.component';
import { ExpenseMasterEditComponent } from './master/expense-master/expense-master-edit/expense-master-edit.component';
import { FranchiseListComponent } from './master/franchise/franchise-list/franchise-list.component';
import { FranchiseAddComponent } from './master/franchise/franchise-add/franchise-add.component';
import { FranchiseEditComponent } from './master/franchise/franchise-edit/franchise-edit.component';
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
import { EmployeeViewComponent } from './master/Employee/employee-view/employee-view.component';
import { EmployeeEditComponent } from './master/Employee/employee-edit/employee-edit.component';
import { DivisionListComponent } from './master/division/division-list/division-list.component';
import { DivisionEditComponent } from './master/division/division-edit/division-edit.component';
import { DivisionAddComponent } from './master/division/division-add/division-add.component';
import { YearListComponent } from './master/year/year-list/year-list.component';
import { YearAddComponent } from './master/year/year-add/year-add.component';
import { YearEditComponent } from './master/year/year-edit/year-edit.component';
import { ReasonListComponent } from './master/reason/reason-list/reason-list.component';
import { ReasonAddComponent } from './master/reason/reason-add/reason-add.component';
import { ReasonEditComponent } from './master/reason/reason-edit/reason-edit.component';
import { PriceListAddComponent } from './master/price-list/price-list-add/price-list-add.component';
import { PriceListListComponent } from './master/price-list/price-list-list/price-list-list.component';
import { PriceListEditComponent } from './master/price-list/price-list-edit/price-list-edit.component';
import { CityListComponent } from './master/city/city-list/city-list.component';
import { CityAddComponent } from './master/city/city-add/city-add.component';
import { CityEditComponent } from './master/city/city-edit/city-edit.component';
import { StoreListComponent } from './master/store/store-list/store-list.component';
import { StoreAddComponent } from './master/store/store-add/store-add.component';
import { StoreEditComponent } from './master/store/store-edit/store-edit.component';
import { BarcodeAllComponent } from './master/barcode/barcode-all/barcode-all.component';
import { BarcodeAddComponent } from './master/barcode/barcode-add/barcode-add.component';
import { DesignListComponent } from './master/design/design-list/design-list.component';
import { DesignAddComponent } from './master/design/design-add/design-add.component';
import { DesignEditComponent } from './master/design/design-edit/design-edit.component';
import { PosListComponent } from './master/pos/pos-list/pos-list.component';
import { PosAddComponent } from './master/pos/pos-add/pos-add.component';
import { PosEditComponent } from './master/pos/pos-edit/pos-edit.component';
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
import { CurrencyListComponent } from './master/currency-master/currency-list/currency-list.component';
import { CurrencyAddComponent } from './master/currency-master/currency-add/currency-add.component';
import { CurrencyEditComponent } from './master/currency-master/currency-edit/currency-edit.component';
import { SubBrandListComponent } from './master/sub-brand-master/sub-brand-list/sub-brand-list.component';
import { SubBrandAddComponent } from './master/sub-brand-master/sub-brand-add/sub-brand-add.component';
import { SubBrandEditComponent } from './master/sub-brand-master/sub-brand-edit/sub-brand-edit.component';
import { DocumentNumberingListComponent } from './master/document-numbering-master/document-numbering-list/document-numbering-list.component';
import { DocumentNumberingAddComponent } from './master/document-numbering-master/document-numbering-add/document-numbering-add.component';
import { DocumentNumberingEditComponent } from './master/document-numbering-master/document-numbering-edit/document-numbering-edit.component';
import { StoreGroupListComponent } from './master/store-group-master/store-group-list/store-group-list.component';
import { StoreGroupAddComponent } from './master/store-group-master/store-group-add/store-group-add.component';
import { StoreGroupEditComponent } from './master/store-group-master/store-group-edit/store-group-edit.component';
import { ExchangeRateAddComponent } from './master/exchange-rate-master/exchange-rate-add/exchange-rate-add.component';
import { ExchangeRateListComponent } from './master/exchange-rate-master/exchange-rate-list/exchange-rate-list.component';
import { ExchangeRateEditComponent } from './master/exchange-rate-master/exchange-rate-edit/exchange-rate-edit.component';
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
import { SkuAddComponent } from './master/sku-master/sku-add/sku-add.component';
import { SkuViewComponent } from './master/sku-master/sku-view/sku-view.component';
import { StyleAddComponent } from './master/style-master/style-add/style-add.component';
import { StyleViewComponent } from './master/style-master/style-view/style-view.component';
import { SkuEditComponent } from './master/sku-master/sku-edit/sku-edit.component';
import { StyleEditComponent } from './master/style-master/style-edit/style-edit.component';
import { SkuListComponent } from './master/sku-master/sku-list/sku-list.component';
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
import { NonTradingStockDistributionListComponent } from './master/non-trading-stock-distribution/non-trading-stock-distribution-list/non-trading-stock-distribution-list.component';
import { NonTradingStockDistributionAddComponent } from './master/non-trading-stock-distribution/non-trading-stock-distribution-add/non-trading-stock-distribution-add.component';
import { InventoryCountingListComponent } from './master/inventory-counting/inventory-counting-list/inventory-counting-list.component';
import { InventoryCountingAddComponent } from './master/inventory-counting/inventory-counting-add/inventory-counting-add.component';
import { InventoryCountingViewComponent } from './master/inventory-counting/inventory-counting-view/inventory-counting-view.component';
import { PricePointListComponent } from './master/price-point/price-point-list/price-point-list.component';
import { PricePointAddComponent } from './master/price-point/price-point-add/price-point-add.component';
import { PricePointEditComponent } from './master/price-point/price-point-edit/price-point-edit.component';
import { PriceChangeListComponent } from './master/price-change/price-change-list/price-change-list.component';
import { PriceChangeAddComponent } from './master/price-change/price-change-add/price-change-add.component';
import { PriceChangeEditComponent } from './master/price-change/price-change-edit/price-change-edit.component';
import { BinConfigurationComponent } from './master/bin/bin-configuration/bin-configuration.component';
import { BinConfigurationDetailsComponent } from './master/bin/bin-configuration-details/bin-configuration-details.component';
import { PricepopupComponent } from './master/pricepopup/pricepopup.component';
import { StocktransferComponent } from './master/stocktransfer/stocktransfer.component';
import { PosOneComponent } from './pos/pos-one/pos-one.component';
import { XReportComponent } from './report/x-report/x-report.component';
import { ZReportComponent } from './report/z-report/z-report.component';
import { StockReturnReportComponent } from './report/stock-return-report/stock-return-report.component';
import { StockReceiptReportComponent } from './report/stock-receipt-report/stock-receipt-report.component';
import {CashierWiseReportComponent } from './report/cashier-wise-report/cashier-wise-report.component';
import{ SalesManWiseReportComponent } from './report/sales-man-wise-report/sales-man-wise-report.component';
import{DetailedShowroomSalesReportComponent} from './report/detailed-showroom-sales-report/detailed-showroom-sales-report.component';
import{ SalesReturnInvoiceReportComponent} from './report/sales-return-invoice-report/sales-return-invoice-report.component';
import { DetailedSalesInvoiceReportComponent } from './report/detailed-sales-invoice-report/detailed-sales-invoice-report.component';
import { CouponAdd1Component } from './master/coupon1/coupon-add1/coupon-add1.component';
import { CouponList1Component } from './master/coupon1/coupon-list1/coupon-list1.component';
import { CouponEdit1Component } from './master/coupon1/coupon-edit1/coupon-edit1.component';
import { ComboAddComponent } from './master/combo/combo-add/combo-add.component';
import { ComboListComponent } from './master/combo/combo-list/combo-list.component';
import { ComboViewComponent } from './master/combo/combo-view/combo-view.component';


import { CouponTransferListComponent } from './master/coupon-transfer/coupon-transfer-list/coupon-transfer-list/coupon-transfer-list.component';
import { CouponTransferAddComponent } from './master/coupon-transfer/coupon-transfer-add/coupon-transfer-add/coupon-transfer-add.component';
import { CouponTransferEditComponent } from './master/coupon-transfer/coupon-transfer-edit/coupon-transfer-edit/coupon-transfer-edit.component';
import { CouponReceiptListComponent } from './master/coupon-receipt/coupon-receipt-list/coupon-receipt-list.component';
import { CouponReceiptAddComponent } from './master/coupon-receipt/coupon-receipt-add/coupon-receipt-add.component';
import { CouponReceiptEditComponent } from './master/coupon-receipt/coupon-receipt-edit/coupon-receipt-edit.component';
import { OnaccountPaymentListComponent } from './pos/onaccount-payment/onaccount-payment-list/onaccount-payment-list.component';
import { OnaccountPaymentAddComponent } from './pos/onaccount-payment/onaccount-payment-add/onaccount-payment-add.component';
import { OnaccountPaymentViewComponent } from './pos/onaccount-payment/onaccount-payment-view/onaccount-payment-view.component';
import { InventorydocUploadComponent } from './master/inventory-counting/inventorydoc-upload/inventorydoc-upload.component';
import { InventoryCountingApprovalComponent } from './master/inventory-counting/inventory-counting-approval/inventory-counting-approval.component';
import { SearchInvoiceViewComponent } from './pos/search-invoice/search-invoice-view/search-invoice-view.component';
import { SalesReturnReceiptComponent } from './pos/sales-return-receipt/sales-return-receipt.component';
import{ StyleLedgerComponent} from './report/style-ledger/style-ledger.component';
import { CashInOutReportComponent } from './report/cash-in-out-report/cash-in-out-report.component';
import { DenominationComponent } from './pos/denomination/denomination.component';
import { SearchdemoComponent } from './master/searchdemo/searchdemo.component';
import { SearchdemosComponent } from './master/searchdemos/searchdemos.component';
import { PaymentModeAddComponent } from './master/payment-mode-master/payment-mode-add/payment-mode-add.component';
import { PaymentModeListComponent } from './master/payment-mode-master/payment-mode-list/payment-mode-list.component';
import { PaymentModeEditComponent } from './master/payment-mode-master/payment-mode-edit/payment-mode-edit.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuardService] },
  { path: 'qz', component: QzTryComponent, canActivate: [AuthGuardService] },
  { path: 'pos', component: PosComponent, canActivate: [AuthGuardService] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuardService] },
  { path: 'return', component: ReturnComponent, canActivate: [AuthGuardService] },
  { path: 'exchange', component: ExchangeComponent, canActivate: [AuthGuardService] },
  { path: 'CustomerAdd', component: CustomerAddComponent, canActivate: [AuthGuardService] },
  { path: 'CustomerEdit/:id', component: CustomerEditComponent, canActivate: [AuthGuardService] },
  { path: 'CustomerView/:id', component: CustomerViewComponent, canActivate: [AuthGuardService] },
  { path: 'Customer', component: CustomerListComponent, canActivate: [AuthGuardService] },
  { path: 'massample', component: MassampleComponent, canActivate: [AuthGuardService] },


  { path: 'Company', component: CompanyListComponent, canActivate: [AuthGuardService] },
  { path: 'Companyadd', component: CompanyAddComponent, canActivate: [AuthGuardService] },
  { path: 'CompanyEdit/:id', component: CompanyEditComponent, canActivate: [AuthGuardService] },
  { path: 'Country', component: CountryListComponent, canActivate: [AuthGuardService] },
  { path: 'CountryAdd', component: CountryAddComponent, canActivate: [AuthGuardService] },
  { path: 'CountryEdit/:id', component: CountryEditComponent, canActivate: [AuthGuardService] },
  { path: 'returnPayment', component: ReturnPaymentComponent, canActivate: [AuthGuardService] },
  { path: 'stock', component: StockComponent, canActivate: [AuthGuardService] },
  { path: 'findStock', component: FindStockComponent, canActivate: [AuthGuardService] },
  { path: 'searchInvoice', component: SearchInvoiceComponent, canActivate: [AuthGuardService] },
  { path: 'productSearch', component: ProductSearchComponent, canActivate: [AuthGuardService] },
  { path: 'recall-invoice', component: RecallInvoiceComponent, canActivate: [AuthGuardService] },
  { path: 'cash-in', component: CashInComponent, canActivate: [AuthGuardService] },
  { path: 'cash-out', component: CashOutComponent, canActivate: [AuthGuardService] },
  { path: 'day-in-out', component: DayInOutComponent, canActivate: [AuthGuardService] },
  { path: 'shiftout', component: DayOutComponent, canActivate: [AuthGuardService] },
  { path: 'sales-order', component: SalesOrderComponent, canActivate: [AuthGuardService] },
  { path: 'sales-order-list', component: SalesOrderListComponent, canActivate: [AuthGuardService] },
  { path: 'sales-order-pick/:id', component: SalesOrderPickComponent, canActivate: [AuthGuardService] },
  { path: 'tailoring', component: TailoringListComponent, canActivate: [AuthGuardService] },
  { path: 'tailoring-add', component: TailoringAddComponent, canActivate: [AuthGuardService] },
  { path: 'tailoring-edit/:id', component: TailoringEditComponent, canActivate: [AuthGuardService] },
  { path: 'manager-override', component: ManagerOverrideListComponent, canActivate: [AuthGuardService] },
  { path: 'manager-override-add', component: ManagerOverrideAddComponent, canActivate: [AuthGuardService] },
  { path: 'manager-override-edit/:id', component: ManagerOverrideEditComponent, canActivate: [AuthGuardService] },
  { path: 'state', component: StateListComponent, canActivate: [AuthGuardService] },
  { path: 'state-add', component: StateAddComponent, canActivate: [AuthGuardService] },
  { path: 'state-edit/:id', component: StateEditComponent, canActivate: [AuthGuardService] },
  { path: 'city', component: CityListComponent, canActivate: [AuthGuardService] },
  { path: 'city-add', component: CityAddComponent, canActivate: [AuthGuardService] },
  { path: 'city-edit/:id', component: CityEditComponent, canActivate: [AuthGuardService] },
  { path: 'language', component: LanguageListComponent, canActivate: [AuthGuardService] },
  { path: 'language-add', component: LanguageAddComponent, canActivate: [AuthGuardService] },
  { path: 'language-edit/:id', component: LanguageEditComponent, canActivate: [AuthGuardService] },
  { path: 'warehouse-type', component: WarehouseTypeListComponent, canActivate: [AuthGuardService] },
  { path: 'warehouse-type-add', component: WarehouseTypeAddComponent, canActivate: [AuthGuardService] },
  { path: 'warehouse-type-edit/:id', component: WarehouseTypeEditComponent, canActivate: [AuthGuardService] },
  { path: 'warehouse', component: WarehouseListComponent, canActivate: [AuthGuardService] },
  { path: 'warehouse-add', component: WarehouseAddComponent, canActivate: [AuthGuardService] },
  { path: 'warehouse-edit/:id', component: WarehouseEditComponent, canActivate: [AuthGuardService] },
  { path: 'designation', component: DesignationListComponent, canActivate: [AuthGuardService] },
  { path: 'designation-add', component: DesignationAddComponent, canActivate: [AuthGuardService] },
  { path: 'designation-edit/:id', component: DesignationEditComponent, canActivate: [AuthGuardService] },
  { path: 'vendor-group', component: VendorGroupListComponent, canActivate: [AuthGuardService] },
  { path: 'vendor-group-add', component: VendorGroupAddComponent, canActivate: [AuthGuardService] },
  { path: 'vendor-group-edit/:id', component: VendorGroupEditComponent, canActivate: [AuthGuardService] },
  { path: 'vendor', component: VendorListComponent, canActivate: [AuthGuardService] },
  { path: 'vendor-add', component: VendorAddComponent, canActivate: [AuthGuardService] },
  { path: 'vendor-edit/:id', component: VendorEditComponent, canActivate: [AuthGuardService] },
  { path: 'customer-group', component: CustomerGroupListComponent, canActivate: [AuthGuardService] },
  { path: 'customer-group-add', component: CustomerGroupAddComponent, canActivate: [AuthGuardService] },
  { path: 'customer-group-edit/:id', component: CustomerGroupEditComponent, canActivate: [AuthGuardService] },
  { path: 'retail-settings', component: RetailSettingsListComponent, canActivate: [AuthGuardService] },
  { path: 'retail-settings-add', component: RetailSettingsAddComponent, canActivate: [AuthGuardService] },
  { path: 'retail-settings-edit/:id', component: RetailSettingsEditComponent, canActivate: [AuthGuardService] },
  { path: 'style-status', component: StyleStatusListComponent, canActivate: [AuthGuardService] },
  { path: 'style-status-add', component: StyleStatusAddComponent, canActivate: [AuthGuardService] },
  { path: 'style-status-edit/:id', component: StyleStatusEditComponent, canActivate: [AuthGuardService] },
  { path: 'segmentation-type', component: SegmentationTypeListComponent, canActivate: [AuthGuardService] },
  { path: 'segmentation-type-add', component: SegmentationTypeAddComponent, canActivate: [AuthGuardService] },
  { path: 'segmentation-type-edit/:id', component: SegmentationTypeEditComponent, canActivate: [AuthGuardService] },
  { path: 'drop-master', component: DropMasterListComponent, canActivate: [AuthGuardService] },
  { path: 'drop-master-add', component: DropMasterAddComponent, canActivate: [AuthGuardService] },
  { path: 'drop-master-edit/:id', component: DropMasterEditComponent, canActivate: [AuthGuardService] },
  { path: 'price-type', component: PriceTypeListComponent, canActivate: [AuthGuardService] },
  { path: 'price-type-add', component: PriceTypeAddComponent, canActivate: [AuthGuardService] },
  { path: 'price-type-edit/:id', component: PriceTypeEditComponent, canActivate: [AuthGuardService] },
  { path: 'tax', component: TaxListComponent, canActivate: [AuthGuardService] },
  { path: 'tax-add', component: TaxAddComponent, canActivate: [AuthGuardService] },
  { path: 'tax-edit/:id', component: TaxEditComponent, canActivate: [AuthGuardService] },
  { path: 'collection', component: CollectionListComponent, canActivate: [AuthGuardService] },
  { path: 'collection-add', component: CollectionAddComponent, canActivate: [AuthGuardService] },
  { path: 'collection-edit/:id', component: CollectionEditComponent, canActivate: [AuthGuardService] },
  { path: 'agent', component: AgentListComponent, canActivate: [AuthGuardService] },
  { path: 'agent-add', component: AgentAddComponent, canActivate: [AuthGuardService] },
  { path: 'agent-edit/:id', component: AgentEditComponent, canActivate: [AuthGuardService] },
  { path: 'role', component: RoleListComponent, canActivate: [AuthGuardService] },
  { path: 'role-add', component: RoleAddComponent, canActivate: [AuthGuardService] },
  { path: 'role-edit/:id', component: RoleEditComponent, canActivate: [AuthGuardService] },
  { path: 'payment-type', component: PaymentTypeListComponent, canActivate: [AuthGuardService] },
  { path: 'payment-type-add', component: PaymentTypeAddComponent, canActivate: [AuthGuardService] },
  { path: 'payment-type-edit/:id', component: PaymentTypeEditComponent, canActivate: [AuthGuardService] },
  { path: 'user-master', component: UserMasterListComponent, canActivate: [AuthGuardService] },
  { path: 'user-master-add', component: UserMasterAddComponent, canActivate: [AuthGuardService] },
  { path: 'user-master-edit/:id', component: UserMasterEditComponent, canActivate: [AuthGuardService] },
  { path: 'expense-master', component: ExpenseMasterListComponent, canActivate: [AuthGuardService] },
  { path: 'expense-master-add', component: ExpenseMasterAddComponent, canActivate: [AuthGuardService] },
  { path: 'expense-master-edit/:id', component: ExpenseMasterEditComponent, canActivate: [AuthGuardService] },
  { path: 'franchise', component: FranchiseListComponent, canActivate: [AuthGuardService] },
  { path: 'franchise-add', component: FranchiseAddComponent, canActivate: [AuthGuardService] },
  { path: 'franchise-edit/:id', component: FranchiseEditComponent, canActivate: [AuthGuardService] },
  { path: 'brand', component: BrandListComponent, canActivate: [AuthGuardService] },
  { path: 'brand-add', component: BrandAddComponent, canActivate: [AuthGuardService] },
  { path: 'brand-edit/:id', component: BrandEditComponent, canActivate: [AuthGuardService] },
  { path: 'product-line', component: ProductLineListComponent, canActivate: [AuthGuardService] },
  { path: 'product-line-add', component: ProductLineAddComponent, canActivate: [AuthGuardService] },
  { path: 'product-line-edit/:id', component: ProductLineEditComponent, canActivate: [AuthGuardService] },
  { path: 'product-group', component: ProductGroupListComponent, canActivate: [AuthGuardService] },
  { path: 'product-group-add', component: ProductGroupAddComponent, canActivate: [AuthGuardService] },
  { path: 'product-group-edit/:id', component: ProductGroupEditComponent, canActivate: [AuthGuardService] },
  { path: 'season', component: SeasonListComponent, canActivate: [AuthGuardService] },
  { path: 'season-add', component: SeasonAddComponent, canActivate: [AuthGuardService] },
  { path: 'season-edit/:id', component: SeasonEditComponent, canActivate: [AuthGuardService] },
  { path: 'design', component: DesignListComponent, canActivate: [AuthGuardService] },
  { path: 'design-add', component: DesignAddComponent, canActivate: [AuthGuardService] },
  { path: 'design-edit/:id', component: DesignEditComponent, canActivate: [AuthGuardService] },
  { path: 'EmployeeAdd', component: EmployeeAddComponent, canActivate: [AuthGuardService] },
  { path: 'EmployeeView', component: EmployeeViewComponent, canActivate: [AuthGuardService] },
  { path: 'EmployeeEdit/:id', component: EmployeeEditComponent, canActivate: [AuthGuardService] },
  { path: 'EmployeeView/:id', component: EmployeeViewComponent, canActivate: [AuthGuardService] },
  { path: 'Employee', component: EmployeeListComponent, canActivate: [AuthGuardService] },
  { path: 'division', component: DivisionListComponent, canActivate: [AuthGuardService] },
  { path: 'division-add', component: DivisionAddComponent, canActivate: [AuthGuardService] },
  { path: 'division-edit/:id', component: DivisionEditComponent, canActivate: [AuthGuardService] },
  { path: 'year', component: YearListComponent, canActivate: [AuthGuardService] },
  { path: 'year-add', component: YearAddComponent, canActivate: [AuthGuardService] },
  { path: 'year-edit/:id', component: YearEditComponent, canActivate: [AuthGuardService] },
  { path: 'reason', component: ReasonListComponent, canActivate: [AuthGuardService] },
  { path: 'reason-add', component: ReasonAddComponent, canActivate: [AuthGuardService] },
  { path: 'reason-edit/:id', component: ReasonEditComponent, canActivate: [AuthGuardService] },
  { path: 'price-list', component: PriceListListComponent, canActivate: [AuthGuardService] },
  { path: 'price-list-add', component: PriceListAddComponent, canActivate: [AuthGuardService] },
  { path: 'price-list-edit/:id', component: PriceListEditComponent, canActivate: [AuthGuardService] },
  { path: 'store', component: StoreListComponent, canActivate: [AuthGuardService] },
  { path: 'store-add', component: StoreAddComponent, canActivate: [AuthGuardService] },
  { path: 'store-edit/:id', component: StoreEditComponent, canActivate: [AuthGuardService] },
  { path: 'barcode', component: BarcodeAllComponent, canActivate: [AuthGuardService] },
  { path: 'barcode-add', component: BarcodeAddComponent, canActivate: [AuthGuardService] },
  { path: 'barcode-add/:id', component: BarcodeAddComponent, canActivate: [AuthGuardService] },
  { path: 'design', component: DesignListComponent, canActivate: [AuthGuardService] },
  { path: 'design-add', component: DesignAddComponent, canActivate: [AuthGuardService] },
  { path: 'design-edit/:id', component: DesignEditComponent, canActivate: [AuthGuardService] },
  { path: 'pos-list', component: PosListComponent, canActivate: [AuthGuardService] },
  { path: 'pos-add', component: PosAddComponent, canActivate: [AuthGuardService] },
  { path: 'pos-edit/:id', component: PosEditComponent, canActivate: [AuthGuardService] },
  { path: 'style-segmentation', component: StyleSegmentationListComponent, canActivate: [AuthGuardService] },
  { path: 'style-segmentation-add', component: StyleSegmentationAddComponent, canActivate: [AuthGuardService] },
  { path: 'style-segmentation-edit/:id', component: StyleSegmentationEditComponent, canActivate: [AuthGuardService] },
  { path: 'sub-collection', component: SubCollectionListComponent, canActivate: [AuthGuardService] },
  { path: 'sub-collection-add', component: SubCollectionAddComponent, canActivate: [AuthGuardService] },
  { path: 'sub-collection-edit/:id', component: SubCollectionEditComponent, canActivate: [AuthGuardService] },
  { path: 'brand-division-mapping', component: BrandDivisionMappingListComponent, canActivate: [AuthGuardService] },
  { path: 'brand-division-mapping-edit/:id', component: BrandDivisionMappingEditComponent, canActivate: [AuthGuardService] },
  { path: 'user-previlege', component: UserPrevilegeListComponent, canActivate: [AuthGuardService] },
  { path: 'user-previlege-edit/:id', component: UserPrevilegeEditComponent, canActivate: [AuthGuardService] },
  { path: 'currency', component: CurrencyListComponent, canActivate: [AuthGuardService] },
  { path: 'currency-add', component: CurrencyAddComponent, canActivate: [AuthGuardService] },
  { path: 'currency-edit/:id', component: CurrencyEditComponent, canActivate: [AuthGuardService] },
  { path: 'sub-brand', component: SubBrandListComponent, canActivate: [AuthGuardService] },
  { path: 'sub-brand-add', component: SubBrandAddComponent, canActivate: [AuthGuardService] },
  { path: 'sub-brand-edit/:id', component: SubBrandEditComponent, canActivate: [AuthGuardService] },
  { path: 'document-numbering', component: DocumentNumberingListComponent, canActivate: [AuthGuardService] },
  { path: 'document-numbering-add', component: DocumentNumberingAddComponent, canActivate: [AuthGuardService] },
  { path: 'document-numbering-edit/:id', component: DocumentNumberingEditComponent, canActivate: [AuthGuardService] },
  { path: 'store-group', component: StoreGroupListComponent, canActivate: [AuthGuardService] },
  { path: 'store-group-add', component: StoreGroupAddComponent, canActivate: [AuthGuardService] },
  { path: 'store-group-edit/:id', component: StoreGroupEditComponent, canActivate: [AuthGuardService] },
  { path: 'exchange-rate', component: ExchangeRateListComponent, canActivate: [AuthGuardService] },
  { path: 'exchange-rate-add', component: ExchangeRateAddComponent, canActivate: [AuthGuardService] },
  { path: 'exchange-rate-edit/:id', component: ExchangeRateEditComponent, canActivate: [AuthGuardService] },
  { path: 'product-subgroup', component: ProductSubgroupListComponent, canActivate: [AuthGuardService] },
  { path: 'product-subgroup-add', component: ProductSubgroupAddComponent, canActivate: [AuthGuardService] },
  { path: 'product-subgroup-edit/:id', component: ProductSubgroupEditComponent, canActivate: [AuthGuardService] },
  { path: 'shift', component: ShiftListComponent, canActivate: [AuthGuardService] },
  { path: 'shift-add', component: ShiftAddComponent, canActivate: [AuthGuardService] },
  { path: 'shift-edit/:id', component: ShiftEditComponent, canActivate: [AuthGuardService] },
  { path: 'color', component: ColorListComponent, canActivate: [AuthGuardService] },
  { path: 'color-add', component: ColorAddComponent, canActivate: [AuthGuardService] },
  { path: 'color-edit/:id', component: ColorEditComponent, canActivate: [AuthGuardService] },
  { path: 'promotionspriority', component: PromotionspriorityListComponent, canActivate: [AuthGuardService] },
  { path: 'scale', component: ScaleListComponent, canActivate: [AuthGuardService] },
  { path: 'scale-add', component: ScaleAddComponent, canActivate: [AuthGuardService] },
  { path: 'scale-edit/:id', component: ScaleEditComponent, canActivate: [AuthGuardService] },
  { path: 'style', component: StyleListComponent, canActivate: [AuthGuardService] },
  { path: 'style-add', component: StyleAddComponent, canActivate: [AuthGuardService] },
  { path: 'style-view/:id', component: StyleViewComponent, canActivate: [AuthGuardService] },
  { path: 'style-edit/:id', component: StyleEditComponent, canActivate: [AuthGuardService] },
  { path: 'sku-master', component: SkuListComponent, canActivate: [AuthGuardService] },
  { path: 'sku-master-add', component: SkuAddComponent, canActivate: [AuthGuardService] },
  { path: 'sku-master-view/:id', component: SkuViewComponent, canActivate: [AuthGuardService] },
  { path: 'sku-master-edit/:id', component: SkuEditComponent, canActivate: [AuthGuardService] },
  { path: 'promotion', component: PromotionListComponent, canActivate: [AuthGuardService] },
  { path: 'promotion-add', component: PromotionAddComponent, canActivate: [AuthGuardService] },
  { path: 'promotion-edit/:id', component: PromotionEditComponent, canActivate: [AuthGuardService] },
  { path: 'openingstock', component: OpeningstockListComponent, canActivate: [AuthGuardService] },
  { path: 'openingstock-add', component: OpeningstockAddComponent, canActivate: [AuthGuardService] },
  { path: 'openingstock-view/:id', component: OpeningstockViewComponent, canActivate: [AuthGuardService] },
  { path: 'stockrequest', component: StockrequestListComponent, canActivate: [AuthGuardService] },
  { path: 'stockrequest-add', component: StockrequestAddComponent, canActivate: [AuthGuardService] },
  { path: 'stockrequest-view/:id', component: StockrequestViewComponent, canActivate: [AuthGuardService] },
  { path: 'stockreceipt', component: StockreceiptListComponent, canActivate: [AuthGuardService] },
  { path: 'stockreceipt-view/:id', component: StockreceiptViewComponent, canActivate: [AuthGuardService] },
  { path: 'stockreturn', component: StockreturnListComponent, canActivate: [AuthGuardService] },
  { path: 'stockreturn-add', component: StockreturnAddComponent, canActivate: [AuthGuardService] },
  { path: 'stockreturn-view/:id', component: StockreturnViewComponent, canActivate: [AuthGuardService] },
  { path: 'stockadjustment', component: StockadjustmentListComponent, canActivate: [AuthGuardService] },
  { path: 'stockadjustment-add', component: StockadjustmentAddComponent, canActivate: [AuthGuardService] },
  { path: 'stockadjustment-view/:id', component: StockadjustmentViewComponent, canActivate: [AuthGuardService] },
  { path: 'promotion-mapping', component: PromotionMappingListComponent, canActivate: [AuthGuardService] },
  { path: 'promotion-mapping-edit/:id', component: PromotionMappingEditComponent, canActivate: [AuthGuardService] },
  { path: 'WNPromotions', component: WnpromotionListComponent, canActivate: [AuthGuardService] },
  { path: 'WNPromotions-add', component: WnpromotionAddComponent, canActivate: [AuthGuardService] },
  { path: 'WNPromotions-edit/:id', component: WnpromotionEditComponent, canActivate: [AuthGuardService] },
  { path: 'non-trading-stock-distribution', component: NonTradingStockDistributionListComponent, canActivate: [AuthGuardService] },
  { path: 'non-trading-stock-distribution-add', component: NonTradingStockDistributionAddComponent, canActivate: [AuthGuardService] },
  { path: 'inventory-counting', component: InventoryCountingListComponent, canActivate: [AuthGuardService] },
  { path: 'inventory-counting-add', component: InventoryCountingAddComponent, canActivate: [AuthGuardService] },
  { path: 'inventory-counting-view/:id', component: InventoryCountingViewComponent, canActivate: [AuthGuardService] },
  { path: 'price-point', component: PricePointListComponent, canActivate: [AuthGuardService] },
  { path: 'price-point-add', component: PricePointAddComponent, canActivate: [AuthGuardService] },
  { path: 'price-point-edit/:id', component: PricePointEditComponent, canActivate: [AuthGuardService] },
  { path: 'price-change', component: PriceChangeListComponent, canActivate: [AuthGuardService] },
  { path: 'price-change-add', component: PriceChangeAddComponent, canActivate: [AuthGuardService] },
  { path: 'price-change-edit/:id', component: PriceChangeEditComponent, canActivate: [AuthGuardService] },
  { path: 'bin-config', component: BinConfigurationComponent, canActivate: [AuthGuardService] },
  { path: 'bin-config-detail', component: BinConfigurationDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'pricepopup', component: PricepopupComponent, canActivate: [AuthGuardService] },
  { path: 'invoice-receipt', component: InvoiceReceiptComponent, canActivate: [AuthGuardService] },
  { path: 'return-receipt', component: ReturnReceiptComponent, canActivate: [AuthGuardService] },
  { path: 'duplicate-receipt', component: DuplicateReceiptComponent, canActivate: [AuthGuardService] },
  { path: 'hold-receipt', component: HoldReceiptComponent, canActivate: [AuthGuardService] },
  // { path: 'x-report', component: XReportComponent, canActivate:[AuthGuardService]},
  // { path: 'z-report', component: ZReportComponent, canActivate:[AuthGuardService]},
  { path: 'exchange-receipt', component: ExchangeReceiptComponent, canActivate: [AuthGuardService] },
  { path: 'closing-report', component: ClosingReportComponent, canActivate: [AuthGuardService] },
  { path: 'bintransfer', component: StocktransferComponent, canActivate: [AuthGuardService] },
  { path: 'pos-one', component: PosOneComponent, canActivate: [AuthGuardService] },
  { path: 'x-report', component: XReportComponent, canActivate: [AuthGuardService] },
  { path: 'z-report', component: ZReportComponent, canActivate: [AuthGuardService] },
  { path: 'stock-return-report', component: StockReturnReportComponent, canActivate: [AuthGuardService] },
  { path: 'stock-receipt-report', component: StockReceiptReportComponent, canActivate: [AuthGuardService] },
  { path: 'coupon-add1', component: CouponAdd1Component, canActivate: [AuthGuardService] },
  { path: 'coupon-list', component: CouponList1Component, canActivate: [AuthGuardService] },
  { path: 'coupon-edit1/:id', component: CouponEdit1Component, canActivate: [AuthGuardService] },
  { path: 'coupon-transfer', component: CouponTransferListComponent, canActivate: [AuthGuardService] },
  { path: 'coupon-transfer-add', component: CouponTransferAddComponent, canActivate: [AuthGuardService] },
  { path: 'coupon-transfer-edit/:id', component: CouponTransferEditComponent, canActivate: [AuthGuardService] },
  { path: 'coupon-receipt', component: CouponReceiptListComponent, canActivate: [AuthGuardService] },
  { path: 'coupon-receipt-add', component: CouponReceiptAddComponent, canActivate: [AuthGuardService] },
  { path: 'coupon-receipt-edit/:id', component: CouponReceiptEditComponent, canActivate: [AuthGuardService] },
  { path: 'onaccount-payment', component: OnaccountPaymentListComponent, canActivate: [AuthGuardService] },
  { path: 'onaccount-payment-add', component: OnaccountPaymentAddComponent, canActivate: [AuthGuardService] },
  { path: 'onaccount-payment-view/:id', component: OnaccountPaymentViewComponent, canActivate: [AuthGuardService] },
  { path: 'inventory-counting-docUpload', component: InventorydocUploadComponent, canActivate: [AuthGuardService] },
  { path: 'inventory-counting-approval', component: InventoryCountingApprovalComponent, canActivate: [AuthGuardService] },
  { path: 'combo-add', component: ComboAddComponent, canActivate: [AuthGuardService] },
  { path: 'combo-list', component: ComboListComponent, canActivate: [AuthGuardService] },
  { path: 'combo-edit/:id', component: ComboViewComponent, canActivate: [AuthGuardService] },
  { path: 'searchinvoice-view/:id', component:SearchInvoiceViewComponent, canActivate: [AuthGuardService] },
  { path: 'salesreturnreceipt', component:SalesReturnReceiptComponent, canActivate: [AuthGuardService] },
  { path: 'style-ledger', component: StyleLedgerComponent, canActivate: [AuthGuardService] },
  { path: 'Cash-In-Out-Report', component: CashInOutReportComponent, canActivate: [AuthGuardService] },
  { path:'cashier-wise-report',component:CashierWiseReportComponent ,canActivate:[AuthGuardService]},
  { path:'sales-man-wise-report',component:SalesManWiseReportComponent ,canActivate:[AuthGuardService]},
  { path:'detailed-showroom-sales-report',component:DetailedShowroomSalesReportComponent ,canActivate:[AuthGuardService]},
  { path:'sales-return-invoice-report',component:SalesReturnInvoiceReportComponent ,canActivate:[AuthGuardService]},
  { path:'sales-invoice-report',component:DetailedSalesInvoiceReportComponent ,canActivate:[AuthGuardService]},
  { path:'denomination',component:DenominationComponent ,canActivate:[AuthGuardService]},
  {path:'search-demo',component:SearchdemoComponent,canActivate:[AuthGuardService]},
  {path:'search-demos',component:SearchdemosComponent,canActivate:[AuthGuardService]},
  { path: 'payment-mode-add', component: PaymentModeAddComponent, canActivate: [AuthGuardService] },
  { path: 'payment-mode-master', component: PaymentModeListComponent, canActivate: [AuthGuardService] },
  { path: 'payment-mode-edit/:id', component: PaymentModeEditComponent, canActivate: [AuthGuardService] }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
