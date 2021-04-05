const ProposalContract = artifacts.require('ProposalContract');

module.exports = function (deployer) {
  deployer.deploy(ProposalContract);
};
