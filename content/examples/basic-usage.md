---
title: Basic Usage Examples
description: Common patterns for using ECME Framework
author: Examples Team
date: 2025-06-17
tags: [examples, getting-started]
---

# Basic Usage Examples

## Creating a Page

```javascript
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is an example page using ECME.</p>
    </div>
  )
}
```

## Adding Styles

ECME supports both global and component-scoped styles:

```css
/* styles/globals.css */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
}
```

## Data Fetching

Example of fetching data at build time:

```javascript
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  
  return {
    props: {
      data
    }
  }
}
```

## Navigation

Creating navigation links:

```javascript
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

## Next Steps

For more advanced examples, see the [Advanced Usage](../advanced/) section.
