// src/infrastructure/repositories/product.repository.ts

import { Http } from '@domain/repositories/Http';
import { PodcastRepository } from '@domain/repositories/PodcastRepository';
import { podcastRepository } from '@infrastructure/repositories/productRepository';
import { httpAxios } from './httpAxios'

const client: Http = httpAxios;

export const podcastRepositoryInstance: PodcastRepository = podcastRepository(client);
