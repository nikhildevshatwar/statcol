## Build Instructions

```
git clone https://github.com/nikhildevshatwar/statcol/tree/stat-viz
cd stat-viz
npm install
npm run build
```

## Running Instructions

#### Dependency: Websocketd

```
./websocketd --staticdir=build --dir=scripts --port=<INSERT_PORT>
```

## Notes

- If the build command runs out of heap memory, perform the following command and try again.

```
export NODE_OPTIONS=--max_old_space_size=4096
```
