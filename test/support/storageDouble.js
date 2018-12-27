const sinon = require("sinon");

module.exports = () => {
  const dao = { byId: sinon.stub(), update: sinon.stub() };
  const storage = {};

  storage.dao = () => dao;

  storage.alreadyContains = ({ id, data }) => {
    dao.byId.withArgs(id).callsArgWithAsync(1, null, data);
    return { id, data };
  };

  storage.updateWillNotFail = () => dao.update.callsArgWithAsync(1, null);

  return storage;
};
