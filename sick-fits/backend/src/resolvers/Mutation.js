const mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
      }
    }, info)

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    // first take copy of updates, removing ID
    const { id, ...updates } = args;

    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id,
      },
    }, info);
  }
};

module.exports = mutations;
