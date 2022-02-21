import "./App.css";
import {
  MINIMUM_SEARCH_QUERY_LENGTH,
  NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
} from "./utils/constants";
import { useEffect, useState } from "react";
import SearchBox from "./components/SearchBox";
import { RequestedDataProps } from "./types/globals";
import InitialLoader from "./components/InitialLoader";

function App() {
  const [isInitialLoaderVisible, setIsInitialLoaderVisible] = useState(true);

  const initialRequestedState = {
    searchQuery: "",
    resultsPerPage: NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
    requestedPageNumber: 1,
  };

  const [requestedData, setRequestedData] = useState<RequestedDataProps>(
    initialRequestedState
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsInitialLoaderVisible(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="App">
      {isInitialLoaderVisible ? (
        <InitialLoader />
      ) : (
        <div className="fade-in">
          <SearchBox
            label={"Search"}
            placeholder={"Search Git"}
            requestedData={requestedData}
            setRequestedData={setRequestedData}
            initialRequestedState={initialRequestedState}
            minimumSearchQueryLength={MINIMUM_SEARCH_QUERY_LENGTH}
            messagePrimaryText={`Type atleast ${MINIMUM_SEARCH_QUERY_LENGTH} characters`}
            messageSecondaryText={"to start searching"}
          />
        </div>
      )}
    </div>
  );
}

export default App;
