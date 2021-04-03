import * as React from 'react';
const {
  genPrivateKey,
  genPublicKey,
  formatBabyJubJubPrivateKey,
  SNARK_FIELD_SIZE,
} = require('../utils/crypto');

const { binarifyWitness, binarifyProvingKey } = require('../utils/binarify');
const provingKey = require('../../build/circuits/provingKey.json');
const verifyingKey = require('../../build/circuits/verifyingKey.json');
const compiler = require('circom');
const { buildBn128 } = require('websnark');
const { Circuit, groth, bigInt } = require('snarkjs');
const {
  stringifyBigInts,
  unstringifyBigInts,
} = require('snarkjs/src/stringifybigint');

//get ocntract

// These are the key pairs specified in the smart contract (ZkIdentity.sol)
const validSk1 = bigInt(
  '5127263858703129043234609052997016034219110701251230596053007266606287227503'
);

const validPub1 = genPublicKey(validSk1);

export default ({ drizzle, drizzleState }) => {
  const zkIdentityContract = drizzle.contracts.ZkIdentity;

  const generateProofAndSubmitToContract = async (sk, pks) => {
    // Get circtui definition
    const circuitDef = await compiler(
      require.resolve('../../circuits/circuit.circom')
    );
    const circuit = new Circuit(circuitDef);
    const circuitInputs = {
      privateKey: formatBabyJubJubPrivateKey(sk),
      publicKeys: pks,
    };

    // Calculate witness and public signals
    console.log('Generating witness....');
    const witness = circuit.calculateWitness(stringifyBigInts(circuitInputs));
    const publicSignals = witness.slice(
      1,
      circuit.nPubInputs + circuit.nOutputs + 1
    );

    // Websnark to generate proof
    const wasmBn128 = await buildBn128();
    const zkSnark = groth;

    console.log('Generating proof....');
    const witnessBin = binarifyWitness(witness);
    const provingKeyBin = binarifyProvingKey(provingKey);
    const proof = await wasmBn128.groth16GenProof(witnessBin, provingKeyBin);
    const isValid = zkSnark.isValid(
      unstringifyBigInts(verifyingKey),
      unstringifyBigInts(proof),
      unstringifyBigInts(publicSignals)
    );

    // Need to massage inputs to fit solidity format
    const solidityProof = {
      a: stringifyBigInts(proof.pi_a).slice(0, 2),
      b: stringifyBigInts(proof.pi_b)
        .map((x) => x.reverse())
        .slice(0, 2),
      c: stringifyBigInts(proof.pi_c).slice(0, 2),
      inputs: publicSignals.map((x) => x.mod(SNARK_FIELD_SIZE).toString()),
    };
    console.log(`Passed local zk-snark verification: ${isValid}`);

    // Submit to smart contract
    const solidityIsValid = await zkIdentityContract.methods
      .isInGroup(
        solidityProof.a,
        solidityProof.b,
        solidityProof.c,
        solidityProof.inputs
      )
      .call();
    console.log(`Verified user is in group (via solidity): ${solidityIsValid}`);
  };

  console.log(generateProofAndSubmitToContract(validSk1, [validPub1]));
  return <>Hola</>;
};
