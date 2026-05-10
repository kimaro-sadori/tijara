# Kolchi Market

A production-ready Django e-commerce website inspired by modern marketplaces. Built with HTML, CSS, vanilla JavaScript, and Django.

## Features

- Homepage product grid with promotions
- Product details and category filtering
- Search, cart, and checkout simulation
- User registration, login, logout
- Admin management for products, categories, users
- Visitor analytics dashboard
- Responsive mobile and desktop UI

## Project structure

- `manage.py` — Django management entrypoint
- `ecommerce/` — Django project settings and URLs
- `shop/` — main app containing models, views, templates, static assets
- `requirements.txt` — Python dependencies
- `README.md` — setup and deployment instructions

## Setup

1. Create a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```powershell
   python manage.py migrate
   ```
4. Load sample product data:
   ```powershell
   python manage.py loaddata initial_data.json
   ```
5. Create a superuser:
   ```powershell
   python manage.py createsuperuser
   ```
6. Start the development server:
   ```powershell
   python manage.py runserver
   ```
7. Open `http://127.0.0.1:8000/`

## Deployment

The project uses SQLite by default in development. For deployable production, switch to PostgreSQL via environment variables.

### PostgreSQL option

Set `DATABASE_URL` in your hosting environment to a valid Postgres URL:

```
postgres://USER:PASSWORD@HOST:PORT/NAME
```

Then run migrations again.

### Deploy on free hosters

#### Option A: PythonAnywhere

1. Create a free account on PythonAnywhere.
2. Upload the project files or clone from a Git repository.
3. Create a virtualenv and install `pip install -r requirements.txt`.
4. Configure the web app to use `manage.py` and point the WSGI file to `ecommerce/wsgi.py`.
5. Set `DATABASE_URL` if using PostgreSQL, or use the built-in SQLite file.
6. Collect static files if needed:
   ```powershell
   python manage.py collectstatic --noinput
   ```

#### Option B: Render or Railway (recommended)

1. Push the repository to GitHub.
2. Create a new web service on Render or Railway.
3. Point it to the repository.
4. Set environment variables:
   - `DJANGO_SETTINGS_MODULE=ecommerce.settings`
   - `DATABASE_URL` (optional for PostgreSQL)
   - `SECRET_KEY` (use a secure random value)
5. Configure the build command:
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```
6. Visit the generated public URL.

### Cloudflare Pages note

Cloudflare Pages supports static sites only. To use this project with Cloudflare Pages, host the static frontend separately and deploy the Django backend on a free Python backend provider such as Render, Railway, or PythonAnywhere.

## Extending features

- Add real payment gateway integration (Stripe, PayPal)
- Add product reviews and ratings
- Add order history and account pages for customers
- Add email confirmation and receipts
- Add advanced sales reports and inventory tracking
- Add a custom admin dashboard with charts and order analytics
