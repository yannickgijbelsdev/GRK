import React from 'react';
import NewsListPage from './NewsListPage';

const EventsTicketsListPage = () => (
  <NewsListPage
    title="Events & Tickets"
    subtitle="Dit zijn alle events en tickets voor de exclusieve shows van GRK."
    category="events-tickets"
    basePath="/events-tickets"
  />
);

export default EventsTicketsListPage;
