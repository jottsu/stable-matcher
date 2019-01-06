const util = require('./util');

class Accepter {
  constructor(id, preference) {
    this.id = id;
    this.preference = preference;
    this.keep = null;
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

  changeKeep(proposerId) {
    this.keep = proposerId;
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
