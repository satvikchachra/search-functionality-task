import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Axios Request Config for GitHub API with Authorization
export const gitHubClientConfig: AxiosRequestConfig = {
  baseURL: "https://api.github.com/",
  headers: {
    Authorization: `token ${process.env.REACT_APP_ACCESS_TOKEN}`,
  },
};

// Axios Instance for GitHub API
export const GitHubClient: AxiosInstance = axios.create(gitHubClientConfig);
