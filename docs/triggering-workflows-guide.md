# 手动触发工作流指南

GitHub Actions 工作流可以自动运行，也可以手动触发。本指南将说明如何手动触发项目中的工作流，以及如何使用自定义参数。

## 精选项目更新工作流

### 自动触发条件

精选项目更新工作流 (`update-featured-projects.yml`) 会在以下情况下自动运行：

- 每周日 UTC 时间 00:00 自动运行
- 当 `.github/scripts/repositories_info.json` 文件有更改时

### 手动触发步骤

1. 导航到您的 GitHub 仓库
2. 点击顶部的 `Actions` 标签
3. 从左侧工作流列表中选择 `Update Featured Projects`
4. 点击右侧的 `Run workflow` 按钮
5. 此时会显示一个下拉菜单，您可以配置以下参数：
   - **显示的最大项目数量**: 默认为 6，可以调整为您需要的数字
   - **排序方式**: 可选 priority（自定义优先级）、stars（星标数）、activity（活动度）或 updated（更新时间）
   - **显示趋势图**: 选择是否在项目卡片中显示提交趋势图表
6. 设置完参数后，点击绿色的 `Run workflow` 按钮启动工作流

![手动触发精选项目更新工作流](https://user-images.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/raw/main/docs/images/trigger-featured-projects.png)

## WakaTime 统计更新工作流

### 自动触发条件

WakaTime 统计更新工作流 (`waka-readme-stats.yml`) 会在以下情况下自动运行：

- 每天 UTC 时间 00:00 自动运行

### 手动触发步骤

1. 导航到您的 GitHub 仓库
2. 点击顶部的 `Actions` 标签
3. 从左侧工作流列表中选择 `WakaTime Readme Stats`
4. 点击右侧的 `Run workflow` 按钮
5. 点击绿色的 `Run workflow` 按钮启动工作流

这个工作流不需要额外参数，它将使用您在 `.github/workflows/waka-readme-stats.yml` 中配置的设置。

## 查看工作流运行状态

触发工作流后，您可以查看其运行状态：

1. 在 `Actions` 标签页，您会看到最近触发的工作流运行
2. 点击具体的工作流运行查看详情
3. 检查各个步骤的执行状态和日志
4. 工作流完成后，导航回您的 GitHub 个人主页查看更改

## 常见问题解决

如果工作流失败，请检查以下可能的原因：

1. **权限问题**: 确保 `GH_TOKEN` 拥有足够权限并且未过期
2. **文件找不到**: 检查必要的文件路径是否正确，例如 README.md 或配置文件
3. **API 限制**: 检查是否达到了 GitHub API 的使用限制
4. **语法错误**: 检查工作流文件或脚本中的语法错误

查看工作流运行日志以获取更详细的错误信息，这对解决问题非常有帮助。
