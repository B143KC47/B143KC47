#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
增强版: 自动更新GitHub个人资料中的精选项目
支持自定义项目描述和分类展示
"""

import os
import re
import json
import requests
import pandas as pd
from github import Github
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

# 获取环境变量
GITHUB_TOKEN = os.environ.get("GH_TOKEN")
USERNAME = os.environ.get("USERNAME", "B143KC47")
MAX_PROJECTS = int(os.environ.get("MAX_PROJECTS", "6"))
SORT_BY = os.environ.get("SORT_BY", "priority")  # 默认按优先级排序
INCLUDE_CATEGORIES = os.environ.get("INCLUDE_CATEGORIES", "True").lower() == "true"
README_PATH = "README.md"
THEME = "midnight-purple"
CONFIG_PATH = ".github/scripts/repositories_info.json"

# 连接到GitHub API
g = Github(GITHUB_TOKEN)
user = g.get_user(USERNAME)

def load_custom_info():
    """
    从配置文件加载自定义仓库信息
    """
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"配置文件 {CONFIG_PATH} 不存在，将使用默认信息")
        return {"repositories": [], "categories": {}}
    except json.JSONDecodeError:
        print(f"配置文件 {CONFIG_PATH} 格式错误，将使用默认信息")
        return {"repositories": [], "categories": {}}

def get_repo_activity(repo):
    """
    计算仓库的活动得分
    基于最近提交、问题和PR活动
    """
    now = datetime.now()
    activity_score = 0
    
    # 获取最近的提交
    try:
        commits = repo.get_commits()
        if commits.totalCount > 0:
            latest_commit_date = commits[0].commit.author.date
            days_since_last_commit = (now - latest_commit_date).days
            # 最近提交获得更高分
            activity_score += max(0, 100 - days_since_last_commit)
    except Exception as e:
        print(f"Error getting commits for {repo.name}: {e}")
    
    # 加上星标数量
    activity_score += repo.stargazers_count * 3
    
    # 加上最近的问题和PR活动
    try:
        recent_issues = repo.get_issues(state='all', since=now - timedelta(days=30))
        activity_score += recent_issues.totalCount * 2
    except Exception as e:
        print(f"Error getting issues for {repo.name}: {e}")
    
    # 如果有GitHub Pages，加分
    if repo.has_pages:
        activity_score += 20
        
    # 如果最近有更新，加分
    days_since_update = (now - repo.updated_at).days
    activity_score += max(0, 50 - days_since_update)
    
    return activity_score

def generate_project_card(repo, repo_info, category_info=None):
    """
    生成项目卡片的Markdown代码
    """
    # 使用自定义信息或默认值
    description_cn = repo_info.get("description_cn", repo.description or "项目描述待更新")
    emoji = repo_info.get("emoji", "🚀")
    category = repo_info.get("category", "其他")
    
    # 获取分类颜色
    if category_info and category in category_info:
        primary_color = category_info[category].get("color", "c792ea")
    else:
        primary_color = "c792ea"
    
    secondary_color = "7fdbca" 
    text_color = "a9b1d6"
    
    # 生成卡片Markdown
    card = f"""<td width="50%">
 <a href="{repo.html_url}">
   <img src="https://github-readme-stats.vercel.app/api/pin/?username={USERNAME}&repo={repo.name}&theme={THEME}&hide_border=true&bg_color=0d1117&title_color={primary_color}&icon_color={secondary_color}&text_color={text_color}" />
   <br>
   <p align="center" style="color: #{primary_color};"><strong>{emoji} {repo.name}</strong></p>
   <p align="center" style="color: #{text_color};">{description_cn}</p>"""
    
    # 如果显示分类标签
    if category_info and category in category_info:
        card += f"""
   <p align="center"><span style="background-color: #{primary_color}30; color: #{primary_color}; padding: 3px 8px; border-radius: 10px; font-size: 0.7em;">{category}</span></p>"""
    
    card += """
 </a>
