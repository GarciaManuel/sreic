// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.7.0;

/**
 * @title ProposalContract
 * @dev Store & retrieve value in a variable
 */
contract ProposalContract {
    

    address owner;
    string public proposal_description = '';
    string public document_hash = '';
    int256 public proposal_reputation = 0;
    int256 positive = 0;
    int256 neutral = 0;
    int256 negative = 0;
    mapping(address => bool) public voters;
    int256 public votes = 0;


  
    function store(string memory _proposal,string memory _document_hash) public {
        require(owner == address(0));
            owner = msg.sender;
            proposal_description = _proposal;
            document_hash = _document_hash;
            voters[msg.sender] = true;
        

    }
    
    function vote(int256 _vote) public {
        require(!voters[msg.sender]);
        voters[msg.sender] = true;
        votes += 1;
        
        if(_vote == 0){
            neutral += 1;
        }else if(_vote > 0){
            positive += 1;
        }else{
            negative -=1;
        }
        update_reputation();
    }


    function retrieve() public view returns (string memory, string memory){
        return (proposal_description, document_hash);
    }
    

    function update_reputation() private{
        proposal_reputation =  (positive * 100 + (neutral*100/2) + negative * (0))/(votes * 10);
    }
}