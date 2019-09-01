import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/*
 * Entry components are components loaded imperatively through code instead of declaratively through a template.
 * The LogoutPromptComponent doesn't get called through a template, it gets loaded by Angular Material
 * when the user clicks the Log Out button.
 */

@Component({
  selector: 'abl-logout-prompt',
  template: `
    <h3 mat-dialog-title>Log Out</h3>

    <mat-dialog-content>
      Are you sure you want to log out?
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="cancel()">
        No
      </button>
      <button mat-button (click)="confirm()">
        Yes
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        max-width: 300px;
      }

      mat-dialog-actions {
        display: flex;
        justify-content: flex-end;
      }

      [mat-button] {
        padding: 0;
      }
    `
  ]
})
export class LogoutPromptComponent {
  constructor(private ref: MatDialogRef<LogoutPromptComponent>) {}

  cancel() {
    this.ref.close(false);
  }

  confirm() {
    this.ref.close(true);
  }
}
