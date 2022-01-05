import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MPosMaster } from 'src/app/models/m-pos-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MDesignMaster } from 'src/app/models/m-design-master';
import { MEmployeeMaster } from 'src/app/models/m-employee-master';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-design-add',
  templateUrl: './design-add.component.html',
  styleUrls: ['./design-add.component.css']
})
export class DesignAddComponent implements OnInit {
  myForm: FormGroup;
  json: Array<any>;
  design: MDesignMaster;
  season_list: Array<any>;
  seasonCode: string;
  drop_list: Array<any>;
  dropCode: string;
  collection_list: Array<any>;
  collectionCode: string;
  subcollection_list: Array<any>;
  subcollectionCode: string;
  brand_list: Array<any>;
  brandCode: string;
  productgroup_list: Array<any>;
  productgroupCode: string;
  productline_list: Array<any>;
  productlineCode: string;
  stylestatus_list: Array<any>;
  stylestatusCode: string;
  year_list: Array<any>;
  yearCode: string;
  developmentoffice_list: Array<any>;
  developmentofficeCode: string;
  designer_list: Array<MEmployeeMaster>;
  designerCode: string;
  division_list: Array<any>;
  divisionCode: string;
  brandDropdownSettings: IDropdownSettings = {};
  SubCollectionDropdownSettings: IDropdownSettings={};
  CollectionDropdownSettings: IDropdownSettings={};
  ProductGroupDropdownSettings:IDropdownSettings={};
  selectedProductgroupcodeList=[];
  selectedCollectionList=[];
  selectedSubCollectionList=[];
  selectedBrandList = [];
  closeDropdownSelection=false;
  closeDropdownSelection1=false;
  closeDropdownSelection2=false;
  closeDropdownSelection3=false;
  productgroupid:number;

