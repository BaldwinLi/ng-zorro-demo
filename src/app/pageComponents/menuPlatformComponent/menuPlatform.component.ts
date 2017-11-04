import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'app-menu-platform-component',
  templateUrl: './menuPlatform.component.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class MenuPlatformComponent implements OnInit {
  validateForm: FormGroup;

  marks = {
    0: 'A',
    25: 'B',
    50: 'C',
    75: 'D',
    100: 'E'
  };
  now = new Date();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      select: ['China'],
      select_multiple: [['Red']],
      datepicker: [new Date()],
      timepicker: [new Date()],
      input_number: [4],
      switch: [false],
      slider: [0],
      radio_group: [1],
      radio_button: [1]
    });
  }
}
