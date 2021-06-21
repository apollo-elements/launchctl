import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ApolloQueryController } from '@apollo-elements/core';

import '../countdown-timer';

import { NextLaunchQueryDocument } from './NextLaunch.query';

import style from '../latest-launch/latest-launch.css';

@customElement('spacex-next-launch')
export class NextLaunch extends LitElement {
  static readonly styles = [style];

  query = new ApolloQueryController(this, NextLaunchQueryDocument);

  render(): TemplateResult {
    const rocketName =
      this.query.data?.launchNext.rocket.rocket.name;

    const siteName =
      this.query.data?.launchNext.launch_site.site_name_long;

    const launchTime =
      this.query.data?.launchNext.launch_date_utc;

    const launchDate =
      launchTime && new Date(launchTime);

    const past = launchDate && launchDate.getTime() < Date.now();

    return html`
      <p>
        The next launch
        ${past ? 'will be announced soon' : html`
        will be the
        ${this.query.loading ? '...' : html`
        <strong>${rocketName}</strong> from
        <strong>${siteName}</strong> in
        <strong>
          <countdown-timer datetime="${launchTime}"></countdown-timer>
        </strong>
        `}
        `}
      </p>
    `;
  }
}
