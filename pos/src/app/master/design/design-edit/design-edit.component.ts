import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MDesignMaster } from 'src/app/models/m-design-master';
import { MEmployeeMaster } from 'src/app/models/m-employee-master';

@Component({
  selector: 'app-design-edit',
  templateUrl: './design-edit.component.html',
  styleUrls: ['./design-edit.component.css']
})
export class DesignEditComponent implements OnInit {
  id: any;
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
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {

    this.myForm = this.fb.group({
      designCode: ['', Validators.required],
      designName: ['', Validators.required],
      description: ['', Validators.required],
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
      active: [false]
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
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getDesignData();
  }

  getDesignData() {
    this.common.showSpinner();
    this.api.getAPI("designmaster?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['designCode'].setValue(data.designMasterTypesData.designCode);
            this.myForm.controls['designName'].setValue(data.designMasterTypesData.designName);
            this.myForm.controls['description'].setValue(data.designMasterTypesData.description);
            this.myForm.controls['seasonID'].setValue(data.designMasterTypesData.seasonID);
            this.myForm.controls['dropID'].setValue(data.designMasterTypesData.dropID);
            this.myForm.controls['collectionID'].setValue(data.designMasterTypesData.collectionID);
            this.getSubCollection();
            this.myForm.controls['subcollectionID'].setValue(data.designMasterTypesData.subCollectionID);
            this.myForm.controls['gradeID'].setValue(data.designMasterTypesData.grade);
            this.myForm.controls['brandID'].setValue(data.designMasterTypesData.brandID);
            this.myForm.controls['productgroupID'].setValue(data.designMasterTypesData.productGroupID);
            this.myForm.controls['productlineID'].setValue(data.designMasterTypesData.productLineID);
            this.myForm.controls['stylestatusID'].setValue(data.designMasterTypesData.styleStatusID);
            this.myForm.controls['yearID'].setValue(data.designMasterTypesData.yearID);
            this.myForm.controls['shortdescription'].setValue(data.designMasterTypesData.shortDescription);
            this.myForm.controls['developmentofficeID'].setValue(data.designMasterTypesData.developmentOffice);
            this.myForm.controls['symbolgroup'].setValue(data.designMasterTypesData.simbolGroup);
            this.myForm.controls['composition'].setValue(data.designMasterTypesData.composition);
            this.myForm.controls['designerID'].setValue(data.designMasterTypesData.designerID);
            this.myForm.controls['divisionID'].setValue(data.designMasterTypesData.divisionID);
            this.myForm.controls['remarks'].setValue(data.designMasterTypesData.remarks);
            this.myForm.controls['active'].setValue(data.designMasterTypesData.active);
            this.seasonCode = data.designMasterTypesData.seasonCode;
            this.dropCode = data.designMasterTypesData.dropCode;
            this.collectionCode = data.designMasterTypesData.collectionCode;
            this.subcollectionCode = data.designMasterTypesData.subCollectionCode;
            this.brandCode = data.designMasterTypesData.brandCode;
            this.designerCode = data.designMasterTypesData.designerCode;
            this.divisionCode = data.designMasterTypesData.divisionCode;
            this.yearCode = data.designMasterTypesData.yearCode;
            this.stylestatusCode = data.designMasterTypesData.styleStatusCode;
            this.productgroupCode = data.designMasterTypesData.productGroupCode;
            this.productlineCode = data.designMasterTypesData.productLineCode;
            //.log(this.company_list);
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

  updatedesign() {
    if (this.design == null) {
      this.common.showMessage("warn", "Can not Save, Design Data is invalid.");
    } else {
      this.design.id = this.id;
      this.design.designCode = this.myForm.get('designCode').value;
      this.design.designName = this.myForm.get('designName').value;
      this.design.description = this.myForm.get('description').value;
      this.design.seasonID = this.myForm.get('seasonID').value;
      this.design.dropID = this.myForm.get('dropID').value;
      this.design.collectionID = this.myForm.get('collectionID').value;
      this.design.subCollectionID = this.myForm.get('subcollectionID').value;
      this.design.grade = this.myForm.get('gradeID').value;
      this.design.brandID = this.myForm.get('brandID').value;
      this.design.productGroupID = this.myForm.get('productgroupID').value;
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
      this.api.putAPI("designmaster", this.design).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Design Data saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['design']);
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
  seasoncode() {
    if (this.season_list != null && this.season_list.length > 0) {
      for (let season of this.season_list) {
        if (season.id == this.myForm.get('seasonID').value) {
          this.seasonCode = season.seasonCode;
          this.myForm.get('designCode').setValue(this.seasonCode);
          break;
        }
      }
    }
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
  dropcode() {
    if (this.drop_list != null && this.drop_list.length > 0) {
      for (let drop of this.drop_list) {
        if (drop.id == this.myForm.get('dropID').value) {
          this.dropCode = drop.dropCode;
          this.myForm.get('designCode').setValue(this.seasonCode + this.dropCode);
          break;
        }
      }
    }
  }
  getCollection() {
    this.collection_list = null;
    this.common.showSpinner();
    this.api.getAPI("CollectionMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.collection_list = data.collectionMasterTypesList;
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
  collectioncode() {
    if (this.collection_list != null && this.collection_list.length > 0) {
      for (let collection of this.collection_list) {
        if (collection.id == this.myForm.get('collectionID').value) {
          this.collectionCode = collection.collectionCode;
          break;
        }
      }
    }
    this.getSubCollection();
  }
  getSubCollection() {
    this.subcollection_list = null;
    this.common.showSpinner();
    this.api.getAPI("SubCollectionLookUp?collectionid=" + this.myForm.get('collectionID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.subcollection_list = data.subCollectionMasterLookUpList;
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
  subcollectioncode() {
    if (this.subcollection_list != null && this.subcollection_list.length > 0) {
      for (let subcollection of this.subcollection_list) {
        if (subcollection.id == this.myForm.get('subcollectionID').value) {
          this.subcollectionCode = subcollection.subCollectionCode;
          break;
        }
      }
    }
  }

  getBrand() {
    this.brand_list = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brand_list = data.responseDynamicData;
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
  brandcode() {
    this.myForm.get('description').setValue(':' + this.myForm.get('designCode').value + ':');
    if (this.brand_list != null && this.brand_list.length > 0) {
      for (let brand of this.brand_list) {
        if (brand.id == this.myForm.get('brandID').value) {
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
  productgroupcode() {
    if (this.productgroup_list != null && this.productgroup_list.length > 0) {
      for (let productgroup of this.productgroup_list) {
        if (productgroup.id == this.myForm.get('productgroupID').value) {
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
  productlinecode() {
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
  stylestatuscode() {
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
  yearcode() {
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
  designercode() {
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
  divisioncode() {
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
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['design']);
    }  
    } 
    else
    {
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
}
