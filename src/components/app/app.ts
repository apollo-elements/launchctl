import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ApolloQueryController } from '@apollo-elements/core';

import { AppQueryDocument } from './App.query';

import shared from '../shared.css';
import style from './app.css';

@customElement('spacex-app')
export class SpacexApp extends LitElement {
  static readonly styles = [shared, style];

  query = new ApolloQueryController(this, AppQueryDocument);

  render(): TemplateResult {
    const backURL = this.query.data?.route?.pathname?.includes('/launches/') ? '/' : '';
    return html`
      <link rel="stylesheet" href="/src/links.css">
      <link rel="stylesheet" href="/src/skeleton.css">

      <nav>
        <a href="${backURL}" ?hidden="${!backURL}">Back</a>
      </nav>

      <slot name="router-outlet">
        ${this.renderRoute()}
      </slot>
    `;
  }

  renderRoute(): string|TemplateResult {
    const [parent] = this.query.data?.route.parts ?? [];
    switch (parent) {
      case 'launches': return html`<spacex-launch></spacex-launch>`;
      case 'launchpads': return html`<spacex-launchpads></spacex-launchpads>`;
      default: return html`<slot name="router-fallback"></slot>`;
    }
  }
}
