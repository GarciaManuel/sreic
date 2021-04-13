// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

/**
 * @title ProposalContract
 * @dev Store & retrieve value in a variable
 */
contract ProposalContract {

    enum Parties{ PRI, PAN, PRD, PT }

    struct Proposal{
        uint index;
        address candidate;
        string name;
        string description;
        string period;
        string document_hash;
        int256 reputation;
        int256 positive;
        int256 neutral;
        int256 negative;
        int256 votes;

    }

    struct Candidate {
        string name;
        Parties party;
        string starting_period;
        string email;
        int256 district;
        int256 reputation;
        uint[] proposalsIndex;
        uint index;
    }
        
    mapping (uint=>Proposal) private allProposals;
    uint[] private allProposalsIndex;

    mapping (address=>Candidate) private allCandidates;
    address[] private allCandidatesIndex;

    mapping(uint => mapping(address => bool)) proposalsVoters;

    event LogNewCandidate(address indexed candidate, uint index, string name);
    event LogNewProposal(address indexed candidate, uint index, string name, string document_hash);
    event LogNewVote(address indexed candidate, uint index, string name, int256 reputation);

    constructor() public{
        createCandidate(0xA6174d009FB4518B34e75B548543F7BD1a1cF031, "Abigail Arredondo", Parties.PRI, "2021", "arredondo@pri.mx", 3);
        createCandidate(0x1cB2AC85653179655C420e8a923c50bE467F6035, "Mauricio Kuri", Parties.PAN, "2021", "kuri@pan.mx", 3);
        createCandidate(0x064B09b4Cecd636A839f773C1f6308bA023F0e05, "Raquel Ruiz de Santiago", Parties.PRD, "2021", "raquelruiz@prd.mx", 3);
    } 

    function isCandidate(address userAddress) public view returns(bool isIndeed){
        if(allCandidatesIndex.length == 0) return false;
        return (allCandidatesIndex[allCandidates[userAddress].index] == userAddress);
    }

    function isProposal(uint proposalIndex) public view returns(bool isIndeed) {
        if(allProposalsIndex.length == 0) return false;
        return (allProposalsIndex[allProposals[proposalIndex].index] == proposalIndex);
    }

    function createProposal(string memory _name, string memory _description, string memory _period, string memory _document_hash) public returns (uint newIndex){
        address userAddress = msg.sender;
        require(isCandidate(userAddress));
        uint index = allProposalsIndex.length;
        allProposals[index].index = index;
        allProposals[index].candidate = userAddress;
        allProposals[index].name = _name;
        allProposals[index].description = _description;
        allProposals[index].period = _period;
        allProposals[index].document_hash = _document_hash;
        allProposals[index].reputation = 0;
        allProposals[index].positive = 0;
        allProposals[index].negative = 0;
        allProposals[index].neutral = 0;
        allProposals[index].votes = 0;
        allProposalsIndex.push(index);
        allCandidates[userAddress].proposalsIndex.push(index);
        proposalsVoters[index][userAddress] = true;


        emit LogNewProposal(userAddress, index, allProposals[index].name, allProposals[index].document_hash);
        return index;
    }
    function createCandidate(address userAddress, string memory _name, Parties _party, string memory _starting_period, string memory _email, int256 _district) public returns(uint newIndex){
        require(!isCandidate(userAddress));
        allCandidates[userAddress].name = _name;
        allCandidates[userAddress].party = _party;
        allCandidates[userAddress].starting_period = _starting_period;
        allCandidates[userAddress].email = _email;
        allCandidates[userAddress].district = _district;
        allCandidates[userAddress].reputation = 0;
        allCandidates[userAddress].index = allCandidatesIndex.push(userAddress)-1;  

        emit LogNewCandidate(userAddress,  allCandidates[userAddress].index, allCandidates[userAddress].name);
        return  allCandidates[userAddress].index;
    }

    function voteProposal(uint proposalIndex, int256 _vote) public returns(bool success){
        require(isProposal(proposalIndex));
        require(!proposalsVoters[proposalIndex][msg.sender]);
        proposalsVoters[proposalIndex][msg.sender]= true;
        allProposals[proposalIndex].votes += 1;
        
        if(_vote == 0){
            allProposals[proposalIndex].neutral += 1;
        }else if(_vote > 0){
            allProposals[proposalIndex].positive += 1;
        }else{
           allProposals[proposalIndex].negative +=1;
        }
        updateProposalReputation(proposalIndex);
        emit LogNewVote(allProposals[proposalIndex].candidate, proposalIndex, allProposals[proposalIndex].name, allProposals[proposalIndex].reputation);
        return true;
    }
    
    function getProposal(uint proposalIndex) public view returns(Proposal memory){
        require(!isProposal(proposalIndex)); 
        Proposal memory prop = allProposals[proposalIndex];
        return(
                prop
        );
    }

    function getCandidate(address userAddress) public view returns (address candidate, string memory name, Parties party, string memory starting_period, string memory email, int256 district, int256 reputation, uint[]  memory proposalsIndex){
        require(!isCandidate(userAddress));
        Candidate memory person = allCandidates[userAddress];
        
        return(
            userAddress,
            person.name,
            person.party,
            person.starting_period,
            person.email,
            person.district,
            person.reputation,
            person.proposalsIndex
        );

    }

    function getCandidateByIndex(uint index) public view returns (address candidate, string memory name, Parties party, string memory starting_period, string memory email, int256 district, int256 reputation, uint[]  memory proposalsIndex){
        require(index>= 0 && index < allCandidatesIndex.length);
        address userAddress = allCandidatesIndex[index];
        Candidate memory person = allCandidates[userAddress];
        
        return(
            userAddress,
            person.name,
            person.party,
            person.starting_period,
            person.email,
            person.district,
            person.reputation,
            person.proposalsIndex
        );

    }

    function getAllCandidates() public view returns(Candidate[] memory){
        Candidate[] memory allCands = new Candidate[](allCandidatesIndex.length);
        for (uint256 index = 0; index < allCandidatesIndex.length; index++) {
            allCands[index] = allCandidates[allCandidatesIndex[index]];
        }

        return allCands;
    }

    function getProposalsByCandidate(uint indexCandidate) public view returns(Proposal[] memory){
        require(indexCandidate>= 0 && indexCandidate < allCandidatesIndex.length);
        address candidateAddress = allCandidatesIndex[indexCandidate];
        Candidate memory candidate = allCandidates[candidateAddress];

        Proposal[] memory allProp = new Proposal[](candidate.proposalsIndex.length);
        for (uint256 index = 0; index < candidate.proposalsIndex.length; index++) {
            allProp[index] = allProposals[candidate.proposalsIndex[index]];
        }

        return allProp;
    }

    function updateProposalReputation(uint proposalIndex) private{
        allProposals[proposalIndex].reputation =  (allProposals[proposalIndex].positive * 100 + (allProposals[proposalIndex].neutral*100/2) + allProposals[proposalIndex].negative * (0))/(allProposals[proposalIndex].votes * 10);
    }

    function updateCandidateReputation(uint indexCandidate) public returns(bool updated){
        require(indexCandidate>= 0 && indexCandidate < allCandidatesIndex.length);
        address candidateAddress = allCandidatesIndex[indexCandidate];
        require(allCandidates[candidateAddress].proposalsIndex.length > 0);
        Candidate memory candidate = allCandidates[candidateAddress];

        int256 cumulative = 0;
        for (uint256 index = 0; index < candidate.proposalsIndex.length; index++) {
            cumulative += allProposals[candidate.proposalsIndex[index]].reputation;
        }
        allCandidates[candidateAddress].reputation =  cumulative/(int256(candidate.proposalsIndex.length));
        return true;
    }
}