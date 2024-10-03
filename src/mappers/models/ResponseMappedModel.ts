export interface ResponseMappedModel {
  feed: {
    author: {
      name: {};
      uri: {
        label: string;
      };
    };
    podcasts: {
      podcastName: {
        label: string;
      };
      podcastImage: [
        {
          label: string;
          attributes: {
            height: string;
          };
        },
        {
          label: string;
          attributes: {
            height: string;
          };
        },
        {
          label: string;
          attributes: {
            height: string;
          };
        },
      ];
      summary: {
        label: string;
      };
      podcastPrice: {
        label: string;
        attributes: {
          amount: string;
          currency: string;
        };
      };
      podcastContentType: {
        attributes: {
          term: string;
          label: string;
        };
      };
      rights: {
        label: string;
      };
      title: {
        label: string;
      };
      link: {
        attributes: {
          rel: string;
          type: string;
          href: string;
        };
      };
      id: {
        label: string;
        attributes: {
          'im:id': string;
        };
      };
      podcastArtist: {
        label: string;
        attributes: {
          href: string;
        };
      };
      category: {
        attributes: {
          'im:id': string;
          term: string;
          scheme: string;
          label: string;
        };
      };
      'im:releaseDate': {
        label: Date;
        attributes: {
          label: string;
        };
      };
    }[];
    updated: {
      label: Date;
    };
    rights: {
      label: string;
    };
    title: {
      label: string;
    };
    icon: {
      label: string;
    };
    link: [
      {
        attributes: {
          rel: string;
          type: string;
          href: string;
        };
      },
      {
        attributes: {
          rel: string;
          href: string;
        };
      },
    ];
    id: {
      label: string;
    };
  };
}
