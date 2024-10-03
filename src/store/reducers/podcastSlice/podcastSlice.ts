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
      const responsePodcasts = await podcastService(
        podcastRepositoryInstance
      ).getPodcasts();
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
      const detail = await podcastService(
        podcastRepositoryInstance
      ).getPodcastDetail(id);
      return detail;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchPodcastEpisodes = createAsyncThunk(
  'episodes/fetchAllEpisodes',
  async (id: string) => {
    try {
      const episodes = await podcastService(
        podcastRepositoryInstance
      ).getPodcastEpisodes(id);
      return episodes;
    } catch (error) {
      console.log(error);
    }
  }
);

interface PodcastState {
  podcasts: ResponseMappedModel | null;
  podcast: PodcastDetailModel | null;
  episodes: PodcastEpisodeModel | null;
  loadingPodcasts: boolean;
  loadingPodcast: boolean;
  loadingEpisodes: boolean;
  error: string | null;
}

const initialState: PodcastState = {
  podcasts: null,
  podcast: null,
  episodes: null,
  loadingPodcasts: false,
  loadingPodcast: false,
  loadingEpisodes: false,
  error: null,
};

const podcastSlice = createSlice({
  name: 'podcast',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPodcastList.pending, (state) => {
      state.loadingPodcasts = true;
      state.error = null;
    });
    builder.addCase(
      fetchPodcastList.fulfilled,
      (state, action: PayloadAction<ResponseMappedModel>) => {
        return {
          ...state,
          podcasts: { ...(state.podcasts || {}), ...action.payload },
          loadingPodcasts: false,
        };
      }
    );
    builder.addCase(fetchPodcastList.rejected, (state, action) => {
      state.loadingPodcasts = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchPodcastDetail.pending, (state) => {
      state.loadingPodcast = true;
      state.error = null;
    });
    builder.addCase(
      fetchPodcastDetail.fulfilled,
      (state, action: PayloadAction<PodcastDetailModel>) => {
        return {
          ...state,
          podcast: { ...(state.podcast || {}), ...action.payload },
          loadingPodcast: false,
        };
      }
    );
    builder.addCase(fetchPodcastDetail.rejected, (state, action) => {
      state.loadingPodcast = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchPodcastEpisodes.pending, (state) => {
      state.loadingEpisodes = true;
      state.error = null;
    });
    builder.addCase(
      fetchPodcastEpisodes.fulfilled,
      (state, action: PayloadAction<PodcastEpisodeModel>) => {
        return {
          ...state,
          episodes: { ...(state.episodes || {}), ...action.payload },
          loadingEpisodes: false,
        };
      }
    );
    builder.addCase(fetchPodcastEpisodes.rejected, (state, action) => {
      state.loadingEpisodes = false;
      state.error = action.payload as string;
    });
  },
});

export default podcastSlice.reducer;
