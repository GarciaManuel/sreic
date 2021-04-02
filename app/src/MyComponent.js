import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import logo from './logo.png';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

  useEffect(() => {
    console.log(drizzleState.accounts[0]);
  });

  const [storageFile, setStorageFile] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setStorageFile(Buffer(reader.result));
    };
  };
  const onSubmit = async (data) => {
    console.log(
      await drizzle.contracts.ProposalContract.methods.document_hash().call()
    );
    const keyValue = drizzle.contracts.ProposalContract.methods.document_hash.cacheCall();
    console.log(
      'Esperando ando',
      await drizzle.store.getState().contracts.ProposalContract.document_hash
    );
    if (
      (await drizzle.store.getState().contracts.ProposalContract.document_hash[
        keyValue
      ].value) == ''
    ) {
      const submission = await ipfs.add(storageFile);
      drizzle.contracts.ProposalContract.methods
        .store(data.name, submission.path)
        .send();
    }
  };

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
        <h2>Proposal contract</h2>
        <p>
          This shows a simple ContractData component with no arguments, along
          with a form to set its value.
        </p>
        <p>
          <strong>Stored Value:</strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="proposal_description"
          />
          {/* <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="document_hash"
          /> */}
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
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control ">
              <label>Nombre de la propuesta</label>
              <input
                type="text"
                name="name"
                ref={register({
                  required: 'El nombre de la propuesta es requerido',
                })}
              />
              {errors.email && (
                <p className="errorMsg">{errors.name.message}</p>
              )}
            </div>
            <div className="form-control">
              <label>Documento de respaldo</label>
              <input type="file" name="file" onChange={captureFile} />
              {errors.password && (
                <p className="errorMsg">{errors.file.message}</p>
              )}
            </div>
            <div className="form-control">
              <label></label>
              <button type="submit">Registrar propuesta</button>
            </div>
          </form>
        </div>

        <ContractForm
          drizzle={drizzle}
          contract="ProposalContract"
          method="vote"
        />
      </div>
    </div>
  );
};
