// Muli font
import "typeface-muli";

// Set timezone 
(function () {
    setInterval(() => {
        // Parse and update the "the current time is" nodes.
        const now = new Date();
        const nowStr = now.toUTCString();
        const iso = now.toISOString();
        const html = `${nowStr.substr(0, nowStr.length - 7)} (<span class="font-mono">${iso.substr(0, iso.length - 8)}</span>)`; // Strip timezone and seconds branch
        for (const elem of document.getElementsByClassName("utc-current-time")) {
            const e = elem as HTMLSpanElement;
            if (e.innerHTML !== html)
                e.innerHTML = html;
        }
    }, 1000);

    for (const elem of document.getElementsByClassName("display-time")) {
        // Special nodes that takes a time and formats it into local time.
        const time = new Date(elem.getAttribute("data-time"));
        elem.innerHTML = time.toLocaleString() + " (local)";
        elem.setAttribute("title", "UTC: " + time.toUTCString())

    }
})();

// require-confirm forms
(function () {
    for (const elem of document.getElementsByClassName("require-confirm")) {
        (elem as HTMLFormElement).addEventListener("submit", ev => {
            if (!confirm("Are you sure you want to delete this item?"))
                ev.preventDefault();
        })
    }
})();

// load the list of tests
(function () {
    const SHOW = "[show]";
    const HIDE = "[hide]";
    const SHOW_ALL = "[show all]";
    const HIDE_ALL = "[hide all]";

    const allToggle: Element = document.getElementById("toggle-all-tests");
    if (!allToggle) {
        // Not where we need. Return.
        return;
    }

    const testTables = Array.from(document.getElementsByClassName("tests-list"))
    const toggles = Array.from(document.getElementsByClassName("toggle-tests"))
    const groups = testTables
        .reduce((m, elem) => {
            const e = elem as HTMLDivElement;
            const group = e.getAttribute("data-test-group");
            const toggle = toggles.find(t => t.getAttribute("data-test-group") == group);
            m.set(group, [e, toggle]);
            return m;
        }, new Map<string, [HTMLDivElement, Element]>());
    let opening = 0;
    const doToggle = (table: HTMLDivElement, toggle: Element, force?: boolean) => {
        const current = table.style.maxHeight === ""; // table showing?
        if (force === undefined) {
            force = !current;
        }
        if (force === current) return;
        if (force) {
            toggle.innerHTML = HIDE;
            table.style.maxHeight = "";
            ++opening;
        } else {
            toggle.innerHTML = SHOW;
            table.style.maxHeight = "0";
            --opening;
        }
        if (opening > 0) {
            allToggle.innerHTML = HIDE_ALL;
        } else {
            allToggle.innerHTML = SHOW_ALL;
        }
    }
    const items = Array.from(groups.values());
    for (const [table, toggle] of items) {
        toggle.addEventListener("click", () => doToggle(table, toggle))
    }

    allToggle.addEventListener("click", ev => {
        const switchOn = allToggle.innerHTML === SHOW_ALL;
        for (const [table, toggle] of items) {
            doToggle(table, toggle, switchOn)
        }
    });
})();
