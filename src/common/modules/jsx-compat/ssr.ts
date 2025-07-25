function isSelfClosing(tag: string) {
  return ["meta", "link"].includes(tag);
}

function renderProps(props: object) {
  const renderedProps = Object.keys(props)
    .map?.((key) => `${key}="${props[key]}"`)
    .join(" ");
  return renderedProps ? ` ${renderedProps}` : "";
}

function renderChildren(children: any) {
  if (typeof children === "string") {
    return children;
  }
  const renderedChildren = children
    ?.map?.((node: object) => toHtml(node))
    .join("\n");
  return renderedChildren ? `\n${renderedChildren}\n` : "";
}

function toHtml(jsxObj: object) {
  if (Object.keys(jsxObj).includes("tag")) {
    const tag = jsxObj["tag"];
    if (typeof tag === "string") {
      const { children, ...props } = jsxObj["props"];
      if (isSelfClosing(tag)) {
        return `<${tag}${renderProps(props)} />`;
      }
      const doctype = tag === "html" ? "<!doctype html>\n" : "";
      return `${doctype}<${tag}${renderProps(props)}>${renderChildren(children)}</${tag}>`;
    }
  }
  console.log(JSON.stringify(jsxObj));
  return "";
}

export { toHtml };
