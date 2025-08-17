# Getting Started

This is a repo for HighCircl Weather Application.

To run this application you can either run it by running make command (which runs docker):

```bash
make docker-serve
```

or by installing everything locally:

```bash
yarn install
yarn run start
```

# Building For Production

To build this application for production:

```bash
yarn run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
yarn run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
yarn run lint
yarn run format
yarn run check
```
