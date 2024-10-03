import { PodcastRepository } from '@domain/repositories/PodcastRepository';
import { Http } from '../../domain/repositories/Http';
import { ResponseFullDTO } from '../http/dto/ResponseFullDTO';
import { mapResponseToDTO } from '@src/mappers/helpers/mapResponseToDTO';
import { PodcastDetailDTO } from '@infrastructure/http/dto/PodcastDetailDTO';
export const podcastRepository = (client: Http): PodcastRepository => ({
  getPodcasts: async () => {
    const response = await client.get<ResponseFullDTO>(
      'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'
    );

    const mappedResponse = mapResponseToDTO<typeof response>(response, {
      'feed.entry': 'podcasts',
      'feed.entry.im:artist': 'podcastArtist',
      'feed.entry.im:name': 'podcastName',
      'feed.entry.im:image': 'podcastImage',
      'feed.entry.im:price': 'podcastPrice',
      'feed.entry.im:contentType': 'podcastContentType',
    });

    return mappedResponse;
  },
  getPodcastDetail: async (id: string | null) => {

    const baseURL = encodeURIComponent(
      `https://itunes.apple.com/lookup?id=${id}`
    );
    const CORS = `https://api.allorigins.win/get?url=${baseURL}`;
    const response = await client.get<PodcastDetailDTO>(`${CORS}`);

    const replacedPodcastDetail = response.contents
      .replaceAll(/\\n/g, '\n')
      .replaceAll(/\\'/g, "'")
      .replaceAll(/\\"/g, '"');

    const parsedPodcastDetail = JSON.parse(replacedPodcastDetail);

    return parsedPodcastDetail;
  },
  getPodcastEpisodes: async (id: string) => {
    const data = await client.get(
      `http://localhost:3005/api/podcasts/episodes/${id}`
    );
    return data;
  },
});
