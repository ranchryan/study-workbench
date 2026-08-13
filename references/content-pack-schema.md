# 内容包 Schema（CONTENT_PACK）

内容包是「学习工作台模板」里**唯一需要随年级 / 学科 / 教材变化的数据**。引擎（`assets/study-workbench-engine.html`）读取它来排课与渲染，自身不含任何写死的课程。

---

## 完整结构

```json
{
  "meta": {
    "grade": "八年级上册",
    "edition": "人教版",
    "subjects_order": ["yuwen", "shuxue", "yingyu"],
    "note": "可选：本包说明"
  },
  "startDate": "2026-09-01",
  "subjects": {
    "<subjId>": {
      "name": "语文",
      "color": "var(--yuwen)",
      "cls": "yuwen",
      "bookUrl": "https://book.pep.com.cn/... (可选：电子课本链接)",
      "units": [
        {
          "name": "第一单元 * 新闻（活动*探究）",
          "intro": "单元导学语（可选）",
          "lessons": [
            {
              "title": "消息二则",
              "points": ["要点1", "要点2", "要点3"],
              "explain": "课文 / 知识点完整讲解",
              "ex": ["练习题1", "练习题2"]
            }
          ]
        }
      ]
    }
  },
  "acc": [
    { "subj": "yuwen", "title": "《三峡》全文", "c": "完整积累内容（可多行）" }
  ],
  "subjImg": { "yuwen": "assets/subj-yuwen.png" },
  "exams": [
    { "id": "m1", "name": "第一次月考", "date": "2026-10-12", "scope": "语文第一、二单元；数学第十一、十二章" },
    { "id": "mid", "name": "期中考试", "date": "2026-11-16", "scope": "全册一至四单元" },
    { "id": "m2", "name": "第二次月考", "date": "2026-12-14", "scope": "语文五单元" },
    { "id": "fin", "name": "期末考试", "date": "2027-01-18", "scope": "全册" }
  ]
}
```

---

## 字段说明

| 路径 | 必填 | 说明 |
|------|------|------|
| `meta.grade` | 是 | 年级册次展示，如「八年级上册」「七年级下册」 |
| `meta.edition` | 是 | 教材版本，如「人教版」「北师大版」「外研社」 |
| `meta.subjects_order` | 是 | 学科显示 / 排课顺序，对应 `subjects` 的 key |
| `meta.note` | 否 | 包说明 |
| `startDate` | 是 | 开学日 `YYYY-MM-DD`，排课起点；可在「我的」改 |
| `subjects.<id>.name` | 是 | 学科名，如「语文」「数学」 |
| `subjects.<id>.color` | 是 | 主题色，用引擎 CSS 变量 `var(--yuwen)` 等，或十六进制 `#2563EB` |
| `subjects.<id>.cls` | 是 | 样式类，建议与 `<id>` 相同（用于 pill 配色） |
| `subjects.<id>.bookUrl` | 否 | 电子课本链接；填写后课程页显示「电子版」按钮，留空不显示 |
| `subjects.<id>.units[].name` | 是 | 单元名，可用 `*` 分隔副标题（如「第一单元 * 新闻」） |
| `subjects.<id>.units[].intro` | 否 | 单元导学语，显示在单元开头 |
| `subjects.<id>.units[].lessons[]` | 是 | 每课：`title` 课名 / `points[]` 知识点 / `explain` 讲解 / `ex[]` 练习题 |
| `acc[]` | 是 | 每日积累轮转：`{subj, title, c}`；引擎按天轮转展示 |
| `subjImg.<id>` | 否 | 学科图标路径（引擎 `assets/` 下 png）；不填则该科无图标 |
| `exams[]` | 是 | 考试倒计时卡：`{id, name, date, scope}`，至少 1 张 |

---

## 排课规则（重要内容包无需管）

- 内容包只给**全量课程**（各单元 lesson 列表），**不用自己排到具体日期**。
- 引擎在 `maxDay()` 个上学日内，按 `subjects_order` 每天每科 1 课均匀铺开；lesson 总数决定排课跨度。
- `acc` 按天轮转温故；`exams` 四张卡片显示倒计时，最近一场在复习页置顶。

---

## 写法注意事项

- **中文用弯引号 `""`**（非 ASCII 直引号 `'`），避免落盘时字节损坏导致解析失败。
- 内容包必须是**合法 JSON**：无注释、无 trailing comma、双引号键。
- 颜色：多科可自定义 CSS 变量（在引擎 `:root` 加 `--colorX`），`color` 字段引用之。
- 默认示例见 `references/sample-pack-8up-cme.json`（八上语数英人教版·英语2024，含古诗文积累全文）。

---

## 注入方式

写好新包后二选一：

1. **脚本**（推荐）：`node references/inject_pack.js assets/study-workbench-engine.html 新包.json 输出.html`
2. **手动**：Edit 引擎顶部 `const CONTENT_PACK = {...};` 整段为新包 JSON，保留其后四行重导出不变。

注入后跑 `verify_static.js` 校验（应 17/17）。
