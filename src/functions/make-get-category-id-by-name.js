export const makeGetCategoryIDByName =
  ({ formattedCategories }) =>
  ({ categoryName }) =>
    formattedCategories.find((category) => category.name === categoryName)
      .category_id;
