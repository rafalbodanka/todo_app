import React from "react";
import { Button } from "@material-tailwind/react";

const ConnectionErrorModal: React.FC<{
  message: string;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ message, setIsError }) => {
  const errorMessage =
    message || "Something went wrong. Refresh and try again.";

  const closeErrorModal = () => {
    setIsError(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-40 z-20"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeErrorModal();
        }
      }}
    >
      <div className="bg-white p-6 text-lg rounded-md text-center">
        <p>{errorMessage}</p>
        <Button
          className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400 p-2 pl-6 pr-6 rounded-md mt-4"
          onClick={closeErrorModal}
        >
          OK
        </Button>
      </div>
    </div>
  );
};

export default ConnectionErrorModal;
