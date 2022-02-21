import React from "react";

export type ErrorState = {
  message: string;
};

export type GitHubSearchResultDataItem = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  received_events_url: string;
  type: string;
  score: number;
  following_url: string;
  gists_url: string;
  starred_url: string;
  events_url: string;
  site_admin: boolean;
};

export type RequestStatusProps =
  | "SUCCESS"
  | "LOADING"
  | "FAILURE"
  | "IDLE"
  | "CLEAR";

export type DataProps = {
  error: null | ErrorState;
  fetchedDataList: GitHubSearchResultDataItem[];
  status: RequestStatusProps;
};

export type SearchQueryCacheProps = {
  list: GitHubSearchResultDataItem[];
  lastPageNumber: number;
};

export type CacheProps = {
  [key: string]: SearchQueryCacheProps;
};

export type RequestedDataProps = {
  searchQuery: string;
  resultsPerPage: number;
  requestedPageNumber: number;
};

export type MessageCardProps = {
  primaryText: string;
  secondaryText: string;
};

export type SearchProps = {
  label: string;
  placeholder: string;
  initialRequestedState: RequestedDataProps;
  requestedData: RequestedDataProps;
  setRequestedData: React.Dispatch<React.SetStateAction<RequestedDataProps>>;
  minimumSearchQueryLength: number;
  messagePrimaryText: string;
  messageSecondaryText: string;
};

export type SearchListProps = {
  list: GitHubSearchResultDataItem[];
  status: RequestStatusProps;
};

export type SearchListItemProps = {
  item: GitHubSearchResultDataItem;
};
