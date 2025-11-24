const footwearSizes = Array.from({ length: 30 }, (_, index) => {
  const value = 3.5 + index * 0.5;
  return Number.isInteger(value) ? value.toFixed(0) : value.toString();
});

const variationPresets = {
  apparel: {
    sizeType: 'alpha',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['#0f172a', '#1f2937', '#475569', '#f97316', '#6366f1', '#0ea5e9'],
  },
  footwear: {
    sizeType: 'numeric',
    sizes: footwearSizes,
    colors: ['#0f172a', '#1e293b', '#dc2626', '#f59e0b', '#10b981'],
  },
  accessory: {
    sizeType: 'none',
    sizes: [],
    colors: ['#0f172a', '#6366f1'],
  },
  other: {
    sizeType: 'none',
    sizes: [],
    colors: [],
  },
};

const sanitizeStringArray = (values, fallback = []) => {
  if (Array.isArray(values) && values.length) {
    return values.map((value) => String(value).trim()).filter(Boolean);
  }
  return [...fallback];
};

const inferProductType = (explicitType, category = '') => {
  if (explicitType && variationPresets[explicitType]) {
    return explicitType;
  }
  const normalizedCategory = category.toLowerCase();
  if (/shoe|sneaker|footwear|boot|flip/.test(normalizedCategory)) {
    return 'footwear';
  }
  if (/tee|shirt|dress|coat|jacket|men|women|kids/.test(normalizedCategory)) {
    return 'apparel';
  }
  return 'other';
};

const buildVariantPayload = (variants = {}, productType = 'other') => {
  const resolvedType = inferProductType(variants.productType || productType);
  const defaults = variationPresets[resolvedType] || variationPresets.other;
  return {
    sizeType: variants.sizeType || defaults.sizeType,
    sizes: sanitizeStringArray(variants.sizes, defaults.sizes),
    colors: sanitizeStringArray(variants.colors, defaults.colors),
  };
};

module.exports = {
  variationPresets,
  inferProductType,
  buildVariantPayload,
};
