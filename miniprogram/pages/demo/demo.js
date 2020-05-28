// miniprogram/pages/demo.js

const db = wx.cloud.database();
const app = getApp();

Page({
  //页面的初始数据
  data: {
    name: "",
    tel: "",
    newName: "",
    newTel: "",
    userList: [],
    isOpen: false,
  },

  // 监听页面加载
  onLoad: function (options) {
    this.get();
  },

  insName(e) {
    this.setData({
      name: e.detail.detail.value,
    });
  },
  insTel(e) {
    this.setData({
      tel: e.detail.detail.value,
    });
  },
  insNewName(e) {
    this.setData({
      newName: e.detail.detail.value,
    });
  },
  insNewTel(e) {
    this.setData({
      newTel: e.detail.detail.value,
    });
  },

  // 打开模态框
  handleOpen(e) {
    this.setData({
      isOpen: true,
    });
    const { id } = e.currentTarget.dataset;
    app.globalData.userId = id;
    this.getById(id);
  },

  // 关闭模态框
  handleClose() {
    this.setData({
      isOpen: false,
    });
  },

  // 新增
  add() {
    db.collection("user")
      .add({
        data: {
          name: this.data.name,
          tel: this.data.tel,
        },
      })
      .then((res) => {
        // 再获取一次
        this.get();
        this.setData({
          name: "",
          tel: "",
        });
        wx.showToast({
          title: "新增成功",
          icon: "none",
          duration: 1500,
        });
      })
      .catch(console.error);
  },

  // 删除
  delete(e) {
    const { id } = e.currentTarget.dataset;
    db.collection("user")
      .where({
        _id: id,
      })
      .remove()
      .then((res) => {
        // 再获取一次
        this.get();
        wx.showToast({
          title: "删除成功",
          icon: "none",
          duration: 1500,
        });
      })
      .catch(console.error);
  },

  // 查询
  get() {
    db.collection("user")
      .get()
      .then((res) => {
        this.setData({
          userList: res.data,
        });
      })
      .catch(console.error);
  },

  // 根据id查询
  getById(id) {
    db.collection("user")
      .where({
        _id: id,
      })
      .get()
      .then((res) => {
        this.setData({
          newName: res.data[0].name,
          newTel: res.data[0].tel,
        });
      })
      .catch(console.error);
  },

  // 修改
  handleUpdate() {
    db.collection("user")
      .where({
        _id: app.globalData.userId,
      })
      .update({
        data: {
          name: this.data.newName,
          tel: this.data.newTel,
        },
      })
      .then((res) => {
        this.get();
        this.handleClose();

        wx.showToast({
          title: "修改成功",
          icon: "none",
          duration: 1500,
        });
      })
      .catch(console.error);
  },
});
