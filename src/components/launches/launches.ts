import { ApolloQuery, customElement, html, query, TemplateResult } from '@apollo-elements/lit-apollo';
import { classMap } from 'lit-html/directives/class-map';

import { TypePoliciesMixin } from '@apollo-elements/mixins/type-policies-mixin';

import ResizeObserver from 'resize-observer-polyfill';

import type {
  LaunchesQueryData as Data,
  LaunchesQueryVariables as Variables,
  Launch as _Launch,
} from '../../schema';

import LaunchesQuery from './Launches.query.graphql';

import shared from '../shared.css';
import style from './launches.css';

type Launch = _Launch & { loading?: boolean };

@customElement('spacex-launches')
export class SpacexLaunches extends TypePoliciesMixin(ApolloQuery)<Data, Variables> {
  static readonly is = 'spacex-launches'

  static readonly styles = [shared, style];

  query = LaunchesQuery;

  typePolicies = {
    Launch: {
      fields: {
        launch_date_local(next: string): Date {
          return new Date(next);
        },
      },
    },
  }

  @query('table') table: HTMLTableElement;

  private ro: ResizeObserver;

  constructor() {
    super();
    this.ro = new ResizeObserver(this.onResize.bind(this));
    this.ro.observe(this);
  }

  onResize(entries: ResizeObserverEntry[]): void {
    const [{ contentRect: { width } }] = entries;
    this.table.style.setProperty('--data-table-link-width', `${width}px`);
  }

  render(): TemplateResult {
    const { loading, data } = this;

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
          ${launches.map(this.launchTemplate)}
        </tbody>
      </table>
    `;
  }

  launchTemplate(launch: Launch): TemplateResult {
    const { loading = false } = launch;
    return html`
      <tr class="${classMap({ loading })}">
        <th class="${classMap({ loading })}">
          <a href="/launches/${launch?.id}">🚀</a>
          <span>${launch?.mission_name}</span>
        </th>

        <td class="${classMap({ loading })}">
          <span>${launch?.rocket?.rocket_name}</span>
        </td>

        <td class="${classMap({ loading })}">
          <span>${(launch?.launch_date_local as Date)?.toLocaleDateString()}</span>
        </td>
      </tr>
    `;
  }
}
