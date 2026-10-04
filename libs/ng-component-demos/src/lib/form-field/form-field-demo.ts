import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoApi, DemoApiItem, DemoExample, DemoPage, DemoSection } from '../_demo-ui';
import { FormFieldBasicExample } from './examples/form-field-basic.example';
import { snippet as basicSnippet } from './examples/form-field-basic.ts.snippet';
import { FormFieldContactExample } from './examples/form-field-contact.example';
import { snippet as contactSnippet } from './examples/form-field-contact.ts.snippet';
import { FormFieldValidationExample } from './examples/form-field-validation.example';
import { snippet as validationSnippet } from './examples/form-field-validation.ts.snippet';

/** Docs page for ngc-form-field. */
@Component({
  selector: 'ngc-demo-form-field',
  imports: [
    DemoApi,
    DemoApiItem,
    DemoExample,
    DemoPage,
    DemoSection,
    FormFieldBasicExample,
    FormFieldContactExample,
    FormFieldValidationExample,
  ],
  template: `
    <ngc-demo-page>
      <ngc-demo-section title="Basic">
        <ngc-demo-example id="form-field-basic" [snippet]="basicSnippet">
          <ngc-demo-form-field-basic-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Validation">
        <ngc-demo-example id="form-field-validation" [snippet]="validationSnippet">
          <ngc-demo-form-field-validation-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="Contact form">
        <ngc-demo-example id="form-field-contact" [snippet]="contactSnippet">
          <ngc-demo-form-field-contact-example />
        </ngc-demo-example>
      </ngc-demo-section>

      <ngc-demo-section title="API">
        <ngc-demo-api>
          <ngc-demo-api-item
            name="ngc-form-field"
            kind="directive"
            type="element"
            description="Container; finds the control inside and mirrors its status as data attributes on every part."
          />
          <ngc-demo-api-item
            name="ngc-field-label"
            kind="directive"
            type="label"
            description="Label; its for attribute points at the control automatically."
          />
          <ngc-demo-api-item
            name="ngc-field-hint"
            kind="directive"
            type="any element"
            description="Always-visible helper text; feeds the control's aria-describedby."
          />
          <ngc-demo-api-item
            name="ngc-field-error"
            kind="directive"
            type="any element"
            description="Error message; visible while its validator fails on a touched control."
          />
          <ngc-demo-api-item
            name="validator (error)"
            kind="input"
            type="string"
            default="null"
            description="Validator key the error belongs to (e.g. required, email); omit to match any error."
          />
          <ngc-demo-api-item
            name="id (label, hint, error)"
            kind="input"
            type="string"
            default="generated"
            description="Element id; the control's aria-labelledby / aria-describedby reference it."
          />
        </ngc-demo-api>
      </ngc-demo-section>

      <ngc-demo-section title="Usage">
        <p>
          Wrap one control (with its <code>formControl</code>) per <code>&lt;ngc-form-field&gt;</code>. Label
          association and <code>aria-describedby</code> for hints and failing errors are wired automatically – no manual
          <code>for</code>/<code>id</code> pairing needed. Errors render eagerly but only become visible once their
          validator fails and the control was touched; controls show the destructive border at the same moment via
          <code>data-invalid</code>/<code>data-touched</code>.
        </p>
      </ngc-demo-section>
    </ngc-demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldDemo {
  protected readonly basicSnippet = basicSnippet;
  protected readonly validationSnippet = validationSnippet;
  protected readonly contactSnippet = contactSnippet;
}
