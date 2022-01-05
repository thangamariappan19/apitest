import { Component, OnInit } from '@angular/core';
import { MAgentMaster } from 'src/app/models/m-agent-master';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {

  json: Array<any>;
  agent_list: Array<MAgentMaster>;
  agent_Filter: Array<MAgentMaster>;
  myForm: FormGroup;

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
      agentCode: ['', Validators.required],
      agentName: ['', Validators.required],
      remarks: ['']
    });
    this.getagentList();
    this.clear_controls();
  }

  clear_controls() {
    this.myForm.controls['agentCode'].setValue('');
    this.myForm.controls['agentName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.agent_Filter = this.agent_list;
  }


  getagentList() {
    this.json = null;
    this.agent_list = null;
    this.agent_Filter = null;
    this.common.showSpinner();
    this.api.getAPI("agent")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.agent_list = new Array<MAgentMaster>();
            this.agent_list = data.agentList;
            this.agent_Filter = this.agent_list;
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

  ngOnInit() {
  }
  filter() {
    let agentCode = this.myForm.get('agentCode').value;
    let agentName = this.myForm.get('agentName').value;
    let remarks = this.myForm.get('remarks').value;

    this.agent_Filter = this.agent_list;

    if (agentCode != null && agentCode != "")
      this.agent_Filter = this.agent_Filter.filter(x => x.agentCode.toLowerCase().includes(agentCode.toLowerCase()));

    if (agentName != null && agentName != "")
      this.agent_Filter = this.agent_Filter.filter(x => x.agentName.toLowerCase().includes(agentName.toLowerCase()));

    if (remarks != null && remarks != "")
      this.agent_Filter = this.agent_Filter.filter(x => x.remarks.toLowerCase().includes(remarks.toLowerCase()));
  }
}
