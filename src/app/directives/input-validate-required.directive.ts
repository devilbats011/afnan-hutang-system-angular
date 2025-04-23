import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { NgControl, AbstractControl, ValidatorFn, Validators } from '@angular/forms';

@Directive({
  selector: '[appInputValidateRequired]'
})
export class InputValidateRequiredDirective implements OnInit {
  private control = inject(NgControl);
  private el = inject(ElementRef);

  private renderer = inject(Renderer2);

  private html_element!: HTMLElement;

  constructor() {
  }

  ngOnInit() {
    Promise.resolve().then(() => {
      const formControl = this.control.control;
      if (!formControl) {
        return;
      }
      this.add_required_to_FormControl(formControl);
      this.subscribe_event_Touched_Dirty_handler(formControl);
    });
  }

  private add_required_to_FormControl(formControl: AbstractControl) {
    const existingValidators = formControl.validator
      ? [formControl.validator]
      : [];
    const requiredValidator: ValidatorFn = Validators.required;
    formControl.setValidators([...existingValidators, requiredValidator]);
    formControl.updateValueAndValidity();
  }

  private subscribe_event_Touched_Dirty_handler(formControl: AbstractControl) {
    // console.log('reached', formControl);
    const element_html = this.render_ELEMENT_DIV();
    formControl.statusChanges?.subscribe(() => this.updateMessage(element_html, formControl));
    formControl.valueChanges?.subscribe(() => this.updateMessage(element_html, formControl));
    // formControl.statusChanges?.subscribe(() => console.log('upp?'));
  }

  private updateMessage(element_html: HTMLElement, formControl: AbstractControl) {
    const isInvalid = formControl.invalid && (formControl.dirty || formControl.touched);
    // console.log('up', isInvalid);
    isInvalid ? this.add_text_element_html(element_html, 'Fill in the blank') : this.add_text_element_html(element_html, '')
  }

  render_ELEMENT_DIV() {
    const parent = this.el.nativeElement.parentNode;
    // console.log('parrent',parent);
    // parent.classList.add('m-b-2rem');
    this.html_element = this.renderer.createElement('div');
    this.renderer.setStyle(this.html_element, 'color', 'red');
    this.renderer.setStyle(this.html_element, 'font-size', '14px');
    // this.renderer.setStyle(this.html_element, 'position', 'absolute');
    this.renderer.setStyle(this.html_element, 'padding', '.1rem');
    this.renderer.appendChild(parent, this.html_element);
    return this.html_element;
  }

  add_text_element_html(element_html: HTMLElement, message: string) {
    element_html.innerText = message;
  }

}
