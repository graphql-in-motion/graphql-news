import Dataloader from 'dataloader';

async function batchUsers(Users, keys) {
  return await Users.find({ _id: { $in: keys } }).toArray();
}

export default ({ Users }) => ({
  userLoader: new Dataloader(keys => batchUsers(Users, keys), {
    cacheKeyFn: key => key.toString(),
  }),
});
