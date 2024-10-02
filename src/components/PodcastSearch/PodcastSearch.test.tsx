/**
 * @jest-environment jsdom
*/
import { render, screen, fireEvent } from '@testing-library/react';
import PodcastSearch from './PodcastSearch';

describe('PodcastSearch Component', () => {
  const mockSetSearchTerm = jest.fn();
  const filteredPodcasts = [
    { id: 1, title: 'Podcast One' },
    { id: 2, title: 'Podcast Two' },
  ];
  const searchTerm = 'podcast';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('renders the component correctly', () => {
    render(
      <PodcastSearch
        filteredPodcasts={filteredPodcasts}
        searchTerm={searchTerm}
        setSearchTerm={mockSetSearchTerm}
      />
    );

    const inputElement = screen.getByPlaceholderText('Search podcasts...');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(searchTerm);

    const badgeElement = screen.getByText(filteredPodcasts.length.toString());
    expect(badgeElement).toBeInTheDocument();
  });

  describe('displays the correct number of filtered podcasts', () => {
    render(
      <PodcastSearch
        filteredPodcasts={filteredPodcasts}
        searchTerm={searchTerm}
        setSearchTerm={mockSetSearchTerm}
      />
    );

    const badgeElement = screen.getAllByTestId('podcast-badge');
    expect(badgeElement).toHaveTextContent(filteredPodcasts.length.toString());
  });

  describe('calls setSearchTerm with the correct value when typing', () => {
    render(
      <PodcastSearch
        filteredPodcasts={filteredPodcasts}
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
      />
    );

    const inputElement = screen.getByPlaceholderText('Search podcasts...');
    
    fireEvent.change(inputElement, { target: { value: 'new search' } });
    
    expect(mockSetSearchTerm).toHaveBeenCalledWith('new search');
  });

  describe('matches the snapshot', () => {
    const { container } = render(
      <PodcastSearch
        filteredPodcasts={filteredPodcasts}
        searchTerm={searchTerm}
        setSearchTerm={mockSetSearchTerm}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
