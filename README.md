# Kolchi Market - Temu Style Pro Store

A professional, high-performance static e-commerce platform inspired by the Temu aesthetic. Built with HTML, CSS, and vanilla JavaScript.

## Features

- **Dynamic Product Grid**: Real-time category filtering and search.
- **Client-Side Admin Panel**: Manage products, categories, and orders using LocalStorage.
- **Manual Checkout**: Order processing via WhatsApp and EmailJS integration.
- **Responsive Design**: Fully optimized for mobile and desktop.
- **Zero Backend**: Works entirely in the browser, making it perfect for free hosting.

## Local Development

1. Open `index.html` in any modern browser (Chrome, Brave, Edge).
2. To use the admin features, go to `setup.html` first to create your credentials.

## Deployment on GitHub Pages

This project is configured to deploy automatically via GitHub Actions.

1. Push this repository to GitHub.
2. Go to **Settings > Pages** in your repository.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The site will be live at `https://<username>.github.io/<repo-name>/`.

## Project Structure

- `index.html`: Homepage with hero section and product grid.
- `product.html`: Detailed product view.
- `cart.html`: Shopping cart and checkout flow.
- `admin-panel-x7k.html`: Secure admin dashboard (access restricted by password).
- `setup.html`: Initial admin configuration.
- `js/store.js`: Central state management using LocalStorage.
- `js/app.js`: Frontend logic and UI interactions.
- `css/style.css`: Modern, responsive styling.
