# Theme Tokens (Almadar Identity)

The front-end uses a unified design-token system defined in [`src/styles/tokens.css`](src/styles/tokens.css) and wired through [`tailwind.config.js`](tailwind.config.js). Tokens provide a single source of truth for both light (`:root`) and dark (`.dark`) themes.

## Families
- **Core:** `background`, `foreground`, `border`, `input`, `ring`, `muted`
- **Brand:** `primary`, `secondary`, `accent` (each exposes `DEFAULT`, `foreground`, `hover`, `light`)
- **State:** `success`, `warning`, `destructive` (each with `*-foreground`)
- **Surfaces:** `card`, `popover` (`DEFAULT`, `foreground`, optional `hover`)
- **Sidebar:** `sidebar` (`DEFAULT`, `foreground`, `accent`, `accent-foreground`, `primary`, `primary-foreground`, `border`, `ring`)
- **Visuals:** `gradient-primary`, `gradient-secondary`, `gradient-hero`, `gradient-card` and `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-glow`

## Typography
- `fontFamily.heading` → `var(--font-heading)` (Inter)
- `fontFamily.body` → `var(--font-body)` (Cairo)

## Adding a new theme
Override variables within a scope class and apply that class to `html` or any container:

```css
.theme-ocean {
  --primary: #0D9488;
  --primary-foreground: #062825;
  /* other overrides */
}
```

Then wrap your application or subtree:

```html
<html class="theme-ocean">
  ...
</html>
```

## Picking tokens by role
- **Primary actions** → `bg-primary text-primary-foreground hover:bg-primary-hover`
- **Decorative highlights or links** → `text-accent` or `bg-accent`
- **Subtle surfaces** → `bg-secondary` or `bg-muted`
- **Feedback banners** → `bg-success|warning|destructive` with corresponding `*-foreground`
- **Cards & popovers** → `bg-card|popover` + `text-card-foreground|popover-foreground`

Always pair background tokens with the matching `*-foreground` for accessible contrast. Run `npm run lint` to ensure no legacy color classes remain after edits.
