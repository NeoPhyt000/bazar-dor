# 🛒 বাজার দর | BazarDor

**BazarDor** is a simple and user-friendly web application that helps people check the prices of everyday grocery products in Bangladesh. Users can explore different products, browse categories, and compare market prices in one place.

The main goal of this project is to make daily shopping easier by helping people stay informed about market prices.

## ✨ Key Features

1. **Browse Grocery Products** – Explore everyday products such as rice, vegetables, fish, meat, and other essentials with their prices.

2. **Category-Based Browsing** – Find products easily by visiting different product categories.

3. **Market Price Comparison** – Check product price information and compare prices across different markets.

4. **User Authentication** – Create an account or sign in using email and password, Google, or GitHub.

5. **Personal Profile Management** – View your profile information and update your name when needed.

## 🛠️ Technologies Used

- **Next.js 16** 
- **React 19** 
- **Tailwind CSS 4** 
- **HeroUI**
- **Better Auth**
- **MongoDB**
- **Lucide React** 
- **React Hot Toast**
- **React Fast Marquee** 

## 📦 Dependencies

- `next`, `react`, `react-dom`
- `tailwindcss`, `@heroui/react`
- `better-auth`
- `mongodb`
- `lucide-react` (icons)
- `react-hot-toast` (notifications)
- `react-fast-marquee` (scrolling banner)

> See [`package.json`](./package.json) for the exact versions.

## 🚀 Run Locally

**Prerequisites:** Node.js 20+ and npm, a MongoDB database (local or MongoDB Atlas).

```bash
# 1. Clone the repository
git clone https://github.com/NeoPhyt000/bazar-dor.git
cd bazar-dor

# 2. Install dependencies
npm install

# 3. Create a .env.local file in the project root (see below)

# 4. Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

### 🔐 Environment Variables

Create a `.env.local` file and add your own values:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🔗 Links

- **Live Site:** https://bazar-dor-silk-beta.vercel.app
- **GitHub Repo:** https://github.com/NeoPhyt000/bazar-dor
