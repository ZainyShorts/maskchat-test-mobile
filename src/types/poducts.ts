export interface ProductImage {
  id: number;
  shopify_id: string;
  position: number;
  src: string;
  alt: string | null;
}

export interface ProductOption {
  id: number;
  shopify_id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ProductVariant {
  id: number;
  shopify_id: string;
  title: string;
  sku: string;
  barcode: string;
  price: string;
  compare_at_price: string;
  inventory_quantity: number;
  inventory_item_id: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  weight: number;
  weight_unit: string;
}

export interface Product {
  id: number;
  business_id: string;
  shopify_id: string;
  title: string;
  file_id: string | null;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  tags: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  meta: boolean
}
