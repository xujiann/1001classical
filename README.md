# 1001 Classical · 一千零一张古典必听录音地图

按**时期 / 体裁 / 作曲家 / 心情 / 编制**进入九百年古典音乐史的策展式单页网站。灵感来自 Matthew Rye 主编的 *1001 Classical Recordings You Must Hear Before You Die*（Cassell Illustrated, 2007）——以**录音**而非作品为单位：同一部《贝九》，富特文格勒、卡拉扬、伯恩斯坦各不可替代。

本站精选古典音乐史上公认的**标杆与传奇录音**，每张配中文导读、时期、体裁、编制与心情标签，并提供合法的试听平台跳转。

## 特性

- 纯静态单页，**零构建、零后端、零第三方依赖**
- Hash 路由 + 全库搜索（认作品英文名、中文曲名、作曲家译名、演绎者、厂牌）
- 时期时间轴、今日一张、精选作曲家、延伸聆听
- 作曲家小传卡（生卒 / 国别 / 身份 / 中文小传 + 维基百科肖像）
- 唱片封面来自 **iTunes Search API**、作曲家肖像来自 **Wikipedia pageimages**，均按需请求 + 本地缓存，失败优雅回退
- 试听按钮跳转 网易云 / QQ音乐 / Spotify / Apple Music / YouTube / IDAGIO / 豆瓣 的搜索页
- 移动端优化、暗色音乐厅视觉

## 合法性

**不上传、不缓存、不下载、不托管任何音乐文件。** 封面与肖像取自公共接口、客户端按需加载；文字导读为入门向介绍，仅供学习交流。

## 文件结构

| 文件 | 作用 |
|---|---|
| `index.html` | 骨架与导航 |
| `styles.css` | 暗色音乐厅视觉（CSS 变量主题） |
| `app.js` | hash 路由、渲染、搜索、封面/肖像懒加载 |
| `data.js` | `window.ALBUMS` 策展录音数据（自动生成） |
| `composers.js` | `window.ARTIST_BIOS` 作曲家小传（自动生成） |
| `_build.mjs` | 数据源 + 生成器（`node _build.mjs` → 重建 data.js / composers.js） |

## 本地预览

```bash
python -m http.server 8793
# 打开 http://localhost:8793
```

"1001 × 1001" 收藏计划的一员。反馈：popstudy@gmail.com
