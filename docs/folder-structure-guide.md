# 项目文件夹结构指南

为了确保自动更新功能正常工作，请确保您的仓库具有以下文件夹结构：

```
B143KC47/
├── .github/
│   ├── workflows/
│   │   ├── update-featured-projects.yml  # 精选项目更新工作流
│   │   └── waka-readme-stats.yml         # WakaTime 统计更新工作流
│   └── scripts/
│       ├── repositories_info.json        # 仓库信息配置文件
│       └── enhanced_update_featured_projects.py  # 增强版更新脚本
├── assets/
│   ├── images/
│   │   └── project-badges/               # 项目徽章和趋势图存放位置
│   └── css/
│       ├── main.css                      # 主样式表
│       └── wakatime-custom.css           # WakaTime 自定义样式
├── README.md                             # 个人资料主文件
└── docs/
    ├── github-setup-guide.md            # GitHub 配置指南
    └── folder-structure-guide.md        # 文件夹结构指南
```

## 重要文件说明

### 配置文件

- `.github/scripts/repositories_info.json`: 包含自定义的仓库信息和分类配置
  - 在这里可以手动配置您想要突出显示的项目
  - 可以设置项目优先级、分类和中文描述

### 工作流文件

- `.github/workflows/update-featured-projects.yml`: 控制精选项目更新的工作流程
  - 设置为每周自动运行一次
  - 也可以手动触发或在特定文件更改时运行

- `.github/workflows/waka-readme-stats.yml`: 控制 WakaTime 统计更新的工作流程
  - 设置为每天自动运行一次
  - 支持手动触发

### 资产文件夹

- `assets/images/project-badges/`: 用于存储自动生成的项目趋势图和徽章
  - 此文件夹将由 GitHub Actions 自动创建（如果不存在）

## 手动创建必要文件夹

如果某些文件夹不存在，您可以通过 GitHub 网页界面创建它们：

1. 导航到您的仓库
2. 点击 "Add file" > "Create new file"
3. 在文件名中输入完整路径，例如 `.github/workflows/example.txt`
4. 添加一些内容并提交
5. 然后可以删除这个示例文件，文件夹结构将保留

通过以上步骤，您可以确保所有必要的文件夹都存在，以便自动更新功能正常工作。
