import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ApolloQueryController } from '@apollo-elements/core';
import { classMap } from 'lit-html/directives/class-map';

import { LatestLaunchQueryDocument } from './LatestLaunch.query';

import style from './latest-launch.css';

@customElement('spacex-latest-launch')
export class LatestLaunch extends LitElement {
  static readonly styles = [style];

  query = new ApolloQueryController(this, LatestLaunchQueryDocument);

  render(): TemplateResult {
    const rocketName =
      this.query.data?.launchLatest.rocket.rocket.name;

    const siteName =
      this.query.data?.launchLatest.launch_site.site_name_long;

    const localTime =
      this.query.data &&
      new Date(this.query.data.launchLatest.launch_date_local).toLocaleTimeString();

    const missionName =
      this.query.data?.launchLatest.mission_name;

    const { loading } = this.query;
    return html`
      <p class="${classMap({ loading })}">
        The last launch was the${loading ? '...' : html`
        <strong>${rocketName}</strong>, which took off from
        <strong>${siteName}</strong> on
        <strong>${localTime}</strong> local time for the
        <strong>${missionName}</strong> mission.
        `}
      </p>
    `;
  }
}
