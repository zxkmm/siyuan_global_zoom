import { Plugin, showMessage, IModel } from "siyuan";
import "@/index.scss";

import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";

export default class siyuan_global_zoom extends Plugin {
  customTab: () => IModel;
  private settingUtils: SettingUtils;

  async onload() {
    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

    this.settingUtils = new SettingUtils({
      plugin: this,
      name: STORAGE_NAME,
    });

    this.settingUtils.addItem({
      key: "mainSwitch",
      value: true,
      type: "checkbox",
      title: this.i18n.mainSwitch,
      description: "",
    });

    this.settingUtils.addItem({
      key: "baseZoomNumber",
      value: 1,
      type: "textinput",
      title: this.i18n.baseZoomNumber,
      description: this.i18n.baseZoomNumberDesc,
    });

    this.settingUtils.addItem({
      key: "mainShowZoomInfo",
      value: 1,
      type: "select",
      title: this.i18n.mainShowZoomInfo,
      description: this.i18n.mainShowZoomInfoDesc,
      options: {
        1: "100%",
        2: "1×",
      },
    });

    this.settingUtils.addItem({
      key: "mainShowFontInfo",
      value: 2,
      type: "select",
      title: this.i18n.mainShowFontInfo,
      description: this.i18n.mainShowFontInfoDesc,
      options: {
        1: "100%",
        2: "16px",
      },
    });

    this.settingUtils.addItem({
      key: "dontDisplayIf100",
      value: false,
      type: "checkbox",
      title: this.i18n.dontDisplayIf100,
      description: "",
    });

    this.settingUtils.addItem({
      key: "Hint",
      value: "",
      type: "hint",
      title: this.i18n.hintTitle,
      description: this.i18n.hintDesc,
    });

    try {
      this.settingUtils.load();
    } catch (error) {
      console.error(
        "Error loading settings storage, probably empty config json:",
        error
      );
    }
    console.log(this.i18n.helloPlugin);
  }

  showZoomInfoAndCallback() {

    const _mainShowZoomInfo_ = this.settingUtils.get("mainShowZoomInfo");
    const _baseZoomNumber_ = this.settingUtils.get("baseZoomNumber");
    const _dontDisplayIf100_ = this.settingUtils.get("dontDisplayIf100");
    const zoomInfoElement = document.createElement("div");
    zoomInfoElement.classList.add("ariaLabel", "zoom_content", "status__counter");
    if (_mainShowZoomInfo_ == 1) {
      zoomInfoElement.setAttribute("aria-label", "AKA 1×");
    } else if (_mainShowZoomInfo_ == 2) {
      zoomInfoElement.setAttribute("aria-label", "AKA 100%");
    }

    zoomInfoElement.addEventListener("click", () => {
      //this call back works, just TODO
    });

    const updateZoomInfo = () => {
      if (_mainShowZoomInfo_ == 1) {
        zoomInfoElement.textContent = ` ${(
          (window.devicePixelRatio / _baseZoomNumber_) *
          100
        ).toFixed(0)}% `;
        zoomInfoElement.setAttribute(
          "aria-label",
          `AKA ${(window.devicePixelRatio).toFixed(2)}×`
        );

        if (_dontDisplayIf100_) {
          if (window.devicePixelRatio == _baseZoomNumber_) {
            zoomInfoElement.style.display = "none";
          } else {
            zoomInfoElement.style.display = "block";
          }
        }
      } else if (_mainShowZoomInfo_ == 2) {
        zoomInfoElement.textContent = `${(window.devicePixelRatio).toFixed(2)}×`;
        zoomInfoElement.setAttribute(
          "aria-label",
          `AKA ${((window.devicePixelRatio / _baseZoomNumber_) * 100).toFixed(
            0
          )}%`
        );

        if (_dontDisplayIf100_) {
          if (window.devicePixelRatio == _baseZoomNumber_) {
            zoomInfoElement.style.display = "none";
          } else {
            zoomInfoElement.style.display = "block";
          }
        }
      }
    };

    updateZoomInfo();

    window.addEventListener("resize", updateZoomInfo);

    this.addStatusBar({
      element: zoomInfoElement,
    });
  }

  showFontSizeAndCallback() {
    const _mainShowFontInfo_ = this.settingUtils.get("mainShowFontInfo");
    const _baseZoomNumber_ = 16; //it's hard coded from siyuan
    const _dontDisplayIf100_ = this.settingUtils.get("dontDisplayIf100");
    const zoomInfoElement = document.createElement("div");
    zoomInfoElement.classList.add("ariaLabel", "zoom_content", "status__counter"); //3rd party theme use zoom_content_for_theme to style me.
    if (_mainShowFontInfo_ == 1) {
      zoomInfoElement.setAttribute("aria-label", "AKA 16px"); //this is just init the string, and also 16px is hard coded in siyuan
    } else if (_mainShowFontInfo_ == 2) {
      zoomInfoElement.setAttribute("aria-label", "AKA 100%");
    }

    // zoomInfoElement.addEventListener("click", () => {
    //   //this call back works, just TODO
    // });

    const FetchUpdateFontSize = () => {
      if (_mainShowFontInfo_ == 1) {
        zoomInfoElement.textContent = ` ${(
          (window.siyuan.config.editor.fontSize / _baseZoomNumber_) *
          100
        ).toFixed(0)}% `;
        zoomInfoElement.setAttribute(
          "aria-label",
          `AKA ${(window.siyuan.config.editor.fontSize).toFixed(2)}×`
        );

        if (_dontDisplayIf100_) {
          if (window.siyuan.config.editor.fontSize == _baseZoomNumber_) {
            zoomInfoElement.style.display = "none";
          } else {
            zoomInfoElement.style.display = "block";
          }
        }
      } else if (_mainShowFontInfo_ == 2) {
        zoomInfoElement.textContent = `${(window.siyuan.config.editor.fontSize).toFixed(0)}px`;
        zoomInfoElement.setAttribute(
          "aria-label",
          `AKA ${(
            (window.siyuan.config.editor.fontSize / _baseZoomNumber_) *
            100
          ).toFixed(0)}%`
        );

        if (_dontDisplayIf100_) {
          if (window.siyuan.config.editor.fontSize == _baseZoomNumber_) {
            zoomInfoElement.style.display = "none";
          } else {
            zoomInfoElement.style.display = "block";
          }
        }
      }
    };

    FetchUpdateFontSize();
    console.log("new12new");

    window.addEventListener("keyup", function (event) {
      if (event.key === "Control") {
        FetchUpdateFontSize();
      }
    });
    this.addStatusBar({
      element: zoomInfoElement,
    });
  }

  onLayoutReady() {
    if (this.settingUtils.get("mainSwitch")) {
      this.showZoomInfoAndCallback();
      this.showFontSizeAndCallback();
    }

    // this.loadData(STORAGE_NAME);
    this.settingUtils.load();
  }

  async onunload() {}

  uninstall() {}
}
