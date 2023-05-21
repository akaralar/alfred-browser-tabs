#!/usr/bin/env osascript -l JavaScript

function run(args) {
  let browser = args[0];
  if (!Application(browser).running()) {
    return JSON.stringify({
      items: [
        {
          title: `${browser} is not running`,
          subtitle: `Press enter to launch ${browser}`,
        },
      ],
    });
  }

  let arc = Application(browser);
  arc.includeStandardAdditions = true;

  let tabsMap = {};

  for (let w = 0; w < arc.windows.length; w++) {
    let window = arc.windows[w];

    for (let s = 0; s < window.spaces.length; s++) {
      let space = arc.windows[w].spaces[s];
      let spaceName = space.title();

      for (let t = 0; t < space.tabs.length; t++) {
        let tab = space.tabs[t];
        let url = tab.url() || "";
        let matchUrl = url.replace(/(^\w+:|^)\/\//, "");
        let title = tab.title() || matchUrl;
        let tabID = tab.id();

        let subtitle = "";
        let subtitlePrefix = "";

        if (window.incognito()) {
          subtitlePrefix = "Incognito Window"
        } else if (spaceName.length <= 0) {
          subtitlePrefix = "Space " + s
        } else {
          subtitlePrefix = spaceName
        }

        if (tab.location() === "pinned") {
          subtitle = subtitlePrefix + " 📌 | " + url;
        } else {
          subtitle = subtitlePrefix + " | " + url;
        }

        tabsMap[tabID] = {
          title,
          url,
          subtitle: subtitle,
          windowIndex: w,
          spaceIndex: s,
          tabIndex: t,
          quicklookurl: url,
          arg: `${w},${s},${t},${url}`,
          match: `${title} ${decodeURIComponent(matchUrl).replace(
            /[^\w]/g,
            " ",
          )}`,
        };
      }
    }
  }

  let items = Object.keys(tabsMap).reduce((acc, url) => {
    acc.push(tabsMap[url]);
    return acc;
  }, []);

  return JSON.stringify({ items });
}