import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AlertifyService } from '../../_service/alertify.service';
import { RelationService } from '../../_service/relation.service';
import { Relation } from '../../_model/Relation';
import { RELATIONTYPE } from '../../_data/RelationType';

@Component({
  selector: 'app-relation-edit',
  templateUrl: './relation-edit.component.html',
  styleUrls: ['./relation-edit.component.css']
})
export class RelationEditComponent implements OnInit {
  @Input() relationEdit: Relation;
  @Input() public search: Function;
  @ViewChild('closeTag') closeTag: ElementRef;
  relationForm: FormGroup;
  relation: Relation;

  autoCompleteList = RELATIONTYPE;

  constructor(private fb: FormBuilder, private alertify: AlertifyService, private relationService: RelationService) { }

  ngOnInit() {
    this.createRelationForm();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    console.log('changes');
    if (this.relationEdit) {
      this.setRelationForm();
    }

  }

  setRelationForm() {
    this.createRelationForm();

    for (let i = 0; i < this.relationEdit.subjects.length - 1; i++) {
      (<FormArray>this.relationForm.controls['subjects']).push(this.fb.group({
        name: [''],
        idNumber: [''],
        memo: ['']
      }, { validator: this.checkValidate('name', 'idNumber') }));
    }

    for (let i = 0; i < this.relationEdit.objects.length - 1; i++) {
      (<FormArray>this.relationForm.controls['objects']).push(this.fb.group({
        name: [''],
        idNumber: [''],
        relationType: [[], Validators.required],
        memo: ['']
      }, { validator:  Validators.compose([this.checkValidate('name', 'idNumber'), this.checkMemo('relationType','memo')]) }));
    }

    this.relationForm.controls['subjects'].setValue(this.relationEdit.subjects);
    this.relationForm.controls['objects'].setValue(this.relationEdit.objects);
    this.relationForm.controls['reason'].setValue(this.relationEdit.reason);
    console.log(this.relationForm.value);
  }

  createRelationForm() {
    this.relationForm = this.fb.group({
      subjects: this.fb.array([this.fb.group({
        name: [''],
        idNumber: [''],
        memo: ['']
      }, { validator: this.checkValidate('name', 'idNumber') })]),
      objects: this.fb.array([this.fb.group({
        name: [''],
        idNumber: [''],
        relationType: [[], Validators.required],
        memo: ['']
      }, { validator: Validators.compose([this.checkValidate('name', 'idNumber'), this.checkMemo('relationType','memo')])})]),
      reason: ['', Validators.required],
      user: ['', Validators.required]
    });
  }

  addObject() {
    // add address to the list
    const control = <FormArray>this.relationForm.controls['objects'];
    control.push(this.fb.group({
      name: [''],
      idNumber: [''],
      relationType: [[], Validators.required],
      memo: ['']
    }, { validator: Validators.compose([this.checkValidate('name', 'idNumber'), this.checkMemo('relationType','memo')])}));
  }

  addSubject() {
    // add address to the list
    const control = <FormArray>this.relationForm.controls['subjects'];
    control.push(this.fb.group({
      name: [''],
      idNumber: [''],
      memo: ['']
    }, { validator: this.checkValidate('name', 'idNumber') }));
  }

  remove(i: number, target: string) {
    // remove address from the list
    const control = <FormArray>this.relationForm.controls[target];
    control.removeAt(i);
  }

  addRelation() {

    this.relation = Object.assign({}, this.relationForm.value);

    this.relationService.addRelation(this.relation).subscribe(request => {
      this.alertify.success('relation created');
    }, error => {
      this.alertify.error('failed');
    });
    // console.log(this.relationForm.value);
  }


  clearForm() {
    this.createRelationForm();
  }


  checkValidate(nameKey: string, idnumberKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const name = group.controls[nameKey];
      const idnumber = group.controls[idnumberKey];
      if (name.value.trim() === '' && idnumber.value.trim() === '') {
        return {
          checkValidate: true
        };
      }
    };
  }

  checkMemo(relationType: string, memo: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let r = group.controls[relationType];
      let m = group.controls[memo];
      if (r.value.includes("其他") && m.value.trim() === '' ){
        return {
          checkMemo: true
        };
      
    }
  }
}
  saveChange() {
    this.relationEdit= Object.assign({},this.relationEdit, this.relationForm.value);

    this.relationEdit.objects.forEach(object => {
      object.relationType=object.relationType.map(r=>{
        if(r.value) 
          return r.value;
        else 
          return r;
      });
    });

    // console.log(this.relationEdit);

    this.relationService.updateRelation(this.relationEdit).subscribe(() => {
      this.alertify.success('relation updated');
    }, error => {
      console.log(error);
    }, () => {
      this.search();
      this.closeTag.nativeElement.click();
    } );
  }
}
