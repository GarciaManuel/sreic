import Web3 from 'web3';
import ProposalContract from './contracts/ProposalContract.json';

const options = {
  web3: {
    block: false,
    customProvider: new Web3(Web3.givenProvider || 'ws://localhost:7545'),
    //new Web3(Web3.givenProvider || 'ws://localhost:7545')
  },
  contracts: [ProposalContract],
  events: {
    // SimpleStorage: ['StorageSet'],
  },
  polls: {
    blocks: 1500,
  },
};

export default options;
