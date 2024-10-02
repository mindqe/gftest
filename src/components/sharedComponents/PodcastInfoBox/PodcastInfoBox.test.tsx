/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import PodcastInfoBox from "./PodcastInfoBox";
import { useAppSelector } from "@src/store/store";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@src/store/reducers/rootReducer";

const mockStore = (initialState: any) => {
  return configureStore({
    reducer: rootReducer.podcastSlice,
    preloadedState: initialState,
  });
};

jest.mock("@src/store/store", () => ({
  ...jest.requireActual("@src/store/store"),
  useAppSelector: jest.fn(),
}));

describe("PodcastInfoBox component", () => {
  const mockPodcastData = {
    feed: {
      podcasts: [
        {
          id: { attributes: { "im:id": "1" } },
          podcastImage: [
            { label: "small.jpg" },
            { label: "medium.jpg" },
            { label: "large.jpg" }
          ],
          podcastArtist: { label: "Artist Name" },
          summary: { label: "Podcast description" }
        },
      ],
    },
  };
  const mockPodcastDataFalse = {
    feed: {
      podcasts: [
        {
          id: { attributes: { "im:id": "1" } },
          podcastImage: [
            { label: "small.jpg" },
            { label: "medium.jpg" },
            { label: "large.jpg" }
          ],
          podcastArtist: { label: "Artist Namee" },
          summary: { label: "Podcast descriptionn" }
        },
      ],
    },
  };

  describe("should render the podcast details when a valid id is provided", () => {
    (useAppSelector as jest.Mock).mockReturnValue(mockPodcastData);

    render(
      <Provider store={mockStore({ podcastSlice: { podcasts: mockPodcastData } })}>
        <PodcastInfoBox id="1" />
      </Provider>
    );

    // Assertions
    expect(screen.getByAltText("podcast-image")).toHaveAttribute("src", "large.jpg");
    expect(screen.getByText("Artist Name")).toBeInTheDocument();
    expect(screen.getByText("Podcast description")).toBeInTheDocument();
  });

  describe("should render nothing when no podcast matches the provided id", () => {
    (useAppSelector as jest.Mock).mockReturnValue(mockPodcastData);

    render(
      <Provider store={mockStore({ podcastSlice: { podcasts: mockPodcastDataFalse } })}>
        <PodcastInfoBox id="999" />
      </Provider>
    );

    expect(screen.queryByText("Artist Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Podcast description")).not.toBeInTheDocument();
  });
});
