const ZkIdentity = artifacts.require('ZkIdentity');
const Verifier = artifacts.require('Verifier');
const ProposalContract = artifacts.require('ProposalContract');

module.exports = function (deployer) {
  deployer.deploy(Verifier);
  deployer.deploy(ZkIdentity);
  deployer.deploy(ProposalContract);
};
