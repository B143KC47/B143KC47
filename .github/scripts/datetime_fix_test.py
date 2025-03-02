#!/usr/bin/env python3
"""
简化版脚本，测试并验证时区问题修复
"""
import os
from github import Github
from datetime import datetime, timezone
import sys

# 获取GitHub令牌
GITHUB_TOKEN = os.environ.get("GH_TOKEN")
if not GITHUB_TOKEN:
    print("未设置GH_TOKEN环境变量")
    sys.exit(1)

# 创建GitHub实例
g = Github(GITHUB_TOKEN)

def ensure_timezone(dt):
    """确保datetime对象有时区信息"""
    if dt is None:
        return datetime.now(timezone.utc)
    if dt.tzinfo is None:
        print(f"修复naive datetime: {dt}")
        return dt.replace(tzinfo=timezone.utc)
    return dt

def test_datetime_operations():
    print("开始测试datetime操作...")
    
    # 获取当前用户
    user = g.get_user("B143KC47")
    print(f"用户名: {user.login}")
    
    # 显示用户信息
    print(f"创建时间: {user.created_at}")
    print(f"更新时间: {user.updated_at}")
    
    # 测试时区判断
    print(f"创建时间tzinfo: {user.created_at.tzinfo}")
    print(f"更新时间tzinfo: {user.updated_at.tzinfo}")
    
    # 获取用户的仓库
    print("\n获取仓库信息...")
    for repo in user.get_repos():
        print(f"\n仓库: {repo.name}")
        
        # 创建时区安全的now
        now = datetime.now(timezone.utc)
        print(f"当前时间: {now} (tzinfo: {now.tzinfo})")
        
        # 显示仓库更新时间
        print(f"仓库更新时间: {repo.updated_at} (tzinfo: {repo.updated_at.tzinfo if repo.updated_at else None})")
        
        # 在比较前确保两个时间都有时区信息
        safe_updated_at = ensure_timezone(repo.updated_at)
        print(f"安全的更新时间: {safe_updated_at} (tzinfo: {safe_updated_at.tzinfo})")
        
        # 安全计算时间差
        try:
            days_diff = (now - safe_updated_at).days
            print(f"距离上次更新已过去 {days_diff} 天")
        except TypeError as e:
            print(f"类型错误: {e}")
            print(f"now类型: {type(now)}, tzinfo: {now.tzinfo}")
            print(f"updated_at类型: {type(safe_updated_at)}, tzinfo: {safe_updated_at.tzinfo}")
        
        # 只处理前2个仓库，避免API速率限制
        if repo.name == user.login or repo.name == "CityU_GenAi_AIcademy":
            break

if __name__ == "__main__":
    try:
        test_datetime_operations()
        print("\n测试完成，没有错误!")
    except Exception as e:
        print(f"\n测试失败: {e}")
        import traceback
        traceback.print_exc()
