stat-viz is a platform for building browser-based visulizations of statistics collected from target EVMs. The project is focused on providing users with an easy-to-access UI and providing developers easy-to-extend web components that can be customized for their own EVMs.

For the development of this project, we used the J7 Common Processor Board as the target EVM. However, it is not a requirement for the project - the EVM-specific code is data collection and can be modified per target EVM.

The only requirement is that the target EVM has a Linux distribution on which a websocket server can be instatiated.

## Build Instructions

```
git clone https://github.com/nikhildevshatwar/statcol/tree/stat-viz
cd stat-viz
npm install
npm run build
```

#### Notes

- If the build command runs out of heap memory, perform the following command and try again.

```
export NODE_OPTIONS=--max_old_space_size=4096
```

## Running Instructions

#### Dependency: Websocketd

```
./websocketd --staticdir=build --dir=scripts --port=<INSERT_PORT>
```

## Adding a New Component

All components are stored under the `components` directory and return a `Generic` component. The interface of the Generic component is as follows:

```javascript
<Generic
  innerComponent={content}
  resetHandler={props.resetHandler}
  resetHandlerName={props.resetHandlerName}
  settings={props.settings}
/>
```

The `innerComponent` JSX element is the only one that needs to be defined in the component definition. The rest need to be supplied when the components is instatiated. They behave as follows:

- `innerComponent`: This is a JSX element that represents the actual React element rendered that will be rendered in the component.
- `resetHandler`: This callback is the function called when the Reset button is called for the component.
- `resetHandlerName`: This is a unique name for the resetHandler of this component. This name should be unique in the Tab wherein the component is being rendered.
- `settings`: This is a JS object that represents the configuration option for this particular component. These will be discussed in detail in the next section.

## Adding new Config options
