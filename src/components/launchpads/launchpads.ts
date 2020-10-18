import {
  ApolloQuery,
  html,
  customElement,
  TemplateResult,
  property,
} from '@apollo-elements/lit-apollo';

import type {
  LaunchpadsQueryData as Data,
  LaunchpadsQueryVariables as Variables,
} from '../../schema';

import 'leaflet-element';
import '@power-elements/card';

import shared from '../shared.css';
import style from './launchpads.css';

import LaunchpadsQuery from './Launchpads.query.graphql';

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

@customElement('spacex-launchpads')
export class Launchpads extends ApolloQuery<Data, Variables> {
  static readonly is = 'spacex-launchpads';

  static readonly styles = [shared, style];

  query = LaunchpadsQuery;

  @property({ attribute: false }) selected: Data['landpads' | 'launchpads'][number];

  render(): TemplateResult {
    const launchpads = this.data?.launchpads ?? [];
    const landpads = this.data?.landpads ?? [];
    return html`
      <leaflet-map ?fit-to-markers="${!!this.data}">
        <leaflet-tilelayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            max-zoom="19"
            .attribution="${attribution}"
        ></leaflet-tilelayer>
        ${launchpads.map(x => html`
          <leaflet-marker title="${x.name}"
              rise-on-hover
              longitude="${x.location.longitude}"
              latitude="${x.location.latitude}"
              data-id="${x.id}"
              @click="${this.onClickMarker}"
          ></leaflet-marker>
        `)}

        ${landpads.map(x => html`
          <leaflet-marker title="${x.name}"
              rise-on-hover
              longitude="${x.location.longitude}"
              latitude="${x.location.latitude}"
              data-id="${x.id}"
              @click="${this.onClickMarker}"
          ></leaflet-marker>
        `)}
      </leaflet-map>

      <p-card>
        <h2 slot="heading">${this.selected?.name ?? ''}</h2>
        <p>${this.selected?.details ?? ''}</p>
        <a href="${this.selected?.wikipedia ?? '#'}" target="_blank" rel="noopener noreferrer">Read More</a>
      </p-card>
    `;
  }

  onClickMarker(event: MouseEvent & { target: HTMLElement }): void {
    event.preventDefault();
    const id = event.target.dataset.id ?? null;
    this.selected =
      this.data.landpads.find(x => x.id === id) ??
      this.data.launchpads.find(x => x.id === id) ??
      null;
  }
}
