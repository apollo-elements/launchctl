import {
  ApolloQuery,
  customElement,
  html,
  TemplateResult,
} from '@apollo-elements/lit-apollo';

import { TypePoliciesMixin } from '@apollo-elements/mixins/type-policies-mixin';

import type {
  AppQueryData as Data,
  AppQueryVariables as Variables,
} from '../../schema';

import AppQuery from './App.query.graphql';

import shared from '../shared.css';
import style from './app.css';

@customElement('spacex-app')
export class SpacexApp extends TypePoliciesMixin(ApolloQuery)<Data, Variables> {
  static readonly styles = [shared, style];

  query = AppQuery;

  render(): TemplateResult {
    const backURL = this.data?.route?.pathname?.includes('/launches/') ? '/' : '';
    return html`
      <link rel="stylesheet" href="/src/links.css">
      <link rel="stylesheet" href="/src/skeleton.css">

      <header>
        <a href="${backURL}" ?hidden="${!backURL}">Back</a>
      </header>
      <slot name="router-outlet">
        ${this.renderRoute()}
      </slot>
    `;
  }

  renderRoute(): string|TemplateResult {
    const [parent] = this.data?.route.parts ?? [];
    switch (parent) {
      case 'launches': return html`<spacex-launch></spacex-launch>`;
      default: return html`<slot name="router-fallback"></slot>`;
    }
  }
}
