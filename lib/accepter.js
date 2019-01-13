const util = require('./util');

class Accepter {
  constructor(id, preference, capacity = 1) {
    this.id = id;
    this.preference = preference;
    this.capacity = capacity;
    this.proposedBy = [];
    this.keeps = [];
  }

  addProposedBy(accepterId) {
    this.proposedBy.push(accepterId);
  }

  judge() {
    const candidates = this.keeps;
    const rejects = [];

    this.proposedBy.forEach(proposerId => {
      if (this.preference.includes(proposerId)) {
        candidates.push(proposerId);
        return;
      }
      rejects.push(proposerId);
    });

    candidates.sort((a, b) => {
      const aRank = this.preference.indexOf(a);
      const bRank = this.preference.indexOf(b);

      if (aRank < bRank) {
        return -1;
      }
      return 1;
    });

    const newKeeps = [];

    candidates.forEach((candidate, i) => {
      if (i < this.capacity) {
        newKeeps.push(candidate);
        return;
      }
      rejects.push(candidate);
    });

    this.keeps = newKeeps;
    this.proposedBy = [];
    return {
      keeps: newKeeps,
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
    accepters = data.map(item => new Accepter(item.id, item.preference, item.capacity));
  });
  return accepters;
}
