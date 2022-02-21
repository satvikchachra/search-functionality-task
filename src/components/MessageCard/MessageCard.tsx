import { MessageCardProps } from "../../types/globals";
import { makeStyles, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
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

const MessageCard = ({ primaryText, secondaryText }: MessageCardProps) => {
  const classes = useStyles();
  return (
    <section className={classes.messageCardContainer}>
      <Paper variant="outlined" className={classes.messageCard}>
        <Typography className={classes.minCharacterMsgText}>
          {primaryText}
          <br />
          <span className={classes.toStartSearchingText}>{secondaryText}</span>
        </Typography>
      </Paper>
    </section>
  );
};

export default MessageCard;
