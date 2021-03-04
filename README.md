# 会议室预约系统

- 温馨提示：本系统是为了方便开发而使用GITHUB作为仓库托管工具，请勿在未经许可的情况下进行商业，带来的一切责任请自行承担，特此警告！

## 如何使用

开发的时候运行下列命令：

```
npm run dev
```

然后在浏览器中打开 localhost:20000 即可访问。

开发完毕需要发布的时候，请运行下列命令：

```
npm run build
```

直接用浏览器打开 index.html 即可访问。

发布的时候把```build```和```index.html```复制进去就可以了。

## 交易结构

- 首页：```src/pages/home.vuew```
- 我的预约：```src/pages/bespeak.vue```
- 会议室详情：```src/pages/detail.vue```
- 会议室预约（弹框）：```src/dialogs/bespeck.vue```

1.点击页面右上角的```个人中心```可以进入```我的预约```

2.点击```首页```的```会议室介绍```可以进入```会议室详情```

3.点击```首页```的```立即预约```可以弹框```会议室预约（弹框）```
