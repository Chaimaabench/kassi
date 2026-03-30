<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2b7b81b5-843a-40f8-9e40-f705a22bb555

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Manage Products

Product content is now managed from `data/products.json`.

For each product you can edit:
- `assetFolder`: must match the folder name inside `public/products`
- `name`: product name shown on the site
- `price`: current selling price
- `originalPrice`: old crossed-out price
- `category`: visible category label
- `categoryId`: one of `soft`, `bold`, or `organic`
- `description`: short product description
- `tag`: optional badge like `New` or `Low Stock`

To add a new product:
1. Create a folder inside `public/products`
2. Put the product images inside that folder
3. Add a new object in `data/products.json`
4. Set `assetFolder` exactly equal to the folder name

The first image in the folder is used as the main product image, and the rest are shown in the swipe gallery.

Logo and favicon:
- Replace `public/logo/logo kassi.png`
