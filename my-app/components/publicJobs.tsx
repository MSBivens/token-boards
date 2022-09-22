import React from "react";

type Board = {
  id: number;
  companyName: string;
  position: string;
  employmentType: string;
  location: string;
  companyUrl: string;
};

export default function Board() {
  const info = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div className="card">
      <span className="card-rating">{id + 1}</span>
      <div className="info">
        <span>{companyName} - </span>
        <span>{position}</span>
        <p>
          <span>{employmentType} - </span> <span> {location}</span>
        </p>
      </div>
      <a
        href={`companyUrl`}
        target="_blank"
        rel="noreferrer"
        passHref={true}
        className="primary-btn"
      >
        Apply
      </a>
    </div>
  );
}
