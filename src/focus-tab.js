#!/usr/bin/env osascript -l JavaScript

function run(args) {
  ObjC.import("stdlib");
  let browser = $.getenv("browser");

  let arc = Application(browser);
  let query = args[0];
  let [arg1, arg2, arg3] = query.split(",");
  let windowIndex = parseInt(arg1);
  let spaceIndex = parseInt(arg2);
  let tabIndex = parseInt(arg3);

  arc.windows[windowIndex].spaces[spaceIndex].tabs[tabIndex].select();
}
