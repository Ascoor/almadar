# Application Style Guide

This guide defines the design tokens and components used across the application.
It supports light and dark modes using CSS variables. All values are provided in
HSL notation and exposed through Tailwind classes.

## Color Palette

### Light Mode
| Token | HSL | Description |
|------|-----|-------------|
| `--background` | `210 20% 98%` | App background |
| `--text-title` | `222 47% 11%` | Heading text |
| `--text-body` | `215 20% 25%` | Body text |
| `--text-muted` | `215 16% 52%` | Muted text and placeholders |
| `--primary` | `222 83% 55%` | Primary actions & links |
| `--secondary` | `262 83% 58%` | Secondary actions |
| `--accent` | `164 60% 45%` | Accent highlights |
| `--success` | `142 70% 45%` | Success state |
| `--warning` | `38 92% 50%` | Warning state |
| `--destructive` | `0 72% 50%` | Error state |
| `--info` | `199 90% 48%` | Informational state |

### Dark Mode
| Token | HSL | Description |
|------|-----|-------------|
| `--background` | `215 40% 13%` | App background |
| `--text-title` | `210 40% 98%` | Heading text |
| `--text-body` | `214 32% 85%` | Body text |
| `--text-muted` | `215 20% 65%` | Muted text and placeholders |
| `--primary` | `222 83% 70%` | Primary actions & links |
| `--secondary` | `262 83% 70%` | Secondary actions |
| `--accent` | `164 65% 60%` | Accent highlights |
| `--success` | `142 70% 55%` | Success state |
| `--warning` | `38 92% 60%` | Warning state |
| `--destructive` | `0 72% 60%` | Error state |
| `--info` | `199 90% 60%` | Informational state |

## Typography
- `--font-heading`: Roboto, Open Sans, sans-serif
- `--font-body`: Roboto, Open Sans, sans-serif

## UI Components
The following utility classes are available and adapt automatically to the
current color mode:

| Class | Purpose |
|-------|---------| 
| `Button` (variant="default") | Primary action button |
| `Button` (variant="secondary") | Secondary action button |
| `Button` (variant="accent") | Accent button |
| `Button` (variant="destructive") | Danger/destructive action |
| `Button` (variant="outline") | Outline button |
| `Button` (variant="ghost") | Subtle button |
| `Button` (variant="link") | Link-style button |
| `.btn-hero` | Gradient hero button |
 
| `.input` | Text input fields |
| `.card` | Card and container surfaces |
| `.navbar` | Application navigation bar |
| `.modal` | Modal dialog container |
| `.tooltip` | Tooltip body |
| `.link` | Interactive link style |

## Gradients & Effects
- `bg-gradient-primary` – gradient from primary to secondary
- `bg-gradient-card` – subtle card background gradient
- `shadow-glow` – soft glow used on interactive elements

## Usage
All design tokens are available as CSS variables and in Tailwind through the
configured color names (e.g. `text-title`, `bg-card`, `shadow-glow`). Components
are built with Tailwind's `@apply` directive for consistency.

