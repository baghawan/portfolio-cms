"use strict";

/**
 * journal controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::journal.journal", ({ strapi }) => ({
  async findOne(ctx) {
    const { id: slug } = ctx.params;

    const entity = await strapi.entityService.findMany("api::journal.journal", {
      filters: { slug },
      populate: {
        seo: {
          populate: {
            metaImage: {
              fields: ["name", "url"],
            },
          },
        },
        journal_category: {
          fields: ["name"],
        },
        cover_picture: {
          fields: ["url", "width", "height", "formats"],
        },
      },
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound("Entry not found");
    }

    const sanitized = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitized);
  },

  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      fields: ["title", "slug", "createdAt", "updatedAt"],
      populate: {
        journal_category: {
          fields: ["name"],
        },
        cover_picture: {
          fields: ["formats"],
        },
      },
    };

    const { data, meta } = await super.find(ctx);

    return { data, meta };
  },
}));
