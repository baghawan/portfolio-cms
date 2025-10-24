"use strict";

/**
 * work controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::work.work", ({ strapi }) => ({
  async findOne(ctx) {
    const { id: slug } = ctx.params;

    const entity = await strapi.entityService.findMany("api::work.work", {
      filters: { slug },
      populate: {
        seo: {
          populate: {
            metaImage: {
              fields: ["name", "url"],
            },
          },
        },
        expertise: {
          fields: ["name"],
        },
        tools: {
          fields: ["name"],
        },
        gallery: {
          fields: [
            "name",
            "alternativeText",
            "url",
            "width",
            "height",
            "formats",
          ],
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
      fields: ["title", "slug", "year", "createdAt", "updatedAt"],
      populate: {
        expertise: {
          fields: ["name"],
        },
        gallery: {
          fields: ["formats"],
        },
      },
    };

    const { data, meta } = await super.find(ctx);

    const filteredData = data.map((item) => {
      const gallery = item?.gallery;

      if (Array.isArray(gallery) && gallery.length > 0) {
        const firstImage = { ...gallery[0] };
        const formats = firstImage?.formats;

        if (formats && formats.medium) {
          firstImage.formats = { medium: formats.medium };
        } else {
          delete firstImage.formats;
        }

        item.gallery = firstImage;
      } else {
        item.gallery = null;
      }

      return item;
    });

    return { data: filteredData, meta };
  },
}));
