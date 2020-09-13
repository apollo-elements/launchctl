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

@customElement('spacex-app')
export class SpacexApp extends TypePoliciesMixin(ApolloQuery)<Data, Variables> {
  static readonly style = [shared];

  query = AppQuery;

  render(): TemplateResult {
    return html`
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
