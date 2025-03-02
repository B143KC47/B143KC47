# GitHub 配置指南

为了让自动更新精选项目和 WakaTime 统计数据正常工作，请按照以下步骤配置您的 GitHub 仓库。

## 添加必要的 Secrets

1. 在您的 GitHub 仓库中，导航到 `Settings` > `Secrets and variables` > `Actions`
2. 点击 `New repository secret` 添加以下密钥：

### 必需的 Secrets

| 密钥名称 | 用途 | 获取方式 |
|---------|------|---------|
| `GH_TOKEN` | GitHub 个人访问令牌，用于更新仓库 | [创建个人访问令牌](https://github.com/settings/tokens)，需要 `repo` 权限 |
| `WAKATIME_API_KEY` | WakaTime API 密钥，用于获取编程统计数据 | 在 [WakaTime 设置页面](https://wakatime.com/settings/account) 获取 |

### 创建个人访问令牌 (GH_TOKEN)

1. 访问 [GitHub 个人访问令牌设置页面](https://github.com/settings/tokens)
2. 点击 `Generate new token` > `Generate new token (classic)`
3. 添加描述，例如 "自动更新个人主页"
4. 选择过期时间（建议选择较长时间或不过期）
5. 勾选以下权限：
   - `repo` (完整的仓库访问权限)
   - `workflow` (用于更新工作流程)
6. 点击底部的 `Generate token` 按钮
7. **复制生成的令牌**（离开页面后将无法再次查看）
8. 将此令牌添加为仓库 Secrets 中的 `GH_TOKEN`

### 获取 WakaTime API 密钥

1. 登录您的 [WakaTime 账户](https://wakatime.com/login)
2. 导航到 [账户设置](https://wakatime.com/settings/account)
3. 在 API 密钥部分找到您的密钥
4. 将此密钥添加为仓库 Secrets 中的 `WAKATIME_API_KEY`

## 文件夹权限配置

确保 GitHub Actions 工作流程有权限写入仓库：

1. 导航到仓库的 `Settings` > `Actions` > `General`
2. 在 "Workflow permissions" 部分，选择 `Read and write permissions`
3. 点击 `Save` 保存更改

## 验证配置

配置完成后，您可以：

1. 手动触发 "Update Featured Projects" 工作流程，检查是否能正常更新精选项目
2. 手动触发 "WakaTime Readme Stats" 工作流程，检查是否能正常更新编程统计数据

如果您遇到任何问题，请检查 Actions 标签页中的工作流程运行日志以获取错误信息。
