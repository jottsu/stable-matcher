module.exports.validateData = (data, callback) => {
  const idList = [];

  data.some((item, i) => {
    if (item.id === undefined) {
      callback(new Error('undefined id of data index ', i));
      return true;
    }

    if (item.preference === undefined) {
      callback(new Error('undefined preference of data index ', i));
      return true;
    }

    if (!(item.preference instanceof Array)) {
      callback(new Error('preference is not array of data index '  + i));
      return true;
    }

    if (idList.includes(item.id)) {
      callback(new Error('duplicate id of data index ' + i));
      return true;
    }

    idList.push(item.id);
  });

  callback(null);
}
