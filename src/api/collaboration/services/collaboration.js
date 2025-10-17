'use strict';

/**
 * collaboration service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::collaboration.collaboration');
