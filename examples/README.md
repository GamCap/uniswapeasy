# UniswapEasy Example

This is an example project demonstrating how to integrate and customize the UniswapEasy liquidity provider widget.

## Customizing the Widget

To customize the widget, pass a `theme` prop to the `UniswapEasy` component. This prop allows you to define colors for various UI elements.

```jsx
<UniswapEasy
  theme={
    {
      // Define your theme colors here
    }
  }
  // ...other props
/>
```

Remember that the widget currently only displays the first pool provided in the `poolKeys`.

## Running the Example

Before running the example, update the `uniswapeasy` dependency in `package.json` to point to the correct package location after building it with `yarn pack`.

1. Replace the full path to `uniswapeasy` in `package.json` with the relative path to the `.tgz` file.
2. Install the dependencies with `yarn install`.
3. Start the application using `yarn start`. The application will be available at `http://localhost:3000`.

## Notes

- The example is set up for development and is not suitable for production deployment.
- It is important to build and pack the `uniswapeasy` package from the root directory before attempting to run the example.
