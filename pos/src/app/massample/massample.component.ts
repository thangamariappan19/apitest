import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-massample',
  templateUrl: './massample.component.html',
  styleUrls: ['./massample.component.css']
})
export class MassampleComponent implements OnInit {

myForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