  disabled=false;
  collectionid:number;
  brandid:number;
  subCollectionID:number;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {

    this.myForm = this.fb.group({
      designCode: [''],
      designName: ['', Validators.required],
      description: [''],
      gradeID: ['', Validators.required],
      seasonID: ['', Validators.required],
      dropID: ['', Validators.required],
      collectionID: ['', Validators.required],
      subcollectionID: ['', Validators.required],
      shortdesigncode: [''],
      brandID: ['', Validators.required],
      productgroupID: ['', Validators.required],
      productlineID: ['', Validators.required],
      stylestatusID: ['', Validators.required],
      yearID: ['', Validators.required],
      shortdescription: ['', Validators.required],
      developmentofficeID: [''],
      symbolgroup: ['', Validators.required],
      composition: ['', Validators.required],
      designerID: ['', Validators.required],
      divisionID: ['', Validators.required],
      remarks: [''],
      active: [true]
    });
    this.getSeason();
    this.getDrop();
    this.getCollection();
    //this.getSubCollection();
    this.getBrand();
    this.getProductgroup();
    this.getProductline();
    this.getStyleStatus();
    this.getYear();
    this.getDevelopmentOffice();
    this.getDivision();
    this.getDesigner();
    this.clear_controls();
  }
  clear_controls() {
    this.design = new MDesignMaster();
    this.myForm.get('designCode').setValue('');
    this.myForm.get('designName').setValue('');
    this.myForm.get('description').setValue('');
    this.myForm.get('seasonID').setValue('');
    this.myForm.get('dropID').setValue('');
    this.myForm.get('collectionID').setValue('');
    this.myForm.get('subcollectionID').setValue('');
    this.myForm.get('gradeID').setValue('');
    this.myForm.get('brandID').setValue('');
    this.myForm.get('productgroupID').setValue('');
    this.myForm.get('productlineID').setValue('');
    this.myForm.get('stylestatusID').setValue('');
    this.myForm.get('yearID').setValue('');
    this.myForm.get('shortdescription').setValue('');
    this.myForm.get('developmentofficeID').setValue('');
    this.myForm.get('symbolgroup').setValue('');
    this.myForm.get('composition').setValue('');
    this.myForm.get('designerID').setValue('');
    this.myForm.get('divisionID').setValue('');
    this.myForm.get('remarks').setValue('');
    this.myForm.get('active').setValue('');
    this.myForm.get('shortdescription').setValue('');
    this.myForm.get('shortdesigncode').setValue('');
	
	
    this.myForm.get('active').setValue(true);
    this.subcollection_list = null;
    this.seasonCode = null;
    this.dropCode = null;
    this.collectionCode = null;
    this.subcollectionCode = null;
  }
  ngOnInit() {

  }
  quickadd_design() {
    if (this.design == null) {
      this.common.showMessage("warn", "Can not Save, Design Data is invalid.");
    }
  
    else {
      this.design.id = 0;
      this.design.designCode = this.myForm.get('designCode').value;
      this.design.designName = this.myForm.get('designName').value;
      this.design.description = this.myForm.get('description').value;
      this.design.seasonID = this.myForm.get('seasonID').value;
      this.design.dropID = this.myForm.get('dropID').value;
      this.design.collectionID = this.collectionid;
      this.design.subCollectionID = this.subCollectionID;
      this.design.grade = this.myForm.get('gradeID').value;
      this.design.brandID = this.brandid;
      this.design.productGroupID = this.productgroupid;
      this.design.productLineID = this.myForm.get('productlineID').value;
      this.design.styleStatusID = this.myForm.get('stylestatusID').value;
      this.design.yearID = this.myForm.get('yearID').value;
      this.design.shortDescription = this.myForm.get('shortdescription').value;
      this.design.developmentOffice = this.myForm.get('developmentofficeID').value;
      this.design.simbolGroup = this.myForm.get('symbolgroup').value;
      this.design.composition = this.myForm.get('composition').value;
      this.design.designerID = this.myForm.get('designerID').value;
      this.design.divisionID = this.myForm.get('divisionID').value;
      this.design.remarks = this.myForm.get('remarks').value;
      this.design.active = this.myForm.get('active').value;
      this.design.seasonCode = this.seasonCode;
      this.design.dropCode = this.dropCode;
      this.design.collectionCode = this.collectionCode;
      this.design.subCollectionCode = this.subcollectionCode;
      this.design.brandCode = this.brandCode;
      this.design.designerCode = this.designerCode;
      this.design.divisionCode = this.divisionCode;
      this.design.yearCode = this.yearCode;
      this.design.styleStatusCode = this.stylestatusCode;
      this.design.productGroupCode = this.productgroupCode;
      this.design.productLineCode = this.productlineCode;


      // .log(this.design);
      this.common.showSpinner();
      this.api.postAPI("designmaster", this.design).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Design Data saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  getSeason() {
    this.season_list = null;
    this.common.showSpinner();
    this.api.getAPI("season")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.season_list = data.seasonMasterList;
            // .log(this.season_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  seasoncode_Change() {

    if (this.season_list != null && this.season_list.length > 0) {
      for (let season of this.season_list) {
        if (season.id == this.myForm.get('seasonID').value) {
          this.seasonCode = season.seasonCode;
          //this.myForm.get('designCode').setValue(this.seasonCode);

          // this.myForm.get('designCode').setValue(this.seasonCode + this.dropCode + this.collectionCode + this.subcollectionCode);
          break;
        }
      }

    }
    this.generateDesignCode();
  }

  getDrop() {
    this.dropCode = null;
    this.common.showSpinner();
    this.api.getAPI("drop")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.drop_list = data.responseDynamicData;
            // .log(this.drop_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  dropcode_Change() {
    if (this.drop_list != null && this.drop_list.length > 0) {
      for (let drop of this.drop_list) {
        if (drop.id == this.myForm.get('dropID').value) {
          this.dropCode = drop.dropCode;
          //  this.myForm.get('designCode').setValue(this.seasonCode + this.dropCode);

          break;
        }
      }
    }
    this.generateDesignCode();
  }
  getCollection() {
    this.collection_list = null;
    this.common.showSpinner();
    this.api.getAPI("CollectionMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.collection_list = data.collectionMasterTypesList;
            this.CollectionDropdownSettings = {
              singleSelection: true,
              idField: 'id',
              textField: 'collectionName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              closeDropDownOnSelection: this.closeDropdownSelection2
              
            };
            this.selectedSubCollectionList = [];
            // .log(this.collection_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  collectioncode_Change(item:any) {
    this.selectedSubCollectionList = [];
    this.myForm.get('subcollectionID').setValue('');
    this.collectionid=item.id;
    //this.myForm.get('subcollectionID').setValue('');
    if (this.collection_list != null && this.collection_list.length > 0) {
      for (let collection of this.collection_list) {
        if (collection.id ==this.collectionid) {
          this.collectionCode = collection.collectionCode;
          this.subcollectionCode = "";
        
          // this.myForm.get('designCode').setValue(this.seasonCode + this.dropCode + this.collectionCode);

          break;
        }
      }
    }
    this.getSubCollection();
    this.generateDesignCode();
  }

  generateDesignCode() {
    let season_code: string = this.seasonCode != null ? this.seasonCode : "";
    let drop_code: string = this.dropCode != null ? this.dropCode : "";
    let coll_code: string = this.collectionCode != null ? this.collectionCode : "";
    let sub_coll_code: string = this.subcollectionCode != null ? this.subcollectionCode : "";
    let design_code: string = season_code + drop_code + coll_code + sub_coll_code;
    this.myForm.get('designCode').setValue(design_code);
  }


  getSubCollection() {
    this.subcollection_list = null;
    this.common.showSpinner();
    this.api.getAPI("SubCollectionLookUp?collectionid=" + this.collectionid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.subcollection_list = data.subCollectionMasterLookUpList;
            this.SubCollectionDropdownSettings = {
              singleSelection: true,
              idField: 'id',
              textField: 'subCollectionName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              closeDropDownOnSelection: this.closeDropdownSelection1
              
            };
            this.selectedSubCollectionList = [];
            // .log(this.subcollection_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  subcollectioncode_Change(item:any) {
    this.subCollectionID=item.id;
    if (this.subcollection_list != null && this.subcollection_list.length > 0) {
      for (let subcollection of this.subcollection_list) {
        if (subcollection.id == this.subCollectionID) {
          this.subcollectionCode = subcollection.subCollectionCode;
          // this.myForm.get('designCode').setValue(this.seasonCode + this.dropCode + this.collectionCode + this.subcollectionCode);

          break;
        }
      }

    }
    this.generateDesignCode();
  }

  getBrand() {
    this.brand_list = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brand_list = data.responseDynamicData;
            this.brandDropdownSettings = {
              singleSelection: true,
              idField: 'id',
              textField: 'brandName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              closeDropDownOnSelection: this.closeDropdownSelection
              
            };
            this.selectedBrandList = [];
            // .log(this.brand_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  brandcode_Change(item:any) {
    this.brandid=item.id;
    this.myForm.get('description').setValue(':' + this.myForm.get('designCode').value + ':');
    if (this.brand_list != null && this.brand_list.length > 0) {
      for (let brand of this.brand_list) {
        if (brand.id == this.brandid) {
          this.brandCode = brand.brandCode;
        
          break;
        }
      }
    }
  }
  getProductgroup() {
    this.productgroup_list = null;
    this.common.showSpinner();
    this.api.getAPI("productgroup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productgroup_list = data.productGroupList;
            this.ProductGroupDropdownSettings = {
              singleSelection: true,
              idField: 'id',
              textField: 'productGroupName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              closeDropDownOnSelection: this.closeDropdownSelection3
              
            };
            this.selectedProductgroupcodeList = [];

            // .log(this.productgroup_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  productgroupcode_Change(item:any) {
    this.productgroupid=item.id;
    if (this.productgroup_list != null && this.productgroup_list.length > 0) {
      for (let productgroup of this.productgroup_list) {
        if (productgroup.id == this.productgroupid) {
          this.productgroupCode = productgroup.productGroupCode;
          this.myForm.get('description').setValue(':' + this.myForm.get('designCode').value + ':' + productgroup.productGroupName + ':');
          break;
        }
      }
    }
  }
  getProductline() {
    this.productline_list = null;
    this.common.showSpinner();
    this.api.getAPI("productline")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productline_list = data.productLineMasterList;
            // .log(this.productline_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  productlinecode_Change() {
    if (this.productline_list != null && this.productline_list.length > 0) {
      for (let productline of this.productline_list) {
        if (productline.id == this.myForm.get('productlineID').value) {
          this.productlineCode = productline.productLineCode;
          break;
        }
      }
    }
  }
  getStyleStatus() {
    this.stylestatus_list = null;
    this.common.showSpinner();
    this.api.getAPI("stylestatus")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stylestatus_list = data.styleStatusMasterTypeList;
            // .log(this.stylestatus_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  stylestatuscode_Change() {
    if (this.stylestatus_list != null && this.stylestatus_list.length > 0) {
      for (let stylestatus of this.stylestatus_list) {
        if (stylestatus.id == this.myForm.get('stylestatusID').value) {
          this.stylestatusCode = stylestatus.styleStatusCode;
          break;
        }
      }
    }
  }
  getYear() {
    this.year_list = null;
    this.common.showSpinner();
    this.api.getAPI("year")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.year_list = data.responseDynamicData;
            // .log(this.year_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  yearcode_Change() {
    if (this.year_list != null && this.year_list.length > 0) {
      for (let year of this.year_list) {
        if (year.id == this.myForm.get('yearID').value) {
          this.yearCode = year.yearCode;
          break;
        }
      }
    }
  }
  getDevelopmentOffice() {
    this.developmentoffice_list = null;
    this.common.showSpinner();
    this.api.getAPI("DevelopmentOfficeLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.developmentoffice_list = data.responseDynamicData;
            // .log(this.developmentoffice_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  developmentofficecode() {
    if (this.developmentoffice_list != null && this.developmentoffice_list.length > 0) {
      for (let developmentoffice of this.developmentoffice_list) {
        if (developmentoffice.id == this.myForm.get('developmentofficeID').value) {
          this.developmentofficeCode = developmentoffice.developmentOffice;
          break;
        }
      }
    }
  }
  getDesigner() {
    this.designer_list = null;
    this.common.showSpinner();
    this.api.getAPI("EmployeeMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.designer_list = data.employeeList;
            this.designer_list = this.designer_list.filter(x => x.roleName == "Designer")
            // .log(this.designer_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  designercode_Change() {
    if (this.designer_list != null && this.designer_list.length > 0) {
      for (let designer of this.designer_list) {
        if (designer.id == this.myForm.get('designerID').value) {
          this.designerCode = designer.employeeCode;
          break;
        }
      }
    }
  }
  getDivision() {
    this.division_list = null;
    this.common.showSpinner();
    this.api.getAPI("division")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.division_list = data.responseDynamicData;
            // .log(this.division_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  divisioncode_Change() {
    if (this.division_list != null && this.division_list.length > 0) {
      for (let division of this.division_list) {
        if (division.id == this.myForm.get('divisionID').value) {
          this.divisionCode = division.divisionCode;
          break;
        }
      }
    }
  }

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['design']);
      }
    }
    else {
      this.router.navigate(['design']);
    }
  }

  restrictSpecialChars(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57));
  }
  onSelectSubCollection(item: any) {
   this.subCollectionID=item.id;
  }
 
  onSelectBrand(item: any) {
    console.log(this.selectedBrandList);
  }
  
  toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.brandDropdownSettings = Object.assign({}, this.brandDropdownSettings,{closeDropDownOnSelection: this.closeDropdownSelection});
    this.closeDropdownSelection = !this.closeDropdownSelection1;
    this.SubCollectionDropdownSettings = Object.assign({}, this.SubCollectionDropdownSettings,{closeDropDownOnSelection: this.closeDropdownSelection1});
    this.closeDropdownSelection = !this.closeDropdownSelection2;
    this.CollectionDropdownSettings = Object.assign({}, this.CollectionDropdownSettings,{closeDropDownOnSelection: this.closeDropdownSelection2});
    this.closeDropdownSelection = !this.closeDropdownSelection3;
    this.ProductGroupDropdownSettings = Object.assign({}, this.ProductGroupDropdownSettings,{closeDropDownOnSelection: this.closeDropdownSelection3});
}
}
