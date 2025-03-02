# 常见问题排查指南

本指南帮助您解决在使用自动更新精选项目和WakaTime统计功能时可能遇到的常见问题。

## 日期时区错误

### 问题描述

您可能会在Actions日志中看到类似这样的错误：

```
TypeError: can't subtract offset-naive and offset-aware datetimes
```

### 原因

这个错误出现是因为Python中的datetime对象有两种形式：
- offset-naive（无时区信息）
- offset-aware（有时区信息）

当尝试比较或计算两个不同类型的datetime对象时，会发生这个错误。GitHub API有时返回带时区信息的时间，有时返回不带时区信息的时间。

### 解决方案

我们的脚本已经通过以下方式解决这个问题：

1. 使用UTC时区创建所有datetime对象：
   ```python
   from datetime import datetime, timezone
   now = datetime.now(timezone.utc)
   ```

2. 检查并确保所有从API获取的datetime对象都具有时区信息：
   ```python
   if date_object.tzinfo is None:
       date_object = date_object.replace(tzinfo=timezone.utc)
   ```

如果您仍然遇到此错误，请检查脚本中涉及日期时间比较的部分，确保所有的datetime对象都是同一类型（建议全部使用offset-aware）。

## GitHub API速率限制

### 问题描述

Actions日志中可能会显示类似的错误：
```
RateLimitExceededException: 403 You have exceeded a secondary rate limit.
```

### 原因

GitHub API有请求速率限制，对于验证用户，限制为每小时5000个请求。如果您的脚本在短时间内发送了过多请求，可能会触发二级速率限制。

### 解决方案

1. 减少不必要的API调用
2. 实现请求间的延迟
3. 使用条件请求和缓存响应
4. 考虑使用GitHub GraphQL API（可以在一个请求中获取多种信息）

## 文件未找到错误

### 问题描述

在Actions日志中可能会看到：
```
FileNotFoundError: [Errno 2] No such file or directory
```

### 原因

脚本可能正在尝试访问不存在的文件或目录。

### 解决方案

1. 确保所有需要的目录都已创建：
   ```python
   os.makedirs("path/to/directory", exist_ok=True)
   ```

2. 检查文件路径是否正确，注意大小写敏感性

3. 验证GitHub Actions工作流工作目录设置正确

## 权限错误

### 问题描述

当尝试更新文件时出现权限错误：
```
PermissionError: [Errno 13] Permission denied
```

### 原因

GitHub Actions可能没有足够的权限来修改仓库文件。

### 解决方案

1. 确保在仓库设置中启用了写入权限：
   - 转到仓库的 `Settings` > `Actions` > `General`
   - 在 "Workflow permissions" 下选择 `Read and write permissions`

2. 验证GH_TOKEN有足够的权限（至少需要`repo`范围）

## 提交更改失败

### 问题描述

脚本成功运行，但未能提交更改到仓库。

### 原因

可能是Git配置问题或没有实际的变更需要提交。

### 解决方案

1. 确保正确设置了Git用户：
   ```yaml
   git config --local user.email "action@github.com"
   git config --local user.name "GitHub Action"
   ```

2. 添加条件检查确保只在有更改时才提交：
   ```yaml
   git diff --quiet && git diff --staged --quiet || git commit -m "更新信息"
   ```

3. 查看提交步骤的完整输出以获取更多详细信息

## 帮助与支持

如果您遇到上述指南未能解决的问题，请查看：

1. GitHub Actions的完整日志输出，寻找详细的错误信息
2. [GitHub Actions文档](https://docs.github.com/cn/actions)
3. [PyGithub库文档](https://pygithub.readthedocs.io/)
4. 在GitHub上创建一个issue以获取社区帮助
