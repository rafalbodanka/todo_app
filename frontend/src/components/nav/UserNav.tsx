import React, { useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/user";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Avatar,
  Button,
  Typography,
  List,
  ListItem,
} from "@material-tailwind/react";
import avatarImg from "../../images/avatar.png"

const handleLogout = async () => {
  try {
    const response = await axios.get("http://localhost:5000/users/logout", {
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      // setIsLoggedIn(true);
      // setUsername(response.data.email);
    }
  } catch (err) {}
};

const UserNav = () => {
  const user = useAppSelector(selectUser)
  const [invitationsNumber, setInvitationsNumber] = useState(0);
  return (
    <>
      <Popover placement="bottom">
        <PopoverHandler>
          <Button className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400">
            {user.email}
          </Button>
        </PopoverHandler>
        <PopoverContent className="w-60">
          <div className="flex items-center gap-4 border-b border-blue-gray-50 pb-4 mb-4">
            <Avatar
              className="min-w-12"
              src={
                user.userIconId === 0
                  ? avatarImg
                  : `/userIcons/${user.userIconId}.svg`
              }
              alt={`${user.firstName} ${user.lastName}`}
            />
            <div>
              <Typography variant="h6" color="blue-gray">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {user.level ? user.level : ""}
              </Typography>
            </div>
          </div>
          <List className="p-0 min-w-0">
            <a href="/invitations">
              <ListItem
                className="justify-center w-full relative"
                tabIndex={-1}
              >
                <div className="">
                  <p>Invitations</p>
                  {invitationsNumber > 0 && (
                    <div className="absolute top-0 translate-y-[6px] right-6 w-8 h-8 rounded-full bg-purple-900 text-white">
                      <div className="flex justify-center items-center h-full">
                        {invitationsNumber}
                      </div>
                    </div>
                  )}
                </div>
              </ListItem>
            </a>
            <a href="/user">
              <ListItem className="justify-center w-full">
                Account settings
              </ListItem>
            </a>
            <a href="" onClick={handleLogout}>
              <ListItem className="justify-center w-full">Logout</ListItem>
            </a>
          </List>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserNav;
