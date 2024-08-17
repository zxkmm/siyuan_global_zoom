import {
  Plugin,
  showMessage,
  IModel,
} from "siyuan";
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

  // rescuveDangerousZoom() {
  //   const dprDisplay = document.createElement("div");
  //   const zoomLevelHint = document.createElement("div");

  //   dprDisplay.style.cssText = `
  //       position: fixed;
  //       top: 50%;
  //       left: 50%;
  //       transform: translate(-50%, -50%);
  //       font-size: 24px;
  //       background-color: rgba(0, 0, 0, 0.99);
  //       color: red;
  //       padding: 10px;
  //       border-radius: 5px;
  //       z-index: 9999;
  //       `;

  //   document.body.appendChild(dprDisplay);
  //   document.body.appendChild(zoomLevelHint);

  //   const hintBefore = `使用方法：（1）新建一个工作空间，安装并启用此插件，查看并记住条目7所示的正常默认的缩放比例（一般是1.25)
  //   ； （2）在您不小心使用ctrl（或control）加滚轮或ctrl（或control）和+-键盘缩放的主工作空间安装并启用此插件
  //   ； （3）使用您之前不小心调乱缩比例的方法（要么是ctrl（control）+滚轮，要么是（ctrlcontrol）和+-）
  //   ； （4）来调整回你在新工作空间看到的比例（一般都是1.25）
  //   ；（5）此时您的工作空间的缩放比例已经还原到默认值。
  //   ；（6）最后卸载或禁用本插件即可。
  //   ；（7）请注意，当前的比例为：------>[[[[[[[[[[[`;

  //   const hintAfter = `]]]]]]]]]]]<------`;

  //   function updateDprDisplay() {
  //     dprDisplay.textContent =
  //       hintBefore + `${window.devicePixelRatio}` + hintAfter;
  //   }

  //   updateDprDisplay();

  //   window.addEventListener("resize", updateDprDisplay);
  // }

  showZoomInfoAndCallback() {
    const _mainShowZoomInfo_ = this.settingUtils.get("mainShowZoomInfo");
    const _baseZoomNumber_ = this.settingUtils.get("baseZoomNumber");
    const zoomInfoElement = document.createElement("div");
    zoomInfoElement.classList.add("toolbar__item", "ariaLabel");
    if(_mainShowZoomInfo_ == 1){
      zoomInfoElement.setAttribute("aria-label", "AKA 1×");
    } else if(_mainShowZoomInfo_ == 2){
      zoomInfoElement.setAttribute("aria-label", "AKA 100%");
    }
  
    const updateZoomInfo = () => {
      if (_mainShowZoomInfo_ == 1) {
      zoomInfoElement.textContent = `${(window.devicePixelRatio / _baseZoomNumber_ * 100).toFixed(0)}%`;
      zoomInfoElement.setAttribute("aria-label", `AKA ${window.devicePixelRatio}×`);
      } else if (_mainShowZoomInfo_ == 2){
      zoomInfoElement.textContent = `${window.devicePixelRatio}×`;
      zoomInfoElement.setAttribute("aria-label", `AKA ${(window.devicePixelRatio / _baseZoomNumber_ * 100).toFixed(0)}%`);
      }
    };
  
    updateZoomInfo();
  
    window.addEventListener('resize', updateZoomInfo);
  
    this.addStatusBar({
      element: zoomInfoElement,
    });
  }

  onLayoutReady() {
    if(this.settingUtils.get("mainSwitch")){
    // this.rescuveDangerousZoom();
    this.showZoomInfoAndCallback();

    }

    // this.loadData(STORAGE_NAME);
    this.settingUtils.load();
  }

  async onunload() {

  }

  uninstall() {
  }
}
