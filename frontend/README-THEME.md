Theme Tokens

The application uses a unified set of CSS variables stored in
src/styles/tokens.css. These variables define both light and dark themes and
are consumed through Tailwind in tailwind.config.js.

Tokens

The default palette follows the new Almadar brand: primary olive drab, secondary
teal and a medium blue accent.

background / foreground – base surfaces and text.

primary – main actions and highlights.

secondary – secondary surfaces or actions.

accent – decorative highlights.

muted – subtle backgrounds and text.

success / warning / destructive – status feedback.

card / popover – generic surfaces.

sidebar – dedicated palette for the navigation sidebar.

gradients – --gradient-primary, --gradient-secondary,
--gradient-hero, --gradient-card.

shadows – --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl,
--shadow-glow.

fonts – --font-heading, --font-body.

Adding a new theme

Override the variables under a new class and apply it on the root element:

.theme-ocean {
  --primary: #0D9488;
  --primary-foreground: #062825;
  /* other overrides */
}

<html class="theme-ocean">
  ...
</html>

Choosing tokens by role

Primary for prominent call-to-action buttons.

Secondary for muted buttons and panels.

Accent for attention or decorative elements.

Muted for borders or background fillers.

Status colors for success, warning or destructive messages.

Always pair background tokens with their *-foreground text token for
contrast.