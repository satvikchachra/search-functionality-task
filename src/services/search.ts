import { GitHubClient } from "./config/axiosInstance";

export const getUsersSearchResult = (query: string) => {
  return GitHubClient.get(`search/users?${query}`);
};
