// this is the result of `pnpm build` in `../ts-plugin`

export const script = `import { createEffect, createComponent } from 'solid-js';
import { render, Dynamic, Portal } from 'solid-js/web';

function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = "count is " + counter;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
const Comp = (props) => {
  const container = document.createElement("div");
  container.appendChild(document.createElement("hr"));
  container.append(
    "Button from typescript plugin; simply increments its own count. I.e. doesn't interact with anything external yet."
  );
  const button = document.createElement("button");
  setupCounter(button);
  container.appendChild(button);
  container.appendChild(document.createElement("hr"));
  container.append(
    "Reactive prop that typescript plugin gets from Solid. It works! (By using Solid's 'createEffect', hah.)"
  );
  const iDiv = document.createElement("div");
  createEffect(() => {
    iDiv.textContent = props.i.toString();
  });
  container.appendChild(iDiv);
  container.appendChild(document.createElement("hr"));
  const h1 = document.createElement("h1");
  h1.textContent = "Failing attempts to attach a Solid Component:";
  container.appendChild(h1);
  container.appendChild(document.createElement("hr"));
  container.append("using 'render':");
  const renderDiv = document.createElement("div");
  render(
    () => props.child({
      get i() {
        return props.i;
      }
    }),
    renderDiv
  );
  container.appendChild(renderDiv);
  container.appendChild(document.createElement("hr"));
  container.append("using 'Dynamic':");
  const dynamicNode = Dynamic({
    get component() {
      return props.child;
    },
    get i() {
      return props.i;
    }
  })();
  container.appendChild(dynamicNode);
  container.appendChild(document.createElement("hr"));
  container.append("using 'Portal':");
  const portalDiv = document.createElement("div");
  Portal({
    mount: portalDiv,
    children: props.child({
      get i() {
        return props.i;
      }
    })
  });
  container.appendChild(portalDiv);
  container.appendChild(document.createElement("hr"));
  container.append(
    "using 'Portal' inside a 'createEffect' replaces the entire DOM sub-tree, losing all fine-grained updates"
  );
  const portalEffectDiv = document.createElement("div");
  createEffect(() => {
    Portal({
      mount: portalEffectDiv,
      children: props.child({
        get i() {
          return props.i;
        }
      })
    });
  });
  container.appendChild(portalEffectDiv);
  container.appendChild(document.createElement("hr"));
  container.append(
    "Invoking the component and replacing the entire DOM sub-tree with createEffect, losing all fine-grained updates"
  );
  const componentDiv = document.createElement("div");
  createEffect(() => {
    componentDiv.replaceChildren(
      props.child({
        get i() {
          return props.i;
        }
      })
    );
  });
  container.appendChild(componentDiv);
  container.appendChild(document.createElement("hr"));
  container.append("createComponent with a plain VoidComponent ");
  const createPlainComponent = createComponent(props.child, {
    get i() {
      return props.i;
    }
  });
  container.appendChild(createPlainComponent);
  container.appendChild(document.createElement("hr"));
  container.append("createComponent with Dynamic");
  const createDynamicComp = createComponent(Dynamic, {
    get component() {
      return props.child;
    },
    get i() {
      return props.i;
    }
  });
  container.appendChild(createDynamicComp());
  container.appendChild(document.createElement("hr"));
  return container;
};

export { Comp as default, setupCounter };
`