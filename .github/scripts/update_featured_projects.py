#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
import sys
from github import Github
from datetime import datetime

# 配置
USERNAME = "B143KC47"  # 你的GitHub用户名
CONFIG_PATH = ".github/featured-projects-config.json"
README_PATH = "README.md"
FEATURED_START_MARKER = "<!-- FEATURED_PROJECTS_START -->"
FEATURED_END_MARKER = "<!-- FEATURED_PROJECTS_END -->"

# 设置调试日志函数
def log_debug(message):
    print(f"DEBUG: {message}", file=sys.stderr)

def load_config():
    """加载配置文件，如果不存在则使用默认配置"""
    try:
        log_debug(f"尝试从 {CONFIG_PATH} 加载配置")
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            config = json.load(f)
            log_debug("配置加载成功")
            return config
    except FileNotFoundError:
        log_debug(f"未找到配置文件，使用默认配置")
        # 默认配置
        return {
            "max_projects": 6,  # 最大显示项目数量
            "criteria": {
                "stars": 0.4,       # 星星权重
                "updated": 0.3,     # 更新时间权重
                "forks": 0.2,       # Fork数权重
                "pinned": 0.1       # 是否Pin的权重
            },
            "exclude_repos": ["B143KC47"],  # 排除的仓库
            "layout": "table",      # 显示布局: table 或 cards
            "columns": 2            # 表格列数
        }
    except json.JSONDecodeError as e:
        log_debug(f"配置文件JSON格式错误: {e}")
        raise

def get_repo_info(repo):
    """获取存储库的信息和评分"""
    try:
        stars = repo.stargazers_count
        forks = repo.forks_count
        days_since_updated = (datetime.now() - repo.updated_at.replace(tzinfo=None)).days
        # 更新时间评分 (1.0为今天更新，接近0为长时间未更新)
        update_score = max(0, min(1.0, 1.0 - (days_since_updated / 365)))
        
        return {
            "name": repo.name,
            "full_name": repo.full_name,
            "description": repo.description or "暂无描述",
            "url": repo.html_url,
            "stars": stars,
            "forks": forks,
            "language": repo.language or "未指定",
            "updated_at": repo.updated_at.strftime("%Y-%m-%d"),
            "days_since_updated": days_since_updated,
            "update_score": update_score
        }
    except Exception as e:
        log_debug(f"获取仓库 {repo.name} 信息时出错: {e}")
        raise

def calculate_score(repo_info, criteria):
    """计算仓库评分"""
    try:
        star_factor = repo_info["stars"] * criteria["stars"]
        update_factor = repo_info["update_score"] * criteria["updated"]
        fork_factor = repo_info["forks"] * criteria["forks"]
        
        # 基础分数
        score = star_factor + update_factor + fork_factor
        return score
    except Exception as e:
        log_debug(f"计算仓库 {repo_info['name']} 评分时出错: {e}")
        raise

