import React, { useEffect } from "react";
import { IconButton, Typography } from "@material-tailwind/react";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
}

interface MembersPaginationProps {
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  pageSize: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  members: User[];
  setMembersRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MembersPagination: React.FC<MembersPaginationProps> = ({
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  members,
  setMembersRerenderSignal,
}) => {
  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const next = () => {
    if (currentPage === totalPages) return;
    setCurrentPage((prevPage) => prevPage + 1);
  };

  //on members change count total pages
  useEffect(() => {
    setTotalPages(Math.ceil(members.length / pageSize));
  }, [members]);

  if (members.length > 0) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-8">
          <IconButton
            size="sm"
            variant="outlined"
            color="blue-gray"
            onClick={prev}
            disabled={currentPage === 1}
          >
            <img src="./pagination-arrow-left.svg" className="w-full" />
          </IconButton>
          <Typography color="gray" className="font-normal">
            Page <strong className="text-blue-gray-900">{currentPage}</strong>{" "}
            of <strong className="text-blue-gray-900">{totalPages}</strong>
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            color="blue-gray"
            onClick={next}
            disabled={currentPage === totalPages}
          >
            <img src="./pagination-arrow-right.svg" className="w-full" />
          </IconButton>
        </div>
      </div>
    );
  }
  return null;
};

export default MembersPagination;
