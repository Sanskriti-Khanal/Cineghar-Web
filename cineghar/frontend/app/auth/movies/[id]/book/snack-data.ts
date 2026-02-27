/**
 * Snack & combo types and mock data.
 * Replace SNACK_ITEMS and SNACK_COMBOS with API data for dynamic loading.
 */

export type SnackCategory = "veg" | "nonveg" | "beverage";

export interface SnackItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: SnackCategory;
}

export interface SnackCombo {
  id: string;
  name: string;
  itemsPreview: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  imageUrl: string;
}

export const SNACK_ITEMS: SnackItem[] = [
  {
    id: "popcorn-s",
    name: "Popcorn (Small)",
    description: "Fresh buttered popcorn",
    price: 120,
    imageUrl: "/images/snacks/popcorn.jpg",
    category: "veg",
  },
  {
    id: "popcorn-l",
    name: "Popcorn (Large)",
    description: "Large buttered popcorn",
    price: 200,
    imageUrl: "/images/snacks/popcorn.jpg",
    category: "veg",
  },
  {
    id: "nachos",
    name: "Nachos with Cheese",
    description: "Crispy nachos with cheese dip",
    price: 250,
    imageUrl: "/images/snacks/nachos.jpg",
    category: "veg",
  },
  {
    id: "samosa",
    name: "Samosa (2 pcs)",
    description: "Crispy vegetable samosas",
    price: 80,
    imageUrl: "/images/snacks/samosa.jpg",
    category: "veg",
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    description: "Spicy crispy chicken wings (6 pcs)",
    price: 320,
    imageUrl: "/images/snacks/wings.jpg",
    category: "nonveg",
  },
  {
    id: "chicken-burger",
    name: "Chicken Burger",
    description: "Crispy chicken burger with fries",
    price: 380,
    imageUrl: "/images/snacks/burger.jpg",
    category: "nonveg",
  },
  {
    id: "pepsi",
    name: "Pepsi (500ml)",
    description: "Chilled soft drink",
    price: 100,
    imageUrl: "/images/snacks/pepsi.jpg",
    category: "beverage",
  },
  {
    id: "water",
    name: "Water Bottle",
    description: "Mineral water 500ml",
    price: 50,
    imageUrl: "/images/snacks/water.jpg",
    category: "beverage",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    description: "Iced coffee with cream",
    price: 180,
    imageUrl: "/images/snacks/coffee.jpg",
    category: "beverage",
  },
  {
    id: "juice",
    name: "Fresh Juice",
    description: "Seasonal fruit juice",
    price: 150,
    imageUrl: "/images/snacks/juice.jpg",
    category: "beverage",
  },
];

export const SNACK_COMBOS: SnackCombo[] = [
  {
    id: "combo-pop-drink",
    name: "Popcorn & Drink Combo",
    itemsPreview: "Large popcorn + Pepsi 500ml",
    price: 260,
    originalPrice: 300,
    discountLabel: "Save NPR 40",
    imageUrl: "/images/snacks/combo1.jpg",
  },
  {
    id: "combo-mega",
    name: "Mega Snack Pack",
    itemsPreview: "Large popcorn, nachos, 2 drinks",
    price: 550,
    originalPrice: 670,
    discountLabel: "18% off",
    imageUrl: "/images/snacks/combo2.jpg",
  },
  {
    id: "combo-date",
    name: "Date Night Combo",
    itemsPreview: "2 popcorns, 2 drinks, 1 nachos",
    price: 620,
    originalPrice: 720,
    discountLabel: "Best value",
    imageUrl: "/images/snacks/combo3.jpg",
  },
];

export const SNACK_CATEGORY_TABS: { key: SnackCategory | "combos"; label: string }[] = [
  { key: "veg", label: "Veg Snacks" },
  { key: "nonveg", label: "Non-Veg Snacks" },
  { key: "beverage", label: "Beverages" },
  { key: "combos", label: "Popular Combos" },
];
