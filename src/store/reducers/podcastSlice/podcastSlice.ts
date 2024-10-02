import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { podcastService } from '@domain/services/PodcastService';
import { podcastRepositoryInstance } from '@infrastructure/instances/podcastRepositoryInstance';
import { ResponseMappedModel } from '@src/mappers/models/ResponseMappedModel';
import { PodcastDetailModel } from '@domain/models/PodcastDetailModel';
import { PodcastEpisodeModel } from '@domain/models/PodcastEpisodeModel';


export const fetchPodcastList = createAsyncThunk(
  'podcast/fetchPodcastList',
  async (_, { rejectWithValue }) => {
    try {
      const responsePodcasts = await podcastService(podcastRepositoryInstance).getPodcasts();
      return responsePodcasts;
    } catch (error) {
      return rejectWithValue('Failed to fetch podcasts');
    }
  }
);

export const fetchPodcastDetail = createAsyncThunk(
  'podcast/fetchPodcastDetail',
  async (id: string) => {
    try {
      const detail = await podcastService(podcastRepositoryInstance).getPodcastDetail(id);
      return detail;
    } catch (error) {
      console.log(error)
    }
  }
);

export const fetchPodcastEpisodes = createAsyncThunk(
  'episodes/fetchAllEpisodes',
  async (id: string) => {
    try {
      const episodes = await podcastService(podcastRepositoryInstance).getPodcastEpisodes(id);
      return episodes; 
    } catch (error) {
      console.log(error)
    }
  }
);

interface PodcastState {
  podcasts: ResponseMappedModel | null;
  podcast: PodcastDetailModel | null;
  episodes: PodcastEpisodeModel | null,
  loading: boolean;
  error: string | null;
}

const initialState: PodcastState = {
  podcasts: null,
  podcast: null,
  episodes: null,
  loading: false,
  error: null
};

const podcastSlice = createSlice({
  name: 'podcast',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchPodcastList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPodcastList.fulfilled, (state, action: PayloadAction<ResponseMappedModel>) => {
      return {
        ...state, // Persist the previous global state
        podcasts: { ...(state.podcasts || {}), ...action.payload }, // Update episodes with previous and new data
        loading: false, // Set loading to false
      };
    });
    builder.addCase(fetchPodcastList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchPodcastDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPodcastDetail.fulfilled, (state, action: PayloadAction<PodcastDetailModel>) => {
      return {
        ...state, // Persist the previous global state
        podcast: { ...(state.podcast || {}), ...action.payload }, // Update podcast with previous and new data
        loading: false, // Set loading to false
      };
    });
    builder.addCase(fetchPodcastDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchPodcastEpisodes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPodcastEpisodes.fulfilled, (state, action: PayloadAction<PodcastEpisodeModel>) => {
      return {
        ...state, // Persist the previous global state
        episodes: { ...(state.episodes || {}), ...action.payload }, // Update episodes with previous and new data
        loading: false, // Set loading to false
      };
    });
    builder.addCase(fetchPodcastEpisodes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const selectLoadingPodcast = (state: { podcast: PodcastState }) => state.podcast.loading;
export const selectErrorPodcast = (state: { podcast: PodcastState }) => state.podcast.error;

export const selectLoadingPodcasts = (state: { podcasts: PodcastState }) => state.podcasts.loading;
export const selectErrorPodcasts = (state: { podcasts: PodcastState }) => state.podcasts.error;

export const selectLoadingEpisodes = (state: { episodes: PodcastState }) => state.episodes.loading;
export const selectErrorEpisodes = (state: { episodes: PodcastState }) => state.episodes.error;

export default podcastSlice.reducer;
