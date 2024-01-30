const { PrismaClient } = require("@prisma/client");

class GetFeature {
  constructor() {
    this.prisma = new PrismaClient();
  }
  handleQuery(MainQuery , keyword) {
    let saveQuery = MainQuery;
    keyword = keyword ? keyword : "name";
    let query = {};
    if (saveQuery?.sort) {
      const value = saveQuery.sort.startsWith("-");
      if (value) {
        query.sortOrder = "desc";

        query.sortBy = saveQuery.sort.split("-")[1];
      } else {
        query.sortOrder = "asc";
      }
      delete saveQuery.sort;
    }
    if (saveQuery?.page) {
      query.page = parseInt(saveQuery.page);
      delete saveQuery.page;
    }
    if (saveQuery?.limit) {
      query.limit = parseInt(saveQuery.limit);
    }
    if (saveQuery?.searchBy) {
      query.searchBy = { [keyword]: saveQuery.searchBy };
      delete saveQuery.searchBy;
    }
    if (Object.keys(saveQuery).length > 0) {
      query.filterBy = saveQuery;
    } else {
      query.filterBy = {};
    }
    return query;
  }
  HandleFilterQuery(filterBy) {
    if (filterBy[Object.keys(filterBy)[0]]?.gt)
      filterBy[Object.keys(filterBy)[0]].gt = parseInt(
        filterBy[Object.keys(filterBy)[0]].gt
      );
    if (filterBy[Object.keys(filterBy)[0]]?.gte)
      filterBy[Object.keys(filterBy)[0]].gte = parseInt(
        filterBy[Object.keys(filterBy)[0]].gte
      );
    if (filterBy[Object.keys(filterBy)[0]]?.lt)
      filterBy[Object.keys(filterBy)[0]].lt = parseInt(
        filterBy[Object.keys(filterBy)[0]].lt
      );
    if (filterBy[Object.keys(filterBy)[0]]?.lte)
      filterBy[Object.keys(filterBy)[0]].lte = parseInt(
        filterBy[Object.keys(filterBy)[0]].lte
      );
    return filterBy;
  }
  async findMany(model, options , include) {

    let { sortBy, sortOrder, page, limit, filterBy, searchBy } = this.handleQuery(options);
    limit = limit || 5;
    page = page || 0;

    if (Object.keys(filterBy).length > 0) {
      filterBy = this.HandleFilterQuery(filterBy);
    }
    let query = {
      where: {
        ...filterBy,
      },
      orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : undefined,
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      include : {
        [include] : include ? true : undefined,
      }
    };

    if (searchBy && Object.keys(searchBy).length > 0) {
      query.where.OR = this.buildSearchConditions(searchBy);
    }

    const data = await this.prisma[model].findMany(query);
    const total = await this.prisma[model].count({ where: query.where });
    const totalPages = Math.ceil(total / limit);
  
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
  buildSearchConditions(searchBy) {
    return Object.keys(searchBy).map((field) => ({
      [field]: {
        startsWith: searchBy[field],
      },
    }));
  }
}

module.exports = GetFeature;
