# create-app

## Usage

```zsh
npm create @e.fe/app@latest

# OR

npx @e.fe/create-app@latest
```

![Usage](./usage.svg)

### More

```zsh
# From Repo
npm create @e.fe/app@latest from-repo <url>

# From Template
npm create @e.fe/app@latest -T <template>

# Mixin Mode - Apply template logic to current directory
npm create @e.fe/app@latest -T <template> --mixin
```

## Mixin Mode

The mixin mode allows you to apply template package logic to your current directory, useful for:

- Adding new modules to existing projects
- Applying configuration templates

```bash
# Apply React component template
npx @e.fe/create-app --template @e.fe/template-standard --mixin

# Use local template file
npx @e.fe/create-app --template file:./local-template --mixin
``````
