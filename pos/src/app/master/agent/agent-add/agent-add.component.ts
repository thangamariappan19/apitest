import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAgentMaster } from 'src/app/models/m-agent-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-add',
  templateUrl: './agent-add.component.html',
  styleUrls: ['./agent-add.component.css']
})
export class AgentAddComponent implements OnInit {
 
  myForm: FormGroup;
  json: Array<any>; 
  agent: MAgentMaster;

  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router
  ) { this.createForm();} 

  createForm() {
    this.myForm = this.fb.group({    
      agentCode: ['',Validators.required],
      agentName: ['',Validators.required],     
      remarks:[''],
      active:[false]
  });
  this.agent = new MAgentMaster();
  this.clear_controls();
}
  clear_controls() { 
    
    this.myForm.controls['agentCode'].setValue('');
    this.myForm.controls['agentName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  ngOnInit() {
  }

  quickadd_agent() {
    if (this.agent == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    }  else {
      this.agent.id = 0;
      this.agent.agentCode = this.myForm.get('agentCode').value;
      this.agent.agentName = this.myForm.get('agentName').value;      
      this.agent.active= this.myForm.get('active').value;
      this.agent.remarks = this.myForm.get('remarks').value;
   
     // .log(this.agent);
      this.common.showSpinner();
      this.api.postAPI("agent", this.agent).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else {
          setTimeout(() => {
           // .log(data);
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }

  close(){
    this.router.navigate(['agent']);
  }

}
