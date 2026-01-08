/// <reference types="vite/client" />

// Fix JSX component type compatibility
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
}
