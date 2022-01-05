import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAgentMaster } from 'src/app/models/m-agent-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.css']
})
export class AgentEditComponent implements OnInit {


  myForm: FormGroup;
  json: Array<any>;
  agent: MAgentMaster;
  id: any;
  agentCode: string;
  agentName: string;

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
      agentCode: ['', Validators.required],
      agentName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.agent = new MAgentMaster();
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAgentData();
  }

  getAgentData() {
    this.common.showSpinner();
    this.api.getAPI("agent?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['agentCode'].setValue(data.agentRecord.agentCode);
            this.myForm.controls['agentName'].setValue(data.agentRecord.agentName);
            this.myForm.controls['remarks'].setValue(data.agentRecord.remarks);
            this.myForm.controls['active'].setValue(data.agentRecord.active);

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

  update() {
    if (this.agent == null) {
      this.common.showMessage("warn", "Can not Save, Agent  Master Data is invalid.");
    } else {
      this.agent.id = this.id;
      this.agent.agentCode = this.myForm.get('agentCode').value;
      this.agent.agentName = this.myForm.get('agentName').value;
      this.agent.active = this.myForm.get('active').value;
      this.agent.remarks = this.myForm.get('remarks').value;

     // .log(this.agent);
      this.common.showSpinner();
      this.api.putAPI("agent", this.agent).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.close();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }

  close() {
    this.router.navigate(['agent']);
  }

}




