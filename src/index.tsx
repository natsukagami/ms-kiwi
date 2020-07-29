import { h, render } from "preact";
import App from "./App";

// Must be the first import
import "preact/debug";

const HOST = window.location.origin;

render(<App host={HOST} />, document.getElementById("main") as HTMLElement);
