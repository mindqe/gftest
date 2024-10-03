import { Http } from '@domain/repositories/Http';
import { PodcastRepository } from '@domain/repositories/PodcastRepository';
import { podcastRepository } from '@infrastructure/repositories/podcastRepository';
import { httpAxios } from './httpAxios';

const client: Http = httpAxios;

export const podcastRepositoryInstance: PodcastRepository =
  podcastRepository(client);