def generate_table_layout(repos, columns=2):
    """生成表格布局的Markdown内容"""
    try:
        md = []
        md.append('<div align="center" style="background-color: #0d1117; padding: 20px; border-radius: 10px;">')
        md.append('<table>')
        
        for i in range(0, len(repos), columns):
            md.append('<tr>')
            for j in range(columns):
                if i + j < len(repos):
                    repo = repos[i + j]
                    md.append('<td width="{}%">'.format(100 // columns))
                    md.append(' <a href="{}">'.format(repo["url"]))
                    
                    # 项目卡片内容
                    md.append('   <img src="https://github-readme-stats.vercel.app/api/pin/?username={}&repo={}&theme=midnight-purple&hide_border=true&bg_color=0d1117&title_color=c792ea&icon_color=7fdbca&text_color=a9b1d6" />'.format(
                        USERNAME, repo["name"]
                    ))
                    md.append('   <br>')
                    md.append('   <p align="center" style="color: #c792ea;"><strong>{}</strong></p>'.format(repo["name"]))
                    md.append('   <p align="center" style="color: #a9b1d6;">{}</p>'.format(repo["description"]))
                    md.append(' </a>')
                    md.append('</td>')
            md.append('</tr>')
        
        md.append('</table>')
        md.append('</div>')
        return '\n'.join(md)
    except Exception as e:
        log_debug(f"生成表格布局时出错: {e}")
        raise

def generate_card_layout(repos):
    """生成卡片布局的Markdown内容"""
    try:
        md = []
        md.append('<div align="center" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">')
        
        for repo in repos:
            md.append('<div style="flex: 1; min-width: 280px; max-width: 400px; background-color: #0d1117; padding: 15px; border-radius: 10px; border: 1px solid #30363d;">')
            md.append('  <a href="{}" style="text-decoration: none;">'.format(repo["url"]))
            md.append('    <h3 style="color: #c792ea; text-align: center;">{}</h3>'.format(repo["name"]))
            md.append('    <p style="color: #a9b1d6; text-align: center;">{}</p>'.format(repo["description"]))
            md.append('    <div style="display: flex; justify-content: center; margin-top: 10px;">')
            md.append('      <span style="color: #7fdbca; margin: 0 10px;"><i class="fas fa-star"></i> {}</span>'.format(repo["stars"]))
            md.append('      <span style="color: #7fdbca; margin: 0 10px;"><i class="fas fa-code-branch"></i> {}</span>'.format(repo["forks"]))
            md.append('      <span style="color: #7fdbca; margin: 0 10px;"><i class="fas fa-circle"></i> {}</span>'.format(repo["language"]))
            md.append('    </div>')
            md.append('  </a>')
            md.append('</div>')
        
        md.append('</div>')
        return '\n'.join(md)
    except Exception as e:
        log_debug(f"生成卡片布局时出错: {e}")
        raise

def update_readme(featured_projects):
    """更新README文件中的精选项目部分"""
    try:
        log_debug(f"尝试打开README文件: {README_PATH}")
        with open(README_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 查找标记位置
        pattern = re.compile(
            f'{re.escape(FEATURED_START_MARKER)}.*?{re.escape(FEATURED_END_MARKER)}', 
            re.DOTALL
        )
        
        match = pattern.search(content)
        if match:
            log_debug(f"找到标记位置: {match.start()}-{match.end()}")
        else:
            log_debug("未找到标记位置")
            return False
        
        # 替换标记之间的内容
        new_section = f"{FEATURED_START_MARKER}\n{featured_projects}\n{FEATURED_END_MARKER}"
        updated_content = pattern.sub(new_section, content)
        
        # 检查内容是否被更改
        if updated_content == content:
            log_debug("内容未更改，无需写入")
            return True
        
        # 写入更新后的内容
        log_debug("写入更新后的内容")
        with open(README_PATH, 'w', encoding='utf-8') as f:
            f.write(updated_content)
            
        return True
    
    except Exception as e:
        log_debug(f"更新README时出错: {e}")
        return False

def main():
    """主函数"""
    try:
        log_debug("开始更新精选项目")
        
        # 获取GitHub token
        token = os.environ.get("GH_TOKEN")
        if not token:
            log_debug("环境变量中未找到GH_TOKEN")
            raise ValueError("没有找到GitHub令牌。请设置GH_TOKEN环境变量。")
        else:
            log_debug("成功获取GH_TOKEN")
            # 不显示真实token，只显示长度
            log_debug(f"Token长度: {len(token)}")
            
        # 初始化GitHub客户端
        log_debug("初始化GitHub客户端")
        g = Github(token)
        
        # 测试连接
        try:
            rate_limit = g.get_rate_limit()
            log_debug(f"API速率限制: {rate_limit.core.remaining}/{rate_limit.core.limit}")
        except Exception as e:
            log_debug(f"测试API连接时出错: {e}")
            raise
        
        log_debug(f"获取用户: {USERNAME}")
        user = g.get_user(USERNAME)
        
        # 加载配置
        log_debug("加载配置")
        config = load_config()
        log_debug(f"配置: 最大项目数 {config['max_projects']}, 布局 {config['layout']}")
        
        # 获取仓库列表并过滤
        log_debug("获取仓库列表")
        repos = []
        for repo in user.get_repos():
            log_debug(f"处理仓库: {repo.name}")
            if repo.name not in config["exclude_repos"] and not repo.fork:
                log_debug(f"包含仓库: {repo.name}")
                repo_info = get_repo_info(repo)
                repo_info["score"] = calculate_score(repo_info, config["criteria"])
                repos.append(repo_info)
            else:
                log_debug(f"排除仓库: {repo.name}")
        
        log_debug(f"找到符合条件的仓库: {len(repos)}")
        
        # 按评分排序
        repos.sort(key=lambda x: x["score"], reverse=True)
        
        # 获取前N个仓库
        featured_repos = repos[:config["max_projects"]]
        log_debug(f"选择了 {len(featured_repos)} 个精选项目")
        
        # 根据布局生成Markdown内容
        log_debug(f"使用 {config['layout']} 布局生成内容")
        if config["layout"] == "table":
            content = generate_table_layout(featured_repos, config["columns"])
        else:
            content = generate_card_layout(featured_repos)
            
        # 更新README
        log_debug("更新README")
        success = update_readme(content)
        if success:
            log_debug("成功更新README中的精选项目。")
        else:
            log_debug("更新README失败。")
    
    except Exception as e:
        log_debug(f"发生错误: {e}")
        raise

if __name__ == "__main__":
    main()
