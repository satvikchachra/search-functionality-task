import { useEffect, useRef, useCallback, useState } from "react";
import {
  CacheProps,
  RequestedDataProps,
  DataProps,
  GitHubSearchResultDataItem,
} from "../types/globals";
import axios, { AxiosError } from "axios";
import { MINIMUM_SEARCH_QUERY_LENGTH } from "../utils/constants";
import { getUsersSearchResult } from "../services/search";

const useSearchGithubUsers = ({
  searchQuery,
  resultsPerPage,
  requestedPageNumber,
}: RequestedDataProps) => {
  // Creating Query String based on searchQuery, resultsPerPage, requestedPageNumber parameters
  const url = new URLSearchParams({
    q: searchQuery,
    per_page: `${resultsPerPage}`,
    page: `${requestedPageNumber}`,
  }).toString();

  // Creating a cache for storing list of results and last requested page number of search queries
  const cache = useRef<CacheProps>({});

  // Default/Initial State will be IDLE
  const initialState: DataProps = {
    status: "IDLE",
    error: null,
    fetchedDataList: [],
  };

  const [data, setData] = useState<DataProps>(initialState);

  // On Success Response
  const successHandler = useCallback(
    (items: GitHubSearchResultDataItem[], query: string, pageNum: number) => {
      const previousCacheQueryObject = cache.current[query];

      let updatedItemsList: GitHubSearchResultDataItem[] = [];

      if (previousCacheQueryObject) {
        // Append new search results at the end
        updatedItemsList = [...previousCacheQueryObject.list, ...items];
      } else {
        updatedItemsList = items;
      }

      // Update Query Cache Object
      cache.current[query] = {
        ...previousCacheQueryObject,
        list: updatedItemsList,
        lastPageNumber: previousCacheQueryObject
          ? Math.max(pageNum, previousCacheQueryObject.lastPageNumber)
          : pageNum,
      };

      setData({
        status: "SUCCESS",
        error: null,
        fetchedDataList: updatedItemsList,
      });
    },
    []
  );

  // On Error
  const errorHandler = (error: unknown, query: string) => {
    let errorObject = { message: "" };

    // If axios error, convert into our custom format of error object with error message from axios error object
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError;

      if (serverError && serverError.response) {
        errorObject = { message: serverError.response.data.message };
      }
    } else {
      // Handling some unexpected error
      errorObject = {
        message: "Some unexpected error occured.",
      };
    }
    setData({
      status: "FAILURE",
      error: errorObject,
      fetchedDataList: [],
    });
  };

  useEffect(() => {
    let isMounted = true;
    const currentQueryCacheObject = cache.current[searchQuery];

    const getUsersSearchResultHandler = async () => {
      if (
        currentQueryCacheObject?.list?.length > 0 &&
        requestedPageNumber <= currentQueryCacheObject?.lastPageNumber
      ) {
        // Required data is already present in cache where data = currentQueryCacheObject.list
        setData({
          status: "IDLE",
          error: null,
          fetchedDataList: currentQueryCacheObject.list,
        });
        return;
      } else {
        // Make API call to get search results
        try {
          const {
            // @ts-ignore
            data: { items },
          } = await getUsersSearchResult(url);

          successHandler(items, searchQuery, requestedPageNumber);
        } catch (error) {
          errorHandler(error, searchQuery);
        } finally {
          setData((previousState) => ({
            ...previousState,
            status: "IDLE",
          }));
        }
      }
    };

    // Search for users only when search query has atleast MINIMUM_SEARCH_QUERY_LENGTH number of characters
    if (searchQuery.trim().length >= MINIMUM_SEARCH_QUERY_LENGTH && isMounted) {
      const timeoutId = setTimeout(() => {
        // Set Loading status just before API Call
        setData((previousState) => ({
          ...previousState,
          error: null,
          status: "LOADING",
        }));

        // Waiting for user to finish typing for a time period of one second, then making the API request
        getUsersSearchResultHandler();
      }, 500);

      return () => {
        // Cleanup
        clearTimeout(timeoutId);
      };
    } else {
      // Set array of results as empty otherwise when search query length < MINIMUM_SEARCH_QUERY_LENGTH
      if (isMounted) {
        setData({ status: "SUCCESS", error: null, fetchedDataList: [] });
      }
    }

    return () => {
      // Cleanup
      isMounted = false;
    };
  }, [requestedPageNumber, resultsPerPage, searchQuery, successHandler, url]);

  return { data, cache };
};

export default useSearchGithubUsers;
