# Code Patterns

## 1. Glassmorphism Card
Standard card style used throughout the apps:
```css
.card {
    background: var(--glass-bg); /* e.g., rgba(255, 255, 255, 0.7) */
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 2. Dark Mode Implementation
Theme switching using a data attribute on the `<html>` or `<body>` element:
```javascript
const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
};
```

## 3. App Shell Structure
Every application follows this high-level structure:
- `header`: Contains the title, theme toggle, and secondary actions.
- `main`: The core interactive area (grid, simulator, etc.).
- `nav`: (New) Bottom tab bar for mobile navigation.
- `footer`: Versioning and credits (often hidden on mobile).

## 4. Resource Pathing
To ensure compatibility between "Web" and "Standalone" modes:
- Use relative paths: `./css/style.css` in root webapps.
- [DEPRECATED FOR NOW] The `standalone/` files bundle these into a single file during export (via Python scripts like `replace_header.py`).

## 5. Event Handling
Prefer delegation or clean initialization:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize app state
    // Bind listeners
});
```

