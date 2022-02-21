import clsx from "clsx";
import SearchList from "../SearchList";
import { FC, ChangeEvent, useState, useEffect } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  makeStyles,
  Button,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import MessageCard from "../MessageCard";
import { ExpandMore } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { SearchProps } from "../../types/globals";
import SearchIcon from "@material-ui/icons/Search";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import useSearchGithubUsers from "../../hooks/useSearchGithubUsers";

const useStyles = makeStyles(() => ({
  formContainer: {
    width: "100%",
  },
  searchBarSection: {
    position: "fixed",
    width: "100%",
    padding: "1rem 3rem",
    background: "#fff",
  },
  inputBox: {},
  buttonContainerSection: {
    padding: "0 3rem",
  },
  loadBtn: {
    height: "3rem",
    margin: "0 0 1rem 0",
  },
  minCharacterMsgText: {
    textAlign: "left",
    fontWeight: 600,
    fontSize: "0.85rem",
    color: "#535b62",
  },
  toStartSearchingText: {
    textAlign: "left",
    fontWeight: 500,
    fontSize: "0.8rem",
    color: "#81878c",
  },
  messageCardContainer: {
    minHeight: "5rem",
    padding: "0 3rem",
    marginTop: "5.5rem",
  },
  messageCard: {
    padding: "1rem",
  },
}));

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SearchBox: FC<SearchProps> = ({
  label,
  placeholder,
  initialRequestedState,
  requestedData,
  setRequestedData,
  minimumSearchQueryLength,
  messagePrimaryText,
  messageSecondaryText,
}) => {
  const classes = useStyles();

  const { data, cache } = useSearchGithubUsers(requestedData);
  const [isErrorNotificationOpen, setIsErrorNotificationOpen] = useState(false);

  const isRightSuffixIconVisible = requestedData.searchQuery.length > 0;
  const isMinimumCharacterMessageVisible =
    requestedData.searchQuery.length < minimumSearchQueryLength;

  const isLoadingIconVisible =
    isRightSuffixIconVisible && data.status === "LOADING";

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const newQueryValue = event.target.value;
    setRequestedData((prev) => ({
      ...prev,
      searchQuery: newQueryValue,
      requestedPageNumber: 1,
    }));
  };

  const incrementPageHandler = () => {
    setRequestedData((prev) => ({
      ...prev,
      requestedPageNumber:
        cache.current[requestedData.searchQuery].lastPageNumber + 1,
    }));
  };

  const clearSearchQueryHandler = () => {
    setRequestedData(initialRequestedState);
  };

  const handleClose = (event?: React.SyntheticEvent) => {
    setIsErrorNotificationOpen(false);
  };

  const displaySearchResultList =
    minimumSearchQueryLength <= requestedData.searchQuery.trim().length
      ? cache.current[requestedData.searchQuery]
        ? cache.current[requestedData.searchQuery].list
        : data.fetchedDataList
      : [];

  const isLoadMoreVisible =
    data.status === "IDLE" && displaySearchResultList.length > 0;

  const isLoadingMoreResults =
    data.status === "LOADING" && displaySearchResultList.length > 0;

  useEffect(() => {
    if (data.error && data.error.message) {
      setIsErrorNotificationOpen(true);
    }
  }, [data.error]);

  return (
    <FormControl
      className={clsx(classes.formContainer, "w-100")}
      variant="outlined"
    >
      <section className={classes.searchBarSection}>
        <InputLabel
          htmlFor="outlined-adornment-search-field"
          className="hidden"
        >
          {label}
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-search-field"
          type={"text"}
          placeholder={placeholder}
          className={clsx("w-100", classes.inputBox)}
          value={requestedData.searchQuery}
          onChange={onChangeHandler}
          startAdornment={
            <InputAdornment position="start">
              <IconButton
                aria-label="search github users"
                edge="start"
                disabled
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={!isRightSuffixIconVisible || isLoadingIconVisible}
                className={clsx(
                  requestedData.searchQuery.length === 0 ? "hidden" : ""
                )}
                aria-label="clear search query"
                onClick={clearSearchQueryHandler}
                onMouseDown={clearSearchQueryHandler}
                edge="end"
              >
                {isLoadingIconVisible ? (
                  <CircularProgress size={"1rem"} />
                ) : (
                  <CloseIcon />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </section>

      {isMinimumCharacterMessageVisible ? (
        <MessageCard
          primaryText={messagePrimaryText}
          secondaryText={messageSecondaryText}
        />
      ) : (
        <SearchList status={data.status} list={displaySearchResultList} />
      )}

      <section className={classes.buttonContainerSection}>
        {isLoadMoreVisible && (
          <Button
            className={clsx("w-100", classes.loadBtn)}
            variant="outlined"
            color="primary"
            onClick={incrementPageHandler}
            endIcon={<ExpandMore />}
          >
            Load More
          </Button>
        )}

        {isLoadingMoreResults && (
          <Button
            className={clsx("w-100", classes.loadBtn)}
            disabled
            variant="outlined"
            color="default"
          >
            Loading Results...
          </Button>
        )}
      </section>

      {data.error ? (
        <Snackbar
          open={isErrorNotificationOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            {data.error?.message}
          </Alert>
        </Snackbar>
      ) : null}
    </FormControl>
  );
};

export default SearchBox;
