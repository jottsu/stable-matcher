const createProposers = require('./proposer').createProposers;
const createAccepters = require('./accepter').createAccepters;

module.exports = class Matcher {
  constructor(proposers, accepters, isOneToMany = false) {
    this._proposers = createProposers(proposers);
    this._accepters = createAccepters(accepters, isOneToMany);
    this._isOneToMany = isOneToMany;
  }

  run() {
    while (!this._isFinished()) {
      this._proposeAll();
      this._judgeAll();
    }
    return this._result();
  }

  _proposeAll() {
    this._proposers.forEach(proposer => {
      if (proposer.keepedBy) {
        return;
      }

      const targetAccepterId = proposer.targetAccepterId();
      if (targetAccepterId === null) {
        return;
      }

      const targetAccepter = this._accepters.find(a => a.id === targetAccepterId);
      targetAccepter.addProposedBy(proposer.id);
    });
  }

  _judgeAll() {
    this._accepters.forEach(accepter => {
      const result = accepter.judge();

      result.keeps.forEach(keep => {
        const keepedProposer = this._proposers.find(p => p.id === keep);
        keepedProposer.changeKeepedBy(accepter.id);
      });

      result.rejects.forEach(reject => {
        const rejectedProposer = this._proposers.find(p => p.id === reject);
        rejectedProposer.addRejectedBy(accepter.id);
        rejectedProposer.changeKeepedBy(null);
      });
    });
  }

  _isFinished() {
    const unkeepedProposers = this._proposers.filter(proposer => {
      return proposer.keepedBy === null;
    });
    if (unkeepedProposers.length === 0) {
      return true;
    }

    const potentialProposers = unkeepedProposers.filter(proposer => {
      return proposer.targetAccepterId() !== null;
    });
    if (potentialProposers.length === 0) {
      return true;
    }

    return false;
  }

  _result() {
    const result = [];

    this._accepters.forEach((accepter) => {
      const keeps = accepter.keeps;
      if (keeps.length === 0) {
        return;
      }

      if (this._isOneToMany) {
        result.push({
          proposerIdList: keeps,
          accepterId: accepter.id
        });
        return;
      }

      result.push({
        proposerId: keeps[0],
        accepterId: accepter.id
      });
    });

    return result;
  }
}
