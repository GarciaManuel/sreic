import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import logo from './logo.png';
import { useState, useEffect } from 'react';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props

  // const [web3Acc, setWeb3Acc] = useState(null);
  // const [web3Bal, setWeb3Bal] = useState(null);

  // useEffect(() => {
  //   function loadWeb3Data(web3) {
  //     web3.eth.getAccounts().then((accounts) => {
  //       setWeb3Acc(accounts[0]);
  //       drizzleState.accounts = accounts;
  //       web3.eth.getBalance(accounts[0]).then((res) => {
  //         drizzleState.accountBalances[accounts[0]] = res;
  //         setWeb3Bal(res);
  //       });
  //     });
  //   }

  //   async function listenMMAccount() {
  //     window.ethereum.on('accountsChanged', async function () {
  //       loadWeb3Data(drizzle.web3);
  //     });
  //   }

  //   loadWeb3Data(drizzle.web3);
  //   listenMMAccount();
  // });

  const [storageFile, setStorageFile] = useState(null);
  const [proposal, setProposal] = useState({
    description: 'No realizada',
    hash: '',
  });

  function captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setStorageFile(Buffer(reader.result));
    };
  }
  async function onSubmit(event) {
    event.preventDefault();
    console.log('Submitting file to ipfs...');
    const submission = await ipfs.add(storageFile);
    setProposal((prevProposal) => ({ ...prevProposal, hash: submission.path }));
  }
  return (
    <div className="App">
      <div>
        <img src={logo} alt="drizzle-logo" />
        <h1>Drizzle Examples</h1>
        <p>
          Examples of how to get started with Drizzle in various situations.
        </p>
      </div>
      <div className="section">
        <h2>Active Account </h2>
        <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
        />
      </div>
      <div className="section">
        <h2>Proposal contract {proposal.description}</h2>
        <p>
          This shows a simple ContractData component with no arguments, along
          with a form to set its value.
        </p>
        <p>
          <strong>Stored Value: {proposal.hash}</strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="proposal_description"
          />
        </p>
        <p>
          <strong>Votes Value: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="votes"
          />
        </p>
        <p>
          <strong>Reputation Value: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="proposal_reputation"
          />
        </p>

        <div className="section">
          <h2>Change Meme</h2>
          <form onSubmit={onSubmit}>
            <input type="text" onChange={() => {}} />
            <input type="file" onChange={captureFile} />
            <input type="submit" />
          </form>
        </div>

        <ContractForm
          drizzle={drizzle}
          contract="ProposalContract"
          method="store"
          sendArgs={{ gas: 1000000 }}
        />
        <ContractForm
          drizzle={drizzle}
          contract="ProposalContract"
          method="vote"
        />
      </div>
    </div>
  );
};
