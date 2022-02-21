import clsx from "clsx";
import { FC } from "react";
import { SearchListItemProps } from "../../types/globals";
import { makeStyles, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  usernameContainer: {
    color: "#535b62",
    fontWeight: 600,
    marginBottom: "0.3rem",
    fontSize: "0.88rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const SearchListItem: FC<SearchListItemProps> = ({ item }) => {
  const classes = useStyles();
  return (
    <li>
      <Paper
        variant="outlined"
        className={clsx("flex", "w-100", "flex-col-gap-1x", "listItem")}
      >
        <div className={clsx("profileImageContainer")}>
          <img src={item.avatar_url} alt={`${item.login} avatar`} />
        </div>
        <div className={clsx("text-left", "descriptionContainer")}>
          <Typography className={classes.usernameContainer}>
            {item.login}
          </Typography>
          <a
            className={clsx("viewProfile")}
            href={item.html_url}
            rel="noreferrer"
            target="_blank"
          >
            View Profile
          </a>
        </div>
      </Paper>
    </li>
  );
};

export default SearchListItem;
