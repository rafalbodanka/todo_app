import React, { useEffect, useState } from "react";
import FunnelIcon from "@rsuite/icons/Funnel";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  List,
  ListItem,
} from "@material-tailwind/react";
import { Member, User, Filters } from "../utils/Types";
import axios from "axios";
import { Avatar } from "@material-tailwind/react";
import { unfocusAllElements } from "../utils/Helpers";
import SearchTasks from "../nav/SearchTasks";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentTable } from "../../redux/currentTable";

type ColumnFilterProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  filters,
  setFilters,
  searchValue,
  setSearchValue,
}) => {
  const currentTable = useAppSelector(selectCurrentTable)

  const [isFinishDateListOpen, setIsFinishDateListOpen] = useState(true);
  const [isDifficultyListOpen, setIsDifficultyListOpen] = useState(true);
  const [isAssignmentListOpen, setIsAssignmentListOpen] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [isMembersFetchError, setIsMembersFetchError] = useState(false);
  const membersFetchErrorMessage = "Members were not loaded. Refresh the page.";
  const [prevSearchValue, setPrevSearchValue] = useState("");

  const addFilter = (filterName: string, filterValue: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: [...prevFilters[filterName], filterValue],
    }));
    unfocusAllElements();
  };

  const removeFilter = (filterName: string, filterValue: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: prevFilters[filterName as keyof typeof filters].filter(
        (value) => value !== filterValue
      ),
    }));
    unfocusAllElements();
  };

  //fetch table members data
  useEffect(() => {
    const fetchMembersData = async () => {
      setIsMembersFetchError(false);
      if (currentTable._id === "") return;
      try {
        const response = await axios.get(
          `http://localhost:5000/tables/${currentTable._id}/members`,
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setMembers(response.data.data);
        }
      } catch (err) {
        setIsMembersFetchError(true);
      }
    };
    fetchMembersData();
  }, [currentTable]);

  return (
    <Popover placement="bottom">
      <PopoverContent className="max-h-[600px] p-0 overflow-y-auto overflow-x-hidden scrollbar-none mt-3">
        <div>
          <div className="m-2">
            <SearchTasks
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              prevSearchValue={prevSearchValue}
              setPrevSearchValue={setPrevSearchValue}
            ></SearchTasks>
          </div>
          <div
            className="flex justify-between bg-gray-100 text-gray-800 px-3 font-bold cursor-pointer"
            onClick={() => {
              setIsFinishDateListOpen((prev) => !prev);
            }}
          >
            <p className="h-8 flex items-center">Finish date</p>
            <div
              className={`expand_btn flex items-center ${
                !isFinishDateListOpen && "hidden_content"
              }`}
            >
              V
            </div>
          </div>
          {isFinishDateListOpen && (
            <List className="w-24 min-w-[240px] max-w-[240px]">
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.finishStatus.includes("exceeded") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.finishStatus.includes("exceeded")) {
                    removeFilter("finishStatus", "exceeded");
                  } else {
                    addFilter("finishStatus", "exceeded");
                  }
                }}
              >
                Exceeded
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.finishStatus.includes("today") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.finishStatus.includes("today")) {
                    removeFilter("finishStatus", "today");
                  } else {
                    addFilter("finishStatus", "today");
                  }
                }}
              >
                Today
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.finishStatus.includes("in-progress") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.finishStatus.includes("in-progress")) {
                    removeFilter("finishStatus", "in-progress");
                  } else {
                    addFilter("finishStatus", "in-progress");
                  }
                }}
              >
                In progress
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.finishStatus.includes("planned") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.finishStatus.includes("planned")) {
                    removeFilter("finishStatus", "planned");
                  } else {
                    addFilter("finishStatus", "planned");
                  }
                }}
              >
                Planned
              </ListItem>
            </List>
          )}
        </div>
        <div>
          <div
            className="flex justify-between bg-gray-100 text-gray-800 px-3 font-bold cursor-pointer"
            onClick={() => {
              setIsDifficultyListOpen((prev) => !prev);
            }}
          >
            <p className="h-8 flex items-center">Difficulty</p>
            <div
              className={`expand_btn flex items-center ${
                !isDifficultyListOpen && "hidden_content"
              }`}
            >
              V
            </div>
          </div>
          {isDifficultyListOpen && (
            <List className="w-24 min-w-[240px] max-w-[240px]">
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.difficulty.includes("easy") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.difficulty.includes("easy")) {
                    removeFilter("difficulty", "easy");
                  } else {
                    addFilter("difficulty", "easy");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-green-500"></div>
                  <p>Easy</p>
                </div>
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.difficulty.includes("medium") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.difficulty.includes("medium")) {
                    removeFilter("difficulty", "medium");
                  } else {
                    addFilter("difficulty", "medium");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-orange-500"></div>
                  <p>Medium</p>
                </div>{" "}
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.difficulty.includes("hard") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.difficulty.includes("hard")) {
                    removeFilter("difficulty", "hard");
                  } else {
                    addFilter("difficulty", "hard");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-red-500"></div>
                  <p>Hard</p>
                </div>{" "}
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.isEstimated.includes("estimated") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.isEstimated.includes("estimated")) {
                    removeFilter("isEstimated", "estimated");
                  } else {
                    addFilter("isEstimated", "estimated");
                  }
                }}
              >
                Estimated
              </ListItem>
              <ListItem
                ripple={false}
                className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                  filters.isEstimated.includes("not-estimated") &&
                  "bg-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (filters.isEstimated.includes("not-estimated")) {
                    removeFilter("isEstimated", "not-estimated");
                  } else {
                    addFilter("isEstimated", "not-estimated");
                  }
                }}
              >
                Not estimated
              </ListItem>
            </List>
          )}
        </div>
        <div>
          <div
            className="flex justify-between bg-gray-100 text-gray-800 px-3 font-bold cursor-pointer"
            onClick={() => {
              setIsAssignmentListOpen((prev) => !prev);
            }}
          >
            <p className="h-8 flex items-center">Assignment</p>
            <div
              className={`expand_btn flex items-center ${
                !isAssignmentListOpen && "hidden_content"
              }`}
            >
              V
            </div>
          </div>
          {isAssignmentListOpen &&
            (!isMembersFetchError ? (
              <List className="w-24 min-w-[240px] max-w-[240px]">
                {members.map((member) => (
                  <ListItem
                    ripple={false}
                    key={member.user._id}
                    className={`rounded-none py-1.5 px-3 text-sm font-normal ${
                      filters.assignment.includes(member.user._id) &&
                      "bg-gray-300 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      if (filters.assignment.includes(member.user._id)) {
                        removeFilter("assignment", member.user._id);
                      } else {
                        addFilter("assignment", member.user._id);
                      }
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar
                        src={`../../images/userIcons/${member.user.userIconId}.svg`}
                        alt={`${member.user.firstName} ${member.user.lastName} icon`}
                        size="sm"
                      />
                      <p>
                        {member.user.firstName} {member.user.lastName}
                      </p>
                    </div>
                  </ListItem>
                ))}
              </List>
            ) : (
              <p className="w-24 min-w-[240px] max-w-[240px] text-center">
                {membersFetchErrorMessage}
              </p>
            ))}
        </div>
      </PopoverContent>
      <PopoverHandler>
        <button>
          <FunnelIcon
            className="cursor-pointer"
            style={{ fontSize: "1.5em" }}
          ></FunnelIcon>
        </button>
      </PopoverHandler>
    </Popover>
  );
};

export default ColumnFilter;
