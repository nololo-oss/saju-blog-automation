#!/usr/bin/env python3
"""최근 포스트 목록 + KST 날짜 출력 (n8n 워크플로우용)"""
import os, re, json
from datetime import datetime, timezone, timedelta

kst = datetime.now(timezone(timedelta(hours=9)))
date_str = kst.strftime('%Y-%m-%d')

posts_dir = '/home/nohhe/saju-blog/content/posts'
recent = []
today_count = 0

if os.path.isdir(posts_dir):
    for f in sorted(os.listdir(posts_dir), reverse=True):
        if not f.endswith('.md'):
            continue
        if f.startswith(date_str):
            today_count += 1
        filepath = os.path.join(posts_dir, f)
        title = cat = ''
        with open(filepath, 'r', encoding='utf-8') as fh:
            in_frontmatter = False
            for line in fh:
                if line.strip() == '---':
                    if in_frontmatter:
                        break
                    in_frontmatter = True
                    continue
                if in_frontmatter:
                    tm = re.search(r'title:\s*"(.+?)"', line)
                    cm = re.search(r'category:\s*"(.+?)"', line)
                    if tm:
                        title = tm.group(1)
                    if cm:
                        cat = cm.group(1)
        if title:
            recent.append(f'[{cat}] {title}')
        if len(recent) >= 20:
            break

# 자동 포스팅 카운터 (n8n 자동 포스팅만 카운트, 수동 포스팅 제외)
auto_count = 0
counter_file = f'/tmp/n8n-autopost-{date_str}'
if os.path.exists(counter_file):
    with open(counter_file) as f:
        auto_count = len(f.readlines())

print(json.dumps({'date': date_str, 'todayCount': today_count, 'autoCount': auto_count, 'recentPosts': recent}, ensure_ascii=False))
