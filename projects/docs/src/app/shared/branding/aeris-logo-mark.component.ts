import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'aeris-logo-mark',
  imports: [NgOptimizedImage],
  template: ` <img ngSrc="logo.png" width="579" height="579" alt="" aria-hidden="true" /> `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;
      height: 100%;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `,
})
export class AerisLogoMarkComponent {}
