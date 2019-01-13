const validateProposers = require('./validator').validateProposers;

class Proposer {
  constructor(id, preference) {
    this.id = id;
    this.preference = preference;
    this.rejectedBy = [];
    this.keepedBy = null;
  }

  addRejectedBy(accepterId) {
    this.rejectedBy.push(accepterId);
  }

  changeKeepedBy(accepterId) {
    this.keepedBy = accepterId;
  }

  targetAccepterId() {
    let targetAccepterId = null;
    this.preference.some(accepterId => {
      if (this.rejectedBy.includes(accepterId)) {
        return false;
      }
      targetAccepterId = accepterId;
      return true;
    });
    return targetAccepterId;
  }
}

module.exports.createProposers = data => {
  let proposers = [];
  validateProposers(data, (err) => {
    if (err) {
      throw err;
    }
    proposers = data.map(item => new Proposer(item.id, item.preference));
  });
  return proposers;
}
