import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ApolloQueryController } from '@apollo-elements/core';

import 'leaflet-element';
import '@power-elements/card';

import shared from '../shared.css';
import style from './launchpads.css';

import { LaunchpadsQueryDocument } from './Launchpads.query';
import { Landpad, Launchpad } from '../../schema';

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

@customElement('spacex-launchpads')
export class Launchpads extends LitElement {
  static readonly is = 'spacex-launchpads';

  static readonly styles = [shared, style];

  query = new ApolloQueryController(this, LaunchpadsQueryDocument);

  @property({ attribute: false }) selected: Launchpad|Landpad;

  render(): TemplateResult {
    const launchpads = this.query.data?.launchpads ?? [];
    const landpads = this.query.data?.landpads ?? [];
    return html`
      <leaflet-map ?fit-to-markers="${!!this.query.data}">
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
        <h2 slot="heading">${(this.selected as Launchpad)?.name ?? ''}</h2>
        <p>${this.selected?.details ?? ''}</p>
        <a href="${this.selected?.wikipedia ?? '#'}" target="_blank" rel="noopener noreferrer">Read More</a>
      </p-card>
    `;
  }

  onClickMarker(event: MouseEvent & { target: HTMLElement }): void {
    event.preventDefault();
    const id = event.target.dataset.id ?? null;
    this.selected =
      this.query.data.landpads.find(x => x.id === id) ??
      this.query.data.launchpads.find(x => x.id === id) ??
      null;
  }
}
