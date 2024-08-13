// ==UserScript==
// @name         ASBPlayer Screenshot with iFrame Support
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Screenshot video inside iframe and download with custom filename including milliseconds
// @match        https://killergerbah.github.io/asbplayer/
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let myframe = document.querySelector("iframe");

  let h6Text = "anime_screenshot";

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyS") {
      const h6Element = document.querySelector("header h6");
      if (!h6Element) return;

      var name = h6Element.textContent.trim();

      if (name !== "asbplayer") {
        h6Text = name;
      } else {
        h6Text = "anime_screenshot";
      }

      myframe = document.querySelector("iframe");
      if (!myframe) return;

      const iframeDoc =
        myframe.contentDocument || myframe.contentWindow.document;

      const videoElement = iframeDoc.querySelector("video");

      if (!videoElement) return;

      const currentTime = videoElement.currentTime;
      const hours = Math.floor(currentTime / 3600)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((currentTime % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor(currentTime % 60)
        .toString()
        .padStart(2, "0");
      const milliseconds = Math.floor((currentTime % 1) * 1000)
        .toString()
        .padStart(3, "0");

      const filename = `${h6Text} - ${hours}h${minutes}m${seconds}s${milliseconds}ms.png`;

      const canvas = iframeDoc.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(function (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, "image/png");
    }
  });

  function waitForIframe() {
    if (myframe) {
      myframe.contentDocument.body.addEventListener("keydown", function (e) {
        if (!e.ctrlKey || !e.shiftKey || e.code !== "KeyS") return;
        const iframeDoc =
          myframe.contentDocument || myframe.contentWindow.document;

        const videoElement = iframeDoc.querySelector("video");

        const h6Element = document.querySelector("header h6");
        if (!h6Element) return;
        var name = h6Element.textContent.trim();

        if (name !== "asbplayer") {
          h6Text = name;
        } else {
          h6Text = "anime_screenshot";
        }

        if (!videoElement) return;

        const currentTime = videoElement.currentTime;
        const hours = Math.floor(currentTime / 3600)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((currentTime % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor(currentTime % 60)
          .toString()
          .padStart(2, "0");
        const milliseconds = Math.floor((currentTime % 1) * 1000)
          .toString()
          .padStart(3, "0");

        const filename = `${h6Text} - ${hours}h${minutes}m${seconds}s${milliseconds}ms.png`;

        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, "image/png");
      });
    } else {
      setTimeout(waitForIframe, 100);
    }
  }

  waitForIframe();
})();
