import React, { useEffect, useRef } from "react";
import { Input } from "@material-tailwind/react";
import CloseIcon from '@rsuite/icons/Close';

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

  const input = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    setSearchValue("")
    setPrevSearchValue("")
    console.log(input)
    input.current!.querySelector('input')!.value = "";
  }

  return (
    <Input
      ref={input}
      defaultValue={prevSearchValue}
      label="Search"
      color="deep-purple"
      variant="standard"
      onChange={(event) => setSearchValue(event.target.value)}
      icon={searchValue && <CloseIcon onClick={clearInput} className="cursor-pointer w-4 h-4" />}
    ></Input>
  );
};

export default SearchTasks;
