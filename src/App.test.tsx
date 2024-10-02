/**
 * @jest-environment jsdom
*/
import App from "./App";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";
import { initStore } from "./store/store";
import cache from "./cache";
import { ResponseMappedModel } from "./mappers/models/ResponseMappedModel";
import { Store, UnknownAction } from "redux";
import { responseMock } from "@mocks/responseMock";
import { PodcastDetailModel } from "@domain/models/PodcastDetailModel";
import { PodcastEpisodeModel } from '@domain/models/PodcastEpisodeModel';
// Mocking global variables for server-side rendering

interface PodcastState {
  podcasts: ResponseMappedModel | null;
  podcast: PodcastDetailModel | null;
  episodes: PodcastEpisodeModel | null
  loading: boolean;
  error: string | null;
}
type PodcastStore = { podcastSlice: PodcastState };

const mockPreloadedState: PodcastStore = {
    podcastSlice : {podcasts: null, podcast: null, episodes: null,  loading: false, error: null}
};

const mockWindow = (mockPreloadedState: ResponseMappedModel) => {
    (window as any).__PRELOADED_STATE__ = {};
    (window as any).__PRELOADED_STATE__ = mockPreloadedState;
  };
  
  const mockClearWindow = () => {
    delete (window as any).__PRELOADED_STATE__;
  };

describe("SSR and Client-side rendering without use-ssr", () => {
  let store: Store<any, UnknownAction, unknown>;

  beforeEach(() => store = initStore(mockPreloadedState));

  afterEach(() => {
    mockClearWindow();
  });

  it("renders correctly on the client-side", () => {
    const { container } = render(
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <CacheProvider value={cache}>
              <App />
            </CacheProvider>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    );

    expect(container).toBeInTheDocument();

  });

  it("renders correctly on the server-side", () => {
   
    mockWindow(responseMock);

    const { container } = render(
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <CacheProvider value={cache}>
              <App />
            </CacheProvider>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });
});