</td>"""
    
    return card

def update_readme_projects(featured_projects, by_category=None):
    """
    在README.md中更新精选项目部分
    """
    with open(README_PATH, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 查找精选项目部分的起始和结束标记
    start_marker = "## 🚀 精选项目"
    
    # 找到下一个二级标题作为结束标记
    pattern = re.compile(r'## 🚀 精选项目.*?(?=^##\s)', re.DOTALL | re.MULTILINE)
    match = pattern.search(content)
    
    if match:
        # 生成新的项目部分
        projects_section = "## 🚀 精选项目\n\n"
        projects_section += '<div align="center" style="background-color: #0d1117; padding: 20px; border-radius: 10px;">\n'
        
        # 如果按分类显示
        if by_category and INCLUDE_CATEGORIES:
            for category, projects in by_category.items():
                if projects:
                    projects_section += f'<h3 style="color: #c792ea;">{category}</h3>\n'
                    projects_section += '<table>\n'
                    
                    # 添加项目卡片，每行2个
                    for i in range(0, len(projects), 2):
                        projects_section += '<tr>\n'
                        projects_section += projects[i]
                        
                        if i + 1 < len(projects):
                            projects_section += projects[i + 1]
                        else:
                            # 如果是奇数个项目，添加空白单元格保持对称
                            projects_section += '<td width="50%"></td>\n'
                            
                        projects_section += '</tr>\n'
                        
                    projects_section += '</table>\n'
        else:
            # 不分类显示所有项目
            projects_section += '<table>\n'
            
            # 添加项目卡片，每行2个
            for i in range(0, len(featured_projects), 2):
                projects_section += '<tr>\n'
                projects_section += featured_projects[i]
                
                if i + 1 < len(featured_projects):
                    projects_section += featured_projects[i + 1]
                else:
                    # 如果是奇数个项目，添加空白单元格保持对称
                    projects_section += '<td width="50%"></td>\n'
                    
                projects_section += '</tr>\n'
                
            projects_section += '</table>\n'
        
        # 添加自动更新时间
        update_time = datetime.now().strftime('%Y年%m月%d日 %H:%M')
        projects_section += f'<p align="center" style="font-size: 12px; color: #666;">自动更新于: {update_time}</p>\n'
        projects_section += '</div>\n\n'
        
        # 替换原有部分
        new_content = re.sub(pattern, projects_section, content)
        
        with open(README_PATH, 'w', encoding='utf-8') as file:
            file.write(new_content)
        
        print(f"更新了 {len(featured_projects)} 个精选项目")
    else:
        print("无法找到精选项目部分，请检查README.md格式")

def main():
    # 加载自定义配置
    custom_info = load_custom_info()
    repo_info_map = {repo["name"]: repo for repo in custom_info.get("repositories", [])}
    category_info = custom_info.get("categories", {})
    
    # 获取用户的所有公开仓库
    repos = user.get_repos(type='owner')
    
    # 准备数据框来分析仓库
    repo_data = []
    for repo in repos:
        # 跳过fork的仓库
        if repo.fork:
            continue
            
        # 获取仓库活动分数
        activity_score = get_repo_activity(repo)
        
        # 检查是否有自定义信息
        if repo.name in repo_info_map:
            custom_repo = repo_info_map[repo.name]
            priority = custom_repo.get("priority", 0)
            category = custom_repo.get("category", "其他")
        else:
            priority = 0
            category = "其他"
        
        repo_data.append({
            "name": repo.name,
            "object": repo,
            "stars": repo.stargazers_count,
            "updated_at": repo.updated_at,
            "created_at": repo.created_at,
            "activity": activity_score,
            "priority": priority,
            "category": category
        })
    
    # 创建数据框并排序
    if not repo_data:
        print("没有找到符合条件的仓库")
        return
        
    df = pd.DataFrame(repo_data)
    
    # 根据指定的排序方式进行排序
    if SORT_BY == "stars":
        df = df.sort_values("stars", ascending=False)
    elif SORT_BY == "updated":
        df = df.sort_values("updated_at", ascending=False)
    elif SORT_BY == "created":
        df = df.sort_values("created_at", ascending=False)
    elif SORT_BY == "activity":
        df = df.sort_values("activity", ascending=False)
    elif SORT_BY == "priority":
        df = df.sort_values(["priority", "stars"], ascending=[False, False])
    
    # 限制项目数量
    featured_repos = df.head(MAX_PROJECTS)
    
    # 生成项目卡片
    featured_cards = []
    projects_by_category = {}
    
    for _, row in featured_repos.iterrows():
        repo = row["object"]
        
        # 获取自定义信息或创建默认值
        if repo.name in repo_info_map:
            repo_custom_info = repo_info_map[repo.name]
        else:
            repo_custom_info = {"description_cn": repo.description or "项目描述待更新"}
            
        # 生成卡片
        card = generate_project_card(repo, repo_custom_info, category_info)
        featured_cards.append(card)
        
        # 按分类组织项目
        category = row["category"]
        if category not in projects_by_category:
            projects_by_category[category] = []
        projects_by_category[category].append(card)
    
    # 更新README.md
    update_readme_projects(featured_cards, projects_by_category)

if __name__ == "__main__":
    main()
