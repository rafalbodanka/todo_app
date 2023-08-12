import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";

type SearchTasksProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  prevSearchValue: string;
  setPrevSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const SearchTasks: React.FC<SearchTasksProps> = ({
  searchValue,
  setSearchValue,
  prevSearchValue,
  setPrevSearchValue,
}) => {
  useEffect(() => setPrevSearchValue(searchValue), [searchValue]);

  return (
    <Input
      defaultValue={prevSearchValue}
      label="Search"
      color="deep-purple"
      variant="standard"
      onChange={(event) => setSearchValue(event.target.value)}
    ></Input>
  );
};

export default SearchTasks;
