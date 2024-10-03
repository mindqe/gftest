import { ResponseMappedModel } from '@src/mappers/models/ResponseMappedModel';

export interface PodcastRepository {
  getPodcasts: () => Promise<ResponseMappedModel>;
  getPodcastDetail: (id: string) => Promise<any>;
  getPodcastEpisodes: (id: string, domain: string) => Promise<any>;
}
