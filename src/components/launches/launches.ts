import { LitElement, html, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ApolloQueryController } from '@apollo-elements/core';
import { classMap } from 'lit-html/directives/class-map';

import ResizeObserver from 'resize-observer-polyfill';

import { LaunchesDocument } from './Launches.query';
import { Launch } from '../../schema';
import { bound } from '@apollo-elements/core/lib/bound';

import shared from '../shared.css';
import style from './launches.css';

@customElement('spacex-launches')
export class SpacexLaunches extends LitElement {
  static readonly is = 'spacex-launches'

  static readonly styles = [shared, style];

  query = new ApolloQueryController(this, LaunchesDocument);

  private ro = new ResizeObserver(this.onResize);

  @query('table') table: HTMLTableElement;

  constructor() {
    super();
    this.ro.observe(this);
  }

  @bound onResize(entries: ResizeObserverEntry[]): void {
    const [{ contentRect: { width } }] = entries;
    this.table.style.setProperty('--data-table-link-width', `${width}px`);
  }

  render(): TemplateResult {
    const { loading, data } = this.query;

    const loadingLaunches = (Array.from({ length: 10 }, () => ({ loading })) as Launch[]);

    const launchesUpcoming =
      data?.launchesUpcoming ?? loadingLaunches;

    const launchesPast =
      data?.launchesPast ?? loadingLaunches;

    const launches = [...launchesPast, ...launchesUpcoming];

    return html`
      <link rel="stylesheet" href="/src/links.css">
      <link rel="stylesheet" href="/src/skeleton.css">

      <table>
        <thead>
          <tr>
            <th>Mission</th>
            <th>Rocket</th>
            <th>Launch Date (local)</th>
          </tr>
        </thead>
        <tbody>
          ${launches.map(this.launchTemplate, this)}
        </tbody>
      </table>
    `;
  }

  launchTemplate(launch: Launch): TemplateResult {
    const { loading = false } = this.query;
    const missionPatchSmall = launch?.links?.mission_patch_small;
    return html`
      <tr class="${classMap({ loading })}">
        <th class="${classMap({ loading })}">
          <a href="/launches/${launch?.id}">
            <img alt="mission patch" src="${missionPatchSmall}" ?hidden="${!missionPatchSmall}"/>
            <span ?hidden="${!!missionPatchSmall}">🚀</span>
          </a>

          <span>${launch?.mission_name}</span>
        </th>

        <td class="${classMap({ loading })}">
          <span>${launch?.rocket?.rocket.name}</span>
        </td>

        <td class="${classMap({ loading })}">
          <span>${(launch?.launch_date_local as Date)?.toLocaleDateString()}</span>
        </td>
      </tr>
    `;
  }
}
