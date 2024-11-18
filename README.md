# My hobby project

- A personal hobby project aimed at creating a unified integration platform, initially focused on IoT devices with potential for future expansions.


## Getting started

```bash
# 1. Clone the repository or click on "Use this template" button.
git clone git@github.com:xdien/mixx-mash.git

# 2. Enter your newly-cloned folder.
cd mixx-mash

# 3. Create Environment variables file.
cp .env.example .env

# 3. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install)
yarn
```

## Checklist

When you use this template, try follow the checklist to update your info properly

- [ ] Change configurations in `.env`
- [ ] Create passwd file for mosquitto

And, enjoy :)

### Development

```bash
# 4. Run development server and open http://localhost:3000
# Start dependent services 
docker compose build
docker compose up

yarn watch:dev

```

### Build

To build the App, run

```bash
yarn build:prod
```

And you will see the generated file in `dist` that ready to be served.

## Features

<dl>
  <!-- <dt><b>Quick scaffolding</b></dt>
  <dd>Create modules, services, controller - right from the CLI!</dd> -->

  <dt><b>Instant feedback</b></dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes are reflected instantaneously.</dd>

  <dt><b>JWT Authentication</b></dt>
  <dd>Installed and configured JWT authentication.</dd>

  <dt><b>Next generation Typescript</b></dt>
  <dd>Always up to date typescript version.</dd>

  <dt><b>Industry-standard routing</b></dt>
  <dd>It's natural to want to add pages (e.g. /about`) to your application, and routing makes this possible.</dd>

  <dt><b>Environment Configuration</b></dt>
  <dd>development, staging and production environment configurations</dd>

  <dt><b>Swagger Api Documentation</b></dt>
  <dd>Already integrated API documentation. To see all available endpoints visit http://localhost:3000/documentation</dd>

  <dt><b>Linter</b></dt>
  <dd>eslint + prettier = ❤️</dd>
</dl>

## Documentation

This project includes a `docs` folder with more details on:

1.  [Setup and development](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/development.html#first-time-setup)
1.  [Architecture](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/architecture.html)
1.  [Naming Cheatsheet](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/naming-cheatsheet.html)

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

