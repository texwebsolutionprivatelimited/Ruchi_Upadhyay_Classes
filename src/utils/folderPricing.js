import { categoryConfig, defaultCategoryConfig } from '@/config/categoryConfig';

const STORAGE_KEY_PREFIX = 'rc_folder_prices_';
const CUSTOM_FOLDERS_PREFIX = 'rc_custom_folders_';

export const DEFAULT_FOLDER_PRICE = {
  tests: 299,
  notes: 299,
};

/**
 * Get folder price for a given category and content type ('notes' or 'tests').
 * Priority:
 * 1. Locally stored admin-configured price (if set, including 0 for free)
 * 2. Price from items in that category (if set > 0)
 * 3. Default fallback price (299 for tests/notes)
 */
export const getFolderPrice = (categoryName, type = 'notes', items = []) => {
  if (!categoryName) return 0;

  const cleanCat = String(categoryName).trim();
  const lowerCat = cleanCat.toLowerCase();

  // 1. Check localStorage for admin-configured price / manual toggle (highest priority)
  try {
    const storedPrices = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}${type}`) || '{}');
    if (storedPrices[cleanCat] !== undefined && typeof storedPrices[cleanCat] === 'number') {
      return storedPrices[cleanCat];
    }
    // Case-insensitive match in storedPrices
    const matchedKey = Object.keys(storedPrices).find((k) => k.trim().toLowerCase() === lowerCat);
    if (matchedKey && typeof storedPrices[matchedKey] === 'number') {
      return storedPrices[matchedKey];
    }
  } catch (err) {
    console.error('Error reading folder price from localStorage:', err);
  }

  // 2. Check if any item in this category has an explicit price set in database/data
  // Note: 0 is explicitly supported for FREE folders!
  if (Array.isArray(items) && items.length > 0) {
    const itemWithPrice = items.find(
      (item) =>
        item.category &&
        item.category.trim().toLowerCase() === lowerCat &&
        typeof item.price === 'number'
    );
    if (itemWithPrice && typeof itemWithPrice.price === 'number') {
      return itemWithPrice.price;
    }
  }

  // 3. Fallback default price (Paid by default unless admin toggles Free)
  return DEFAULT_FOLDER_PRICE[type] ?? 299;
};

/**
 * Save folder price to localStorage
 */
export const saveFolderPriceLocal = (categoryName, type = 'notes', price = 0) => {
  if (!categoryName) return;
  try {
    const key = `${STORAGE_KEY_PREFIX}${type}`;
    const storedPrices = JSON.parse(localStorage.getItem(key) || '{}');
    storedPrices[categoryName] = Number(price);
    localStorage.setItem(key, JSON.stringify(storedPrices));
  } catch (err) {
    console.error('Error saving folder price to localStorage:', err);
  }
};

/**
 * Get custom folders created by admin
 */
export const getCustomFolders = (type = 'notes') => {
  try {
    const key = `${CUSTOM_FOLDERS_PREFIX}${type}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (err) {
    console.error('Error reading custom folders:', err);
    return [];
  }
};

/**
 * Add or update a custom folder
 */
export const saveCustomFolder = (type = 'notes', folder) => {
  try {
    const key = `${CUSTOM_FOLDERS_PREFIX}${type}`;
    const folders = getCustomFolders(type);
    const existingIndex = folders.findIndex((f) => f.name === folder.name);
    if (existingIndex >= 0) {
      folders[existingIndex] = { ...folders[existingIndex], ...folder };
    } else {
      folders.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        ...folder,
      });
    }
    localStorage.setItem(key, JSON.stringify(folders));
  } catch (err) {
    console.error('Error saving custom folder:', err);
  }
};

/**
 * Delete a custom folder
 */
export const deleteCustomFolder = (type = 'notes', folderName) => {
  try {
    const key = `${CUSTOM_FOLDERS_PREFIX}${type}`;
    const folders = getCustomFolders(type).filter((f) => f.name !== folderName);
    localStorage.setItem(key, JSON.stringify(folders));
  } catch (err) {
    console.error('Error deleting custom folder:', err);
  }
};

