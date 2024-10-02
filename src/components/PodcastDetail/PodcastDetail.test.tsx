/**
 * @jest-environment jsdom
*/
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useHistory, useParams } from "react-router-dom";
import PodcastDetail from "./PodcastDetail";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { fetchPodcastDetail, fetchPodcastEpisodes } from "@src/store/reducers/podcastSlice/podcastSlice";
import { useConvertTime, useDateFormat } from "@src/hooks/useUtils";

// Mock necessary hooks and modules
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useHistory: jest.fn(),
}));

jest.mock("@src/store/store", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@src/hooks/useUtils", () => ({
  useConvertTime: jest.fn(),
  useDateFormat: jest.fn(),
}));

jest.mock("@src/store/reducers/podcastSlice/podcastSlice", () => ({
  fetchPodcastDetail: jest.fn(),
  fetchPodcastEpisodes: jest.fn(),
}));

describe("PodcastDetail Component", () => {
  const mockDispatch = jest.fn();
  const mockHistoryPush = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector.name === "podcastSlice") {
        return {
          podcast: { id: "1", contents: { results: [{ artistId: "1", artistName: "Artist" }] } },
          episodes: { data: [{ id: "1", attributes: { name: "Episode 1", releaseDateTime: "2024-10-01", durationInMilliseconds: 3000 } }] },
          podcasts: {
            feed: { podcasts: [{ id: { attributes: { "im:id": "1" } }, podcastArtist: { label: "Artist" } }] }
          }
        };
      }
      return {};
    });
    (useHistory as jest.Mock).mockReturnValue({ push: mockHistoryPush });
    (useConvertTime as jest.Mock).mockReturnValue("00:50");
    (useDateFormat as jest.Mock).mockReturnValue("2024-10-01");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the podcast details", () => {
    render(<PodcastDetail />, { wrapper: MemoryRouter });

    expect(screen.getByText("Episodes of Artist")).toBeInTheDocument();
    expect(screen.getByText("Episode 1")).toBeInTheDocument();
    expect(screen.getByText("2024-10-01")).toBeInTheDocument();
    expect(screen.getByText("00:50")).toBeInTheDocument();
  });

  it("should dispatch fetchPodcastDetail and fetchPodcastEpisodes when podcast is not available", () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce({ podcast: null }); // Simulate no podcast in state

    render(<PodcastDetail />, { wrapper: MemoryRouter });

    expect(mockDispatch).toHaveBeenCalledWith(fetchPodcastDetail("1"));
    expect(mockDispatch).toHaveBeenCalledWith(fetchPodcastEpisodes("1"));
  });

  it("should navigate to the episode page on episode click", () => {
    render(<PodcastDetail />, { wrapper: MemoryRouter });

    const episodeRow = screen.getByText("Episode 1");
    fireEvent.click(episodeRow);

    expect(mockHistoryPush).toHaveBeenCalledWith("/podcast/1/episode/1");
  });

  it("should show loading when there are no episodes", () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce({ episodes: { data: [] } }); // Simulate no episodes

    render(<PodcastDetail />, { wrapper: MemoryRouter });

    expect(screen.getByText("Loading Episodes...")).toBeInTheDocument();
  });
});
