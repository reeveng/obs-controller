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

A small little "helper" that does nothing that obs can't do 😆.
Has the following features:
- start recording
- stop recording
- switch scene
- display the timecode / current recording file name / directory
- indicates "nicely" when you're live
- can be build with docker
- almost realtime updates


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

## Screenshots

### When disconnected / when obs is not running

![image](https://github.com/user-attachments/assets/b2a616c5-e65c-481b-8d96-a441b4135514)

### When obs is running and you reconnect

![image](https://github.com/user-attachments/assets/13c8095b-eeb4-406e-86c0-051125d57d63)

### When recording with obs

![image](https://github.com/user-attachments/assets/ab04179c-30c2-4e36-8997-1bce271c33da)


### When you stop the recording

![image](https://github.com/user-attachments/assets/c4303909-38da-424a-bded-2efd86b370a4)



