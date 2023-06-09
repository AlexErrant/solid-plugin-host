export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = "count is " + counter
  }
  element.addEventListener("click", () => setCounter(counter + 1))
  setCounter(0)
}

import { VoidComponent, createComponent, createEffect } from "solid-js"
import { Dynamic, Portal, render } from "solid-js/web"

const Comp: VoidComponent<{
  i: number
  child: VoidComponent<{ i: number }>
}> = (props) => {
  const container = document.createElement("div")
  container.appendChild(document.createElement("hr"))

  container.append(
    "Button from typescript plugin; simply increments its own count. I.e. doesn't interact with anything external yet."
  )
  const button = document.createElement("button")
  setupCounter(button)
  container.appendChild(button)
  container.appendChild(document.createElement("hr"))

  container.append(
    "Reactive prop that typescript plugin gets from Solid. It works! (By using Solid's 'createEffect', hah.)"
  )
  const iDiv = document.createElement("div")
  createEffect(() => {
    iDiv.textContent = props.i.toString()
  })
  container.appendChild(iDiv)
  container.appendChild(document.createElement("hr"))

  const h1 = document.createElement("h1")
  h1.textContent = "Failing attempts to attach a Solid Component:"
  container.appendChild(h1)
  container.appendChild(document.createElement("hr"))

  container.append("using 'render':")
  const renderDiv = document.createElement("div")
  render(
    () =>
      props.child({
        get i() {
          return props.i
        },
      }),
    renderDiv
  )
  container.appendChild(renderDiv)
  container.appendChild(document.createElement("hr"))

  container.append("using 'Dynamic':")
  // @ts-expect-error Dynamic is callable, contrary to the typescript definition. Calling it is probably breaking reactivity, but I don't know how else to attach it to the DOM.
  const dynamicNode = Dynamic({
    get component() {
      return props.child
    },
    get i() {
      return props.i
    },
  })() as Node
  container.appendChild(dynamicNode)
  container.appendChild(document.createElement("hr"))

  container.append("using 'Portal':")
  const portalDiv = document.createElement("div")
  Portal({
    mount: portalDiv,
    children: props.child({
      get i() {
        return props.i
      },
    }),
  })
  container.appendChild(portalDiv)
  container.appendChild(document.createElement("hr"))

  container.append(
    "using 'Portal' inside a 'createEffect' replaces the entire DOM sub-tree, losing all fine-grained updates"
  )
  const portalEffectDiv = document.createElement("div")
  createEffect(() => {
    Portal({
      mount: portalEffectDiv,
      children: props.child({
        get i() {
          return props.i
        },
      }),
    })
  })
  container.appendChild(portalEffectDiv)
  container.appendChild(document.createElement("hr"))

  container.append(
    "Invoking the component and replacing the entire DOM sub-tree with createEffect, losing all fine-grained updates"
  )
  const componentDiv = document.createElement("div")
  createEffect(() => {
    componentDiv.replaceChildren(
      props.child({
        get i() {
          return props.i
        },
      }) as Node
    )
  })
  container.appendChild(componentDiv)
  container.appendChild(document.createElement("hr"))

  container.append("createComponent with a plain VoidComponent ")
  const createPlainComponent = createComponent(props.child, {
    get i() {
      return props.i
    },
  })
  container.appendChild(createPlainComponent as Node)
  container.appendChild(document.createElement("hr"))

  container.append("createComponent with Dynamic")
  const createDynamicComp = createComponent(Dynamic, {
    get component() {
      return props.child
    },
    get i() {
      return props.i
    },
  })
  // @ts-expect-error Dynamic is callable, contrary to the typescript definition. Calling it is probably breaking reactivity, but I don't know how else to attach it to the DOM.
  container.appendChild(createDynamicComp() as Node)
  container.appendChild(document.createElement("hr"))

  return container
}

export default Comp