/**
 * Get list of folders.
 * When `onlyWithItems === true` (for student side), ONLY returns folders
 * that actually contain uploaded items (notes or tests) by admin.
 */
export const getAllFolders = (type = 'notes', items = [], onlyWithItems = false) => {
  const custom = getCustomFolders(type);
  const configKeys = Object.keys(categoryConfig);

  // Collect distinct categories from actual uploaded items in DB
  const itemCategories = new Set();
  (items || []).forEach((item) => {
    if (item?.category) {
      itemCategories.add(item.category);
    }
  });

  const folderMap = new Map();

  // 1. Add categories found in uploaded items
  itemCategories.forEach((name) => {
    const config = categoryConfig[name] || defaultCategoryConfig;
    const catItems = (items || []).filter((i) => i.category === name);
    folderMap.set(name, {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: config.icon || 'Folder',
      gradient: config.gradient || 'from-primary/80 to-accent',
      description: config.description || `Study materials for ${name}`,
      price: getFolderPrice(name, type, items),
      itemCount: catItems.length,
      isCustom: false,
    });
  });

  // 2. Add custom folders created by admin
  custom.forEach((folder) => {
    const catItems = (items || []).filter((i) => i.category === folder.name);
    if (!onlyWithItems || catItems.length > 0) {
      folderMap.set(folder.name, {
        name: folder.name,
        slug: folder.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: folder.icon || 'Folder',
        gradient: folder.gradient || 'from-indigo-500 to-purple-500',
        description: folder.description || `Course package for ${folder.name}`,
        price: folder.price !== undefined ? folder.price : getFolderPrice(folder.name, type, items),
        itemCount: catItems.length,
        isCustom: true,
      });
    }
  });

  // 3. For Admin view only (when onlyWithItems is false): include standard categories
  if (!onlyWithItems) {
    configKeys.forEach((name) => {
      if (!folderMap.has(name)) {
        const config = categoryConfig[name] || defaultCategoryConfig;
        const catItems = (items || []).filter((i) => i.category === name);
        folderMap.set(name, {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: config.icon || 'Folder',
          gradient: config.gradient || 'from-blue-500 to-cyan-400',
          description: config.description || `Study materials for ${name}`,
          price: getFolderPrice(name, type, items),
          itemCount: catItems.length,
          isCustom: false,
        });
      }
    });
  }

  const result = Array.from(folderMap.values());
  if (onlyWithItems) {
    return result.filter((f) => f.itemCount > 0);
  }
  return result;
};

/**
 * Natural sort for chapters/tests by Chapter number in title (e.g. Chapter 1, Chapter 2...)
 * or fallback to created_at ascending (oldest first).
 */
export const sortChapters = (items = []) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const extractNum = (str) => {
      if (!str) return null;
      // Match patterns like "Chapter 1", "Ch 1", "Ch. 1", "Unit 1", "Test 1"
      const match = str.match(/(?:chapter|ch\.?|unit|test|mock)\s*(\d+)/i) || str.match(/^(\d+)[\.\s\:\-]/);
      if (match) return parseInt(match[1], 10);
      // Fallback: look for any number in title
      const generalMatch = str.match(/\b(\d+)\b/);
      return generalMatch ? parseInt(generalMatch[1], 10) : null;
    };

    const numA = extractNum(a?.title);
    const numB = extractNum(b?.title);

    if (numA !== null && numB !== null) {
      if (numA !== numB) return numA - numB;
    } else if (numA !== null) {
      return -1;
    } else if (numB !== null) {
      return 1;
    }

    // Fallback: created_at ascending (Chapter 1 created first, Chapter 4 created last)
    if (a?.created_at && b?.created_at) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return (a?.title || '').localeCompare(b?.title || '', undefined, { numeric: true, sensitivity: 'base' });
  });
};

