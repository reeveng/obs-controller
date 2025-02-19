<!-- # sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment. -->

# Encuez

## Assumptions

- Shouldn't reinvent the wheel, and libraries are allowed

## Prerequisites

Ensure docker and docker compose work.
I used pnpm and it's also what docker will use, but it's not a hard requirement.
You have obs installed, and have web-sockets set up for OBS.

## Start the project

1. Don't forget the required environment variables (can be found in .env.example)

    ```bash
    cp .env.example .env
    ```

2. Then build the docker images.

    ```bash
    docker compose build
    docker compose up
    ```
