import { FC } from "react";
import { SearchListProps } from "../../types/globals";
import MessageCard from "../MessageCard";
import SearchListItem from "../SearchListItem";

const SearchList: FC<SearchListProps> = ({ status, list }) => {
  if (list.length === 0 && status === "IDLE") {
    return (
      <MessageCard
        primaryText="No results found"
        secondaryText="Please try another query"
      />
    );
  }

  return (
    <ul className={"listContainer"}>
      {list.map((item, index) => (
        <SearchListItem key={index} item={item} />
      ))}
    </ul>
  );
};

export default SearchList;
