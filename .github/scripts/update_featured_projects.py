#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动更新GitHub个人资料中的精选项目
"""

import os
import re
import json
import requests
import pandas as pd
from github import Github
from datetime import datetime, timedelta, timezone
from bs4 import BeautifulSoup

# 获取环境变量
GITHUB_TOKEN = os.environ.get("GH_TOKEN")
USERNAME = os.environ.get("USERNAME", "B143KC47")
MAX_PROJECTS = int(os.environ.get("MAX_PROJECTS", "4"))
SORT_BY = os.environ.get("SORT_BY", "stars")
TOPICS_FILTER = os.environ.get("TOPICS_FILTER", "").split(",")
EXCLUDE_REPOS = os.environ.get("EXCLUDE_REPOS", "").split(",")
README_PATH = "README.md"
THEME = "midnight-purple"

# 连接到GitHub API
g = Github(GITHUB_TOKEN)
user = g.get_user(USERNAME)

def get_repo_activity(repo):
    """
    计算仓库的活动得分
    基于最近提交、问题和PR活动
    修复：确保使用相同的时区格式
    """
    # 使用UTC时区创建now变量，确保与GitHub API返回的时间兼容
    now = datetime.now(timezone.utc)
    activity_score = 0
    
    # 获取最近的提交
    try:
        commits = repo.get_commits()
        if commits.totalCount > 0:
            latest_commit_date = commits[0].commit.author.date
            # 确保latest_commit_date是有时区信息的
            if latest_commit_date.tzinfo is None:
                latest_commit_date = latest_commit_date.replace(tzinfo=timezone.utc)
                
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
        
    # 如果最近有更新，加分 (确保时区一致)
    repo_updated_at = repo.updated_at
    if repo_updated_at.tzinfo is None:
        repo_updated_at = repo_updated_at.replace(tzinfo=timezone.utc)
        
    days_since_update = (now - repo_updated_at).days
    activity_score += max(0, 50 - days_since_update)
    
    return activity_score

def get_repo_description_cn(repo):
    """
    尝试获取仓库的中文描述（从README或描述中）
    """
    description = repo.description or ""
    
    # 检查描述是否包含中文
    if re.search("[\u4e00-\u9fff]", description):
        return description
    
    # 尝试从README中提取中文描述
    try:
        readme_content = repo.get_readme().decoded_content.decode('utf-8')
        # 查找第一个中文句子或段落
        chinese_matches = re.findall(r'[^!#\s].*[\u4e00-\u9fff]+.*?(?:\.|。|！|？|$)', readme_content)
        if chinese_matches:
            # 取第一个合理长度的中文描述
            for match in chinese_matches:
                if 10 <= len(match) <= 100:
                    return match.strip()
        
        # 如果没有找到合适的中文描述，则取英文描述
        return description
    except Exception as e:
        print(f"Error reading README for {repo.name}: {e}")
        return description

def generate_project_card(repo, description_cn):
    """
    生成项目卡片的Markdown代码
    """
    # 准备主题色和图标
    primary_color = "c792ea"
    secondary_color = "7fdbca" 
    text_color = "a9b1d6"
    
    # 根据仓库主题确定表情符号
    topics = [topic for topic in repo.get_topics()]
    emoji = "🚀"  # 默认
    
    if any(t in ['ai', 'machine-learning', 'artificial-intelligence'] for t in topics):
        emoji = "🤖"
    elif any(t in ['nlp', 'natural-language-processing'] for t in topics):
        emoji = "📝"
    elif any(t in ['computer-vision', 'vision', 'image'] for t in topics):
        emoji = "👁️"
    elif any(t in ['web', 'website', 'frontend'] for t in topics):
        emoji = "🌐"
    elif any(t in ['data', 'database', 'analysis'] for t in topics):
        emoji = "📊"
    elif any(t in ['tool', 'utility'] for t in topics):
        emoji = "🔧"
    
    # 生成卡片Markdown
    card = f"""<td width="50%">
 <a href="{repo.html_url}">
   <img src="https://github-readme-stats.vercel.app/api/pin/?username={USERNAME}&repo={repo.name}&theme={THEME}&hide_border=true&bg_color=0d1117&title_color={primary_color}&icon_color={secondary_color}&text_color={text_color}" />
   <br>
   <p align="center" style="color: #{primary_color};"><strong>{emoji} {repo.name}</strong></p>
   <p align="center" style="color: #{text_color};">{description_cn}</p>
 </a>
</td>"""
    
    return card

def update_readme_projects(featured_projects):
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
    # 获取用户的所有公开仓库
    repos = user.get_repos(type='owner')
    
    # 准备数据框来分析仓库
    repo_data = []
    for repo in repos:
        # 跳过被排除的仓库
        if repo.name in EXCLUDE_REPOS or repo.fork:
            continue
            
        # 检查主题过滤器（如果指定了）
        if TOPICS_FILTER and TOPICS_FILTER[0]:
            topics = repo.get_topics()
            if not any(topic in TOPICS_FILTER for topic in topics):
                continue
                
        try:
            # 获取仓库活动分数
            activity_score = get_repo_activity(repo)
            
            # 获取中文描述
            description_cn = get_repo_description_cn(repo)
            if not description_cn:
                description_cn = "项目描述待更新"
            
            repo_data.append({
                "name": repo.name,
                "object": repo,
                "stars": repo.stargazers_count,
                "updated_at": repo.updated_at,
                "created_at": repo.created_at,
                "activity": activity_score,
                "description_cn": description_cn
            })
        except TypeError as e:
            print(f"时区错误处理 {repo.name}: {e}")
            # 发生错误时跳过该仓库
            continue
    
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
    
    # 限制项目数量
    featured_repos = df.head(MAX_PROJECTS)
    
    # 生成项目卡片
    featured_cards = []
    for _, row in featured_repos.iterrows():
        card = generate_project_card(row["object"], row["description_cn"])
        featured_cards.append(card)
    
    # 更新README.md
    update_readme_projects(featured_cards)

if __name__ == "__main__":
    main()
