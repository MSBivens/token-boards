import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = ({
  listUser = [
    {
      name: "Postings",
      number: "390",
      icon: "/assets/postings.svg",
    },
    {
      name: "Communities",
      number: "20",
      icon: "/assets/communities.svg",
    },
    {
      name: "Applicants",
      number: "50",
      icon: "/assets/applicants.svg",
    },
  ],
}) => {
  return (
    <div className="max-w-screen-xl px-8 xl:px-16 mx-auto" id="about">
      <div className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16">
        <div className=" flex flex-col justify-center items-start row-start-2 sm:row-start-1 mt-16">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal">
            Token Gated Job Boards with <strong>Token Boards</strong>.
          </h1>
          <p className="text-black-500 mt-4 mb-6">
            Providing communities with private job listings via token gated
            access.
          </p>
        </div>
        <div className="flex w-full mt-16">
          <div className="h-full w-full">
            <Image
              src="/assets/gatedjob.png"
              alt="gated job illustration"
              quality={100}
              width={612}
              height={383}
              layout="responsive"
            />
          </div>
        </div>
      </div>
      <div className="relative w-full flex">
        <div className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500 z-10">
          {listUser.map((listUsers, index) => (
            <div
              className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
              key={index}
            >
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                  <Image src={listUsers.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-black-600 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-black-500">{listUsers.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <ul>
            <li>
              <Link href="/public-job-board">
                <a className="py-2 text-gray-600 underline cursor-pointer">
                  Public Job Board
                </a>
              </Link>
            </li>
            <li>
              <Link href="/post">
                <a className="py-2 text-gray-600 underline cursor-pointer">
                  Post a Job
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div
          className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
          style={{ filter: "blur(114px)" }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
