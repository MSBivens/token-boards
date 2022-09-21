// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Public Job Board Posting
/// @author Mike Bivens
/// @notice this contract lets the user post & manage a public job
/// @custom:warning this contract has not been audited
/// @custom:warning this contract is not complete
contract PublicPosting is Ownable {
    /// @notice global variable that inits an empty job id array
    uint256 public PublicJobId = 0;
    /// @notice sets the admin of the contract to the deploying wallet
    address Admin = msg.sender;

    /// @notice struct to store data for each job
    struct PublicJob {
        uint256 publicJobId;
        string companyName;
        string position;
        string description;
        string employmentType;
        string location;
        string companyUrl;
        address employer;
    }

    /// @notice creates a mapping between the job and its applicants
    PublicJob[] public publicJobs;
    mapping(address => address[]) public applicants;

    /// @notice Adds a job and assigns an id to it
    /// @custom:warning this will need to change to include the gated option
    function addPublicJob(
        string memory _companyName,
        string memory _position,
        string memory _description,
        string memory _employmentType,
        string memory _location,
        string memory _companyUrl
    ) public {
        PublicJob memory publicJob = PublicJob({
            publicJobId: PublicJobId,
            companyName: _companyName,
            position: _position,
            description: _description,
            employmentType: _employmentType,
            location: _location,
            companyUrl: _companyUrl,
            employer: msg.sender
        });
        publicJobs.push(publicJob);
        PublicJobId++;
    }

    /// @notice Returns public jobs
    function viewPublicJobs() public view returns (PublicJob[] memory) {
        return publicJobs;
    }

    /// @notice Allows job poster or admin to delete a job
    /// @dev this changes the data at the location to null, will return null
    function deletePublicJob(uint256 _publicJobId) public {
        require(
            msg.sender == publicJobs[_publicJobId].employer ||
                msg.sender == Admin
        );
        PublicJobId--;
    }

    /// @notice Allows applicants to apply for a job
    function applyForPublicJob(uint256 _publicJobId) public {
        applicants[publicJobs[_publicJobId].employer].push(msg.sender);
    }

    /// @notice returns admin
    function admin() public view returns (address) {
        return Admin;
    }
}
