const types = {
  PROPOSER: 'proposer',
  ACCEPTER: 'accepter'
}

module.exports.validateProposers = (data, callback) => {
  const idList = [];

  data.some((item, i) => {
    commonValidateItem(item, i, idList, types.PROPOSER, (err) => {
      if (err) {
        callback(err)
        return true;
      }
    });
    idList.push(item.id);
  });

  callback(null);
}

module.exports.validateAccepters = (data, isOneToMany, callback) => {
  const idList = [];

  data.some((item, i) => {
    commonValidateItem(item, i, idList, types.ACCEPTER, (err) => {
      if (err) {
        callback(err)
        return true;
      }
    });
    idList.push(item.id);

    if (!isOneToMany) {
      return false;
    }

    if (item.capacity === undefined) {
      callback(new Error(`undefined capacity of ${types.ACCEPTER} index ${i}`));
      return true;
    }

    if (isNaN(item.capacity)) {
      callback(new Error(`capacity is not number of ${types.ACCEPTER} index ${i}`));
      return true;
    }
  });

  callback(null);
}

const commonValidateItem = (item, i, idList, type, callback) => {
  if (item.id === undefined) {
    callback(new Error(`undefined id of ${type} index ${i}`));
    return true;
  }

  if (item.preference === undefined) {
    callback(new Error(`undefined preference of ${type} index ${i}`));
    return true;
  }

  if (!(item.preference instanceof Array)) {
    callback(new Error(`preference is not array of ${type} index ${i}`));
    return true;
  }

  if (idList.includes(item.id)) {
    callback(new Error(`duplicate id of ${type} index ${i}`));
    return true;
  }

  callback(null);
}
