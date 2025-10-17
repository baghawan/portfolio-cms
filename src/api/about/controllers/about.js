"use strict";

/**
 * about controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::about.about", () => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        seo: {
          populate: {
            metaImage: {
              fields: ["name", "url"],
            },
          },
        },
        expertise: {
          fields: ["name", "description"],
          populate: {
            tools: {
              fields: ["name"],
            },
          },
        },
        experiences: {
          fields: ["company", "position", "startDate", "endDate"],
        },
        collaborations: {
          fields: ["name"],
          populate: {
            logo: {
              fields: ["alternativeText", "width", "height", "url"],
            },
          },
        },
      },
    };

    const { data, meta } = await super.find(ctx);

    return { data, meta };
  },
}));
