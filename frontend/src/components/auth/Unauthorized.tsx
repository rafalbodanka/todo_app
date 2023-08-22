import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-10 bg-slate-300 rounded-xl shadow-xl">
        <div className="flex justify-center">
          <p className="text-base mb-2">
            Don't have an account yet?
            <span className="text-purple-900 font-700 cursor-pointer">
              {" "}
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
        <p className="text-base">
          Already have an account?
          <span className="text-purple-900 font-700 cursor-pointer">
            {" "}
            <Link to="/login">Log in</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
