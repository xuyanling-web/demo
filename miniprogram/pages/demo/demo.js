// miniprogram/pages/demo.js

const db = wx.cloud.database();
const app = getApp();

Page({
  //页面的初始数据
  data: {
    modalName:"",
    name: "",
    tel: "",
    newName:"",
    newTel:"",
    _id:"",
    userList: [],
  },

  // 监听页面加载
  onLoad: function (options) {
    this.get();
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

  // 表单提交
  addSubmit(e){
    this.setData({
      name: e.detail.value.name,
      tel:e.detail.value.tel
    });
  },
  updateSubmit(e){
    this.setData({
      newName: e.detail.value.name,
      newTel:e.detail.value.tel
    });
  },

  // 添加
  add(){
  db.collection("user")
  .add({
    data: {
      name:this.data.name,
      tel: this.data.tel
    },
  })
  .then((res) => {
    this.setData({
      name:"",
      tel:""
    })
    // 再获取一次
    this.get();
    this.hideModal()
    wx.showToast({
      title: "新增成功",
      icon: "none",
      duration: 1500,
    });
  })
  .catch(console.error);
},

 // 打开模态框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    let item  = e.currentTarget.dataset.item;
    // 点击修改时，初始化数据
    if(item){
      this.setData({
        newName:item.name,
        newTel:item.tel,
        _id:item._id
      })
    }
  },

  // 关闭模态框
  hideModal(e) {
    this.setData({
      modalName: null,
    })
  },

  // 删除
  delete(e) {
    let { id } = e.currentTarget.dataset;
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

  // 修改
  handleUpdate() {
    db.collection("user")
      .where({
        _id: this.data._id,
      })
      .update({
        data: {
          name: this.data.newName,
          tel: this.data.newTel,
        },
      })
      .then((res) => {
        this.get();
        this.hideModal();

        wx.showToast({
          title: "修改成功",
          icon: "none",
          duration: 1500,
        });
      })
      .catch(console.error);
  },
});
