export interface PodcastDetailModel {
  id: {
    attributes: {
      'im:id': string;
    };
  };
  contents: {
    resultCount: number;
    results: {
      [x: string]: any;
      wrapperType: string;
      kind: string;
      artistId: 1535844019;
      collectionId: 1535809341;
      trackId: 1535809341;
      artistName: string;
      collectionName: string;
      trackName: string;
      collectionCensoredName: string;
      trackCensoredName: string;
      artistViewUrl: string;
      collectionViewUrl: string;
      feedUrl: string;
      trackViewUrl: string;
      artworkUrl30: string;
      artworkUrl60: string;
      artworkUrl100: string;
      collectionPrice: number;
      trackPrice: number;
      collectionHdPrice: 0;
      releaseDate: string;
      collectionExplicitness: string;
      trackExplicitness: string;
      trackCount: number;
      trackTimeMillis: number;
      country: string;
      currency: string;
      primaryGenreName: string;
      contentAdvisoryRating: string;
      artworkUrl600: string;
      genreIds: [string, string];
      genres: [string, string];
    }[];
  };
}
