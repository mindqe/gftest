/**
 * @jest-environment jsdom
*/
import { render, screen } from "@testing-library/react";
import { useAppSelector } from "@src/store/store";
import PodcastEpisode from "./PodcastEpisode";
import { useRouteMatch } from "react-router-dom";


jest.mock("@src/store/store", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useRouteMatch: jest.fn(),
}));

jest.mock("../sharedComponents/PodcastInfoBox/PodcastInfoBox", () => () => (
  <div>Podcast Info</div>
));

jest.mock("../sharedComponents/PodcastPlayer/PodcastPlayer", () => () => (
  <div>Podcast Player</div>
));

describe("PodcastEpisode Component", () => {
  const mockEpisodeData = [
    {
      id: "123",
      attributes: {
        name: "Episode 1",
        description: {
          standard: "This is episode 1 description",
        },
        assetUrl: "http://episode1.mp3",
      },
    },
  ];

  beforeEach(() => {
    (useAppSelector as jest.Mock).mockReturnValue({ data: mockEpisodeData });
    (useRouteMatch as jest.Mock).mockReturnValue({
      url: "podcast/456/episode/123",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("renders the podcast info box", () => {
    render(<PodcastEpisode />);

    expect(screen.getByText("Podcast Info")).toBeInTheDocument();
  });

  describe("displays the episode name and description when episode is found", () => {
    render(<PodcastEpisode />);

    expect(screen.getByText("Episode 1")).toBeInTheDocument();
    expect(screen.getByText("This is episode 1 description")).toBeInTheDocument();
  });

  describe("renders the podcast player with the correct asset URL", () => {
    render(<PodcastEpisode />);

    expect(screen.getByText("Podcast Player")).toBeInTheDocument();
  });

  describe("does not render episode details if episode is not found", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ data: [] });

    render(<PodcastEpisode />);

    expect(screen.queryByText("Episode 1")).not.toBeInTheDocument();
    expect(screen.queryByText("This is episode 1 description")).not.toBeInTheDocument();
  });
});
