import React, { useEffect, useState } from "react";
import FunnelIcon from "@rsuite/icons/Funnel";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { Member, User } from "./Types";
import axios from "axios";
import { Avatar } from "@material-tailwind/react";

type ColumnFilterProps = {
  currentTable: string;
};

const ColumnFilter: React.FC<ColumnFilterProps> = ({ currentTable }) => {
  const [isFinishDateListOpen, setIsFinishDateListOpen] = useState(true);
  const [isDifficultyListOpen, setIsDifficultyListOpen] = useState(true);
  const [isAssignmentListOpen, setIsAssignmentListOpen] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);

  //fetch table members data
  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/tables/${currentTable}/members`,
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
      } catch (err: any) {}
    };
    fetchMembersData();
  }, []);

  return (
    <Popover placement="bottom">
      <PopoverContent className="max-h-[600px] p-0 overflow-y-auto overflow-x-hidden scrollbar-none">
        <div>
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
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                Exceeded
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                Today
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                In progress
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
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
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-green-500"></div>
                  <p>Easy</p>
                </div>
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-orange-500"></div>
                  <p>Medium</p>
                </div>{" "}
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-red-500"></div>
                  <p>Hard</p>
                </div>{" "}
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                Estimated
              </ListItem>
              <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
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
          {isAssignmentListOpen && (
            <List className="w-24 min-w-[240px] max-w-[240px]">
              {members.map((member) => (
                <ListItem className="rounded-none py-1.5 px-3 text-sm font-normal">
                  <div className="flex gap-2 items-center">
                    <Avatar
                      src={`./userIcons/${member.user.userIconId}.svg`}
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
          )}
        </div>
      </PopoverContent>
      <PopoverHandler>
        <button>
          <FunnelIcon className="cursor-pointer"></FunnelIcon>
        </button>
      </PopoverHandler>
    </Popover>
  );
};

export default ColumnFilter;
