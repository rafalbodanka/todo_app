import React from "react";
import axios from "axios";

import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Avatar,
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

type userNavProps = {
  username: string;
};

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
  } catch (err) {
    console.log(err);
  }
};

const UserNav: React.FC<userNavProps> = ({ username }) => {
  return (
    <>
      <Popover placement="bottom">
        <PopoverHandler>
          <Button className="bg-purple-900">{username}</Button>
        </PopoverHandler>
        <PopoverContent className="w-60">
          <div className="flex items-center gap-4 border-b border-blue-gray-50 pb-4 mb-4">
            <Avatar src="/img/team-4.jpg" alt="candice wu" />
            <div>
              <Typography variant="h6" color="blue-gray">
                John Smith
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Senior Consultant
              </Typography>
            </div>
          </div>
          <List className="p-0 min-w-0">
            <a href="#">
              <ListItem className="justify-center w-full">
                account settings
              </ListItem>
            </a>
            <a href="" onClick={handleLogout}>
              <ListItem className="justify-center w-full">logout</ListItem>
            </a>
          </List>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserNav;
