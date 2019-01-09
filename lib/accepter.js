const util = require('./util');

class Accepter {
  constructor(id, preference) {
    this.id = id;
    this.preference = preference;
    this.proposedBy = [];
    this.keep = null;
  }

  addProposedBy(accepterId) {
    this.proposedBy.push(accepterId);
  }

  isAcceptable(proposerId) {
    const proposerRank = this.preference.indexOf(proposerId);
    if (proposerRank === -1) {
      return false;
    }

    if (this.keep === null) {
      return true;
    }

    const keepRank = this.preference.indexOf(this.keep);
    return keepRank > proposerRank;
  }

  judge() {
    const rejects = [];

    this.proposedBy.forEach(proposerId => {
      if (!this.isAcceptable(proposerId)) {
        rejects.push(proposerId);
        return
      };

      if (this.keep) {
        rejects.push(this.keep);
      }
      this.keep = proposerId;
    });

    const keeps = this.keep ? [this.keep] : [];

    this.proposedBy = [];
    return {
      keeps: keeps,
      rejects: rejects
    }
  }
}

module.exports.createAccepters = data => {
  let accepters = [];
  util.validateData(data, (err) => {
    if (err) {
      throw err;
    }
    accepters = data.map(item => new Accepter(item.id, item.preference));
  });
  return accepters;
}
