export const Role = {
  ADMINISTRATOR: "admin",
  REGULAR_USER: "customer",
};

export const Permission = {
  // Produk
  BROWSE_PRODUCTS: "browse_products",
  READ_PRODUCT: "read_product",
  EDIT_PRODUCT: "edit_product",
  ADD_PRODUCT: "add_product",
  DELETE_PRODUCT: "delete_product",

  // Kategori
  BROWSE_CATEGORIES: "browse_categories",
  READ_CATEGORY: "read_category",
  EDIT_CATEGORY: "edit_category",
  ADD_CATEGORY: "add_category",
  DELETE_CATEGORY: "delete_category",

  // Keranjang (Cart)
  VIEW_CART: "view_cart",
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  EMPTY_CART: "empty_cart",

  // Pesanan (Order)
  VIEW_ORDERS: "view_orders",
  VIEW_ORDER_DETAILS: "view_order_details",
  CREATE_ORDER: "create_order",
  CANCEL_ORDER: "cancel_order",
  EDIT_ORDER: "edit_order",

  // Ulasan (Review)
  VIEW_REVIEWS: "view_reviews",
  ADD_REVIEW: "add_review",
  EDIT_REVIEW: "edit_review",
  DELETE_REVIEW: "delete_review",
};

export const RolePermission = {
  // Peran Admin
  [Role.ADMINISTRATOR]: [
      Permission.BROWSE_PRODUCTS,
      Permission.READ_PRODUCT,
      Permission.EDIT_PRODUCT,
      Permission.ADD_PRODUCT,
      Permission.DELETE_PRODUCT,
      Permission.BROWSE_CATEGORIES,
      Permission.READ_CATEGORY,
      Permission.EDIT_CATEGORY,
      Permission.ADD_CATEGORY,
      Permission.DELETE_CATEGORY,
      Permission.VIEW_CART,
      Permission.ADD_TO_CART,
      Permission.REMOVE_FROM_CART,
      Permission.EMPTY_CART,
      Permission.VIEW_ORDERS,
      Permission.VIEW_ORDER_DETAILS,
      Permission.CREATE_ORDER,
      Permission.CANCEL_ORDER,
      Permission.VIEW_REVIEWS,
      Permission.ADD_REVIEW,
      Permission.EDIT_REVIEW,
      Permission.DELETE_REVIEW,
    ],
    [Role.REGULAR_USER]:[
      Permission.BROWSE_PRODUCTS,
      Permission.READ_PRODUCT,
      Permission.VIEW_CART,
      Permission.ADD_TO_CART,
      Permission.REMOVE_FROM_CART,
      Permission.EMPTY_CART,
      Permission.VIEW_ORDERS,
      Permission.VIEW_ORDER_DETAILS,
      Permission.CREATE_ORDER,
      Permission.CANCEL_ORDER,
      Permission.VIEW_REVIEWS,
      Permission.ADD_REVIEW,
      Permission.EDIT_ORDER,
    ],
  }
