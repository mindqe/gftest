import { PodcastRepository } from "../repositories/PodcastRepository";
export const podcastService = (
  repository: PodcastRepository
): PodcastRepository => ({
  getPodcasts: async () => {
    return repository.getPodcasts();
  },
  getPodcastDetail: async (id: string) => {
    return repository.getPodcastDetail(id);
  },
  getPodcastEpisodes: async (id: string) => {
    return repository.getPodcastEpisodes(id);
  },
});
