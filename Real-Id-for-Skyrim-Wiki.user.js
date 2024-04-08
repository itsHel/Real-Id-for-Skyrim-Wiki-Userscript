// ==UserScript==
// @name            Real Id for Skyrim Wiki
// @version         1.0.1
// @description     Replaces partial Form IDs, at Skyrim Wikis, by their real Dawnguard/Hearthfire/Dragonborn Form IDs
// @author          Hel
// @match           https://en.uesp.net/wiki/Skyrim*
// @match           https://elderscrolls.fandom.com/wiki/*
// @run-at          document-idle
// ==/UserScript==

(function () {
    "use strict";

    try {
        if (location.origin == "https://en.uesp.net") {
            const pageReplacement = {
                Dawnguard: "02",
                Hearthfire: "03",
                Dragonborn: "04",
            };
            const boxReplacement = {
                "Appears only with Dawnguard": "02",
                "Appears only with Hearthfire": "03",
                "Appears only with Dragonborn": "04",
            };
            const tableRowReplacement = {
                "Skyrim:Dawnguard": "02",
                "Skyrim:Hearthfire": "03",
                "Skyrim:Dragonborn": "04",
            };

            const pageTitle = document.querySelector(".mw-indicator:last-of-type a")?.title;
            if (pageReplacement[pageTitle]) {
                replaceIdUesp(pageReplacement[pageTitle]);
            }

            document.querySelectorAll(".wikitable.infobox").forEach((el) => {
                const imgTitle = el.querySelector("tr img")?.alt;

                if (boxReplacement[imgTitle]) {
                    replaceIdUesp(boxReplacement[imgTitle], el);
                }
            });

            document.querySelectorAll(".wikitable:not(.infobox)").forEach((el) => {
                el.querySelectorAll("tr td sup").forEach((supEl) => {
                    const supTitle = supEl.querySelector("a")?.title;

                    if (tableRowReplacement[supTitle]) {
                        replaceIdUesp(tableRowReplacement[supTitle], supEl.parentNode);
                    }
                });
            });

            function replaceIdUesp(newId, parent = null) {
                let root = parent ? parent : document;
                if(!root.querySelector(".idref a")){
                    // If couldn't find any IDs look to two parents upwards
                    root = parent.parentNode.parentNode
                }

                root.querySelectorAll(".idref a").forEach((el) => {
                    // Set parent width to make sure that page content won't move
                    const span = document.createElement("span");
                    const parentWidth = el.parentNode.getBoundingClientRect().width;

                    el.parentNode.style.width = parentWidth + "px";
                    el.parentNode.style.display = "inline-block";
                    span.textContent = newId;

                    el.replaceWith(span);
                });
            }
        }

        if (location.origin == "https://elderscrolls.fandom.com") {
            const categoryReplacement = {
                "Dawnguard:": "02",
                "Hearthfire:": "03",
                "Dragonborn:": "04",
            };

            const categoryEl = document.querySelector(".page-header__categories");
            let finished = false;

            categoryEl.querySelectorAll("a").forEach((el) => {
                if (finished) return;

                for (const property in categoryReplacement) {
                    if (el.textContent.indexOf(property) != -1) {
                        replaceIdFandom(categoryReplacement[property]);
                        finished = true;
                        break;
                    }
                }
            });

            function replaceIdFandom(newId) {
                document.querySelectorAll("a[title='Xx']").forEach((el) => {
                    el.replaceWith(newId);
                });
            }
        }
    } catch (e) {console.log(e)}
})();
