#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
增强版: 自动更新GitHub个人资料中的精选项目
支持自定义项目描述、分类展示和项目趋势分析
"""

import os
import re
import json
import requests
import pandas as pd
from github import Github
from datetime import datetime, timedelta, timezone
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt
import numpy as np
import base64

# 获取环境变量
GITHUB_TOKEN = os.environ.get("GH_TOKEN")
USERNAME = os.environ.get("USERNAME", "B143KC47")
MAX_PROJECTS = int(os.environ.get("MAX_PROJECTS", "4"))
SORT_BY = os.environ.get("SORT_BY", "priority")
INCLUDE_CATEGORIES = os.environ.get("INCLUDE_CATEGORIES", "True").lower() == "true"
SHOW_TRENDING = os.environ.get("SHOW_TRENDING", "True").lower() == "true"
README_PATH = "README.md"
THEME = "midnight-purple"
CONFIG_PATH = ".github/scripts/repositories_info.json"
ASSETS_PATH = "assets/images/project-badges"

# 确保徽章目录存在
os.makedirs(ASSETS_PATH, exist_ok=True)

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
    计算仓库的活动得分和趋势
    基于最近提交、问题和PR活动
    修复: 确保所有datetime对象使用相同的时区格式
    """
    # 使用UTC时区创建now变量，确保与GitHub API返回的时间兼容
    now = datetime.now(timezone.utc)
    activity_score = 0
    activity_data = {
        "recent_commits": 0,
        "recent_issues": 0,
        "recent_prs": 0,
        "commit_trend": [],
        "days_since_update": 0
    }
    
    # 获取最近的提交
    try:
        commits = repo.get_commits()
        if commits.totalCount > 0:
            latest_commit_date = commits[0].commit.author.date
            
            # 确保latest_commit_date是有时区信息的
            if latest_commit_date.tzinfo is None:
                latest_commit_date = latest_commit_date.replace(tzinfo=timezone.utc)
                
            days_since_last_commit = (now - latest_commit_date).days
            activity_data["days_since_update"] = days_since_last_commit
            
            # 最近提交获得更高分
            activity_score += max(0, 100 - days_since_last_commit)
            
            # 计算过去30天的提交趋势
            last_month = now - timedelta(days=30)
            weekly_commits = [0] * 4  # 4周的提交频率
            
            for commit in commits:
                try:
                    commit_date = commit.commit.author.date
                    
                    # 确保commit_date是有时区信息的
                    if commit_date.tzinfo is None:
                        commit_date = commit_date.replace(tzinfo=timezone.utc)
                        
                    if commit_date > last_month:
                        activity_data["recent_commits"] += 1
                        week_index = min(3, (now - commit_date).days // 7)
                        weekly_commits[week_index] += 1
                except Exception as e:
                    print(f"Error processing commit date: {e}")
                    continue
            
            activity_data["commit_trend"] = weekly_commits
            
    except Exception as e:
        print(f"Error getting commits for {repo.name}: {e}")
    
    # 加上星标数量
    activity_score += repo.stargazers_count * 3
    
    # 加上最近的问题和PR活动
    try:
        # 确保使用offset-aware的datetime对象
        recent_issues = list(repo.get_issues(state='all', since=now - timedelta(days=30)))
        activity_data["recent_issues"] = len(recent_issues)
        
        # 区分PR和issues
        activity_data["recent_prs"] = sum(1 for issue in recent_issues if issue.pull_request is not None)
        activity_data["recent_issues"] -= activity_data["recent_prs"]
        
        activity_score += len(recent_issues) * 2
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
    
    return activity_score, activity_data

def create_trend_badge(repo_name, trend_data):
    """
    创建仓库活动趋势图标
    """
    # 设置图表样式
    plt.figure(figsize=(3, 1))
    plt.style.use('dark_background')
    
    # 绘制趋势线
    weeks = ['4周前', '3周前', '2周前', '上周']
    values = trend_data["commit_trend"]
    
    # 创建合适的颜色映射
    if sum(values) == 0:
        colors = ['#444444'] * 4
    else:
        # 根据活动程度改变颜色深浅
        max_value = max(values) if max(values) > 0 else 1
        colors = [f'#{int(50 + 205 * (v/max_value)):02x}50ff' for v in values]
    
    plt.bar(weeks, values, color=colors, alpha=0.7)
    
    # 设置样式
    plt.xticks(fontsize=8, rotation=45)
    plt.yticks(fontsize=8)
    plt.title("提交趋势", fontsize=10, color='#c792ea')
    plt.tight_layout()
    
    # 保存为文件
    badge_filename = f"{ASSETS_PATH}/{repo_name}_trend.svg"
    plt.savefig(badge_filename, format='svg', transparent=True)
    plt.close()
    
    return badge_filename.replace("\\", "/")

def get_repo_status_badge(repo, activity_data):
    """
    基于仓库活动生成状态徽章
    """
    days = activity_data["days_since_update"]
    
    if days <= 7:
        status = "活跃开发"
        color = "brightgreen"
    elif days <= 30:
        status = "维护中"
        color = "green"
    elif days <= 90:
        status = "低频更新"
        color = "yellow"
    elif days <= 365:
        status = "稳定版"
        color = "orange"
    else:
        status = "归档"
        color = "red"
    
    return f"https://img.shields.io/badge/状态-{status}-{color}?style=flat-square&logo=github"

def get_repo_topics_as_badges(repo):
    """获取仓库主题并转换为徽章"""
    topics = repo.get_topics()
    badges = []
    
    # 为主题生成带颜色的徽章
    colors = ["blue", "green", "red", "yellow", "orange", "purple"]
    for i, topic in enumerate(topics[:3]):  # 最多展示3个主题
        color = colors[i % len(colors)]
        badges.append(f"https://img.shields.io/badge/topic-{topic}-{color}?style=flat-square")
    
    return badges

def guess_repo_language_color(repo):
    """猜测仓库主要语言的颜色"""
    language_colors = {
        "Python": "3776AB",
        "JavaScript": "F7DF1E",
        "TypeScript": "007ACC",
        "HTML": "E34F26",
        "CSS": "1572B6",
        "C++": "00599C",
        "C#": "239120",
        "Java": "007396",
        "Go": "00ADD8",
        "Rust": "DEA584",
        "Lua": "000080",
        "PHP": "777BB4",
        "Ruby": "CC342D",
        "Swift": "FFAC45",
        "Kotlin": "F18E33"
    }
    
    try:
        languages = repo.get_languages()
        if languages:
            primary_lang = max(languages.items(), key=lambda x: x[1])[0]
            return language_colors.get(primary_lang, "7A7A7A")
        return "7A7A7A"  # 默认灰色
    except:
        return "7A7A7A"

def generate_project_card(repo, repo_info, category_info=None, activity_data=None):
    """
    生成增强版项目卡片的Markdown代码
    """
    # 使用自定义信息或默认值
    description_cn = repo_info.get("description_cn", repo.description or "项目描述待更新")
    emoji = repo_info.get("emoji", "🚀")
    category = repo_info.get("category", "其他")
    status = repo_info.get("status", "开发中")
    
    # 获取分类颜色
    if category_info and category in category_info:
        primary_color = category_info[category].get("color", "c792ea")
    else:
        primary_color = "c792ea"
    
    # 使用仓库主语言颜色作为次要颜色
    lang_color = guess_repo_language_color(repo)
    secondary_color = lang_color
    text_color = "a9b1d6"
    
    # 生成提交趋势徽章（如果有活动数据）
    trend_badge = ""
    status_badge = ""
    topic_badges = ""
    
    if activity_data:
        # 创建提交趋势徽章
        if SHOW_TRENDING and sum(activity_data["commit_trend"]) > 0:
            trend_badge_path = create_trend_badge(repo.name, activity_data)
            trend_badge = f'<img src="/{trend_badge_path}" alt="提交趋势" style="max-width:100%;">'
        
        # 状态徽章
        status_badge = get_repo_status_badge(repo, activity_data)
        
        # 主题徽章
        topic_badges_list = get_repo_topics_as_badges(repo)
        if topic_badges_list:
            topic_badges = " ".join([f'<img src="{badge}" alt="topic" style="margin-right:4px;">' for badge in topic_badges_list])
    
    # 生成徽章行
    badges_row = ""
    if status_badge or topic_badges:
        badges_row = f"""<p align="center">
<img src="{status_badge}" alt="status">
{topic_badges}
</p>"""
    
    # 生成卡片Markdown，添加悬停效果和改进的样式
    card = f"""<td width="50%">
<div style="border: 1px solid #30363d; border-radius: 10px; padding: 10px; transition: transform 0.3s; height: 100%;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
 <a href="{repo.html_url}" style="text-decoration: none; display: block;">
   <img src="https://github-readme-stats.vercel.app/api/pin/?username={USERNAME}&repo={repo.name}&theme={THEME}&hide_border=true&bg_color=0d1117&title_color={primary_color}&icon_color={secondary_color}&text_color={text_color}" style="width: 100%;" />
   <h3 align="center" style="margin-top: 10px; color: #{primary_color};">{emoji} {repo.name}</h3>
   <p align="center" style="color: #{text_color};">{description_cn}</p>
   <p align="center"><span style="background-color: #{primary_color}30; color: #{primary_color}; padding: 3px 8px; border-radius: 10px; font-size: 0.8em;">{category}</span></p>
   {badges_row}
   {trend_badge}
 </a>
</div>
</td>"""
    
    return card

def find_projects_section(content):
    """
    在README.md中查找精选项目部分
    """
    # 正则表达式匹配精选项目部分
    pattern = re.compile(r'## 🚀 精选项目\s*\n.*?(?=\s*##\s|\Z)', re.DOTALL)
    match = pattern.search(content)
    if match:
        return match.group(0), match.start(), match.end()
    return None, -1, -1

def update_readme_projects(featured_projects, by_category=None):
    """
    在README.md中更新精选项目部分
    """
    try:
        with open(README_PATH, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"读取README.md文件出错: {e}")
        return
    
    # 查找精选项目部分
    projects_section, start_pos, end_pos = find_projects_section(content)
    
    if start_pos >= 0:
        # 生成新的项目部分
        new_projects_section = "## 🚀 精选项目\n\n"
        new_projects_section += '<div align="center" style="background-color: #0d1117; padding: 20px; border-radius: 10px;">\n'
        new_projects_section += '<!-- 此部分将由GitHub Actions自动更新，请勿手动修改 -->\n'
        
        # 添加交互脚本
        new_projects_section += """<script>
function highlightCard(element) {
    element.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.5)';
    element.style.transform = 'translateY(-5px)';
}
function resetCard(element) {
    element.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    element.style.transform = 'translateY(0)';
}
</script>
"""
        
        # 如果按分类显示
        if by_category and INCLUDE_CATEGORIES:
            for category, projects in by_category.items():
                if projects:
                    new_projects_section += f'<h3 style="color: #c792ea; border-bottom: 1px solid #30363d; padding-bottom: 10px;">{category}</h3>\n'
                    new_projects_section += '<table width="100%" style="border-collapse: separate; border-spacing: 15px;">\n'
                    
                    # 添加项目卡片，每行2个
                    for i in range(0, len(projects), 2):
                        new_projects_section += '<tr>\n'
                        new_projects_section += projects[i]
                        
                        if i + 1 < len(projects):
                            new_projects_section += projects[i + 1]
                        else:
                            # 如果是奇数个项目，添加空白单元格保持对称
                            new_projects_section += '<td width="50%"></td>\n'
                            
                        new_projects_section += '</tr>\n'
                        
                    new_projects_section += '</table>\n'
                    new_projects_section += '<div style="margin-bottom: 30px;"></div>\n'
        else:
            # 不分类显示所有项目
            new_projects_section += '<table width="100%" style="border-collapse: separate; border-spacing: 15px;">\n'
            
            # 添加项目卡片，每行2个
            for i in range(0, len(featured_projects), 2):
                new_projects_section += '<tr>\n'
                new_projects_section += featured_projects[i]
                
                if i + 1 < len(featured_projects):
                    new_projects_section += featured_projects[i + 1]
                else:
                    # 如果是奇数个项目，添加空白单元格保持对称
                    new_projects_section += '<td width="50%"></td>\n'
                    
                new_projects_section += '</tr>\n'
                
            new_projects_section += '</table>\n'
        
        # 添加统计信息和自动更新时间
        update_time = datetime.now().strftime('%Y年%m月%d日 %H:%M')
        new_projects_section += f'<div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #30363d;">\n'
        new_projects_section += f'<p style="text-align: center; color: #7fdbca;">显示了 {len(featured_projects)} 个精选项目，共 {sum(len(projects) for projects in by_category.values()) if by_category else 0} 个分类</p>\n'
        new_projects_section += f'<p align="center" style="font-size: 12px; color: #666;">自动更新于: {update_time}</p>\n'
        new_projects_section += '</div>\n'
        new_projects_section += '</div>\n'
        
        # 替换原有部分
        new_content = content[:start_pos] + new_projects_section + content[end_pos:]
        
        try:
            with open(README_PATH, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"更新了 {len(featured_projects)} 个精选项目")
        except Exception as e:
            print(f"写入README.md文件出错: {e}")
    else:
        print("无法找到精选项目部分，请检查README.md格式")

def analyze_repo_topics(repos):
    """分析仓库的主题，自动生成更智能的分类"""
    topic_mapping = {
        "ai": "AI研究",
        "machine-learning": "AI研究",
        "deep-learning": "深度学习",
        "artificial-intelligence": "AI研究",
        "nlp": "NLP研究",
        "natural-language-processing": "NLP研究",
        "transformers": "NLP研究",
        "llm": "LLM研究",
        "gpt": "LLM研究",
        "computer-vision": "计算机视觉",
        "vision": "计算机视觉",
        "image-processing": "计算机视觉",
        "mlops": "MLOps",
        "deployment": "MLOps",
        "model-serving": "MLOps",
        "web": "Web开发",
        "frontend": "Web开发",
        "backend": "后端开发",
        "fullstack": "Web开发",
        "api": "后端开发",
        "database": "数据库",
        "data-science": "数据科学",
        "visualization": "数据可视化",
        "mobile": "移动开发",
        "android": "移动开发",
        "ios": "移动开发",
        "devops": "DevOps",
        "docker": "DevOps",
        "kubernetes": "DevOps",
        "cloud": "云计算",
        "aws": "云计算",
        "azure": "云计算",
        "gcp": "云计算",
        "security": "网络安全",
        "blockchain": "区块链",
        "iot": "物联网",
        "game": "游戏开发",
        "robotics": "机器人",
        "research": "研究项目",
        "tutorial": "教程资源",
        "open-source": "开源项目"
    }
    
    for repo in repos:
        topics = repo.get_topics()
        for topic in topics:
            if topic in topic_mapping:
                return topic_mapping[topic]
    
    return "其他"

def main():
    # 加载自定义配置
    custom_info = load_custom_info()
    repo_info_map = {repo["name"]: repo for repo in custom_info.get("repositories", [])}
    category_info = custom_info.get("categories", {})
    
    # 获取用户的所有公开仓库
    try:
        repos = user.get_repos(type='owner')
    except Exception as e:
        print(f"获取GitHub仓库失败: {e}")
        return
    
    # 准备数据框来分析仓库
    repo_data = []
    for repo in repos:
        # 跳过fork的仓库
        if repo.fork:
            continue
            
        # 获取仓库活动分数和数据
        try:
            activity_score, activity_data = get_repo_activity(repo)
        except TypeError as e:
            print(f"时区错误处理 {repo.name}: {e}")
            # 发生错误时使用默认值
            activity_score = 0
            activity_data = {
                "recent_commits": 0, 
                "recent_issues": 0,
                "recent_prs": 0,
                "commit_trend": [0, 0, 0, 0],
                "days_since_update": 999
            }
        
        # 检查是否有自定义信息
        if repo.name in repo_info_map:
            custom_repo = repo_info_map[repo.name]
            priority = custom_repo.get("priority", 0)
            category = custom_repo.get("category", "其他")
        else:
            # 如果没有自定义信息，根据仓库主题智能分类
            priority = 0
            category = analyze_repo_topics([repo])
        
        repo_data.append({
            "name": repo.name,
            "object": repo,
            "stars": repo.stargazers_count,
            "updated_at": repo.updated_at,
            "created_at": repo.created_at,
            "activity": activity_score,
            "priority": priority,
            "category": category,
            "activity_data": activity_data
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
        df = df.sort_values(["priority", "stars", "activity"], ascending=[False, False, False])
    
    # 限制项目数量
    featured_repos = df.head(MAX_PROJECTS)
    
    # 生成项目卡片
    featured_cards = []
    projects_by_category = {}
    
    for _, row in featured_repos.iterrows():
        repo = row["object"]
        category = row["category"]
        activity_data = row["activity_data"]
        
        # 获取自定义信息或创建默认值
        if repo.name in repo_info_map:
            repo_custom_info = repo_info_map[repo.name]
        else:
            repo_custom_info = {"description_cn": repo.description or "项目描述待更新", "category": category}
            
        # 生成卡片
        card = generate_project_card(repo, repo_custom_info, category_info, activity_data)
        featured_cards.append(card)
        
        # 按分类组织项目
        if category not in projects_by_category:
            projects_by_category[category] = []
        projects_by_category[category].append(card)
    
    # 更新README.md
    update_readme_projects(featured_cards, projects_by_category)

if __name__ == "__main__":
    main()
