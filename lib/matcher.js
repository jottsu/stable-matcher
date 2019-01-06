module.exports = class Matcher {
  constructor(proposers, accepters) {
    this._proposers = proposers;
    this._accepters = accepters;
  }

  run() {
    while (!this._isFinished()) {
      this._step();
    }

    const result = [];
    this._accepters.forEach((accepter) => {
      const keep = accepter.keep;
      if (keep === null) {
        return;
      }
      result.push({
        proposerId: keep,
        accepterId: accepter.id
      });
    });
    return result;
  }

  _step() {
    this._proposers.forEach((proposer) => {
      if (proposer.keepedBy) {
        return;
      }

      const accepterId = proposer.targetAccepterId();
      if (accepterId === null) {
        return;
      }

      const accepter = this._accepters.find(a => a.id === accepterId);

      if (!accepter.isAcceptable(proposer.id)) {
        proposer.addRejectedBy(accepterId);
        proposer.changeKeepedBy(null);
        return;
      }

      const keepedProposer = this._proposers.find(p => p.id === accepter.keep);
      if (keepedProposer) {
        keepedProposer.addRejectedBy(accepter.id);
        keepedProposer.changeKeepedBy(null);
      }
      proposer.changeKeepedBy(accepterId);
      accepter.changeKeep(proposer.id);
    })
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
}
