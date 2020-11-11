import {
  ApolloQuery,
  customElement,
  html,
  internalProperty,
  TemplateResult,
} from '@apollo-elements/lit-apollo';

import { TypePoliciesMixin } from '@apollo-elements/mixins/type-policies-mixin';

import { routeVar } from '../../router';

import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';

import type {
  LaunchQueryData as Data,
  LaunchQueryVariables as Variables,
} from '../../schema';

import shared from '../shared.css';
import style from './launch.css';

import LaunchQuery from './Launch.query.graphql';

@customElement('spacex-launch')
export class SpacexLaunches extends TypePoliciesMixin(ApolloQuery)<Data, Variables> {
  static readonly is = 'spacex-launch'

  static readonly styles = [shared, style];

  @internalProperty() masonryDefined = false;

  query = LaunchQuery;

  typePolicies = {
    Launch: {
      fields: {
        launch_date_local(next: string): Date {
          return new Date(next);
        },
      },
    },
  }

  /**
   * Ensure that query does not go over the wire unless user is on a `/launches/:launchId` page.
   */
  shouldSubscribe(): boolean {
    const { params } = routeVar();
    return !!(params?.launchId);
  }

  async updated(): Promise<void> {
    if (this.data?.launch?.links?.video_link)
      import('youtube-video-element');
    if (this.data?.launch?.links?.flickr_images?.length) {
      import('@appnest/masonry-layout');
      await customElements.whenDefined('masonry-layout');
      this.masonryDefined = true;
    }
  }

  render(): TemplateResult {
    const { loading } = this;
    const launch = this.data?.launch;
    const local = launch?.launch_date_local as Date;
    const missionPatch = launch?.links?.mission_patch;
    const videoLink = launch?.links?.video_link;
    const images = launch?.links?.flickr_images;
    return html`
      <link rel="stylesheet" href="/src/links.css">
      <link rel="stylesheet" href="/src/skeleton.css">

      <article>
        <header>
          <h1 class="${classMap({ loading })}">${launch?.mission_name} Mission</h1>
          <img role="presentation" src="${missionPatch}" ?hidden="${!missionPatch}"/>
          <dl>

            <dt>Launch Date</dt>
            <dd class="${classMap({ loading })}">${local?.toLocaleDateString()}</dd>

            <dt>Launch Site</dt>
            <dd class="${classMap({ loading })}">${launch?.launch_site?.site_name_long}</dd>

            <dt>Rocket</dt>
            <dd class="${classMap({ loading })}">${launch?.rocket?.rocket.name} ${launch?.rocket?.rocket.type}</dd>

          </dl>

          <p class="${classMap({ loading })}">${launch?.details}</p>

          <a href="${launch?.links?.article_link}" target="_blank" rel="noopener noreferer">Media</a>
          <a href="${launch?.links?.wikipedia}" target="_blank" rel="noopener noreferer">Wikipedia</a>
        </header>

      </article>
      <article class="${classMap({ loading })}" ?hidden="${!loading && (!videoLink && !images.length)}">
        <youtube-video controls src="${ifDefined(videoLink)}"></youtube-video>

        <section id="media">
          <h2 ?hidden="${!images?.length}">Gallery</h2>
          <masonry-layout class="${classMap({ loading: loading || !this.masonryDefined })}">
            ${images?.map?.((x, i, a) => html`
              <img src="${x}" loading="lazy" class="flickr-pic" alt="${launch?.rocket?.rocket.type} (${i} of ${a.length})"/>
            `)}
          </masonry-layout>
        </section>
      </article>

    `;
  }
}
