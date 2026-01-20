import { useState } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '@/types/poducts';

interface ProductCardProps {
  product: Product;
  currency: string;
  setIsModalOpen: any;
  setModalAction: any;
  setSelectedId: any;
  onAddToCart?: (variant: any, product: any, quantity: number) => void;
}

export function ProductCard({ 
  product, 
  currency, 
  setIsModalOpen, 
  setModalAction, 
  setSelectedId,
  onAddToCart 
}: ProductCardProps) {
  const [showVariants, setShowVariants] = useState(false);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  const primaryImage = product.images[0]?.src;
  const minPrice = Math.min(...product.variants.map(v => parseFloat(cleanNumber(v.price))));
  const maxPrice = Math.max(...product.variants.map(v => parseFloat(cleanNumber(v.price))));
  const totalStock = product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  function cleanNumber(value: string) {
  return value.toString().replace(/\.00$/, "");
}

  const description = stripHtml(product.body_html);
  const shortDescription = description.length > 150
    ? description.substring(0, 150) + '...'
    : description;

  const selectedVariant = product.variants.find(v => v.shopify_id.toString() === selectedVariantId);
  const maxAvailableQty = selectedVariant ? selectedVariant.inventory_quantity : 0;

  const handleAddToCart = () => {
    if (selectedVariantId && quantity > 0 && onAddToCart) {
      const variant = product.variants.find(v => v.shopify_id.toString() === selectedVariantId);
      if (variant) {
        onAddToCart(variant, product, quantity);
        setSelectedVariantId('');
        setQuantity(1);
        setShowPlaceOrder(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-[700px] bg-gray-100">
        {/* Meta Status Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.meta 
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-800 border border-gray-300'
          }`}>
            Meta: {product.meta ? 'Active' : 'Inactive'}
          </span>
        </div>

        {primaryImage ? (
          <img
            src={primaryImage || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {product.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {
                product.title && product.title.length > 42 ?
                `${product.title.slice(0,42)}...`:
                `${product.title.slice(0,42)}`
            }
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {shortDescription}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {currency} {cleanNumber(minPrice.toString())}
              {minPrice !== maxPrice && (
                <span className="text-sm text-gray-500"> - ${cleanNumber(maxPrice.toString())}</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Stock: {totalStock}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {product.options.map((option) => (
            <div key={option.id} className="text-xs">
              <span className="font-semibold text-gray-700">{option.name}:</span>
              <span className="ml-1 text-gray-600">{option.values.length} options</span>
            </div>
          ))}
        </div>

        {onAddToCart && (
          <div className="mb-3">
            {!showPlaceOrder ? (
              <button
                onClick={() => setShowPlaceOrder(true)}
                className="w-full px-3 py-2 cursor-pointer bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
              >
                Place Order
              </button>
            ) : (
              <div className="space-y-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold text-gray-900">Select Variant & Quantity:</p>
                
                {/* Variants List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.shopify_id}
                      onClick={() => {
                        setSelectedVariantId(variant.shopify_id.toString());
                        setQuantity(1);
                      }}
                      className={`p-2 rounded-lg cursor-pointer transition-colors border-2 ${
                        selectedVariantId === variant.shopify_id.toString()
                          ? 'border-purple-600 bg-purple-100'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{variant.title}</p>
                          <p className="text-xs text-gray-500">{currency}{parseFloat(cleanNumber(variant.price))}</p>
                        </div>
                        <p className={`text-xs font-medium ${
                          variant.inventory_quantity > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          Stock: {variant.inventory_quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity Section - Only show if variant selected */}
                {selectedVariantId && (
                  <div className="border-t border-purple-200 pt-3 space-y-2">
                    <label className="text-sm font-medium text-gray-900">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium text-sm transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(Math.min(Math.max(1, val), maxAvailableQty));
                        }}
                        max={maxAvailableQty}
                        min="1"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(maxAvailableQty, quantity + 1))}
                        className="px-3 py-1 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium text-sm transition-colors cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-500 ml-2">Max: {maxAvailableQty}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariantId || quantity <= 0}
                    className="flex-1 px-3 py-2 cursor-pointer bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      setShowPlaceOrder(false);
                      setSelectedVariantId('');
                      setQuantity(1);
                    }}
                    className="flex-1 px-3 py-2 cursor-pointer bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activate/Deactivate Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            className={`flex-1 px-3 py-2 rounded-lg cursor-pointer font-medium text-sm transition-colors ${
              product.meta 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={product.meta}
            onClick={()=>{
              if(product.meta == false){
                setIsModalOpen(true)
                setModalAction('Product-Activate')
                setSelectedId(product.id)
              }
            }}
          >
            Activate
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg cursor-pointer font-medium text-sm transition-colors ${
              !product.meta 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            disabled={!product.meta}
            onClick={()=>{
              if(product.meta){
                setIsModalOpen(true)
                setModalAction('Product-Deactivate')
                setSelectedId(product.id)
              }
            }}
          >
            Deactivate
          </button>
        </div>

        <button
          onClick={() => setShowVariants(!showVariants)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 mb-2"
        >
          <span>{product.variants.length} Variants</span>
          {showVariants ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showVariants && (
          <div className="border-t border-gray-200 pt-3 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {variant.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        SKU: {variant.sku || 'N/A'}
                      </span>
                      {variant.barcode && (
                        <span className="text-xs text-gray-500">
                          | Barcode: {variant.barcode}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-gray-900">
                      {currency}{parseFloat(cleanNumber(variant.price))}
                    </p>
                    <p className={`text-xs font-medium ${
                      variant.inventory_quantity > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {variant.inventory_quantity > 0
                        ? `In Stock: ${variant.inventory_quantity}`
                        : 'Out of Stock'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
