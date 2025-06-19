# How to Set Up the Project (Next.js)

Before you can add pages or make changes to the website, you need to set up the project on your computer. Here’s how:

---

1. **Install Node.js**  
   If not already installed, download and install it from:  
   https://nodejs.org/

2. **Clone the Project**  
   Open your terminal and run:

    ```bash
    git clone https://github.com/jukha/ecme-static-site-framewok.git
    cd your-project

    ```

3. **Install Dependencies**

```bash
    npm install
    # or
    yarn install
```

4. **Install Dependencies**

```bash
   npm run dev
   # or
   yarn dev
```

# How to Add New Pages to Our Website

This guide will walk you through the simple steps to add new content pages to our website and make them appear in the navigation menu. You don't need to be a developer to do this — just follow these instructions carefully!

---

## Step 1: Create Your Content Page (the `.md` file)

Our website uses special files called **Markdown** files (`.md` extension) for content pages. Think of them like simple Word documents, but without all the complex formatting buttons.

1. Go to the `content` folder in your project's main directory. This is where all your content pages live.
2. Create a **new file** inside this `content` folder.
3. Give it a **meaningful name**, for example:  
   `my-new-article.md` or `about-us.md`
4. You can **organize** your files using subfolders, e.g.:  
   `content/documents/about-us.md`
5. Write your content using basic formatting like:

```md
# Main Heading

## Subheading

**Bold Text**

_Italic Text_

- List Item
```

**Example: `about-us.md`**

```md
# About us

Welcome to about us page!

This is some plain text.

- Here is a list item
- Another list item
```

👉 **Remember to save your file!**

---

## Step 2: Add Your Page to the Navigation Menu

Now that you have your content file, you need to **add it to the navigation menu**.

1. Open the file: `config/navigation.config.yaml`

> ✅ **Important: The file name and folder structure must match the URL path exactly.**

For example:

- For the path `/about-us`, the file must be:  
  `content/about-us.md`
- For `/docs/intro`, use:  
  `content/docs/intro.md`

> ⚠️ **Important:** This file uses **YAML** format, which is very sensitive to **spaces**. Use **spaces**, not tabs!

### Understand the Menu Structure:

Each menu item is defined with these keys:

- `key`: Unique ID for the menu item (e.g., `aboutUsPage`)
- `path`: Web address of the page (e.g., `/about`)
- `title`: Text shown in the menu (e.g., "About Us")
- `translateKey`: For multilingual support (e.g., `nav.about`)
- `icon`: (Optional) Icon name
- `type`: `ITEM` for pages, `COLLAPSE` for dropdowns
- `authority`: Leave as `[]` (no restriction)
- `meta.description.label`: A short description
- `subMenu`: List of child menu items

---

### ✅ Example A: Add a Simple About us Page

```yaml
- key: myArticlePage
  path: /about-us
  title: About us
  translateKey: nav.aboutUs
  icon: someIcon
  type: ITEM
  authority: []
  meta:
      description:
          translateKey: nav.aboutUsDesc
          label: A great read on new topics
  subMenu: []
```

---

### ✅ Example B: Add a Page Under a Dropdown Menu

Suppose your file is: `content/documentation/examples/first.md`

1. Add a **top-level dropdown** for Documentation.
2. Add a **submenu** for Examples.
3. Add your **actual page** in the final `subMenu`.

```yaml
- key: documentationParent
  path: ''
  title: Documentation
  translateKey: nav.documentation
  icon: documentIcon
  type: COLLAPSE
  authority: []
  meta:
      description:
          translateKey: nav.documentationDesc
          label: Guides and how-tos
  subMenu:
      - key: examplesParent
        path: ''
        title: Examples
        translateKey: nav.examples
        icon: exampleIcon
        type: COLLAPSE
        authority: []
        meta:
            description:
                translateKey: nav.examplesDesc
                label: Practical usage examples
        subMenu:
            - key: firstExamplePage
              path: /documentation/examples/first
              title: First Example
              translateKey: nav.firstExample
              icon: circleIcon
              type: ITEM
              authority: []
              meta:
                  description:
                      translateKey: nav.firstExampleDesc
                      label: A basic working example
              subMenu: []
```

---

## Step 3: See Your Changes!

Once you've saved both:

- Your `.md` file in the `content/` folder
- And updated `navigation.config.yaml`

Restart your local development server:

```bash
# Stop the current process
Ctrl + C

# Restart the server
npm run dev
# or
yarn dev
```

Open your browser and go to:  
**http://localhost:3000**

🎉 Your new page and menu item should now be visible!

---

## 🧠 Quick Tips

- ✅ **Use spaces**, never tabs in YAML
- ✅ **Every key must be unique**
- ✅ `path` is the URL, `title` is what users see
- ✅ Use `ITEM` for direct pages, `COLLAPSE` for dropdowns

---

By following these steps, you can easily manage and organize website content on your own!
