export interface PodcastEpisodeItemModel {
  id: string;
  type: string;
  href: string;
  attributes: {
    offers: {
      kind: 'get';
      type: 'STDQ';
    }[];
    contentAdvisory: string;
    copyright: string;
    genreNames: string[];
    artworkOrigin: string;
    itunesTitle: string;
    kind: string;
    mediaKind: string;
    description: {
      standard: string;
      short: string;
    };
    artwork: {
      width: number;
      height: number;
      url: string;
      bgColor: string;
      textColor1: string;
      textColor2: string;
      textColor3: string;
      textColor4: string;
    };
    url: string;
    releaseDateTime: string;
    websiteUrl: string;
    durationInMilliseconds: number;
    name: string;
    guid: string;
    artistName: string;
    contentRating: string;
    subscribable: boolean;
    assetUrl: string;
  };
  relationships: {
    channel: {
      href: string;
      data: {
        id: string;
        type: string;
        href: string;
        attributes: {
          seller: string;
          offers: {
            kind: string;
            type: string;
          }[];

          releaseFrequency: string;
          description: {
            standard: string;
          };
          backgroundSwatch: string;
          upsell: [
            {
              joinText: string;
              benefitsText: string;
              kind: string;
            },
          ];
          subscriptionArtwork: {
            width: number;
            height: number;
            url: string;
            bgColor: string;
            textColor1: string;
            textColor2: string;
            textColor3: string;
            textColor4: string;
          };
          artwork: {
            width: number;
            height: number;
            url: string;
            bgColor: string;
            textColor1: string;
            textColor2: string;
            textColor3: string;
            textColor4: string;
          };
          url: string;
          showCount: number;
          displayType: string;
          websiteUrl: string;
          editorialArtwork: {};
          name: string;
          logoArtwork: {
            width: number;
            height: number;
            url: string;
            bgColor: string;
            textColor1: string;
            textColor2: string;
            textColor3: string;
            textColor4: string;
          };
        };
      }[];
    };
  };
}
