"use strict";

/**
 * homepage controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::homepage.homepage", () => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        works: {
          fields: ["title", "slug", "year", "createdAt", "updatedAt"],
          populate: {
            expertise: {
              fields: ["name"],
            },
            gallery: {
              fields: ["name", "alternativeText", "url", "width", "height"],
            },
          },
        },
      },
    };

    const { data, meta } = await super.find(ctx);

    return { data, meta };
  },
}));
