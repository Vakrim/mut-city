export const products = [
  "tree",
  "planks",
  "furniture",
  "rice",
  "tomato",
  "soup",
] as const;

export type Product = typeof products[number];

export interface Recipe {
  in: Product[];
  out: Product[];
}

export const recipes = [
  { in: [], out: ["tree"] },
  { in: [], out: ["rice"] },
  { in: [], out: ["tomato"] },
  { in: ["tree"], out: ["planks"] },
  { in: ["planks"], out: ["furniture"] },
  { in: ["rice", "tomato"], out: ["soup"] },
] satisfies Recipe[];
