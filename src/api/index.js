import axios from 'axios';
import { Router } from 'express';

const api = Router();

api.get('/podcasts/episodes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(
      `https://amp-api.podcasts.apple.com/v1/catalog/us/podcasts/${id}/episodes?extend%5Bpodcast-channels%5D=editorialArtwork%2CisSubscribed%2CsubscriptionArtwork%2CsubscriptionOffers&include=channel&limit=25&with=entitlements&l=en-USz`,
      {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkM0SjdHQlA3NEgifQ.eyJpc3MiOiJVTTdOOVJUVDdHIiwiaWF0IjoxNzI2ODUyODQ1LCJleHAiOjE3MzQxMTA0NDUsInJvb3RfaHR0cHNfb3JpZ2luIjpbImFwcGxlLmNvbSJdfQ.ZaQOKUP-QwApJXu8LjMi59J5klUYfcJMOpwuBYmyl7DGzYHYU8QTF9c2MSKtDlKaCkILo5vC0f_TgtSseVK7tQ',
          referer: 'https://podcasts.apple.com/',
          origin: 'https://podcasts.apple.com',
        },
      }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

export default api;
