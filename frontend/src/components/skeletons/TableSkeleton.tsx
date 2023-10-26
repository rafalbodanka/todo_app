import { Skeleton } from "@mui/material";
import React from "react";

const TableSkeleton = () => {
    return (
			<div className="p-2 mt-4">
        <div className="flex justify-between">
          <div className="flex gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton
                key={index}
                sx={{ bgcolor: 'grey.400' }}
                variant="rectangular"
                className="rounded-md"
                width={120}
                height={36}
              />
            ))}
          </div>
          <div className="pr-4">
            <Skeleton
              sx={{ bgcolor: 'grey.400' }}
              variant="rectangular"
              className="rounded-md"
              width={160}
              height={40}
            />
          </div>
        </div>
        <div className="flex flex-row gap-8">
          {Array.from( {length: 3}, (_, index) => (
            <div key={index} className="mt-4 ml-4">
              <Skeleton
                sx={{ bgcolor: 'grey.400' }}
                variant="rectangular"
                className="rounded-md"
                width={250}
                height={36}
              />
              <div className="flex flex-col gap-2 mt-2">
                <Skeleton
                  sx={{ bgcolor: 'grey.400' }}
                  variant="rectangular"
                  className="rounded-md"
                  width={250}
                  height={38}
                />
                <div className="mt-2 flex flex-col gap-8">
                  {Array.from({ length: -(index-3) * 2}, (_, index) => (
                    <Skeleton
                      key={index}
                      sx={{ bgcolor: 'grey.400' }}
                      variant="rectangular"
                      className="rounded-md"
                      width={250}
                      height={74}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> 
    )
}

export default TableSkeleton