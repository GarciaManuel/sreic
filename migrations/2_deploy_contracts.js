const SimpleStorage = artifacts.require('SimpleStorage');
const TutorialToken = artifacts.require('TutorialToken');
const ComplexStorage = artifacts.require('ComplexStorage');
const ProposalContract = artifacts.require('ProposalContract');

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(ComplexStorage);
  deployer.deploy(ProposalContract);
};
