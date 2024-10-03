import Home from './pages/Home';
import {
  fetchPodcastDetail,
  fetchPodcastList,
  fetchPodcastEpisodes,
} from './store/reducers/podcastSlice/podcastSlice';
import PodcastDetail from './components/PodcastDetail/PodcastDetail';
import PodcastEpisode from './components/PodcastEpisode/PodcastEpisode';

interface Routes {
  path: string;
  exact?: boolean;
  component: () => React.ReactNode;
  getInitialData: (store: any, params: Record<string, any>) => Promise<void>;
}

const routes: Routes[] = [
  {
    path: '/',
    exact: true,
    component: Home,
    getInitialData: async (store: any) => {
      await store.dispatch(fetchPodcastList());
    },
  },
  {
    path: '/podcast/:id',
    exact: true,
    component: PodcastDetail,
    getInitialData: async (store, params) => {
      const { id } = params;
      await store.dispatch(fetchPodcastList());
      await store.dispatch(fetchPodcastDetail(id));
      await store.dispatch(fetchPodcastEpisodes(id));
    },
  },
  {
    path: '/podcast/:id/episode/:id',
    exact: true,
    component: PodcastEpisode,
    getInitialData: async (store, params) => {
      await store.dispatch(fetchPodcastEpisodes(params['id']));
    },
  },
];

export default routes;
