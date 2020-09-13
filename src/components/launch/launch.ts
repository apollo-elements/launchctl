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
    return html`
      <article>
        <h1 class="${classMap({ loading })}">${launch?.mission_name} Mission</h1>
        <dl>

          <dt>Launch Date</dt>
          <dd class="${classMap({ loading })}">${local?.toLocaleDateString()}</dd>

          <dt>Launch Site</dt>
          <dd class="${classMap({ loading })}">${launch?.launch_site?.site_name_long}</dd>

          <dt>Rocket</dt>
          <dd class="${classMap({ loading })}">${launch?.rocket?.rocket_name} ${launch?.rocket?.rocket_type}</dd>

        </dl>

        <p class="${classMap({ loading })}">${launch?.details}</p>

        <a href="${launch?.links?.article_link}" target="_blank" rel="noopener noreferer">Media</a>
        <a href="${launch?.links?.wikipedia}" target="_blank" rel="noopener noreferer">Wikipedia</a>
      </article>

      <h2 ?hidden="${!launch?.links?.video_link}">Video</h2>

      <youtube-video class="${classMap({ loading })}" controls src="${ifDefined(launch?.links?.video_link)}"></youtube-video>

      <h2 ?hidden="${!launch?.links?.flickr_images?.length}">Gallery</h2>

      <masonry-layout class="${classMap({ loading: loading || !this.masonryDefined })}">
        ${launch?.links?.flickr_images?.map((x, i) => html`
          <img src="${x}" loading="lazy" class="flickr-pic" alt="Image ${i} of ${launch?.rocket?.rocket_type}"/>
        `)}
      </masonry-layout>
    `;
  }
}
